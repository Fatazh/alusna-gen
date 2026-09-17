import { useEffect, useRef, useState } from "react";
import { X } from "@phosphor-icons/react/X";
import { DownloadSimple } from "@phosphor-icons/react/DownloadSimple";
import { UploadSimple } from "@phosphor-icons/react/UploadSimple";
import { WarningCircle } from "@phosphor-icons/react/WarningCircle";
import { useLocale } from "../../shared/i18n";
import { useToast } from "../../shared/ui/toastContext";
import { downloadTextFile } from "../../shared/services/download";
import { sanitizePersistedStudioState, useStudio } from "../../store/studio";

type BackupRestoreDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function BackupRestoreDialog({ open, onClose }: BackupRestoreDialogProps) {
  const { text } = useLocale();
  const { show } = useToast();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const savedColors = useStudio((s) => s.savedColors);
  const paletteLibrary = useStudio((s) => s.paletteLibrary);
  const savedBrandKits = useStudio((s) => s.savedBrandKits);
  const uploadedFonts = useStudio((s) => s.uploadedFonts);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleDownloadBackup = () => {
    const payload = {
      app: "ALUSNA",
      version: 1,
      exportedAt: new Date().toISOString(),
      state: {
        savedColors,
        paletteLibrary,
        savedBrandKits,
        uploadedFonts,
      },
    };

    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `alusna-backup-${dateStr}.json`;
    downloadTextFile(JSON.stringify(payload, null, 2), filename, "application/json");
    show(
      text("File cadangan studio berhasil diunduh!", "Studio backup file downloaded successfully!"),
      { tone: "success" },
    );
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    try {
      const rawText = await file.text();
      const parsed = JSON.parse(rawText) as Record<string, unknown>;
      const rawState =
        parsed && typeof parsed === "object" && "state" in parsed
          ? parsed.state
          : parsed && typeof parsed === "object" && "data" in parsed
            ? parsed.data
            : parsed;

      const sanitized = sanitizePersistedStudioState(rawState);

      const hasColors = sanitized.savedColors !== undefined;
      const hasPalettes = sanitized.paletteLibrary !== undefined;
      const hasBrandKits = sanitized.savedBrandKits !== undefined;
      const hasFonts = sanitized.uploadedFonts !== undefined;

      if (!hasColors && !hasPalettes && !hasBrandKits && !hasFonts) {
        show(
          text(
            "File cadangan tidak berisi data ALUSNA yang valid.",
            "Backup file does not contain valid ALUSNA data.",
          ),
          { tone: "error" },
        );
        return;
      }

      useStudio.setState(sanitized);

      const colorsCount = sanitized.savedColors?.length ?? 0;
      const palettesCount = sanitized.paletteLibrary?.length ?? 0;
      const brandKitsCount = sanitized.savedBrandKits?.length ?? 0;

      show(
        text(
          `Cadangan berhasil dipulihkan: ${colorsCount} warna, ${palettesCount} palet, ${brandKitsCount} brand kit!`,
          `Backup successfully restored: ${colorsCount} colors, ${palettesCount} palettes, ${brandKitsCount} brand kits!`,
        ),
        { tone: "success" },
      );
      onClose();
    } catch {
      show(
        text(
          "Gagal membaca file cadangan. Pastikan file berformat JSON yang valid.",
          "Failed to read backup file. Ensure it is valid JSON.",
        ),
        { tone: "error" },
      );
    } finally {
      setIsRestoring(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="backup-dialog-title"
    >
      <button
        type="button"
        aria-label={text("Tutup", "Close")}
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        style={{ backdropFilter: "blur(2px)" }}
      />
      <div
        className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl border p-6"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2
              id="backup-dialog-title"
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {text("Cadangan & Pemulihan Studio", "Studio Backup & Restore")}
            </h2>
            <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              {text(
                "Semua data studio tersimpan lokal di browser Anda. Ekspor cadangan berkala agar tidak hilang saat cache dibersihkan.",
                "All studio data is stored locally in your browser. Export regular backups so your work isn't lost if cache is cleared.",
              )}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={text("Tutup", "Close")}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition hover:bg-black/5 dark:hover:bg-white/10"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>

        {/* Current Data Overview */}
        <div
          className="mb-6 rounded-lg border p-3.5"
          style={{ backgroundColor: "var(--surface-soft)", borderColor: "var(--border)" }}
        >
          <div
            className="text-[11px] font-semibold uppercase tracking-wider mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            {text("Status Data Saat Ini", "Current Data Status")}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div
              className="rounded-md border p-2"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                {savedColors.length}
              </div>
              <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                {text("Warna tersimpan", "Saved colors")}
              </div>
            </div>
            <div
              className="rounded-md border p-2"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                {paletteLibrary.length}
              </div>
              <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                {text("Palet library", "Palette library")}
              </div>
            </div>
            <div
              className="rounded-md border p-2"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                {savedBrandKits.length}
              </div>
              <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                {text("Brand kit", "Brand kits")}
              </div>
            </div>
          </div>
        </div>

        {/* Action Blocks */}
        <div className="space-y-4">
          {/* Download block */}
          <div
            className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="space-y-0.5">
              <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {text("Unduh File Cadangan", "Download Backup File")}
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                {text(
                  "Ekspor seluruh warna, palet, dan kit ke file JSON.",
                  "Export all colors, palettes, and kits to a JSON file.",
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition hover:brightness-110"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-contrast)" }}
            >
              <DownloadSimple size={15} aria-hidden="true" />
              {text("Unduh JSON", "Download JSON")}
            </button>
          </div>

          {/* Restore block */}
          <div
            className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="space-y-0.5">
              <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {text("Pulihkan dari File", "Restore from File")}
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                {text(
                  "Impor file cadangan JSON yang pernah Anda simpan.",
                  "Import a JSON backup file you previously saved.",
                )}
              </div>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
                id="backup-file-input"
              />
              <button
                type="button"
                disabled={isRestoring}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition hover:bg-[var(--surface-hover)] disabled:opacity-50"
                style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
              >
                <UploadSimple size={15} aria-hidden="true" />
                {isRestoring
                  ? text("Memulihkan...", "Restoring...")
                  : text("Pilih File JSON", "Select JSON File")}
              </button>
            </div>
          </div>
        </div>

        {/* Warning note */}
        <div
          className="mt-5 flex items-start gap-2 rounded-lg border p-3 text-xs"
          style={{
            backgroundColor: "var(--surface-soft)",
            borderColor: "var(--border)",
            color: "var(--text-muted)",
          }}
        >
          <WarningCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            {text(
              "Memulihkan cadangan akan menimpa pustaka data aktif dengan data dari file cadangan.",
              "Restoring a backup will overwrite the active library with the backup file data.",
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
