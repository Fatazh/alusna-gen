import { isSafeFontDataUrl, sanitizeFontFamily } from "../model/font";

const loadedRequests = new Map<string, Promise<void>>();

export function buildGoogleFontCssUrl(
  family: string,
  weights: readonly (number | string)[] = [400],
  style: "normal" | "italic" = "normal",
): string {
  const safeFamily = sanitizeFontFamily(family);
  const safeWeights = [...new Set(weights.map(Number))]
    .filter((weight) => Number.isInteger(weight) && weight >= 100 && weight <= 900)
    .sort((a, b) => a - b);
  if (safeWeights.length === 0) safeWeights.push(400);
  const specification =
    style === "italic"
      ? `${safeFamily}:ital,wght@${safeWeights.map((weight) => `1,${weight}`).join(";")}`
      : `${safeFamily}:wght@${safeWeights.join(";")}`;
  const params = new URLSearchParams({ family: specification, display: "swap" });
  return `https://fonts.googleapis.com/css2?${params.toString()}`;
}

export function loadGoogleFont(
  family: string,
  weights: readonly (number | string)[] = [400],
  style: "normal" | "italic" = "normal",
): Promise<void> {
  const href = buildGoogleFontCssUrl(family, weights, style);
  const existing = loadedRequests.get(href);
  if (existing) return existing;

  const request = new Promise<void>((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.googleFont = sanitizeFontFamily(family);
    link.onload = () => resolve();
    link.onerror = () => {
      loadedRequests.delete(href);
      link.remove();
      reject(new Error(`Failed to load Google Font: ${sanitizeFontFamily(family)}`));
    };
    document.head.appendChild(link);
  });

  loadedRequests.set(href, request);
  return request;
}

export async function loadUploadedFont(file: File): Promise<{ family: string; dataUrl: string }> {
  const buffer = await file.arrayBuffer();
  const family = sanitizeFontFamily(file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " "));
  const face = new FontFace(family, buffer);
  await face.load();
  (document.fonts as FontFaceSet).add(face);
  const dataUrl = await fileToDataUrl(file);
  return { family, dataUrl };
}

export async function restoreUploadedFont(dataUrl: string, family: string): Promise<void> {
  if (!isSafeFontDataUrl(dataUrl)) return;
  const face = new FontFace(family, dataUrl);
  await face.load();
  (document.fonts as FontFaceSet).add(face);
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
