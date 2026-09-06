import { type ReactNode } from "react";
import { cn } from "../lib/cn";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn("rounded-2xl border shadow-[var(--shadow-soft)]", className)}
      style={{ borderColor: "var(--card-border)", backgroundColor: "var(--card-bg)" }}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className="flex items-start justify-between gap-4 border-b px-5 py-5 sm:px-7"
      style={{ borderColor: "var(--border)" }}
    >
      <div>
        <h3
          className="text-[15px] font-bold tracking-[-0.02em]"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h3>
        {subtitle && (
          <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("p-5 sm:p-7", className)}>{children}</div>;
}
