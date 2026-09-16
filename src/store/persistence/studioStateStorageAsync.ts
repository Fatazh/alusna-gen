import { type StateStorage } from "zustand/middleware";
import { APP_EVENTS } from "../../shared/config/brand";
import {
  ALUSNA_STUDIO_STORAGE_KEY,
  LEGACY_STUDIO_STORAGE_KEY,
  planStudioStorageMigration,
} from "../migrations/studioStorage";
import { idbDel, idbGet, idbSet, STUDIO_IDB_KEY } from "./idb";

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function notifyStorageError(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(APP_EVENTS.storageError));
  }
}

/**
 * Async StateStorage backed by IndexedDB with a one-shot import of the legacy
 * synchronous localStorage data (the ~5MB localStorage quota was a real risk:
 * uploaded fonts and brand-kit logos are stored as base64). The localStorage
 * rollback copy is kept, mirroring the legacy CIKP migration contract.
 * Falls back to the synchronous storage when IndexedDB is unavailable.
 */
export function createAsyncStudioStateStorage(
  syncStorage: StorageLike,
  onStorageError: () => void = notifyStorageError,
): StateStorage {
  let storageErrorReported = false;
  const reportOnce = () => {
    if (storageErrorReported) return;
    storageErrorReported = true;
    onStorageError();
  };

  return {
    async getItem(name) {
      try {
        if (name !== ALUSNA_STUDIO_STORAGE_KEY) return syncStorage.getItem(name);

        const targetRaw = await idbGet(STUDIO_IDB_KEY);
        if (targetRaw !== null) return targetRaw;

        // First run on IndexedDB: import the synchronous copies once.
        const syncTargetRaw = syncStorage.getItem(ALUSNA_STUDIO_STORAGE_KEY);
        const legacyRaw = syncStorage.getItem(LEGACY_STUDIO_STORAGE_KEY);
        const plan = planStudioStorageMigration(syncTargetRaw, legacyRaw);
        if (plan.action === "write-target") {
          await idbSet(STUDIO_IDB_KEY, plan.value);
          return plan.value;
        }
        if (plan.action === "keep-target" && syncTargetRaw !== null) {
          await idbSet(STUDIO_IDB_KEY, syncTargetRaw);
          return syncTargetRaw;
        }
        return null;
      } catch {
        reportOnce();
        // Fail open to the synchronous copy so the app stays usable.
        try {
          return syncStorage.getItem(name);
        } catch {
          return null;
        }
      }
    },
    async setItem(name, value) {
      try {
        if (name !== ALUSNA_STUDIO_STORAGE_KEY) {
          syncStorage.setItem(name, value);
          return;
        }
        await idbSet(STUDIO_IDB_KEY, value);
      } catch {
        reportOnce();
      }
    },
    async removeItem(name) {
      try {
        if (name !== ALUSNA_STUDIO_STORAGE_KEY) {
          syncStorage.removeItem(name);
          return;
        }
        await idbDel(STUDIO_IDB_KEY);
      } catch {
        reportOnce();
      }
    },
  };
}

export const studioStateStorageAsync = createAsyncStudioStateStorage({
  getItem: (name) => localStorage.getItem(name),
  setItem: (name, value) => localStorage.setItem(name, value),
  removeItem: (name) => localStorage.removeItem(name),
});
