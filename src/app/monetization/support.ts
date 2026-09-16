export type SupportConfig = {
  url: string;
  title: string;
};

export type SupportConfigInput = {
  url?: string;
  title?: string;
};

// Donations are community support, not advertising: never marked `sponsored`,
// always an explicit labeled button, and only rendered when fully configured.
export function parseSupportConfig(input: SupportConfigInput): SupportConfig | null {
  const title = input.title?.trim().slice(0, 80);
  if (!title) return null;

  try {
    const parsedUrl = new URL(input.url?.trim() ?? "");
    if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") return null;
    return { url: parsedUrl.toString(), title };
  } catch {
    return null;
  }
}

export function getConfiguredSupport(): SupportConfig | null {
  return parseSupportConfig({
    url: import.meta.env.VITE_SUPPORT_URL,
    title: import.meta.env.VITE_SUPPORT_TITLE,
  });
}
