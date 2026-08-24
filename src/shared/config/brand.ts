export const APP_BRAND = {
  name: "ALUSNA",
  legalName: "ALUSNA",
  legacyName: "CIKP Studio",
  version: "1.0.0",
  slogan: "Bagusnya dimulai di sini.",
  sloganEn: "Better design starts here.",
  descriptor: "Color, Typography & Brand Toolkit",
  description:
    "Alat warna, tipografi, design token, dan brand kit gratis yang berjalan langsung di browser.",
  locale: "id_ID",
  structuredDataId: "alusna-structured-data",
} as const;

export const APP_EVENTS = {
  storageError: "alusna:storage-error",
  analytics: "alusna:analytics",
} as const;

export function withBrandTitle(title: string): string {
  return `${title} | ${APP_BRAND.name}`;
}
