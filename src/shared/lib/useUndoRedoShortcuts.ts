import { useEffect } from "react";

type UndoRedoCallbacks = {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  enabled: boolean;
};

function isTextEntryTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT" ||
    target.isContentEditable
  );
}

/**
 * Ctrl/Cmd+Z (undo) and Ctrl/Cmd+Y or Ctrl/Cmd+Shift+Z (redo) for one tool.
 * Text entries are skipped so the native input undo stays intact, and modal
 * dialogs own the keyboard while open.
 */
export function useUndoRedoShortcuts({ undo, redo, canUndo, canRedo, enabled }: UndoRedoCallbacks) {
  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const mod = event.ctrlKey || event.metaKey;
      if (!mod || event.altKey) return;
      const key = event.key.toLowerCase();
      const isUndo = key === "z" && !event.shiftKey;
      const isRedo = key === "y" || (key === "z" && event.shiftKey);
      if (!isUndo && !isRedo) return;
      if (isUndo && !canUndo) return;
      if (isRedo && !canRedo) return;
      if (isTextEntryTarget(event.target)) return;
      const dialogOpen = document.querySelector('[role="dialog"][aria-modal="true"]') !== null;
      if (dialogOpen) return;
      event.preventDefault();
      if (isUndo) undo();
      else redo();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canRedo, canUndo, enabled, redo, undo]);
}
