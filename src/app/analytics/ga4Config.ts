const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]{6,12}$/i;

/**
 * Validates a raw GA4 measurement ID. The check is intentionally strict so a
 * misconfigured placeholder (or empty string) can never load the script.
 */
export function resolveGa4MeasurementId(candidate: string | undefined): string | null {
  const trimmed = candidate?.trim() ?? "";
  return GA_MEASUREMENT_ID_PATTERN.test(trimmed) ? trimmed : null;
}
