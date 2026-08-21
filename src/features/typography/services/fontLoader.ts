import { isSafeFontDataUrl, sanitizeFontFamily } from "../model/font";

const loadedFamilies = new Set<string>();

export function loadGoogleFont(family: string, variants: string[] = ["400"]): void {
  if (loadedFamilies.has(family)) return;
  const params = new URLSearchParams({
    family: `${family}:wght@${variants.join(";")}`,
  });
  const href = `https://fonts.googleapis.com/css2?${params.toString()}`;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
  loadedFamilies.add(family);
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
