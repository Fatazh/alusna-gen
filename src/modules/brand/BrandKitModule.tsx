import { useState, useMemo, useCallback, useRef } from "react";
import { useStudio } from "../../store/studio";
import { type RGB, rgbToHex, rgbToHsl, rotateHue } from "../../lib/color";
import { brandKitToTailwindConfig, brandKitToW3cTokens, parseBrandKitImport } from "../../lib/brandKitInterop";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { useToast } from "../../components/Toast";
import { PaletteTab } from "./PaletteTab";
import { TypographyTab } from "./TypographyTab";
import { GuidelinesTab } from "./GuidelinesTab";
import { AccessibilityTab } from "./AccessibilityTab";
import { ExportTab } from "./ExportTab";
import {
  generateBrandKit,
  brandKitToHtml,
  TONE_PROFILES,
  type BrandKit,
  type BrandTone,
} from "../../lib/designSystem";

const TONE_OPTIONS = (["modern", "classic", "playful", "minimal", "bold"] as const).map(
  (id) => TONE_PROFILES[id],
);

export function BrandKitModule() {
  const selectedColor = useStudio((s) => s.selectedColor);
  const { show } = useToast();
  const savedBrandKits = useStudio((s) => s.savedBrandKits);
  const saveBrandKit = useStudio((s) => s.saveBrandKit);
  const deleteBrandKit = useStudio((s) => s.deleteBrandKit);

  const [brandName, setBrandName] = useState("My Brand");
  const [tagline, setTagline] = useState("");
  const [tone, setTone] = useState<BrandTone>("modern");
  const [logoDataUrl, setLogoDataUrl] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<"palette" | "typography" | "guidelines" | "export" | "accessibility">("palette");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Custom overrides
  const [primaryOverride, setPrimaryOverride] = useState<RGB | null>(null);
  const [secondaryOverride, setSecondaryOverride] = useState<RGB | null>(null);
  const [accentOverride, setAccentOverride] = useState<RGB | null>(null);
  const [backgroundOverride, setBackgroundOverride] = useState<RGB | null>(null);
  const [textColorOverride, setTextColorOverride] = useState<RGB | null>(null);
  const [headlineFontOverride, setHeadlineFontOverride] = useState<string | null>(null);
  const [bodyFontOverride, setBodyFontOverride] = useState<string | null>(null);
  const [monoFontOverride, setMonoFontOverride] = useState<string | null>(null);

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

  const [isDragging, setIsDragging] = useState(false);

  const processLogoFile = useCallback(async (file: File) => {
    // Type validation (SVG excluded — external resource / tracking concerns).
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      show("Format logo tidak didukung. Gunakan PNG, JPG, atau WebP.");
      return;
    }
    // Size validation (max 2MB — the logo is embedded as a base64 data URL).
    const MAX_LOGO_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_LOGO_SIZE) {
      show("Logo terlalu besar. Maksimal 2MB.");
      return;
    }
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error ?? new Error("Gagal membaca file"));
        reader.readAsDataURL(file);
      });
      setLogoDataUrl(dataUrl);
      show("✓ Logo berhasil diunggah!");
    } catch {
      show("Gagal mengunggah logo");
    }
  }, [show]);

  const handleLogoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Clear the input so picking the same file again re-fires onChange.
    if (fileInputRef.current) fileInputRef.current.value = "";
    await processLogoFile(file);
  }, [processLogoFile]);

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

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processLogoFile(file);
    }
  }, [processLogoFile]);

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
    show("✓ Brand kit saved!");
  }, [brandName, tagline, effectivePrimary, kit, tone, logoDataUrl, saveBrandKit, show]);

  const handleExportHtml = useCallback(() => {
    const html = brandKitToHtml(kit);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brandName.toLowerCase().replace(/\s+/g, "-")}-brand-guidelines.html`;
    a.click();
    URL.revokeObjectURL(url);
    show("✓ Brand guidelines downloaded!");
  }, [kit, brandName, show]);

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
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brandName.toLowerCase().replace(/\s+/g, "-")}-brand-kit.json`;
    a.click();
    URL.revokeObjectURL(url);
    show("✓ Brand kit JSON downloaded!");
  }, [kit, brandName, show]);

  const downloadText = useCallback((content: string, filename: string, type: string) => {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImportJson = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 1024 * 1024) throw new Error("File Brand Kit maksimal 1 MB.");
      const imported = parseBrandKitImport(await file.text());
      setBrandName(imported.brandName); setTagline(imported.tagline); setTone(imported.tone); setLogoDataUrl(undefined);
      setPrimaryOverride(imported.primaryColor); setSecondaryOverride(imported.secondaryColor); setAccentOverride(imported.accentColor);
      setBackgroundOverride(imported.backgroundColor); setTextColorOverride(imported.textColor);
      setHeadlineFontOverride(imported.headlineFont); setBodyFontOverride(imported.bodyFont); setMonoFontOverride(imported.monoFont);
      setActiveTab("palette");
      show("Brand kit berhasil diimpor.");
    } catch (error) {
      show(error instanceof Error ? error.message : "Gagal mengimpor Brand Kit.");
    } finally {
      event.target.value = "";
    }
  }, [show]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Brand Header */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <input ref={importInputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleImportJson} />
            {/* Logo Preview */}
            <div
              className={`flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 bg-black/[0.02] transition dark:bg-white/5 ${
                isDragging 
                  ? "border-indigo-500 bg-indigo-500/10 scale-105" 
                  : "border-black/10 hover:border-indigo-500/50 dark:border-white/10"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              title="Klik atau drag & drop logo"
            >
              {logoDataUrl ? (
                <img src={logoDataUrl} alt="Logo" className="h-full w-full object-contain" />
              ) : (
                <div className="text-center">
                  <div className="text-2xl">{isDragging ? "📥" : "📸"}</div>
                  <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>{isDragging ? "Drop" : "Upload"}</div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </div>

            {/* Brand Info */}
            <div className="flex-1 space-y-3">
              <div>
                <label className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Brand Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value || "My Brand")}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500/50"
                  style={{ borderColor: "var(--input-border)", backgroundColor: "var(--input-bg)", color: "var(--input-text)" }}
                />
              </div>
              <div>
                <label className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Your brand tagline..."
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-xs outline-none focus:border-indigo-500/50"
                  style={{ borderColor: "var(--input-border)", backgroundColor: "var(--input-bg)", color: "var(--input-text)" }}
                />
              </div>
            </div>

            {/* Brand Tone */}
            <div className="w-full sm:w-56">
              <label className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Tone</label>
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
                        show(`✓ Tone: ${t.label}`);
                      }
                    }}
                    title={t.desc}
                    aria-pressed={tone === t.id}
                    className={
                      "flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left transition " +
                      (tone === t.id
                        ? "border-indigo-500/30 bg-indigo-500/15"
                        : "border-transparent hover:bg-black/5 dark:hover:bg-white/5")
                    }
                  >
                    <span className="text-sm">{t.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={
                          "block text-[11px] font-medium " +
                          (tone === t.id
                            ? "text-indigo-700 dark:text-indigo-300"
                            : "text-zinc-700 dark:text-zinc-300")
                        }
                      >
                        {t.label}
                      </span>
                      <span className="block truncate text-[9px]" style={{ color: "var(--text-muted)" }}>{t.desc}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="w-full sm:w-32">
              <label className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Actions</label>
              <div className="mt-1">
                <button type="button" onClick={() => importInputRef.current?.click()} className="mb-2 flex w-full items-center justify-center rounded-lg border px-3 py-2 text-xs font-medium transition" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                  Impor JSON
                </button>
                <button
                  type="button"
                  onClick={handleSaveBrandKit}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/15 px-3 py-2 text-xs font-medium text-indigo-700 transition hover:bg-indigo-500/25 dark:text-indigo-300"
                >
                  💾 Save Brand Kit
                </button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-1 rounded-xl border p-1" style={{ borderColor: "var(--border)", backgroundColor: "var(--chip-bg)" }}>
        {[
          { id: "palette" as const, label: "🎨 Palet Warna", },
          { id: "typography" as const, label: "📝 Tipografi", },
          { id: "guidelines" as const, label: "📋 Panduan", },
          { id: "export" as const, label: "📦 Export", },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 rounded-lg px-3 py-2 text-xs font-medium transition"
            style={activeTab === tab.id
              ? { backgroundColor: "var(--chip-active-bg)", color: "var(--text-primary)" }
              : { color: "var(--text-muted)" }}
          >
            {tab.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setActiveTab("accessibility")}
          className="flex-1 rounded-lg px-3 py-2 text-xs font-medium transition"
          style={activeTab === "accessibility"
            ? { backgroundColor: "var(--chip-active-bg)", color: "var(--text-primary)" }
            : { color: "var(--text-muted)" }}
        >
          ♿ Aksesibilitas
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

      {activeTab === "guidelines" && (
        <GuidelinesTab kit={kit} />
      )}

      {activeTab === "accessibility" && (
        <AccessibilityTab kit={kit} />
      )}

      {activeTab === "export" && (
        <ExportTab
          kit={kit}
          onExportHtml={handleExportHtml}
          onExportJson={handleExportJson}
          onExportW3cTokens={() => {
            downloadText(brandKitToW3cTokens(kit), `${brandName.toLowerCase().replace(/\s+/g, "-")}-tokens.json`, "application/json");
            show("W3C design tokens downloaded!");
          }}
          onExportTailwind={() => {
            downloadText(brandKitToTailwindConfig(kit), `${brandName.toLowerCase().replace(/\s+/g, "-")}-tailwind.config.js`, "text/javascript");
            show("Tailwind config downloaded!");
          }}
        />
      )}

      {/* Saved Brand Kits */}
      {savedBrandKits.length > 0 && (
        <Card>
          <CardHeader title="Saved Brand Kits" subtitle="Load your saved brand kits" />
          <CardBody>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {savedBrandKits.map((savedKit) => (
                <div
                  key={savedKit.id}
                  className="group rounded-xl border p-4 transition hover:border-indigo-500/50"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-lg"
                      style={{ backgroundColor: rgbToHex(savedKit.primaryColor) }}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{savedKit.name}</div>
                      <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{new Date(savedKit.createdAt).toLocaleDateString()}</div>
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
                        show("✓ Brand kit loaded!");
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
                        show("✓ Brand kit deleted!");
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
