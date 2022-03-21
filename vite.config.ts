import { resolve } from "path";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import vitePluginWindicss from "vite-plugin-windicss";

// https://vitejs.dev/config/
export default defineConfig({
  clearScreen: false,
  resolve: {
    alias: {
      "~": resolve("src"),
    },
  },
  plugins: [vitePluginWindicss(), svelte()],
});
