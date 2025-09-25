import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url"; // 1. Fixes '__dirname'
import path from "path"; // 2. Fixes '__dirname'
import { readFileSync } from "fs"; // 3. Fixes 'require'

// 4. Fixes 'process' and 'require' by reading package.json directly
const packageJsonPath = path.resolve(fileURLToPath(import.meta.url), "..", "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

// Determine the base path for deployment
const base = packageJson.homepage || "/";

export default defineConfig({
  plugins: [react()],

  // The 'base' option is essential for GitHub Pages
  base: base,

  resolve: {
    alias: {
      // Use 'path.resolve' for aliases, fixing '__dirname'
      "@": path.resolve(fileURLToPath(import.meta.url), "..", "src"),
    },
  },
});
