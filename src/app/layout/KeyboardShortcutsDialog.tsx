import { useEffect, useRef } from "react";
import { X } from "@phosphor-icons/react/X";
import { useLocale } from "../../shared/i18n";
import {
  colorTabShortcuts,
  topLevelShortcuts,
  undoRedoShortcuts,
  type KeyboardShortcut,
} from "../router/useStudioRouter";

type KeyboardShortcutsDialogProps = {
  open: boolean;
  onClose: () => void;
  showColorTab: boolean;
  showUndoRedo: boolean;
};

function ShortcutGroup({ title, items }: { title: string; items: KeyboardShortcut[] }) {
  const { locale } = useLocale();
  return (
    <section>
      <h3
        className="mb-2 text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--text-muted)" }}
      >
        {title}
      </h3>
      <ul className="space-y-1.5">
        {items.map((shortcut) => (
          <li key={shortcut.keys} className="flex items-center justify-between gap-4 text-sm">
            <span style={{ color: "var(--text-primary)" }}>
              {locale === "en" ? shortcut.en : shortcut.id}
            </span>
            <kbd
              className="rounded border px-1.5 py-0.5 font-mono text-[11px] font-semibold"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              {shortcut.keys}
            </kbd>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function KeyboardShortcutsDialog({
  open,
  onClose,
  showColorTab,
  showUndoRedo,
}: KeyboardShortcutsDialogProps) {
  const { text } = useLocale();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    return () => previouslyFocused.current?.focus();
  }, [open]);

  if (!open) return null;

  const groupTitleTop = text("Modul studio", "Studio modules");
  const groupTitleColor = text(
    "Sub-alat warna (saat modul Warna aktif)",
    "Color sub-tools (while the Color module is active)",
  );
  const groupTitleUndo = text("Urungkan & ulangi", "Undo & redo");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-dialog-title"
    >
      <button
        type="button"
        aria-label={text("Tutup", "Close")}
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        style={{ backdropFilter: "blur(2px)" }}
      />
      <div
        className="relative max-h-[80vh] w-full max-w-md overflow-y-auto rounded-xl border p-5"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2
              id="shortcuts-dialog-title"
              className="text-base font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {text("Pintasan Keyboard", "Keyboard Shortcuts")}
            </h2>
            <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
              {text(
                "Tekan ? untuk membuka atau menutup panel ini",
                "Press ? to open or close this panel",
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
        <div className="space-y-5">
          <ShortcutGroup title={groupTitleTop} items={topLevelShortcuts()} />
          {showColorTab && <ShortcutGroup title={groupTitleColor} items={colorTabShortcuts()} />}
          {showUndoRedo && <ShortcutGroup title={groupTitleUndo} items={undoRedoShortcuts()} />}
        </div>
      </div>
    </div>
  );
}
