export const loadPatternModule = () =>
  import("./ui/tools/PatternModule").then((module) => ({ default: module.PatternModule }));
export const loadMatchingModule = () =>
  import("./ui/tools/MatchingModule").then((module) => ({ default: module.MatchingModule }));
export const loadExperimentModule = () =>
  import("./ui/tools/ExperimentModule").then((module) => ({ default: module.ExperimentModule }));
export const loadGradientModule = () =>
  import("./ui/tools/GradientModule").then((module) => ({ default: module.GradientModule }));
export const loadShadeModule = () =>
  import("./ui/tools/ShadeModule").then((module) => ({ default: module.ShadeModule }));
export const loadImageModule = () =>
  import("./ui/tools/ImageModule").then((module) => ({ default: module.ImageModule }));
export const loadAccessibilityModule = () =>
  import("./ui/tools/AccessibilityModule").then((module) => ({
    default: module.AccessibilityModule,
  }));
export const loadContrastModule = () =>
  import("./ui/tools/ContrastModule").then((module) => ({ default: module.ContrastModule }));
