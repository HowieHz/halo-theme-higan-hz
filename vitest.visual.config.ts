import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const haloVisualBaseUrl = (process.env.HALO_VISUAL_BASE_URL || "http://localhost:8090").replace(/\/$/u, "");

export default defineConfig({
  define: {
    __HALO_VISUAL_BASE_URL__: JSON.stringify(haloVisualBaseUrl),
  },
  test: {
    include: ["tests/visual/**/*.test.ts"],
    fileParallelism: false,
    testTimeout: 90_000,
    attachmentsDir: ".vitest-attachments",
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [
        {
          browser: "chromium",
          viewport: {
            width: 1365,
            height: 1024,
          },
        },
      ],
      expect: {
        toMatchScreenshot: {
          comparatorName: "pixelmatch",
          comparatorOptions: {
            threshold: 0.2,
            allowedMismatchedPixelRatio: 0.001,
          },
        },
      },
    },
  },
});
