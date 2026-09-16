// Ambient module types for Vite's special query imports.
declare module "*?worker" {
  const workerConstructor: new () => Worker;
  export default workerConstructor;
}
