import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    // *.launch.ts is the pre-launch check (npm run check:launch) and is
    // intentionally NOT part of the normal test run: it fails until the
    // operator has supplied the legal data.
    include: ["**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/.next/**"],
  },
  resolve: {
    alias: {
      "@": projectRoot,
    },
  },
});
