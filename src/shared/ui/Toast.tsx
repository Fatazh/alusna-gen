import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ToastContext, resolveToastPresentation, type ShowToastOptions } from "./toastContext";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
type ToastItem = { id: number; message: string; options: ShowToastOptions };

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const show = useCallback((message: string, options: ShowToastOptions = {}) => {
    const id = nextId.current++;
    const normalizedMessage = message.replace(/^\s*✓\s*/, "");
    setToasts((prev) => [...prev, { id, message: normalizedMessage, options }]);
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timersRef.current.delete(id);
    }, 1800);
    timersRef.current.set(id, timer);
  }, []);

  // Cleanup all timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}

      {/* Toast container — fixed bottom-center */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2">
        {toasts.map((t) => {
          const presentation = resolveToastPresentation(t.options);
          return (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-lg backdrop-blur ${presentation.className}`}
              style={presentation.style}
            >
              <svg
                className="h-5 w-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {t.message}
            </div>
          );
        })}
      </div>

      {/* Keyframes injected once */}
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes toast-out {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(-8px) scale(0.95); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
