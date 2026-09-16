/**
 * Single source of truth for client-side file downloads (audit-001 finding #4).
 * Always appends charset=utf-8 so non-ASCII content decodes correctly.
 */
export function downloadTextFile(content: string, filename: string, mime = "text/plain"): void {
  const url = URL.createObjectURL(new Blob([content], { type: `${mime};charset=utf-8` }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
