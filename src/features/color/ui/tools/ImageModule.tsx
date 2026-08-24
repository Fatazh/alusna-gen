import { useEffect, useRef, useState } from "react";
import { rgbToHex, type RGB } from "../../model/color";
import { getColorName } from "../../model/colorNames";
import { useStudio } from "../../../../store/studio";
import { Card, CardBody, CardHeader } from "../../../../shared/ui/Card";
import { extractPalette } from "../../services/imagePalette";
import { useToast } from "../../../../shared/ui/toastContext";
import { APP_BRAND } from "../../../../shared/config/brand";
import { useLocale } from "../../../../shared/i18n";

export function ImageModule() {
  const { text } = useLocale();
  const setSelectedColor = useStudio((s) => s.setSelectedColor);
  const pushColorHistory = useStudio((s) => s.pushColorHistory);
  const saveColor = useStudio((s) => s.saveColor);
  const { show } = useToast();

  const fileRef = useRef<HTMLInputElement>(null);
  const [colors, setColors] = useState<RGB[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cleanup Object URL on unmount or preview change
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File size validation (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setError("File terlalu besar. Maksimal ukuran file adalah 10MB.");
      return;
    }

    // File type validation
    if (!file.type.startsWith("image/")) {
      setError("Format file tidak didukung. Hanya file gambar yang diizinkan.");
      return;
    }
    // SVG is deliberately excluded
    if (file.type === "image/svg+xml" || /\.svg$/i.test(file.name)) {
      setError("File SVG tidak didukung.");
      return;
    }

    setError(null);
    setLoading(true);
    setPreview(URL.createObjectURL(file));
    try {
      const palette = await extractPalette(file, 6);
      setColors(palette);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : text("Gagal mengekstrak palet", "Failed to extract palette"),
      );
      setColors([]);
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const copyHex = async (hex: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(hex);
      show(`✓ ${hex} berhasil disalin!`);
    } catch {
      // fail silently
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <Card>
          <CardHeader
            title={text("Ekstrak Palet dari Gambar", "Extract a Palette from an Image")}
            subtitle={text(
              `Upload foto, ${APP_BRAND.name} mengekstrak warna dominan. Klik HEX untuk menyalin.`,
              `Upload a photo and ${APP_BRAND.name} will extract dominant colors. Click HEX to copy.`,
            )}
          />
          <CardBody className="space-y-5">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/bmp,image/avif"
              onChange={onUpload}
              className="hidden"
              id="image-upload"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full rounded-xl border border-dashed px-4 py-8 text-sm transition"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              {loading
                ? text("Mengekstrak…", "Extracting…")
                : text("Pilih gambar…", "Choose image…")}
            </button>
            {error && (
              <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-600 dark:text-rose-300">
                {error}
              </p>
            )}
            {preview && (
              <div
                className="h-48 rounded-2xl border bg-cover bg-center"
                style={{ backgroundImage: `url(${preview})`, borderColor: "var(--border)" }}
              />
            )}
            {colors.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {colors.map((rgb, i) => {
                  const hex = rgbToHex(rgb);
                  return (
                    <div
                      key={`${hex}-${i}`}
                      className="group overflow-hidden rounded-xl border text-left transition"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedColor(rgb);
                          pushColorHistory(rgb);
                        }}
                        className="block h-20 w-full"
                        style={{ backgroundColor: hex }}
                        aria-label={`${text("Pilih", "Choose")} ${getColorName(rgb).label}`}
                      />
                      <div
                        className="flex items-center justify-between px-2 py-1.5"
                        style={{ backgroundColor: "var(--chip-bg)" }}
                      >
                        <button
                          type="button"
                          onClick={(e) => copyHex(hex, e)}
                          className="cursor-pointer font-mono text-[10px] transition hover:underline"
                          style={{ color: "var(--text-secondary)" }}
                          aria-label={`${text("Salin", "Copy")} ${hex}`}
                          title={text("Klik untuk salin HEX", "Click to copy HEX")}
                        >
                          {hex}
                        </button>
                        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                          {getColorName(rgb).label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <Card className="h-fit">
        <CardHeader title={text("Aksi", "Actions")} />
        <CardBody className="space-y-3">
          <button
            type="button"
            onClick={() => colors.forEach((rgb) => saveColor(rgb, getColorName(rgb).label))}
            disabled={colors.length === 0}
            className="w-full rounded-lg bg-indigo-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-indigo-400 disabled:opacity-40"
          >
            {text("Simpan semua ke palet", "Save all to palette")}
          </button>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            {text(
              "Klik salah satu warna untuk menjadikannya warna aktif.",
              "Choose a color to make it active.",
            )}
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
