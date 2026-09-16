import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "../ui/toastContext";
import { useLocale } from "../i18n";

const COPIED_RESET_MS = 1200;

/**
 * Single source of truth for clipboard writes (audit-001 finding #3).
 * Toast shows only after the write actually succeeds; failures stay silent.
 */
export function useCopy() {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { show } = useToast();
  const { text } = useLocale();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const copy = useCallback(
    async (value: string, successMessage?: string) => {
      try {
        await navigator.clipboard.writeText(value);
        setCopiedValue(value);
        show(successMessage ?? text(`✓ ${value} berhasil disalin!`, `✓ ${value} copied!`));
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopiedValue(null), COPIED_RESET_MS);
      } catch {
        // Clipboard may be unavailable; fail silently.
      }
    },
    [show, text],
  );

  return { copy, copiedValue };
}
