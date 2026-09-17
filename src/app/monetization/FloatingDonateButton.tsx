import { Coffee } from "@phosphor-icons/react/Coffee";
import { useLocale } from "../../shared/i18n";
import { getConfiguredSupport } from "./support";

type FloatingDonateButtonProps = {
  /** Extra bottom offset in px so the button never covers fixed bars (e.g. HistoryBar). */
  bottomOffset?: number;
};

// Same community-support slot as the header button — never marked `sponsored`,
// only rendered when fully configured, opens in a new tab without referrer.
export function FloatingDonateButton({ bottomOffset = 0 }: FloatingDonateButtonProps) {
  const { text } = useLocale();
  const support = getConfiguredSupport();
  if (!support) return null;

  return (
    <a
      href={support.url}
      target="_blank"
      rel="noopener noreferrer"
      data-support-placement="floating"
      aria-label={text("Dukung ALUSNA dengan donasi", "Support ALUSNA with a donation")}
      title={text("Traktir kopi untuk ALUSNA", "Buy ALUSNA a coffee")}
      className="fixed right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border transition hover:-translate-y-0.5 hover:scale-105 active:scale-95 sm:right-6"
      style={{
        bottom: `calc(1rem + ${bottomOffset}px)`,
        // Coffee-brand accent: light brown disc, near-black cup (one tone below pure black).
        borderColor: "#b98a5e",
        backgroundColor: "#d2a679",
        color: "#241a12",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <Coffee size={22} weight="fill" aria-hidden="true" />
    </a>
  );
}
