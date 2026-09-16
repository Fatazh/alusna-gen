export type AnalyticsConsent = "granted" | "denied";

const CONSENT_STORAGE_KEY = "alusna:analytics-consent";

const VALID_CONSENT = new Set<string>(["granted", "denied"]);

function readStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function isStorageAccessible(storage: Storage | null): boolean {
  if (!storage) return false;
  try {
    const probe = `${CONSENT_STORAGE_KEY}:probe`;
    storage.setItem(probe, "1");
    storage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

/**
 * Reads the stored consent decision. Fails closed: anything missing,
 * corrupted, or written in an unusable storage counts as "no decision".
 */
export function readAnalyticsConsent(): AnalyticsConsent | null {
  const storage = readStorage();
  if (!isStorageAccessible(storage)) return null;
  const raw = storage?.getItem(CONSENT_STORAGE_KEY) ?? "";
  if (!VALID_CONSENT.has(raw)) return null;
  return raw as AnalyticsConsent;
}

/**
 * Persists a consent decision. Returns whether the write succeeded;
 * callers can treat a failed write as "the user must be asked again".
 */
export function writeAnalyticsConsent(consent: AnalyticsConsent): boolean {
  const storage = readStorage();
  if (!isStorageAccessible(storage)) return false;
  try {
    storage?.setItem(CONSENT_STORAGE_KEY, consent);
    return true;
  } catch {
    return false;
  }
}

/**
 * True when the visitor has made any consent decision before. Lets callers
 * distinguish a returning decided visitor from a first-time one.
 */
export function hasStoredConsent(): boolean {
  return readAnalyticsConsent() !== null;
}

export function clearAnalyticsConsent(): void {
  try {
    readStorage()?.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // Storage unavailable — nothing to clear.
  }
}

type ConsentListener = (consent: AnalyticsConsent) => void;

const listeners = new Set<ConsentListener>();

export function subscribeToConsent(listener: ConsentListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners(consent: AnalyticsConsent): void {
  for (const listener of listeners) {
    listener(consent);
  }
}

/**
 * Records the user's banner decision: persists it and notifies
 * subscribers (the GA4 forwarder) in one step.
 */
export function recordAnalyticsConsent(consent: AnalyticsConsent): void {
  writeAnalyticsConsent(consent);
  notifyListeners(consent);
}
