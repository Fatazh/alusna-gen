export type SponsorConfig = {
  url: string;
  title: string;
  text?: string;
};

export type SponsorConfigInput = {
  url?: string;
  title?: string;
  text?: string;
};

export function parseSponsorConfig(input: SponsorConfigInput): SponsorConfig | null {
  const title = input.title?.trim().slice(0, 80);
  if (!title) return null;

  try {
    const parsedUrl = new URL(input.url?.trim() ?? "");
    if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") return null;
    const text = input.text?.trim().slice(0, 180);
    return { url: parsedUrl.toString(), title, ...(text ? { text } : {}) };
  } catch {
    return null;
  }
}

export function getConfiguredSponsor(): SponsorConfig | null {
  return parseSponsorConfig({
    url: import.meta.env.VITE_SPONSOR_URL,
    title: import.meta.env.VITE_SPONSOR_TITLE,
    text: import.meta.env.VITE_SPONSOR_TEXT,
  });
}
