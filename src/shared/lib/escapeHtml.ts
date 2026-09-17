/**
 * Single source of truth for HTML entity escaping.
 * Escapes &, <, >, ", and ' to prevent HTML injection in generated code/static pages.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
