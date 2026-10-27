import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Relative base so the built site works from any static host path.
export default defineConfig({
  base: "./",
  // A new ID per build. Data files keep fixed names, so requests carry ?v=<id> to stop browsers pairing new code
  // with data cached from an earlier deploy (GitHub Pages lets browsers reuse files for 10 minutes).
  define: { __BUILD_ID__: JSON.stringify(Date.now().toString(36)) },
  plugins: [react()],
  test: { include: ["src/**/*.test.ts"] },
});
