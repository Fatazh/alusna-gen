import { useMemo } from "react";
import { rgbToHex, contrastRatio } from "../../lib/color";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { CopyButton } from "../../components/CopyButton";
import { type BrandKit } from "../../lib/designSystem";

// ---------------------------------------------------------------------------
// Accessibility Tab
// ---------------------------------------------------------------------------

export function AccessibilityTab({ kit }: { kit: BrandKit }) {
  const colorPairs = useMemo(() => {
    const roles = [
      { name: "Primary", color: kit.primaryColor }, { name: "Secondary", color: kit.secondaryColor },
      { name: "Accent", color: kit.accentColor }, { name: "Background", color: kit.backgroundColor },
      { name: "Text", color: kit.textColor },
    ];
    return roles.flatMap((foreground, index) => roles.slice(index + 1).map((background) => ({
      name: `${foreground.name} on ${background.name}`, fg: foreground.color, bg: background.color,
    })));
  }, [kit]);

  const audit = useMemo(() => ({
    aa: colorPairs.filter((pair) => contrastRatio(pair.fg, pair.bg) >= 4.5).length,
    large: colorPairs.filter((pair) => { const ratio = contrastRatio(pair.fg, pair.bg); return ratio >= 3 && ratio < 4.5; }).length,
    fail: colorPairs.filter((pair) => contrastRatio(pair.fg, pair.bg) < 3).length,
  }), [colorPairs]);

  const getWcagLevel = (ratio: number) => {
    if (ratio >= 7) return { level: "AAA", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-500/15" };
    if (ratio >= 4.5) return { level: "AA", color: "text-yellow-700 dark:text-yellow-400", bg: "bg-yellow-500/15" };
    if (ratio >= 3) return { level: "AA Large", color: "text-orange-700 dark:text-orange-400", bg: "bg-orange-500/15" };
    return { level: "Fail", color: "text-rose-700 dark:text-rose-400", bg: "bg-rose-500/15" };
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <Card>
        <CardHeader title="WCAG Contrast Checker" subtitle={`Audit ${colorPairs.length} kombinasi warna Brand Kit`} />
        <CardBody>
          <div className="mb-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg bg-emerald-500/10 p-2"><strong className="text-emerald-700 dark:text-emerald-400">{audit.aa}</strong><div style={{ color: "var(--text-muted)" }}>AA normal</div></div>
            <div className="rounded-lg bg-amber-500/10 p-2"><strong className="text-amber-700 dark:text-amber-400">{audit.large}</strong><div style={{ color: "var(--text-muted)" }}>Large only</div></div>
            <div className="rounded-lg bg-rose-500/10 p-2"><strong className="text-rose-700 dark:text-rose-400">{audit.fail}</strong><div style={{ color: "var(--text-muted)" }}>Fail</div></div>
          </div>
          <div className="space-y-3">
            {colorPairs.map((pair) => {
              const ratio = contrastRatio(pair.fg, pair.bg);
              const wcag = getWcagLevel(ratio);
              return (
                <div key={pair.name} className="flex items-center justify-between rounded-xl border px-4 py-3" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-3">
                    <div className="flex">
                      <div className="h-8 w-8 rounded-l-lg border" style={{ borderColor: "var(--border)", backgroundColor: rgbToHex(pair.fg) }} />
                      <div className="h-8 w-8 rounded-r-lg border border-l-0" style={{ borderColor: "var(--border)", backgroundColor: rgbToHex(pair.bg) }} />
                    </div>
                    <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{pair.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{ratio.toFixed(2)}:1</span>
                    <span className={`rounded-md px-2 py-1 text-[10px] font-semibold ${wcag.color} ${wcag.bg}`}>{wcag.level}</span>
                    <CopyButton value={`${pair.name}: ${ratio.toFixed(2)}:1 (${wcag.level})`} label="Copy" />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 rounded-lg p-3" style={{ backgroundColor: "var(--chip-bg)" }}>
            <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
              <strong style={{ color: "var(--text-primary)" }}>WCAG Guidelines:</strong>
              <ul className="mt-1 list-inside list-disc space-y-1">
                <li><strong className="text-emerald-700 dark:text-emerald-400">AAA (7:1+)</strong> - Enhanced contrast for all text sizes</li>
                <li><strong className="text-yellow-700 dark:text-yellow-400">AA (4.5:1+)</strong> - Minimum for normal text (16px+)</li>
                <li><strong className="text-orange-700 dark:text-orange-400">AA Large (3:1+)</strong> - Minimum for large text (18px+ bold or 24px+)</li>
                <li><strong className="text-rose-700 dark:text-rose-400">Fail (&lt;3:1)</strong> - Insufficient contrast for any text</li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Accessibility Recommendations */}
      <Card>
        <CardHeader title="Recommendations" subtitle="Suggestions to improve brand accessibility" />
        <CardBody>
          <div className="space-y-2">
            {colorPairs.filter(pair => contrastRatio(pair.fg, pair.bg) < 4.5).map((pair) => (
              <div key={pair.name} className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                <span className="text-amber-700 dark:text-amber-400">⚠️</span>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}> 
                  <strong>{pair.name}</strong> has insufficient contrast ({contrastRatio(pair.fg, pair.bg).toFixed(2)}:1). Consider adjusting the {rgbToHex(pair.fg)} color for better readability.
                </div>
              </div>
            ))}
            {colorPairs.every(pair => contrastRatio(pair.fg, pair.bg) >= 4.5) && (
              <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                <span className="text-emerald-700 dark:text-emerald-400">✓</span>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}> 
                  All color combinations meet WCAG AA standards. Great job!
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
