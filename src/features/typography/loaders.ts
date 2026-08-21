export const loadFontModule = () =>
  import("./ui/FontModule").then((module) => ({ default: module.FontModule }));
