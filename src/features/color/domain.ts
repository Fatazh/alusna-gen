// Public color domain API now lives in the shared workspace package (ADR 013).
// This barrel keeps the `features/color/domain` import path stable for the store.
export * from "@alusna/shared/color";
export * from "@alusna/shared/colorRecipes";
