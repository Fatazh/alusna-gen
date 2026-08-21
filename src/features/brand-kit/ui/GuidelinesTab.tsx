import { Card, CardHeader, CardBody } from "../../../shared/ui/Card";
import { CopyButton } from "../../../shared/ui/CopyButton";
import { type BrandKit } from "../model/brandKit";

// ---------------------------------------------------------------------------
// Guidelines Tab
// ---------------------------------------------------------------------------

export function GuidelinesTab({ kit }: { kit: BrandKit }) {
  return (
    <div className="space-y-4 animate-fade-in">
      {kit.guidelines.map((g) => (
        <Card key={g.section}>
          <CardHeader title={g.section} />
          <CardBody>
            <div className="space-y-1">
              {g.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-lg border px-4 py-2.5 transition"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-center gap-3">
                    {item.hex && (
                      <div
                        className="h-6 w-6 rounded-md border"
                        style={{ borderColor: "var(--border)", backgroundColor: item.hex }}
                      />
                    )}
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
                      {item.value}
                    </span>
                    {item.hex && <CopyButton value={item.hex} />}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
