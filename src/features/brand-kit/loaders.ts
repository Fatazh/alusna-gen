export const loadBrandKitModule = () =>
  import("./ui/BrandKitModule").then((module) => ({ default: module.BrandKitModule }));
