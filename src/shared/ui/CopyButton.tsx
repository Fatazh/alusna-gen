import { Check } from "@phosphor-icons/react/Check";
import { Copy } from "@phosphor-icons/react/Copy";
import { cn } from "../lib/cn";
import { useCopy } from "../lib/useCopy";
import { useLocale } from "../i18n";

type CopyButtonProps = {
  value: string;
  className?: string;
  label?: string;
  ariaLabel?: string;
};

export function CopyButton({ value, className, label, ariaLabel }: CopyButtonProps) {
  const { copy, copiedValue } = useCopy();
  const { text } = useLocale();
  const copied = copiedValue === value;

  return (
    <button
      type="button"
      onClick={() => copy(value)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition",
        copied
          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
          : "hover:bg-black/5 dark:hover:bg-white/10",
        className,
      )}
      style={!copied ? { color: "var(--text-secondary)" } : undefined}
      title={text("Salin ke clipboard", "Copy to clipboard")}
      aria-label={ariaLabel}
    >
      {copied ? (
        <Check size={14} weight="bold" aria-hidden="true" />
      ) : (
        <Copy size={14} aria-hidden="true" />
      )}
      {copied ? text("Tersalin", "Copied") : (label ?? text("Salin", "Copy"))}
    </button>
  );
}
