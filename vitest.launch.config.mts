import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    include: ["scripts/check-launch.launch.ts"],
    reporters: ["verbose"],
  },
  resolve: {
    alias: {
      "@": projectRoot,
    },
  },
});
