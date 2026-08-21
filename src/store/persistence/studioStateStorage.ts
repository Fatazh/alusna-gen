import { type StateStorage } from "zustand/middleware";
import { APP_EVENTS } from "../../shared/config/brand";
import {
  ALUSNA_STUDIO_STORAGE_KEY,
  LEGACY_STUDIO_STORAGE_KEY,
  planStudioStorageMigration,
} from "../migrations/studioStorage";

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function notifyStorageError(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(APP_EVENTS.storageError));
  }
}

export function createStudioStateStorage(
  storage: StorageLike,
  onStorageError: () => void = notifyStorageError,
): StateStorage {
  let storageErrorReported = false;
  const reportOnce = () => {
    if (storageErrorReported) return;
    storageErrorReported = true;
    onStorageError();
  };

  return {
    getItem: (name) => {
      try {
        if (name !== ALUSNA_STUDIO_STORAGE_KEY) return storage.getItem(name);

        const targetRaw = storage.getItem(ALUSNA_STUDIO_STORAGE_KEY);
        const legacyRaw = storage.getItem(LEGACY_STUDIO_STORAGE_KEY);
        const plan = planStudioStorageMigration(targetRaw, legacyRaw);

        if (plan.action === "keep-target") return targetRaw;
        if (plan.action === "write-target") {
          storage.setItem(ALUSNA_STUDIO_STORAGE_KEY, plan.value);
          return plan.value;
        }
        return null;
      } catch {
        reportOnce();
        return null;
      }
    },
    setItem: (name, value) => {
      try {
        storage.setItem(name, value);
      } catch {
        reportOnce();
      }
    },
    removeItem: (name) => {
      try {
        storage.removeItem(name);
      } catch {
        reportOnce();
      }
    },
  };
}

export const studioStateStorage = createStudioStateStorage({
  getItem: (name) => localStorage.getItem(name),
  setItem: (name, value) => localStorage.setItem(name, value),
  removeItem: (name) => localStorage.removeItem(name),
});
