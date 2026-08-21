import { useState } from "react";
import { cn } from "../lib/cn";
import { useToast } from "./toastContext";

type CopyButtonProps = {
  value: string;
  className?: string;
  label?: string;
};

export function CopyButton({ value, className, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const { show } = useToast();

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      show(`✓ "${value}" berhasil disalin!`);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard may be unavailable; fail silently.
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition",
        copied
          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
          : "hover:bg-black/5 dark:hover:bg-white/10",
        className,
      )}
      style={!copied ? { color: "var(--text-secondary)" } : undefined}
      title="Salin ke clipboard"
    >
      {copied ? "✓ Tersalin" : (label ?? "Salin")}
    </button>
  );
}
