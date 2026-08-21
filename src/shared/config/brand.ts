export const APP_BRAND = {
  name: "ALUSNA",
  legalName: "ALUSNA",
  legacyName: "CIKP Studio",
  slogan: "Bagusnya dimulai di sini.",
  descriptor: "Color, Typography & Brand Toolkit",
  description:
    "Alat warna, tipografi, design token, dan brand kit gratis yang berjalan langsung di browser.",
  locale: "id_ID",
  structuredDataId: "alusna-structured-data",
} as const;

export const APP_EVENTS = {
  storageError: "alusna:storage-error",
} as const;

export function withBrandTitle(title: string): string {
  return `${title} | ${APP_BRAND.name}`;
}
