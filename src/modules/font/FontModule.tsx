import { useEffect, useMemo, useRef, useState } from "react";
import {
  GOOGLE_FONTS,
  loadGoogleFont,
  loadUploadedFont,
  restoreUploadedFont,
  fontStack,
  type FontCategory,
  type FontDef,
} from "../../lib/font";
import { useStudio } from "../../store/studio";
import { Card, CardBody, CardHeader } from "../../shared/ui/Card";
import { ColorPicker } from "../../components/ColorPicker";
import { rgbToHex, formatRgba } from "../../lib/color";
import { CopyButton } from "../../shared/ui/CopyButton";

type SampleText = {
  label: string;
  text: string;
};

const SAMPLE_TEXTS: SampleText[] = [
  { label: "Headline", text: "Desain yang bermakna" },
  { label: "Subheadline", text: "Tipografi memberi nada pada pesanmu" },
  {
    label: "Paragraf",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultricies nibh quis libero dictum, eget ultricies ipsum posuere.",
  },
  { label: "Angka", text: "0123456789" },
  { label: "Alfabet", text: "ABCDEFG abcdefg" },
];

const CATEGORIES: { id: FontCategory | "all"; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "sans-serif", label: "Sans" },
  { id: "serif", label: "Serif" },
  { id: "display", label: "Display" },
  { id: "handwriting", label: "Handwriting" },
  { id: "monospace", label: "Mono" },
];

export function FontModule() {
  const selectedColor = useStudio((s) => s.selectedColor);
  const setSelectedColor = useStudio((s) => s.setSelectedColor);
  const selectedAlpha = useStudio((s) => s.selectedAlpha);
  const setSelectedAlpha = useStudio((s) => s.setSelectedAlpha);
  const activeFontFamily = useStudio((s) => s.activeFontFamily);
  const setActiveFontFamily = useStudio((s) => s.setActiveFontFamily);
  const uploadedFonts = useStudio((s) => s.uploadedFonts);
  const addUploadedFont = useStudio((s) => s.addUploadedFont);

  const [category, setCategory] = useState<FontCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [weight, setWeight] = useState(400);
  const [size, setSize] = useState(32);
  const [bgMode, setBgMode] = useState<"surface" | "color">("surface");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [samples, setSamples] = useState<SampleText[]>(SAMPLE_TEXTS);
  const [pairing, setPairing] = useState<{ heading: string; body: string } | null>(null);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const fileRef = useRef<HTMLInputElement>(null);

  // Curated heading/body pairings (all present in GOOGLE_FONTS).
  const SUGGESTED_PAIRINGS: { heading: string; body: string }[] = [
    { heading: "Playfair Display", body: "Inter" },
    { heading: "Oswald", body: "Open Sans" },
    { heading: "Lora", body: "Source Sans 3" },
    { heading: "Bebas Neue", body: "Roboto" },
    { heading: "Merriweather", body: "Lato" },
    { heading: "Montserrat", body: "Lora" },
  ];

  const selectFont = (family: string) => {
    setActiveFontFamily(family);
    setPairing(null);
  };

  // Lazy-load fonts used by the active pairing.
  useEffect(() => {
    if (!pairing) return;
    for (const fam of [pairing.heading, pairing.body]) {
      const def = GOOGLE_FONTS.find((f) => f.family === fam);
      if (def) loadGoogleFont(def.family, def.variants);
    }
  }, [pairing]);

  // Re-register persisted uploaded fonts (base64) after a reload.
  useEffect(() => {
    for (const f of uploadedFonts) {
      if (f.data) restoreUploadedFont(f.data, f.family).catch(() => {});
    }
  }, [uploadedFonts]);

  // Load Google Font for active family on demand.
  const activeDef = useMemo<FontDef | undefined>(() => {
    if (uploadedFonts.some((f) => f.family === activeFontFamily)) return undefined;
    return GOOGLE_FONTS.find((f) => f.family === activeFontFamily);
  }, [activeFontFamily, uploadedFonts]);

  useEffect(() => {
    if (activeDef) {
      loadGoogleFont(activeDef.family, activeDef.variants);
    }
  }, [activeDef]);

  const filteredFonts = useMemo(() => {
    return GOOGLE_FONTS.filter((f) => {
      const matchCat = category === "all" || f.category === category;
      const matchSearch =
        search.trim() === "" || f.family.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [category, search]);

  const fontFamilyStack = activeDef
    ? fontStack(activeDef.family, activeDef.category)
    : fontStack(activeFontFamily);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploadError(null);

    // File size validation (max 5MB per font file)
    const MAX_FONT_SIZE = 5 * 1024 * 1024;

    for (const file of Array.from(files)) {
      // Validate file size
      if (file.size > MAX_FONT_SIZE) {
        setUploadError(`File ${file.name} terlalu besar. Maksimal ukuran font adalah 5MB.`);
        continue;
      }

      // Validate file type
      const validExtensions = [".ttf", ".otf", ".woff", ".woff2"];
      const fileName = file.name.toLowerCase();
      if (!validExtensions.some((ext) => fileName.endsWith(ext))) {
        setUploadError(`File ${file.name} bukan format font yang didukung.`);
        continue;
      }

      try {
        const { family, dataUrl } = await loadUploadedFont(file);
        addUploadedFont({ family, fileName: file.name, data: dataUrl });
        selectFont(family);
      } catch (err) {
        setUploadError(
          `Gagal memuat ${file.name}: ${err instanceof Error ? err.message : "format tidak didukung"}`,
        );
      }
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const textColor = bgMode === "color" ? "#FFFFFF" : rgbToHex(selectedColor);
  const bgColor =
    bgMode === "color" ? formatRgba({ ...selectedColor, a: selectedAlpha }) : "var(--surface)";

  const cssSnippet = `font-family: ${fontFamilyStack};\nfont-size: ${size}px;\nfont-weight: ${weight};\ncolor: ${rgbToHex(selectedColor)};`;

  const chipClass = "rounded-full border px-3 py-1.5 text-xs font-medium transition";

  const getChipStyle = (active: boolean): React.CSSProperties =>
    active
      ? {
          borderColor: "var(--border)",
          backgroundColor: "var(--chip-active-bg)",
          color: "var(--text-primary)",
        }
      : {
          borderColor: "var(--border)",
          backgroundColor: "var(--chip-bg)",
          color: "var(--text-secondary)",
        };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        {/* Upload + search */}
        <Card>
          <CardHeader
            title="Pilih Font"
            subtitle="Upload font sendiri atau pilih dari Google Fonts"
          />
          <CardBody className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileRef}
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                multiple
                onChange={onUpload}
                className="hidden"
                id="font-upload"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="rounded-lg bg-indigo-500 px-4 py-2 text-xs font-medium text-white transition hover:bg-indigo-400"
              >
                Upload Font (.ttf/.otf/.woff/.woff2)
              </button>
              {uploadedFonts.length > 0 && (
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {uploadedFonts.length} font terupload
                </span>
              )}
            </div>
            {uploadError && (
              <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-600 dark:text-rose-300">
                {uploadError}
              </p>
            )}

            {uploadedFonts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {uploadedFonts.map((f) => (
                  <button
                    key={f.family}
                    type="button"
                    onClick={() => selectFont(f.family)}
                    className={chipClass}
                    style={getChipStyle(activeFontFamily === f.family)}
                    title={f.fileName}
                  >
                    {f.family}
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={chipClass}
                  style={getChipStyle(category === c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Cari font…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{
                borderColor: "var(--input-border)",
                backgroundColor: "var(--input-bg)",
                color: "var(--input-text)",
              }}
            />

            <div className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
              {filteredFonts.map((f) => (
                <button
                  key={f.family}
                  type="button"
                  onClick={() => selectFont(f.family)}
                  className="rounded-lg border px-3 py-2 text-left transition"
                  style={{
                    borderColor: activeFontFamily === f.family ? "var(--border)" : "var(--border)",
                    backgroundColor:
                      activeFontFamily === f.family ? "var(--chip-active-bg)" : "transparent",
                  }}
                >
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {f.family}
                  </div>
                  <div
                    className="mt-0.5 truncate text-sm"
                    style={{
                      fontFamily: fontStack(f.family, f.category),
                      color: "var(--text-primary)",
                    }}
                  >
                    {f.family}
                  </div>
                </button>
              ))}
              {filteredFonts.length === 0 && (
                <p
                  className="col-span-full py-4 text-center text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  Tidak ada font yang cocok.
                </p>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Font pairing suggestions */}
        <Card>
          <CardHeader
            title="Saran Pasangan Font"
            subtitle="Kombinasi heading & body yang selaras"
            action={
              pairing ? (
                <button
                  type="button"
                  onClick={() => setPairing(null)}
                  className="rounded-md border px-2.5 py-1 text-[11px] font-medium transition"
                  style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                >
                  Reset
                </button>
              ) : undefined
            }
          />
          <CardBody>
            {pairing && (
              <p className="mb-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                Aktif:{" "}
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                  {pairing.heading}
                </span>{" "}
                +{" "}
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                  {pairing.body}
                </span>
              </p>
            )}
            <div className="grid gap-2 sm:grid-cols-3">
              {SUGGESTED_PAIRINGS.slice(0, 3).map((p) => {
                const active = pairing?.heading === p.heading && pairing?.body === p.body;
                return (
                  <button
                    key={`${p.heading}-${p.body}`}
                    type="button"
                    onClick={() => setPairing(p)}
                    className="rounded-xl border p-3 text-left transition"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: active ? "var(--chip-active-bg)" : "transparent",
                    }}
                  >
                    <p
                      className="truncate text-lg"
                      style={{ fontFamily: fontStack(p.heading), color: "var(--text-primary)" }}
                    >
                      {p.heading}
                    </p>
                    <p
                      className="mt-1 truncate text-xs"
                      style={{ fontFamily: fontStack(p.body), color: "var(--text-secondary)" }}
                    >
                      {p.body}
                    </p>
                  </button>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Live preview */}
        <Card>
          <CardHeader
            title="Preview Implementasi"
            subtitle="Lihat hasil untuk web & desain dengan warna terpilih"
            action={
              <div className="flex flex-wrap gap-1.5">
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setBgMode("surface")}
                    className="rounded-md px-2.5 py-1 text-[11px] font-medium transition"
                    style={
                      bgMode === "surface"
                        ? { backgroundColor: "var(--chip-active-bg)", color: "var(--text-primary)" }
                        : { color: "var(--text-secondary)" }
                    }
                  >
                    Pada surface
                  </button>
                  <button
                    type="button"
                    onClick={() => setBgMode("color")}
                    className="rounded-md px-2.5 py-1 text-[11px] font-medium transition"
                    style={
                      bgMode === "color"
                        ? { backgroundColor: "var(--chip-active-bg)", color: "var(--text-primary)" }
                        : { color: "var(--text-secondary)" }
                    }
                  >
                    Pada warna
                  </button>
                </div>
                <div className="flex gap-1.5">
                  {(["desktop", "tablet", "mobile"] as const).map((vp) => (
                    <button
                      key={vp}
                      type="button"
                      onClick={() => setViewport(vp)}
                      className="rounded-md px-2.5 py-1 text-[11px] font-medium transition"
                      style={
                        viewport === vp
                          ? {
                              backgroundColor: "var(--chip-active-bg)",
                              color: "var(--text-primary)",
                            }
                          : { color: "var(--text-secondary)" }
                      }
                    >
                      {vp === "desktop" ? "Desktop" : vp === "tablet" ? "Tablet" : "Mobile"}
                    </button>
                  ))}
                </div>
              </div>
            }
          />
          <CardBody className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1">
                <label
                  htmlFor="font-weight-range"
                  className="mb-1 block text-[11px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  Weight: {weight}
                </label>
                <input
                  id="font-weight-range"
                  type="range"
                  min={100}
                  max={900}
                  step={100}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="font-size-range"
                  className="mb-1 block text-[11px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  Size: {size}px
                </label>
                <input
                  id="font-size-range"
                  type="range"
                  min={12}
                  max={96}
                  step={1}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div
              className="mx-auto transition-all"
              style={{
                maxWidth: viewport === "mobile" ? 320 : viewport === "tablet" ? 640 : 1024,
              }}
            >
              <div
                className="rounded-2xl border p-6 transition-colors"
                style={{ backgroundColor: bgColor, borderColor: "var(--card-border)" }}
              >
                {samples.map((s, i) => {
                  const sampleFont = pairing
                    ? s.label === "Headline"
                      ? fontStack(pairing.heading)
                      : fontStack(pairing.body)
                    : fontFamilyStack;
                  return (
                    <div key={s.label} className="mb-4 last:mb-0">
                      <input
                        value={s.text}
                        onChange={(e) =>
                          setSamples((prev) =>
                            prev.map((p, idx) => (idx === i ? { ...p, text: e.target.value } : p)),
                          )
                        }
                        aria-label={`Teks contoh ${s.label}`}
                        className="mb-1 w-full rounded-md border px-2 py-1 text-[11px] outline-none"
                        style={{
                          borderColor: "var(--input-border)",
                          backgroundColor: "var(--input-bg)",
                          color: "var(--input-text)",
                        }}
                      />
                      <div
                        style={{
                          fontFamily: sampleFont,
                          fontWeight: weight,
                          fontSize:
                            s.label === "Headline"
                              ? size * 1.6
                              : s.label === "Subheadline"
                                ? size
                                : s.label === "Paragraf"
                                  ? Math.max(14, size * 0.5)
                                  : size * 0.8,
                          color: textColor,
                          lineHeight: 1.4,
                        }}
                      >
                        {s.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl p-4" style={{ backgroundColor: "var(--chip-bg)" }}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  CSS snippet
                </span>
                <CopyButton value={cssSnippet} label="Salin CSS" />
              </div>
              <pre
                className="overflow-x-auto whitespace-pre-wrap text-[11px]"
                style={{ color: "var(--text-secondary)" }}
              >
                {cssSnippet}
              </pre>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="h-fit">
        <CardHeader title="Warna Teks" subtitle="Warna dari modul warna dipakai di sini" />
        <CardBody className="space-y-4">
          <div
            className="h-20 rounded-xl border"
            style={{
              backgroundColor: formatRgba({
                ...selectedColor,
                a: selectedAlpha,
              }),
              borderColor: "var(--border)",
            }}
          />
          <ColorPicker
            rgb={selectedColor}
            alpha={selectedAlpha}
            onRgbChange={setSelectedColor}
            onAlphaChange={setSelectedAlpha}
            showAlpha
          />
        </CardBody>
      </Card>
    </div>
  );
}
