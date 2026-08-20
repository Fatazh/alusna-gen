import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootEl = document.getElementById("root");
if (!rootEl) {
  window.__showBootError?.(
    "Root element tidak ditemukan",
    "Elemen #root tidak ada di index.html.",
  );
} else {
  try {
    createRoot(rootEl).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
    window.__hideBootLoading?.();
  } catch (err) {
    window.__showBootError?.(
      "Gagal render React",
      err instanceof Error ? err.stack || err.message : String(err),
    );
  }
}
