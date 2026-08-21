import { useEffect, type ReactNode } from "react";
import { useStudio } from "../../store/studio";
import { APP_EVENTS } from "../../shared/config/brand";
import { ErrorBoundary } from "../../shared/ui/ErrorBoundary";
import { ToastProvider } from "../../shared/ui/Toast";
import { useToast } from "../../shared/ui/toastContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppEffects />
        {children}
      </ToastProvider>
    </ErrorBoundary>
  );
}

function AppEffects() {
  const theme = useStudio((state) => state.theme);
  const { show } = useToast();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const onStorageError = () =>
      show("Penyimpanan browser penuh. Perubahan baru hanya tersimpan sementara.");
    window.addEventListener(APP_EVENTS.storageError, onStorageError);
    return () => window.removeEventListener(APP_EVENTS.storageError, onStorageError);
  }, [show]);

  return null;
}
