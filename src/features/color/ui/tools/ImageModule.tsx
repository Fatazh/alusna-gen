import { useCallback, useEffect, useRef, useState } from "react";
import { UploadSimple } from "@phosphor-icons/react/UploadSimple";
import { rgbToHex, type RGB } from "@alusna/shared/color";
import { getColorName } from "@alusna/shared/colorNames";
import { useStudio } from "../../../../store/studio";
import { Card, CardBody, CardHeader } from "../../../../shared/ui/Card";
import { extractPalette } from "../../services/imagePalette";
import { useCopy } from "../../../../shared/lib/useCopy";
import { APP_BRAND } from "../../../../shared/config/brand";
import { useLocale } from "../../../../shared/i18n";
import { cn } from "../../../../shared/lib/cn";
import { useToast } from "../../../../shared/ui/toastContext";

export function ImageModule() {
  const { text } = useLocale();
  const { show } = useToast();
  const setSelectedColor = useStudio((s) => s.setSelectedColor);
  const pushColorHistory = useStudio((s) => s.pushColorHistory);
  const saveColor = useStudio((s) => s.saveColor);
  const savePalette = useStudio((s) => s.savePalette);
  const { copy } = useCopy();

  const fileRef = useRef<HTMLInputElement>(null);
  const [colors, setColors] = useState<RGB[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Cleanup Object URL on unmount or preview change
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const processFile = useCallback(
    async (file: File) => {
      // File size validation (max 10MB)
      const MAX_FILE_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        setError(
          text(
            "File terlalu besar. Maksimal ukuran file adalah 10MB.",
            "File too large. Maximum file size is 10MB.",
          ),
        );
        return;
      }

      // File type validation
      if (!file.type.startsWith("image/")) {
        setError(
          text(
            "Format file tidak didukung. Hanya file gambar yang diizinkan.",
            "Unsupported file format. Only image files are allowed.",
          ),
        );
        return;
      }
      // SVG is deliberately excluded
      if (file.type === "image/svg+xml" || /\.svg$/i.test(file.name)) {
        setError(text("File SVG tidak didukung.", "SVG files are not supported."));
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
    },
    [text],
  );

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void processFile(file);
  };

  // Clipboard paste support (Ctrl+V) for images
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            void processFile(file);
            break;
          }
        }
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [processFile]);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void processFile(file);
  };

  const copyHex = (hex: string, e: React.MouseEvent) => {
    e.stopPropagation();
    copy(hex);
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
            <div
              onDragOver={onDragOver}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileRef.current?.click();
                }
              }}
              aria-label={text(
                "Pilih gambar, seret file ke sini, atau tekan Ctrl+V",
                "Choose image, drop file here, or press Ctrl+V",
              )}
              className={cn(
                "w-full cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
                isDragging
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 scale-[1.01]"
                  : "border-[var(--border)] hover:border-[var(--accent)]/60 hover:bg-[var(--chip-bg)]",
              )}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: "var(--chip-bg)", color: "var(--accent)" }}
                >
                  <UploadSimple size={22} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {loading
                      ? text("Mengekstrak warna…", "Extracting colors…")
                      : isDragging
                        ? text("Lepaskan file gambar di sini", "Drop image file here")
                        : text(
                            "Pilih gambar atau seret file ke sini",
                            "Choose image or drop file here",
                          )}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                    {text(
                      "PNG, JPEG, WebP, GIF hingga 10MB · Atau tekan Ctrl+V",
                      "PNG, JPEG, WebP, GIF up to 10MB · Or press Ctrl+V",
                    )}
                  </p>
                </div>
              </div>
            </div>
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
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedColor(rgb);
                          pushColorHistory(rgb);
                          show(
                            text(
                              `✓ ${hex} disetel sebagai warna aktif & primer Brand Kit!`,
                              `✓ ${hex} set as active & Brand Kit primary!`,
                            ),
                          );
                        }}
                        className="w-full border-t py-1 text-center font-mono text-[10px] font-medium transition hover:bg-[var(--chip-bg)]"
                        style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                        title={text(
                          "Pilih sebagai warna aktif studio & primer Brand Kit",
                          "Set as active studio color & Brand Kit primary",
                        )}
                      >
                        {text("Jadikan Aktif / Primer", "Set as Active / Primary")}
                      </button>
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
            onClick={() => {
              savePalette(text("Palet dari Gambar", "Palette from Image"), colors);
              show(
                text(
                  "✓ Palet gambar berhasil disimpan ke library!",
                  "✓ Image palette saved to library!",
                ),
              );
            }}
            disabled={colors.length === 0}
            className="w-full rounded-lg px-3 py-2 text-xs font-medium transition hover:brightness-110 disabled:opacity-40"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-contrast)" }}
          >
            {text("Simpan sebagai palet utuh", "Save full palette to library")}
          </button>
          <button
            type="button"
            onClick={() => {
              colors.forEach((rgb) => saveColor(rgb, getColorName(rgb).label));
              show(text("✓ Semua warna berhasil disimpan!", "✓ All colors saved!"));
            }}
            disabled={colors.length === 0}
            className="w-full rounded-lg border px-3 py-2 text-xs font-medium transition disabled:opacity-40 hover:bg-[var(--chip-bg)]"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
          >
            {text("Simpan warna individual", "Save individual colors")}
          </button>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            {text(
              "Klik salah satu warna untuk menjadikannya warna aktif studio & primer Brand Kit.",
              "Choose a color to set as active studio & Brand Kit primary.",
            )}
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
