import { useCallback, useEffect, useState } from "react";
import { Check } from "@phosphor-icons/react/Check";
import { ArrowsClockwise } from "@phosphor-icons/react/ArrowsClockwise";
import { LockSimple } from "@phosphor-icons/react/LockSimple";
import { Palette } from "@phosphor-icons/react/Palette";
import { PencilSimple } from "@phosphor-icons/react/PencilSimple";
import { useStudio } from "../../../store/studio";
import { bestTextOn, type RGB, rgbToHex, rgbToHsl, rotateHue } from "../../color";
import { Card, CardHeader, CardBody } from "../../../shared/ui/Card";
import { useToast } from "../../../shared/ui/toastContext";
import { TONE_PROFILES, type BrandKit } from "../model/brandKit";
import { loadGoogleFont } from "../../typography";

// ---------------------------------------------------------------------------
// Palette Tab
// ---------------------------------------------------------------------------

export function PaletteTab({
  kit,
  suggestions,
  secondaryOverride,
  accentOverride,
  setPrimaryOverride,
  setSecondaryOverride,
  setAccentOverride,
  setBackgroundOverride,
  setTextColorOverride,
}: {
  kit: BrandKit;
  suggestions: {
    secondary: RGB;
    accent: RGB;
    analogous: RGB;
    triadic1: RGB;
    triadic2: RGB;
  };
  secondaryOverride: RGB | null;
  accentOverride: RGB | null;
  setPrimaryOverride: (c: RGB | null) => void;
  setSecondaryOverride: (c: RGB | null) => void;
  setAccentOverride: (c: RGB | null) => void;
  setBackgroundOverride: (c: RGB | null) => void;
  setTextColorOverride: (c: RGB | null) => void;
}) {
  const { show } = useToast();
  const toneStyle = TONE_PROFILES[kit.tone].style;
  const savedColors = useStudio((s) => s.savedColors);

  // Auto-adjust toggle
  const [autoAdjust, setAutoAdjust] = useState(true);

  // Load the fonts selected by the current tone so the preview renders correctly.
  useEffect(() => {
    loadGoogleFont(kit.headlineFont, ["400", "700"]);
    loadGoogleFont(kit.bodyFont, ["400"]);
    loadGoogleFont(kit.monoFont, ["400"]);
  }, [kit.headlineFont, kit.bodyFont, kit.monoFont]);

  // Effective background & text colors
  const effectiveBg = kit.backgroundColor;
  const effectiveText = kit.textColor;
  const heroText = bestTextOn(kit.primaryColor);

  // Generate secondary/accent based on tone when auto-adjust is ON
  const deriveColors = useCallback((primary: RGB) => {
    const hsl = rgbToHsl(primary);

    // Secondary: complementary-ish hue rotation
    const secondaryHueShift = hsl.s < 20 ? 0 : 150;
    const secondary = rotateHue(primary, secondaryHueShift);

    // Accent: analogous hue rotation
    const accentHueShift = hsl.s < 20 ? 0 : 30;
    const accent = rotateHue(primary, accentHueShift);

    return { secondary, accent };
  }, []);

  // Handle primary color change with auto-adjust
  const handlePrimaryChange = useCallback(
    (newColor: RGB) => {
      setPrimaryOverride(newColor);
      if (autoAdjust) {
        const derived = deriveColors(newColor);
        setSecondaryOverride(derived.secondary);
        setAccentOverride(derived.accent);
        // Clear bg/text overrides so they re-derive from primary.
        setBackgroundOverride(null);
        setTextColorOverride(null);
      }
    },
    [
      autoAdjust,
      deriveColors,
      setPrimaryOverride,
      setSecondaryOverride,
      setAccentOverride,
      setBackgroundOverride,
      setTextColorOverride,
    ],
  );

  // Handle secondary color change with auto-adjust
  const handleSecondaryChange = useCallback(
    (newColor: RGB) => {
      setSecondaryOverride(newColor);
      if (autoAdjust) {
        // When changing secondary, derive accent from it (analogous)
        const accent = rotateHue(newColor, 30);
        setAccentOverride(accent);
      }
    },
    [autoAdjust, setSecondaryOverride, setAccentOverride],
  );

  // Build the swatch list
  const swatches = [
    {
      label: "Primary",
      color: kit.primaryColor,
      onChange: handlePrimaryChange,
      role: "primary" as const,
      editable: true,
    },
    {
      label: "Secondary",
      color: kit.secondaryColor,
      onChange: handleSecondaryChange,
      role: "secondary" as const,
      editable: true,
    },
    {
      label: "Accent",
      color: kit.accentColor,
      onChange: (c: RGB) => setAccentOverride(c),
      role: "accent" as const,
      editable: true,
    },
    {
      label: "Background",
      color: effectiveBg,
      onChange: autoAdjust ? null : setBackgroundOverride,
      role: "bg" as const,
      editable: !autoAdjust,
    },
    {
      label: "Text",
      color: effectiveText,
      onChange: autoAdjust ? null : setTextColorOverride,
      role: "text" as const,
      editable: !autoAdjust,
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Auto-Adjust Toggle */}
      <Card>
        <CardBody className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-sm">
                <ArrowsClockwise size={16} aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                  Sesuaikan Otomatis
                </div>
                <div className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
                  {autoAdjust
                    ? "Mengubah warna akan menyesuaikan warna lain secara harmonis"
                    : "Pilih warna bebas untuk setiap kolom — hanya tone yang disesuaikan"}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!autoAdjust) {
                  // When switching to auto-adjust, clear manual overrides.
                  setBackgroundOverride(null);
                  setTextColorOverride(null);
                }
                setAutoAdjust(!autoAdjust);
              }}
              className={
                "relative h-6 w-11 rounded-full transition-colors duration-200 " +
                (autoAdjust ? "bg-indigo-500" : "bg-zinc-400 dark:bg-zinc-700")
              }
              aria-label="Toggle sesuaikan otomatis"
            >
              <span
                className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200"
                style={{ transform: autoAdjust ? "translateX(22px)" : "translateX(0)" }}
              />
            </button>
          </div>
        </CardBody>
      </Card>

      {/* Main Palette with Inline Color Pickers */}
      <Card>
        <CardHeader
          title="Palette Utama"
          subtitle={
            autoAdjust
              ? "Klik untuk copy HEX, atau gunakan tombol di bawah untuk pilih warna"
              : "Pilih warna bebas untuk setiap kolom"
          }
        />
        <CardBody>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {swatches.map((item) => {
              const hex = rgbToHex(item.color);
              const colorInputId = `color-picker-${item.role}`;
              return (
                <div key={item.role} className="group">
                  {/* Color swatch */}
                  <div className="relative">
                    <button
                      type="button"
                      aria-label={`Copy ${hex}`}
                      className="relative h-24 w-full cursor-pointer rounded-xl border border-black/10 transition hover:scale-105 hover:shadow-lg dark:border-white/10"
                      style={{ backgroundColor: hex }}
                      onClick={() => {
                        navigator.clipboard.writeText(hex);
                        show(`✓ ${hex} copied!`);
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <span className="rounded-md bg-black/50 px-2 py-1 text-[10px] font-medium text-white backdrop-blur">
                          Click to copy
                        </span>
                      </div>
                    </button>
                    {/* Edit indicator */}
                    {item.editable && (
                      <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[8px] text-white opacity-0 group-hover:opacity-100 transition z-10">
                        <PencilSimple size={13} aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  {/* Label & hex */}
                  <div className="mt-2 text-center">
                    <div
                      className="text-[11px] font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.label}
                    </div>
                    <div
                      className="font-mono text-[10px]"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {hex}
                    </div>
                  </div>
                  {/* Color picker button for editable colors */}
                  {item.editable && item.onChange && (
                    <div className="mt-1.5 flex justify-center">
                      <label
                        htmlFor={colorInputId}
                        className="cursor-pointer rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-medium text-indigo-700 transition hover:bg-indigo-500/20 dark:text-indigo-300"
                      >
                        <Palette size={13} className="mr-1 inline" aria-hidden="true" />
                        Pilih Warna
                      </label>
                      <input
                        type="color"
                        id={colorInputId}
                        value={hex}
                        onChange={(e) => {
                          const newHex = e.target.value;
                          const r = parseInt(newHex.slice(1, 3), 16);
                          const g = parseInt(newHex.slice(3, 5), 16);
                          const b = parseInt(newHex.slice(5, 7), 16);
                          item.onChange?.({ r, g, b });
                        }}
                        className="sr-only"
                      />
                    </div>
                  )}
                  {/* Lock indicator for non-editable */}
                  {!item.editable && (
                    <div className="mt-1.5 flex justify-center">
                      <span
                        className="rounded-md px-2 py-0.5 text-[9px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <LockSimple size={11} className="mr-1 inline" aria-hidden="true" />
                        {autoAdjust ? "Otomatis" : "Manual"}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Saved Colors Palette Footer (for Primary) */}
      {savedColors.length > 0 && (
        <Card>
          <CardHeader
            title="Pilih dari Palet Tersimpan"
            subtitle="Klik untuk mengganti warna Primary"
          />
          <CardBody>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
              {savedColors.map((sc) => {
                const scHex = rgbToHex(sc.rgb);
                const isActive = rgbToHex(kit.primaryColor) === scHex;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => {
                      handlePrimaryChange(sc.rgb);
                      show(`✓ Primary: ${sc.name || scHex}`);
                    }}
                    className={`group relative h-12 w-full rounded-lg border-2 transition hover:scale-105 ${
                      isActive
                        ? "border-indigo-500 ring-2 ring-indigo-500/30"
                        : "border-black/10 hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
                    }`}
                    style={{ backgroundColor: scHex }}
                    title={`${sc.name} — ${scHex}`}
                  >
                    <span className="absolute inset-x-0 bottom-0 text-center text-[8px] font-medium text-white/80 bg-black/40 rounded-b-md py-0.5 truncate px-1">
                      {sc.name || scHex}
                    </span>
                    {isActive && (
                      <div className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-500 text-[8px] text-white">
                        <Check size={10} weight="bold" aria-hidden="true" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                {savedColors.length} warna tersimpan — pilih untuk Primary
              </span>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Color Harmony Suggestions */}
      <Card>
        <CardHeader title="Saran Harmoni" subtitle="Klik untuk mengganti warna secondary/accent" />
        <CardBody>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {[
              {
                label: "Complementary",
                color: suggestions.secondary,
                target: "secondary" as const,
              },
              { label: "Analogous", color: suggestions.analogous, target: "accent" as const },
              { label: "Triadic I", color: suggestions.triadic1, target: "secondary" as const },
              { label: "Triadic II", color: suggestions.triadic2, target: "accent" as const },
              { label: "Accent", color: suggestions.accent, target: "accent" as const },
            ].map((s) => {
              const hex = rgbToHex(s.color);
              return (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => {
                    if (s.target === "secondary") setSecondaryOverride(s.color);
                    else setAccentOverride(s.color);
                  }}
                  className="group overflow-hidden rounded-xl border transition hover:scale-105 hover:border-indigo-500/50"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="h-14 w-full" style={{ backgroundColor: hex }} />
                  <div className="px-2 py-1.5" style={{ backgroundColor: "var(--surface)" }}>
                    <div
                      className="text-[10px] font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {s.label}
                    </div>
                    <div className="font-mono text-[9px]" style={{ color: "var(--text-muted)" }}>
                      {hex}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          {(secondaryOverride || accentOverride) && (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSecondaryOverride(null);
                  setAccentOverride(null);
                }}
                className="rounded-lg border px-3 py-1.5 text-[11px] transition"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              >
                Reset overrides
              </button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Brand Preview */}
      <Card>
        <CardHeader title="Preview Brand" subtitle="Seperti apa brand Anda terlihat" />
        <CardBody>
          {" "}
          <div className="overflow-hidden border" style={{ borderRadius: toneStyle.radius + 4 }}>
            {/* Hero */}
            <div
              className="text-center"
              style={{
                backgroundColor: rgbToHex(kit.primaryColor),
                padding: `${toneStyle.spacing * 2}px ${toneStyle.spacing}px`,
              }}
            >
              {kit.logoDataUrl && (
                <img
                  src={kit.logoDataUrl}
                  alt="Logo"
                  className="mx-auto mb-4 h-16 object-contain"
                />
              )}
              <h2
                style={{
                  color: heroText,
                  fontFamily: `'${kit.headlineFont}', sans-serif`,
                  fontSize: toneStyle.headingSize,
                  fontWeight: toneStyle.headingWeight,
                  letterSpacing: toneStyle.letterSpacing,
                  textTransform: toneStyle.headingTransform,
                }}
              >
                {kit.brandName}
              </h2>
              {kit.tagline && (
                <p
                  className="mt-1 text-sm"
                  style={{ color: `${heroText}CC`, fontFamily: `'${kit.bodyFont}', sans-serif` }}
                >
                  {kit.tagline}
                </p>
              )}
            </div>
            {/* Content */}
            <div style={{ backgroundColor: rgbToHex(effectiveBg), padding: toneStyle.spacing }}>
              <div className="grid grid-cols-3 gap-4">
                <div
                  className="border"
                  style={{
                    borderColor: rgbToHex(kit.secondaryColor) + "30",
                    backgroundColor: rgbToHex(kit.secondaryColor) + "10",
                    borderRadius: toneStyle.radius,
                    borderWidth: 1,
                    padding: toneStyle.spacing / 2,
                  }}
                >
                  <div
                    className="text-xs font-semibold"
                    style={{
                      color: rgbToHex(kit.secondaryColor),
                      fontFamily: `'${kit.headlineFont}', sans-serif`,
                    }}
                  >
                    Feature 1
                  </div>
                  <div
                    className="mt-1 text-[10px]"
                    style={{
                      color: rgbToHex(effectiveText) + "99",
                      fontFamily: `'${kit.bodyFont}', sans-serif`,
                    }}
                  >
                    Description text
                  </div>
                </div>
                <div
                  className="border"
                  style={{
                    borderColor: rgbToHex(kit.accentColor) + "30",
                    backgroundColor: rgbToHex(kit.accentColor) + "10",
                    borderRadius: toneStyle.radius,
                    borderWidth: 1,
                    padding: toneStyle.spacing / 2,
                  }}
                >
                  <div
                    className="text-xs font-semibold"
                    style={{
                      color: rgbToHex(kit.accentColor),
                      fontFamily: `'${kit.headlineFont}', sans-serif`,
                    }}
                  >
                    Feature 2
                  </div>
                  <div
                    className="mt-1 text-[10px]"
                    style={{
                      color: rgbToHex(effectiveText) + "99",
                      fontFamily: `'${kit.bodyFont}', sans-serif`,
                    }}
                  >
                    Description text
                  </div>
                </div>
                <div
                  className="border"
                  style={{
                    borderColor: rgbToHex(kit.primaryColor) + "30",
                    backgroundColor: rgbToHex(kit.primaryColor) + "10",
                    borderRadius: toneStyle.radius,
                    borderWidth: 1,
                    padding: toneStyle.spacing / 2,
                  }}
                >
                  <div
                    className="text-xs font-semibold"
                    style={{
                      color: rgbToHex(kit.primaryColor),
                      fontFamily: `'${kit.headlineFont}', sans-serif`,
                    }}
                  >
                    Feature 3
                  </div>
                  <div
                    className="mt-1 text-[10px]"
                    style={{
                      color: rgbToHex(effectiveText) + "99",
                      fontFamily: `'${kit.bodyFont}', sans-serif`,
                    }}
                  >
                    Description text
                  </div>
                </div>
              </div>
              <div className="mt-2 text-center">
                <button
                  type="button"
                  className="text-xs font-semibold transition hover:opacity-90"
                  style={{
                    backgroundColor: rgbToHex(kit.primaryColor),
                    color: heroText,
                    borderRadius: toneStyle.buttonRadius,
                    padding: `${toneStyle.spacing / 2}px ${toneStyle.spacing}px`,
                    fontFamily: `'${kit.bodyFont}', sans-serif`,
                    boxShadow: toneStyle.shadow,
                  }}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
