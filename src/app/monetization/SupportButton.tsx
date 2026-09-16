import { Heart } from "@phosphor-icons/react/Heart";
import { useLocale } from "../../shared/i18n";
import { getConfiguredSupport } from "./support";

export function SupportButton() {
  const { text } = useLocale();
  const support = getConfiguredSupport();
  if (!support) return null;

  return (
    <a
      href={support.url}
      target="_blank"
      rel="noopener noreferrer"
      data-support-placement="header"
      aria-label={text("Dukung ALUSNA", "Support ALUSNA")}
      title={text("Dukung ALUSNA", "Support ALUSNA")}
      className="inline-flex h-9 items-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold transition hover:bg-black/5 dark:hover:bg-white/10"
      style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
    >
      <Heart size={14} weight="fill" className="text-rose-500" aria-hidden="true" />
      <span className="hidden lg:inline">{support.title}</span>
    </a>
  );
}
