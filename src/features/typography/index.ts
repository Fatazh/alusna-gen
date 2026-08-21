export * from "./model/font";
export { loadGoogleFont, loadUploadedFont, restoreUploadedFont } from "./services/fontLoader";

export const loadFontModule = () =>
  import("./ui/FontModule").then((module) => ({ default: module.FontModule }));
