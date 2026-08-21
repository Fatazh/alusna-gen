export const loadDesignSystemModule = () =>
  import("./ui/DesignSystemModule").then((module) => ({ default: module.DesignSystemModule }));
