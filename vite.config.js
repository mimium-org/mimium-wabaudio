import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { resolve } from "node:path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [wasm(), topLevelAwait(), dts()],
  build: {
    minify: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "mimium_webaudio",
      formats: ["iife"],
      fileName: () => "mimium-webaudio.js",
    },
    sourcemap: true,
  },
});
