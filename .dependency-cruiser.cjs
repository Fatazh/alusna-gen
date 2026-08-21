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
      name: "store-does-not-depend-on-ui",
      severity: "error",
      from: { path: "^src/store" },
      to: { path: "^src/(app|features)/.+/(ui|components)" },
    },
    {
      name: "app-uses-feature-public-api",
      severity: "error",
      from: { path: "^src/app" },
      to: { path: "^src/features/[^/]+/(?!index\\.ts$)" },
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
