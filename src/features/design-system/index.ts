export * from "./model/designSystem";
export * from "./services/serializers";

export const loadDesignSystemModule = () =>
  import("./ui/DesignSystemModule").then((module) => ({ default: module.DesignSystemModule }));
