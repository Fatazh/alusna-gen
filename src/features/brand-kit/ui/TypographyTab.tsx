import { useEffect, useMemo, type ReactNode } from "react";
import { Check } from "@phosphor-icons/react/Check";
import { useStudio } from "../../../store/studio";
import { bestTextOn, rgbToHex } from "../../color";
import { Card, CardBody, CardHeader } from "../../../shared/ui/Card";
import { type BrandKit } from "../model/brandKit";
import { loadGoogleFont } from "../../typography";

type FontOption = {
  family: string;
  category: string;
};

type TypographyTabProps = {
  kit: BrandKit;
  onSelectHeadline: (family: string) => void;
  onSelectBody: (family: string) => void;
  onSelectMono: (family: string) => void;
};

const HEADLINE_FONTS: FontOption[] = [
  { family: "Inter", category: "Sans Serif" },
  { family: "Poppins", category: "Sans Serif" },
  { family: "Montserrat", category: "Sans Serif" },
  { family: "Playfair Display", category: "Serif" },
  { family: "Lora", category: "Serif" },
  { family: "Oswald", category: "Display" },
  { family: "Bebas Neue", category: "Display" },
  { family: "Raleway", category: "Sans Serif" },
];

const BODY_FONTS: FontOption[] = [
  { family: "Inter", category: "Sans Serif" },
  { family: "Roboto", category: "Sans Serif" },
  { family: "Open Sans", category: "Sans Serif" },
  { family: "Lato", category: "Sans Serif" },
  { family: "Source Sans 3", category: "Sans Serif" },
  { family: "Nunito", category: "Sans Serif" },
  { family: "Lora", category: "Serif" },
  { family: "Merriweather", category: "Serif" },
];

const MONO_FONTS: FontOption[] = [
  { family: "JetBrains Mono", category: "Monospace" },
  { family: "Fira Code", category: "Monospace" },
  { family: "Source Code Pro", category: "Monospace" },
  { family: "Space Mono", category: "Monospace" },
  { family: "IBM Plex Mono", category: "Monospace" },
];

function addUploadedFonts(
  options: FontOption[],
  uploadedFonts: { family: string }[],
): FontOption[] {
  const known = new Set(options.map((option) => option.family));
  return [
    ...options,
    ...uploadedFonts
      .filter((font) => !known.has(font.family))
      .map((font) => ({ family: font.family, category: "Uploaded" })),
  ];
}

export function TypographyTab({
  kit,
  onSelectHeadline,
  onSelectBody,
  onSelectMono,
}: TypographyTabProps) {
  const uploadedFonts = useStudio((state) => state.uploadedFonts);
  const uploadedFamilies = useMemo(
    () => new Set(uploadedFonts.map((font) => font.family)),
    [uploadedFonts],
  );
  const headlineOptions = addUploadedFonts(HEADLINE_FONTS, uploadedFonts);
  const bodyOptions = addUploadedFonts(BODY_FONTS, uploadedFonts);
  const monoOptions = addUploadedFonts(MONO_FONTS, uploadedFonts);

  useEffect(() => {
    const selected = [
      { family: kit.headlineFont, variants: ["400", "700"] },
      { family: kit.bodyFont, variants: ["400", "600"] },
      { family: kit.monoFont, variants: ["400"] },
    ];
    selected.forEach(({ family, variants }) => {
      if (!uploadedFamilies.has(family)) loadGoogleFont(family, variants);
    });
  }, [kit.headlineFont, kit.bodyFont, kit.monoFont, uploadedFamilies]);

  const heroText = bestTextOn(kit.primaryColor);

  return (
    <div className="space-y-4 animate-fade-in">
      <Card>
        <CardHeader
          title="Live Preview Tipografi"
          subtitle="Pilihan font langsung diterapkan ke Brand Kit dan seluruh hasil export"
        />
        <CardBody>
          <div
            className="overflow-hidden rounded-xl border"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="px-6 py-8 text-center"
              style={{ backgroundColor: rgbToHex(kit.primaryColor), color: heroText }}
            >
              <div
                className="text-3xl font-bold"
                style={{ fontFamily: `'${kit.headlineFont}', sans-serif` }}
              >
                {kit.brandName}
              </div>
              <div
                className="mt-2 text-sm opacity-80"
                style={{ fontFamily: `'${kit.bodyFont}', sans-serif` }}
              >
                {kit.tagline || "Identitas brand yang konsisten dan mudah dikenali"}
              </div>
            </div>
            <div
              className="space-y-3 px-6 py-5"
              style={{
                backgroundColor: rgbToHex(kit.backgroundColor),
                color: rgbToHex(kit.textColor),
              }}
            >
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: `'${kit.bodyFont}', sans-serif` }}
              >
                Tipografi body digunakan untuk paragraf, deskripsi produk, dan komunikasi
                sehari-hari.
              </p>
              <code
                className="block rounded-lg px-3 py-2 text-xs"
                style={{
                  backgroundColor: `${rgbToHex(kit.primaryColor)}18`,
                  fontFamily: `'${kit.monoFont}', monospace`,
                }}
              >
                --brand-primary: {rgbToHex(kit.primaryColor)};
              </code>
            </div>
          </div>
          <div
            className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px]"
            style={{ color: "var(--text-muted)" }}
          >
            <span>
              Heading:{" "}
              <strong style={{ color: "var(--text-secondary)" }}>{kit.headlineFont}</strong>
            </span>
            <span>
              Body: <strong style={{ color: "var(--text-secondary)" }}>{kit.bodyFont}</strong>
            </span>
            <span>
              Mono: <strong style={{ color: "var(--text-secondary)" }}>{kit.monoFont}</strong>
            </span>
          </div>
        </CardBody>
      </Card>

      <FontSection
        title="Font Heading"
        description="Pilih Sans Serif, Serif, atau Display untuk judul brand"
        options={headlineOptions}
        selected={kit.headlineFont}
        uploadedFamilies={uploadedFamilies}
        onSelect={onSelectHeadline}
        sample={(family) => (
          <span
            className="block truncate text-xl font-bold"
            style={{ fontFamily: `'${family}', sans-serif` }}
          >
            {kit.brandName} — The quick brown fox
          </span>
        )}
      />

      <FontSection
        title="Font Body"
        description="Font untuk paragraf, deskripsi, dan komunikasi brand"
        options={bodyOptions}
        selected={kit.bodyFont}
        uploadedFamilies={uploadedFamilies}
        onSelect={onSelectBody}
        sample={(family) => (
          <span
            className="block text-sm leading-relaxed"
            style={{ fontFamily: `'${family}', sans-serif` }}
          >
            The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.
          </span>
        )}
      />

      <FontSection
        title="Font Monospace"
        description="Font untuk kode, token, dan nilai teknis"
        options={monoOptions}
        selected={kit.monoFont}
        uploadedFamilies={uploadedFamilies}
        onSelect={onSelectMono}
        sample={(family) => (
          <span className="block text-sm" style={{ fontFamily: `'${family}', monospace` }}>
            const brand = {`{ name: "${kit.brandName}" }`};
          </span>
        )}
      />
    </div>
  );
}

function FontSection({
  title,
  description,
  options,
  selected,
  uploadedFamilies,
  onSelect,
  sample,
}: {
  title: string;
  description: string;
  options: FontOption[];
  selected: string;
  uploadedFamilies: Set<string>;
  onSelect: (family: string) => void;
  sample: (family: string) => ReactNode;
}) {
  return (
    <Card>
      <CardHeader title={title} subtitle={description} />
      <CardBody>
        <div className="grid gap-2 sm:grid-cols-2">
          {options.map((option) => {
            const active = selected === option.family;
            return (
              <button
                key={option.family}
                type="button"
                aria-pressed={active}
                onClick={() => onSelect(option.family)}
                onMouseEnter={() => {
                  if (!uploadedFamilies.has(option.family)) {
                    loadGoogleFont(option.family, ["400", "600", "700"]);
                  }
                }}
                className="rounded-lg border px-4 py-3 text-left transition hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                style={{
                  borderColor: active ? "rgb(99 102 241 / 0.65)" : "var(--border)",
                  backgroundColor: active ? "rgb(99 102 241 / 0.1)" : undefined,
                  color: "var(--text-primary)",
                  boxShadow: active ? "0 0 0 2px rgb(99 102 241 / 0.12)" : undefined,
                }}
              >
                <span
                  className="mb-1 flex items-center gap-2 text-[10px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span>{option.family}</span>
                  <span
                    className="rounded-full px-1.5 py-0.5"
                    style={{ backgroundColor: "var(--chip-bg)" }}
                  >
                    {option.category}
                  </span>
                  {active && (
                    <span className="ml-auto font-semibold text-indigo-600 dark:text-indigo-300">
                      Aktif <Check size={12} className="ml-1 inline" aria-hidden="true" />
                    </span>
                  )}
                </span>
                <span style={{ color: "var(--text-secondary)" }}>{sample(option.family)}</span>
              </button>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
