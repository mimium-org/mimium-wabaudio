import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [wasm(), topLevelAwait()],
  build: {
    minify: false,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "mimium_web_component",
      formats: ["iife"],
      fileName: () => "mimium-web-component.js",
    },
    sourcemap: true,
  },
});
