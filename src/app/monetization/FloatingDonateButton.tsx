import { Coffee } from "@phosphor-icons/react/Coffee";
import { useLocale } from "../../shared/i18n";
import { getConfiguredSupport } from "./support";

type FloatingDonateButtonProps = {
  /** Extra bottom offset in px so the button never covers fixed bars (e.g. HistoryBar). */
  bottomOffset?: number;
};

// Same community-support slot as the header button — never marked `sponsored`,
// only rendered when fully configured, opens in a new tab without referrer.
// Idle: a 48px round badge. On hover/focus a label stem slides out to the
// left (away from the screen edge), buy-me-a-coffee style; the right edge —
// anchored via `fixed right-*` — keeps the circular cup in place.
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
      aria-label={text("Traktir Kopi untuk ALUSNA", "Buy a coffee for ALUSNA")}
      className="group fixed right-4 z-40 flex h-12 items-center rounded-full border transition hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a5a2b] motion-reduce:transition-none sm:right-6"
      style={{
        bottom: `calc(1rem + ${bottomOffset}px)`,
        // Coffee-brand accent: light brown pill, near-black cup & text
        // (one tone below pure black), consistent in light and dark mode.
        borderColor: "#b98a5e",
        backgroundColor: "#d2a679",
        color: "var(--text-primary)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <span className="w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-out group-hover:w-56 group-hover:opacity-100 group-focus-visible:w-56 group-focus-visible:opacity-100">
        <span
          aria-hidden="true"
          className="block translate-x-3 pl-5 pr-1 text-sm font-bold transition-transform duration-300 ease-out group-hover:translate-x-0 group-focus-visible:translate-x-0"
        >
          {text("Traktir Kopi untuk ALUSNA", "Buy a coffee for ALUSNA")}
        </span>
      </span>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center">
        <Coffee size={26} weight="fill" aria-hidden="true" />
      </span>
    </a>
  );
}
