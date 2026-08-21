export * from "./model/brandKit";
export { brandKitToHtml } from "./services/htmlSerializer";
export {
  parseBrandKitImport,
  brandKitToW3cTokens,
  brandKitToTailwindConfig,
  type ImportedBrandKit,
} from "./services/interop";

export const loadBrandKitModule = () =>
  import("./ui/BrandKitModule").then((module) => ({ default: module.BrandKitModule }));
