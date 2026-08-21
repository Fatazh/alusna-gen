module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      from: {},
      to: { circular: true },
    },
    {
      name: "shared-does-not-depend-upstream",
      severity: "error",
      from: { path: "^src/shared" },
      to: { path: "^src/(app|features|store)" },
    },
    {
      name: "features-do-not-depend-on-app",
      severity: "error",
      from: { path: "^src/features" },
      to: { path: "^src/app" },
    },
    {
      name: "color-uses-feature-public-api",
      severity: "error",
      from: { path: "^src/features/color" },
      to: { path: "^src/features/(typography|design-system|brand-kit)/(?!index\\.ts$)" },
    },
    {
      name: "typography-uses-feature-public-api",
      severity: "error",
      from: { path: "^src/features/typography" },
      to: { path: "^src/features/(color|design-system|brand-kit)/(?!index\\.ts$)" },
    },
    {
      name: "design-system-uses-feature-public-api",
      severity: "error",
      from: { path: "^src/features/design-system" },
      to: { path: "^src/features/(color|typography|brand-kit)/(?!index\\.ts$)" },
    },
    {
      name: "brand-kit-uses-feature-public-api",
      severity: "error",
      from: { path: "^src/features/brand-kit" },
      to: { path: "^src/features/(color|typography|design-system)/(?!index\\.ts$)" },
    },
    {
      name: "store-does-not-depend-on-ui",
      severity: "error",
      from: { path: "^src/store" },
      to: { path: "^src/(app|features)/.+/(ui|components)" },
    },
    {
      name: "store-uses-feature-domain-api",
      severity: "error",
      from: { path: "^src/store" },
      to: { path: "^src/features/[^/]+/(?!(domain|index)\\.ts$)" },
    },
    {
      name: "app-uses-feature-public-api",
      severity: "error",
      from: { path: "^src/app" },
      to: { path: "^src/features/[^/]+/(?!(domain|index|loaders)\\.ts$)" },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules",
    },
    tsConfig: {
      fileName: "tsconfig.json",
    },
    enhancedResolveOptions: {
      extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts"],
      mainFields: ["module", "main", "types", "typings"],
    },
  },
};
