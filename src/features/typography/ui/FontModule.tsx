import { useEffect, useMemo, useRef, useState } from "react";
import { FONT_WEIGHTS, fontStack, type FontCategory } from "../model/font";
import {
  FILTER_FONT_PAGE_SIZE,
  GOOGLE_FONTS,
  GOOGLE_FONTS_META,
  filterGoogleFonts,
  findGoogleFont,
  nearestFontWeight,
  type FontDef,
  type FontStyle,
} from "../model/googleFonts";
import { loadGoogleFont, loadUploadedFont, restoreUploadedFont } from "../services/fontLoader";
import { useStudio } from "../../../store/studio";
import { Card, CardBody, CardHeader } from "../../../shared/ui/Card";
import { ColorPicker, rgbToHex, formatRgba } from "../../color";
import { CopyButton } from "../../../shared/ui/CopyButton";
import { useLocale } from "../../../shared/i18n";

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

const CATEGORIES: { id: FontCategory | "all"; labelId: string; labelEn: string }[] = [
  { id: "all", labelId: "Semua", labelEn: "All" },
  { id: "sans-serif", labelId: "Sans", labelEn: "Sans" },
  { id: "serif", labelId: "Serif", labelEn: "Serif" },
  { id: "display", labelId: "Display", labelEn: "Display" },
  { id: "handwriting", labelId: "Tulisan tangan", labelEn: "Handwriting" },
  { id: "monospace", labelId: "Mono", labelEn: "Mono" },
];

const STYLE_FILTERS: { id: FontStyle | "all"; labelId: string; labelEn: string }[] = [
  { id: "all", labelId: "Semua gaya", labelEn: "All styles" },
  { id: "normal", labelId: "Normal", labelEn: "Normal" },
  { id: "italic", labelId: "Italic", labelEn: "Italic" },
];

export function FontModule() {
  const { text } = useLocale();
  const selectedColor = useStudio((s) => s.selectedColor);
  const setSelectedColor = useStudio((s) => s.setSelectedColor);
  const selectedAlpha = useStudio((s) => s.selectedAlpha);
  const setSelectedAlpha = useStudio((s) => s.setSelectedAlpha);
  const activeFontFamily = useStudio((s) => s.activeFontFamily);
  const setActiveFontFamily = useStudio((s) => s.setActiveFontFamily);
  const uploadedFonts = useStudio((s) => s.uploadedFonts);
  const addUploadedFont = useStudio((s) => s.addUploadedFont);

  const [category, setCategory] = useState<FontCategory | "all">("all");
  const [styleFilter, setStyleFilter] = useState<FontStyle | "all">("all");
  const [search, setSearch] = useState("");
  const [weight, setWeight] = useState(400);
  const [italic, setItalic] = useState(false);
  const [visibleFontCount, setVisibleFontCount] = useState(FILTER_FONT_PAGE_SIZE);
  const [fontLoadResult, setFontLoadResult] = useState<{
    key: string;
    status: "loaded" | "error";
  } | null>(null);
  const [size, setSize] = useState(32);
  const [bgMode, setBgMode] = useState<"surface" | "color">("surface");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [samples, setSamples] = useState<SampleText[]>(() =>
    SAMPLE_TEXTS.map((sample) => ({
      ...sample,
      label: text(
        sample.label,
        (
          {
            Headline: "Headline",
            Subheadline: "Subheadline",
            Paragraf: "Paragraph",
            Angka: "Numbers",
            Alfabet: "Alphabet",
          } as Record<string, string>
        )[sample.label] ?? sample.label,
      ),
      text: text(
        sample.text,
        (
          {
            "Desain yang bermakna": "Design with meaning",
            "Tipografi memberi nada pada pesanmu": "Typography gives your message a voice",
          } as Record<string, string>
        )[sample.text] ?? sample.text,
      ),
    })),
  );
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
      const def = findGoogleFont(fam);
      if (def) void loadGoogleFont(def.family, def.styleWeights.normal).catch(() => {});
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
    return findGoogleFont(activeFontFamily);
  }, [activeFontFamily, uploadedFonts]);

  const effectiveItalic = Boolean(
    activeDef &&
    activeDef.styles.includes("italic") &&
    (italic || !activeDef.styles.includes("normal")),
  );
  const availableWeights = activeDef
    ? activeDef.styleWeights[effectiveItalic ? "italic" : "normal"]
    : [...FONT_WEIGHTS];
  const effectiveWeight = nearestFontWeight(availableWeights, weight);
  const activeFontRequestKey = activeDef
    ? `${activeDef.family}:${effectiveWeight}:${effectiveItalic ? "italic" : "normal"}`
    : null;
  const fontLoadState = !activeFontRequestKey
    ? "idle"
    : fontLoadResult?.key === activeFontRequestKey
      ? fontLoadResult.status
      : "loading";

  useEffect(() => {
    if (!activeDef || !activeFontRequestKey) return;
    let current = true;
    const selectedStyle: FontStyle = effectiveItalic ? "italic" : "normal";
    void loadGoogleFont(activeDef.family, [effectiveWeight], selectedStyle)
      .then(() => {
        if (current) setFontLoadResult({ key: activeFontRequestKey, status: "loaded" });
      })
      .catch(() => {
        if (current) setFontLoadResult({ key: activeFontRequestKey, status: "error" });
      });
    return () => {
      current = false;
    };
  }, [activeDef, activeFontRequestKey, effectiveItalic, effectiveWeight]);

  const filteredFonts = useMemo(() => {
    return filterGoogleFonts(GOOGLE_FONTS, { category, search, style: styleFilter });
  }, [category, search, styleFilter]);

  const visibleFonts = filteredFonts.slice(0, visibleFontCount);
  const canUseItalic = activeDef?.styles.includes("italic") ?? false;

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
        setUploadError(
          text(
            `File ${file.name} terlalu besar. Maksimal ukuran font adalah 5MB.`,
            `${file.name} is too large. The maximum font size is 5 MB.`,
          ),
        );
        continue;
      }

      // Validate file type
      const validExtensions = [".ttf", ".otf", ".woff", ".woff2"];
      const fileName = file.name.toLowerCase();
      if (!validExtensions.some((ext) => fileName.endsWith(ext))) {
        setUploadError(
          text(
            `File ${file.name} bukan format font yang didukung.`,
            `${file.name} is not a supported font format.`,
          ),
        );
        continue;
      }

      try {
        const { family, dataUrl } = await loadUploadedFont(file);
        addUploadedFont({ family, fileName: file.name, data: dataUrl });
        selectFont(family);
      } catch (err) {
        setUploadError(
          text(
            `Gagal memuat ${file.name}: ${err instanceof Error ? err.message : "format tidak didukung"}`,
            `Failed to load ${file.name}: ${err instanceof Error ? err.message : "unsupported format"}`,
          ),
        );
      }
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const textColor = bgMode === "color" ? "#FFFFFF" : rgbToHex(selectedColor);
  const bgColor =
    bgMode === "color" ? formatRgba({ ...selectedColor, a: selectedAlpha }) : "var(--surface)";

  const cssSnippet = `font-family: ${fontFamilyStack};\nfont-size: ${size}px;\nfont-weight: ${effectiveWeight};\nfont-style: ${effectiveItalic ? "italic" : "normal"};\ncolor: ${rgbToHex(selectedColor)};`;

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
            title={text("Pilih Font", "Choose a Font")}
            subtitle={text(
              "Upload font sendiri atau pilih dari Google Fonts",
              "Upload your own font or choose one from Google Fonts",
            )}
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
                {text("Upload Font", "Upload Font")} (.ttf/.otf/.woff/.woff2)
              </button>
              {uploadedFonts.length > 0 && (
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {uploadedFonts.length} {text("font terupload", "uploaded fonts")}
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

            <div
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-[11px]"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              data-google-font-catalog
            >
              <span>
                {GOOGLE_FONTS.length} Google Fonts ·{" "}
                {GOOGLE_FONTS_META.source === "curated-fallback"
                  ? text("snapshot lokal", "local snapshot")
                  : text("katalog API tersinkron", "API-synced catalog")}
              </span>
              <span>
                {fontLoadState === "loading"
                  ? text("Memuat font…", "Loading font…")
                  : fontLoadState === "error"
                    ? text(
                        "Font gagal dimuat; fallback digunakan",
                        "Font failed to load; using fallback",
                      )
                    : fontLoadState === "loaded"
                      ? text("Font aktif siap", "Active font ready")
                      : text("Dimuat saat dipilih", "Loaded on selection")}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCategory(c.id);
                    setVisibleFontCount(FILTER_FONT_PAGE_SIZE);
                  }}
                  className={chipClass}
                  style={getChipStyle(category === c.id)}
                >
                  {text(c.labelId, c.labelEn)}
                </button>
              ))}
            </div>

            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <input
                type="search"
                aria-label={text("Cari Google Fonts", "Search Google Fonts")}
                placeholder={text("Cari Google Fonts…", "Search Google Fonts…")}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisibleFontCount(FILTER_FONT_PAGE_SIZE);
                }}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                style={{
                  borderColor: "var(--input-border)",
                  backgroundColor: "var(--input-bg)",
                  color: "var(--input-text)",
                }}
              />
              <div
                className="flex flex-wrap gap-1.5"
                aria-label={text("Filter gaya", "Style filter")}
              >
                {STYLE_FILTERS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setStyleFilter(option.id);
                      setVisibleFontCount(FILTER_FONT_PAGE_SIZE);
                    }}
                    aria-pressed={styleFilter === option.id}
                    className="rounded-lg border px-2.5 py-2 text-[11px] font-medium"
                    style={getChipStyle(styleFilter === option.id)}
                  >
                    {text(option.labelId, option.labelEn)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid max-h-80 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
              {visibleFonts.map((f) => (
                <button
                  key={f.family}
                  type="button"
                  onClick={() => selectFont(f.family)}
                  onPointerEnter={() => {
                    const style: FontStyle = f.styleWeights.normal.length ? "normal" : "italic";
                    void loadGoogleFont(
                      f.family,
                      [nearestFontWeight(f.styleWeights[style], 400)],
                      style,
                    ).catch(() => {});
                  }}
                  onFocus={() => {
                    const style: FontStyle = f.styleWeights.normal.length ? "normal" : "italic";
                    void loadGoogleFont(
                      f.family,
                      [nearestFontWeight(f.styleWeights[style], 400)],
                      style,
                    ).catch(() => {});
                  }}
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
                    {text("Bagusnya dimulai di sini", "Good design starts here")}
                  </div>
                  <div
                    className="mt-1 text-[9px] uppercase tracking-wide"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {f.category} · {f.weights.length} {text("weight", "weights")}
                    {f.styles.includes("italic") ? " · italic" : ""}
                  </div>
                </button>
              ))}
              {filteredFonts.length === 0 && (
                <p
                  className="col-span-full py-4 text-center text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  {text("Tidak ada font yang cocok.", "No matching fonts.")}
                </p>
              )}
            </div>
            {visibleFontCount < filteredFonts.length && (
              <button
                type="button"
                onClick={() => setVisibleFontCount((count) => count + FILTER_FONT_PAGE_SIZE)}
                className="w-full rounded-lg border px-3 py-2 text-xs font-medium"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              >
                {text("Tampilkan lebih banyak", "Show more")} ({visibleFontCount}/
                {filteredFonts.length})
              </button>
            )}
          </CardBody>
        </Card>

        {/* Font pairing suggestions */}
        <Card>
          <CardHeader
            title={text("Saran Pasangan Font", "Font Pairing Suggestions")}
            subtitle={text(
              "Kombinasi heading & body yang selaras",
              "Harmonious heading and body combinations",
            )}
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
                {text("Aktif", "Active")}:{" "}
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
            title={text("Preview Implementasi", "Implementation Preview")}
            subtitle={text(
              "Lihat hasil untuk web & desain dengan warna terpilih",
              "Preview the selected typography and color in a real layout",
            )}
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
                    {text("Pada surface", "On surface")}
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
                    {text("Pada warna", "On color")}
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
                  htmlFor="font-weight-select"
                  className="mb-1 block text-[11px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  Weight: {effectiveWeight}
                </label>
                <select
                  id="font-weight-select"
                  value={effectiveWeight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  style={{
                    borderColor: "var(--input-border)",
                    backgroundColor: "var(--input-bg)",
                    color: "var(--input-text)",
                  }}
                >
                  {availableWeights.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex min-w-28 flex-col justify-end">
                <span className="mb-1 block text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {text("Gaya", "Style")}
                </span>
                <button
                  type="button"
                  disabled={!canUseItalic}
                  onClick={() => setItalic((value) => !value)}
                  aria-label={text("Aktifkan gaya italic", "Toggle italic style")}
                  aria-pressed={effectiveItalic}
                  className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                  style={getChipStyle(effectiveItalic)}
                >
                  {effectiveItalic ? "Italic" : "Normal"}
                </button>
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
                        aria-label={`${text("Teks contoh", "Sample text")} ${s.label}`}
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
                          fontWeight: effectiveWeight,
                          fontStyle: pairing ? "normal" : effectiveItalic ? "italic" : "normal",
                          fontSize:
                            s.label === "Headline"
                              ? size * 1.6
                              : s.label === "Subheadline"
                                ? size
                                : s.label === "Paragraf" || s.label === "Paragraph"
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
                <CopyButton value={cssSnippet} label={text("Salin CSS", "Copy CSS")} />
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
        <CardHeader
          title={text("Warna Teks", "Text Color")}
          subtitle={text(
            "Warna dari modul warna dipakai di sini",
            "The active color from the color tools is used here",
          )}
        />
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
