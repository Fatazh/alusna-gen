import { Component, type ReactNode } from "react";
import { WarningCircle } from "@phosphor-icons/react/WarningCircle";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service in production
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <WarningCircle
              size={56}
              weight="duotone"
              className="mx-auto mb-4 text-amber-500"
              aria-hidden="true"
            />
            <h2 className="mb-2 text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              Terjadi Kesalahan
            </h2>
            <p className="mb-4 text-sm" style={{ color: "var(--text-secondary)" }}>
              {this.state.error?.message || "Terjadi error yang tidak terduga."}
            </p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
            >
              Coba Lagi
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="ml-2 rounded-lg border px-4 py-2 text-sm font-medium transition"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              Muat Ulang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
