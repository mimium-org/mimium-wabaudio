import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import { resolve } from "node:path";
import dts from "vite-plugin-dts";
import checker from "vite-plugin-checker";

export default defineConfig({
  plugins: [topLevelAwait(), dts(), checker({ types: "tsc" })],
  resolve: {
    preserveSymlinks: true,
  },
  build: {
    // minify: true,
    lib: {
      entry: [
        resolve(__dirname, "src/index.mts"),
        resolve(__dirname, "src/audioprocessor.mts"),
      ],
      formats: ["es"],
      name: "mimium_webaudio",
      fileName: (format, entryname) => `${entryname}.mjs`,
    },
    sourcemap: true,
  },
});
