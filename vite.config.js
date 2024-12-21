import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import { resolve } from "node:path";
import dts from "vite-plugin-dts";
import checker from "vite-plugin-checker";

export default defineConfig({
  plugins: [topLevelAwait(), dts(), checker({ types: "tsc" })],
  build: {
    minify: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "mimium_webaudio",
      formats: ["es", "umd"],
      fileName: () => "mimium-webaudio.js",
    },
    sourcemap: true,
  },
  compilerOptions: {
    tsconfigPath: resolve(__dirname, "tsconfig.json"),
  },
});
