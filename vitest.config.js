import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["test/setupTests.ts"],
    include: ["__tests__/**/*.test.{ts,tsx}"],
    timeout: 10000,
  },
});
