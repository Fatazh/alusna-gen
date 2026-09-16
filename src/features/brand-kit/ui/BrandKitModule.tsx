import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { BracketsCurly } from "@phosphor-icons/react/BracketsCurly";
import { Buildings } from "@phosphor-icons/react/Buildings";
import { Camera } from "@phosphor-icons/react/Camera";
import { Circle } from "@phosphor-icons/react/Circle";
import { FileText } from "@phosphor-icons/react/FileText";
import { Lightning } from "@phosphor-icons/react/Lightning";
import { Palette } from "@phosphor-icons/react/Palette";
import { Smiley } from "@phosphor-icons/react/Smiley";
import { Sparkle } from "@phosphor-icons/react/Sparkle";
import { FloppyDisk } from "@phosphor-icons/react/FloppyDisk";
import { TextAa } from "@phosphor-icons/react/TextAa";
import { UploadSimple } from "@phosphor-icons/react/UploadSimple";
import { Wheelchair } from "@phosphor-icons/react/Wheelchair";
import { type Icon } from "@phosphor-icons/react/lib";
import { useStudio } from "../../../store/studio";
import { decodeToolShareState } from "../../../shared/lib/toolShareState";
import { type RGB, rgbToHex, rgbToHsl, rotateHue } from "../../color";
import {
  brandKitToTailwindConfig,
  brandKitToW3cTokens,
  parseBrandKitImport,
} from "../services/interop";
import { Card, CardHeader, CardBody } from "../../../shared/ui/Card";
import { downloadTextFile } from "../../../shared/services/download";
import { useToast } from "../../../shared/ui/toastContext";
import { PaletteTab } from "./PaletteTab";
import { TypographyTab } from "./TypographyTab";
import { GuidelinesTab } from "./GuidelinesTab";
import { AccessibilityTab } from "./AccessibilityTab";
import { ExportTab } from "./ExportTab";
import { generateBrandKit, TONE_PROFILES, type BrandKit, type BrandTone } from "../model/brandKit";
import { brandKitToHtml } from "../services/htmlSerializer";
import { useLocale } from "../../../shared/i18n";

const TONE_OPTIONS = (["modern", "classic", "playful", "minimal", "bold"] as const).map(
  (id) => TONE_PROFILES[id],
);

const TONE_ICONS: Record<BrandTone, Icon> = {
  modern: Sparkle,
  classic: Buildings,
  playful: Smiley,
  minimal: Circle,
  bold: Lightning,
};

function readBrandKitShareState(): {
  brandName?: string;
  tagline?: string;
  tone?: BrandTone;
  primaryOverride?: RGB;
  secondaryOverride?: RGB;
  accentOverride?: RGB;
  backgroundOverride?: RGB;
  textColorOverride?: RGB;
  headlineFontOverride?: string;
  bodyFontOverride?: string;
  monoFontOverride?: string;
} | null {
  const decoded = decodeToolShareState(new URLSearchParams(window.location.search));
  if (!decoded?.b) return null;
  return {
    brandName: decoded.b.brandName,
    tagline: decoded.b.tagline || undefined,
    tone: decoded.b.tone as BrandTone,
    primaryOverride: decoded.b.primaryColor,
    secondaryOverride: decoded.b.secondaryColor,
    accentOverride: decoded.b.accentColor,
    backgroundOverride: decoded.b.backgroundColor,
    textColorOverride: decoded.b.textColor,
    headlineFontOverride: decoded.b.headlineFont,
    bodyFontOverride: decoded.b.bodyFont,
    monoFontOverride: decoded.b.monoFont,
  };
}

export function BrandKitModule() {
  const { text } = useLocale();
  const selectedColor = useStudio((s) => s.selectedColor);
  const { show } = useToast();
  const savedBrandKits = useStudio((s) => s.savedBrandKits);
  const saveBrandKit = useStudio((s) => s.saveBrandKit);
  const deleteBrandKit = useStudio((s) => s.deleteBrandKit);

  const sharedBrandKit = useMemo(() => readBrandKitShareState(), []);
  const [brandName, setBrandName] = useState(sharedBrandKit?.brandName ?? "My Brand");
  const [tagline, setTagline] = useState(sharedBrandKit?.tagline ?? "");
  const [tone, setTone] = useState<BrandTone>(sharedBrandKit?.tone ?? "modern");
  const [logoDataUrl, setLogoDataUrl] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<
    "palette" | "typography" | "guidelines" | "export" | "accessibility"
  >("palette");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Custom overrides (initialized from a shared brand kit URL when present)
  const [primaryOverride, setPrimaryOverride] = useState<RGB | null>(
    sharedBrandKit?.primaryOverride ?? null,
  );
  const [secondaryOverride, setSecondaryOverride] = useState<RGB | null>(
    sharedBrandKit?.secondaryOverride ?? null,
  );
  const [accentOverride, setAccentOverride] = useState<RGB | null>(
    sharedBrandKit?.accentOverride ?? null,
  );
  const [backgroundOverride, setBackgroundOverride] = useState<RGB | null>(
    sharedBrandKit?.backgroundOverride ?? null,
  );
  const [textColorOverride, setTextColorOverride] = useState<RGB | null>(
    sharedBrandKit?.textColorOverride ?? null,
  );
  const [headlineFontOverride, setHeadlineFontOverride] = useState<string | null>(
    sharedBrandKit?.headlineFontOverride ?? null,
  );
  const [bodyFontOverride, setBodyFontOverride] = useState<string | null>(
    sharedBrandKit?.bodyFontOverride ?? null,
  );
  const [monoFontOverride, setMonoFontOverride] = useState<string | null>(
    sharedBrandKit?.monoFontOverride ?? null,
  );

  const effectivePrimary = primaryOverride ?? selectedColor;

  const kit: BrandKit = useMemo(() => {
    const base = generateBrandKit(effectivePrimary, brandName, tone);
    base.tagline = tagline;
    if (logoDataUrl) base.logoDataUrl = logoDataUrl;
    if (secondaryOverride) base.secondaryColor = secondaryOverride;
    if (accentOverride) base.accentColor = accentOverride;
    if (backgroundOverride) base.backgroundColor = backgroundOverride;
    if (textColorOverride) base.textColor = textColorOverride;
    if (headlineFontOverride) base.headlineFont = headlineFontOverride;
    if (bodyFontOverride) base.bodyFont = bodyFontOverride;
    if (monoFontOverride) base.monoFont = monoFontOverride;
    return base;
  }, [
    effectivePrimary,
    brandName,
    tagline,
    tone,
    logoDataUrl,
    secondaryOverride,
    accentOverride,
    backgroundOverride,
    textColorOverride,
    headlineFontOverride,
    bodyFontOverride,
    monoFontOverride,
  ]);

  // Auto-derive secondary & accent suggestions
  const suggestions = useMemo(() => {
    const hsl = rgbToHsl(effectivePrimary);
    return {
      secondary: rotateHue(effectivePrimary, hsl.s < 20 ? 0 : 150),
      accent: rotateHue(effectivePrimary, hsl.s < 20 ? 0 : 30),
      analogous: rotateHue(effectivePrimary, 30),
      triadic1: rotateHue(effectivePrimary, 120),
      triadic2: rotateHue(effectivePrimary, 240),
    };
  }, [effectivePrimary]);

  // Publish the actively edited kit to the store (debounced: persist writes
  // on every store change, so raw per-keystroke publishing would hammer
  // IndexedDB). useToolShareUrl then shares exactly what the user sees
  // instead of silently falling back to the most recently saved kit.
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const next = {
        name: brandName,
        brandName,
        tagline,
        primaryColor: effectivePrimary,
        secondaryColor: kit.secondaryColor,
        accentColor: kit.accentColor,
        backgroundColor: kit.backgroundColor,
        textColor: kit.textColor,
        headlineFont: kit.headlineFont,
        bodyFont: kit.bodyFont,
        monoFont: kit.monoFont,
        tone,
        ...(logoDataUrl ? { logoDataUrl } : {}),
      };
      const current = useStudio.getState().activeBrandKitShareState;
      if (current && JSON.stringify(current) === JSON.stringify(next)) return;
      useStudio.setState({ activeBrandKitShareState: next });
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [brandName, tagline, tone, effectivePrimary, kit, logoDataUrl]);

  const [isDragging, setIsDragging] = useState(false);

  const processLogoFile = useCallback(
    async (file: File) => {
      // Type validation (SVG excluded — external resource / tracking concerns).
      if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
        show(
          text(
            "Format logo tidak didukung. Gunakan PNG, JPG, atau WebP.",
            "Unsupported logo format. Use PNG, JPG, or WebP.",
          ),
        );
        return;
      }
      // Size validation (max 2MB — the logo is embedded as a base64 data URL).
      const MAX_LOGO_SIZE = 2 * 1024 * 1024;
      if (file.size > MAX_LOGO_SIZE) {
        show(
          text("Logo terlalu besar. Maksimal 2MB.", "The logo is too large. Maximum size is 2 MB."),
        );
        return;
      }
      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () =>
            reject(reader.error ?? new Error(text("Gagal membaca file", "Failed to read file")));
          reader.readAsDataURL(file);
        });
        setLogoDataUrl(dataUrl);
        show(text("✓ Logo berhasil diunggah!", "✓ Logo uploaded!"));
      } catch {
        show(text("Gagal mengunggah logo", "Failed to upload logo"));
      }
    },
    [show, text],
  );

  const handleLogoUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      // Clear the input so picking the same file again re-fires onChange.
      if (fileInputRef.current) fileInputRef.current.value = "";
      await processLogoFile(file);
    },
    [processLogoFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        await processLogoFile(file);
      }
    },
    [processLogoFile],
  );

  const handleSaveBrandKit = useCallback(() => {
    saveBrandKit({
      name: brandName,
      brandName,
      tagline,
      primaryColor: effectivePrimary,
      secondaryColor: kit.secondaryColor,
      accentColor: kit.accentColor,
      backgroundColor: kit.backgroundColor,
      textColor: kit.textColor,
      headlineFont: kit.headlineFont,
      bodyFont: kit.bodyFont,
      monoFont: kit.monoFont,
      tone,
      logoDataUrl,
    });
    show(text("✓ Brand kit tersimpan!", "✓ Brand kit saved!"));
  }, [brandName, tagline, effectivePrimary, kit, tone, logoDataUrl, saveBrandKit, show, text]);

  const handleExportHtml = useCallback(() => {
    const html = brandKitToHtml(kit);
    downloadTextFile(
      html,
      `${brandName.toLowerCase().replace(/\s+/g, "-")}-brand-guidelines.html`,
      "text/html",
    );
    show(text("✓ Panduan brand diunduh!", "✓ Brand guidelines downloaded!"));
  }, [kit, brandName, show, text]);

  const handleExportJson = useCallback(() => {
    const data = {
      brandName: kit.brandName,
      tagline: kit.tagline,
      tone: kit.tone,
      colors: {
        primary: rgbToHex(kit.primaryColor),
        secondary: rgbToHex(kit.secondaryColor),
        accent: rgbToHex(kit.accentColor),
        background: rgbToHex(kit.backgroundColor),
        text: rgbToHex(kit.textColor),
      },
      typography: {
        headline: kit.headlineFont,
        body: kit.bodyFont,
        mono: kit.monoFont,
      },
      guidelines: kit.guidelines,
    };
    downloadTextFile(
      JSON.stringify(data, null, 2),
      `${brandName.toLowerCase().replace(/\s+/g, "-")}-brand-kit.json`,
      "application/json",
    );
    show(text("✓ JSON Brand Kit diunduh!", "✓ Brand kit JSON downloaded!"));
  }, [kit, brandName, show, text]);

  const handleImportJson = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        if (file.size > 1024 * 1024)
          throw new Error(
            text("File Brand Kit maksimal 1 MB.", "Brand Kit file must be 1 MB or smaller."),
          );
        const imported = parseBrandKitImport(await file.text());
        setBrandName(imported.brandName);
        setTagline(imported.tagline);
        setTone(imported.tone);
        setLogoDataUrl(undefined);
        setPrimaryOverride(imported.primaryColor);
        setSecondaryOverride(imported.secondaryColor);
        setAccentOverride(imported.accentColor);
        setBackgroundOverride(imported.backgroundColor);
        setTextColorOverride(imported.textColor);
        setHeadlineFontOverride(imported.headlineFont);
        setBodyFontOverride(imported.bodyFont);
        setMonoFontOverride(imported.monoFont);
        setActiveTab("palette");
        show(text("Brand kit berhasil diimpor.", "Brand kit imported."));
      } catch (error) {
        show(
          error instanceof Error
            ? error.message
            : text("Gagal mengimpor Brand Kit.", "Failed to import Brand Kit."),
        );
      } finally {
        event.target.value = "";
      }
    },
    [show, text],
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Brand Header */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <input
              ref={importInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleImportJson}
            />
            {/* Logo Preview */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleLogoUpload}
            />
            <button
              type="button"
              className={`flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 bg-black/[0.02] transition dark:bg-white/5 ${
                isDragging ? "scale-105" : "border-black/10 dark:border-white/10"
              }`}
              style={{
                borderColor: isDragging ? "var(--accent)" : undefined,
                backgroundColor: isDragging ? "var(--accent-soft)" : undefined,
              }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              title={text("Klik atau drag & drop logo", "Click or drag and drop a logo")}
            >
              {logoDataUrl ? (
                <img src={logoDataUrl} alt="Logo" className="h-full w-full object-contain" />
              ) : (
                <div className="text-center">
                  {isDragging ? (
                    <UploadSimple size={28} aria-hidden="true" />
                  ) : (
                    <Camera size={28} aria-hidden="true" />
                  )}
                  <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>
                    {isDragging ? "Drop" : "Upload"}
                  </div>
                </div>
              )}
            </button>

            {/* Brand Info */}
            <div className="flex-1 space-y-3">
              <div>
                <p
                  className="text-[11px] font-medium uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Brand Name
                </p>
                <input
                  type="text"
                  aria-label={text("Nama brand", "Brand name")}
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value || "My Brand")}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-semibold outline-none focus:border-[var(--accent)]"
                  style={{
                    borderColor: "var(--input-border)",
                    backgroundColor: "var(--input-bg)",
                    color: "var(--input-text)",
                  }}
                />
              </div>
              <div>
                <p
                  className="text-[11px] font-medium uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Tagline
                </p>
                <input
                  type="text"
                  aria-label={text("Tagline", "Tagline")}
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Your brand tagline..."
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-xs outline-none focus:border-[var(--accent)]"
                  style={{
                    borderColor: "var(--input-border)",
                    backgroundColor: "var(--input-bg)",
                    color: "var(--input-text)",
                  }}
                />
              </div>
            </div>

            {/* Brand Tone */}
            <div className="w-full sm:w-56">
              <p
                className="text-[11px] font-medium uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Tone
              </p>
              <div className="mt-1 space-y-1">
                {TONE_OPTIONS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      if (tone !== t.id) {
                        setTone(t.id);
                        setHeadlineFontOverride(null);
                        setBodyFontOverride(null);
                        setMonoFontOverride(null);
                        show(text(`✓ Tone: ${t.label}`, `✓ Tone: ${t.label}`));
                      }
                    }}
                    title={t.desc}
                    aria-pressed={tone === t.id}
                    className={
                      "flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left transition " +
                      (tone === t.id
                        ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                        : "border-transparent hover:bg-black/5 dark:hover:bg-white/5")
                    }
                  >
                    {(() => {
                      const ToneIcon = TONE_ICONS[t.id];
                      return <ToneIcon size={16} aria-hidden="true" />;
                    })()}
                    <span className="min-w-0 flex-1">
                      <span
                        className={
                          "block text-[11px] font-medium " +
                          (tone === t.id
                            ? "text-[var(--accent)]"
                            : "text-zinc-700 dark:text-zinc-300")
                        }
                      >
                        {t.label}
                      </span>
                      <span
                        className="block truncate text-[9px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {t.desc}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="w-full sm:w-32">
              <p
                className="text-[11px] font-medium uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Actions
              </p>
              <div className="mt-1">
                <button
                  type="button"
                  onClick={() => importInputRef.current?.click()}
                  className="mb-2 flex w-full items-center justify-center rounded-lg border px-3 py-2 text-xs font-medium transition"
                  style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                >
                  {text("Impor JSON", "Import JSON")}
                </button>
                <button
                  type="button"
                  onClick={handleSaveBrandKit}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition hover:brightness-110"
                  style={{
                    borderColor: "var(--accent)",
                    backgroundColor: "var(--accent-soft)",
                    color: "var(--accent)",
                  }}
                >
                  <FloppyDisk size={16} className="mr-1 inline" aria-hidden="true" />
                  {text("Simpan Brand Kit", "Save Brand Kit")}
                </button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tab Navigation */}
      <div
        className="grid grid-cols-2 gap-1 rounded-xl border p-1 sm:grid-cols-5"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--chip-bg)" }}
      >
        {(
          [
            { id: "palette" as const, label: text("Palet", "Palette"), icon: Palette },
            { id: "typography" as const, label: text("Tipografi", "Typography"), icon: TextAa },
            { id: "guidelines" as const, label: text("Panduan", "Guidelines"), icon: FileText },
            { id: "export" as const, label: "Export", icon: BracketsCurly },
          ] satisfies { id: typeof activeTab; label: string; icon: Icon }[]
        ).map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="flex min-h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium transition"
              style={
                activeTab === tab.id
                  ? { backgroundColor: "var(--chip-active-bg)", color: "var(--text-primary)" }
                  : { color: "var(--text-muted)" }
              }
            >
              <TabIcon size={15} aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setActiveTab("accessibility")}
          className="flex min-h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium transition"
          style={
            activeTab === "accessibility"
              ? { backgroundColor: "var(--chip-active-bg)", color: "var(--text-primary)" }
              : { color: "var(--text-muted)" }
          }
        >
          <Wheelchair size={15} aria-hidden="true" />
          {text("Aksesibilitas", "Accessibility")}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "palette" && (
        <PaletteTab
          kit={kit}
          suggestions={suggestions}
          secondaryOverride={secondaryOverride}
          accentOverride={accentOverride}
          setPrimaryOverride={setPrimaryOverride}
          setSecondaryOverride={setSecondaryOverride}
          setAccentOverride={setAccentOverride}
          setBackgroundOverride={setBackgroundOverride}
          setTextColorOverride={setTextColorOverride}
        />
      )}

      {activeTab === "typography" && (
        <TypographyTab
          kit={kit}
          onSelectHeadline={setHeadlineFontOverride}
          onSelectBody={setBodyFontOverride}
          onSelectMono={setMonoFontOverride}
        />
      )}

      {activeTab === "guidelines" && <GuidelinesTab kit={kit} />}

      {activeTab === "accessibility" && <AccessibilityTab kit={kit} />}

      {activeTab === "export" && (
        <ExportTab
          kit={kit}
          onExportHtml={handleExportHtml}
          onExportJson={handleExportJson}
          onExportW3cTokens={() => {
            downloadTextFile(
              brandKitToW3cTokens(kit),
              `${brandName.toLowerCase().replace(/\s+/g, "-")}-tokens.json`,
              "application/json",
            );
            show(text("✓ Token W3C diunduh!", "✓ W3C design tokens downloaded!"));
          }}
          onExportTailwind={() => {
            downloadTextFile(
              brandKitToTailwindConfig(kit),
              `${brandName.toLowerCase().replace(/\s+/g, "-")}-tailwind.config.js`,
              "text/javascript",
            );
            show(text("✓ Konfigurasi Tailwind diunduh!", "✓ Tailwind config downloaded!"));
          }}
        />
      )}

      {/* Saved Brand Kits */}
      {savedBrandKits.length > 0 && (
        <Card>
          <CardHeader
            title={text("Brand Kit tersimpan", "Saved Brand Kits")}
            subtitle={text("Muat Brand Kit yang pernah disimpan", "Load your saved brand kits")}
          />
          <CardBody>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {savedBrandKits.map((savedKit) => (
                <div
                  key={savedKit.id}
                  className="group rounded-xl border p-4 transition hover:border-[var(--accent)]"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-lg"
                      style={{ backgroundColor: rgbToHex(savedKit.primaryColor) }}
                    />
                    <div className="flex-1">
                      <div
                        className="text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {savedKit.name}
                      </div>
                      <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                        {new Date(savedKit.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setBrandName(savedKit.brandName);
                        setTagline(savedKit.tagline);
                        setTone(savedKit.tone);
                        setLogoDataUrl(savedKit.logoDataUrl);
                        setPrimaryOverride(savedKit.primaryColor);
                        setSecondaryOverride(savedKit.secondaryColor);
                        setAccentOverride(savedKit.accentColor);
                        setBackgroundOverride(savedKit.backgroundColor);
                        setTextColorOverride(savedKit.textColor);
                        setHeadlineFontOverride(savedKit.headlineFont);
                        setBodyFontOverride(savedKit.bodyFont);
                        setMonoFontOverride(savedKit.monoFont);
                        show(text("✓ Brand kit dimuat!", "✓ Brand kit loaded!"));
                      }}
                      className="flex-1 rounded-lg border px-2 py-1.5 text-[11px] transition"
                      style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                    >
                      Load
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteBrandKit(savedKit.id);
                        show(text("✓ Brand kit dihapus!", "✓ Brand kit deleted!"));
                      }}
                      className="rounded-lg border px-2 py-1.5 text-[11px] transition hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-300"
                      style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
