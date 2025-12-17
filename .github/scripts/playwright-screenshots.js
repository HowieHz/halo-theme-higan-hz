import { argosScreenshot } from "@argos-ci/playwright";
import { chromium, firefox, webkit } from "playwright";

(async () => {
  try {
    // Support Chromium, Firefox and WebKit
    const browsers = [
      { name: "chromium", launcher: chromium },
      { name: "firefox", launcher: firefox },
      { name: "webkit", launcher: webkit },
    ];

    const pages = [
      { name: "home", path: "/" },
      { name: "archives", path: "/archives" },
      { name: "archives-hello-halo", path: "/archives/hello-halo" },
      { name: "tags", path: "/tags" },
      { name: "tags-halo", path: "/tags/halo" },
      { name: "categories", path: "/categories" },
      { name: "categories-default", path: "/categories/default" },
      { name: "author-admin", path: "/authors/admin" },
      { name: "about", path: "/about" },
    ];

    // 三种视口及对应 UA（可按需调整）
    const viewports = [
      {
        name: "desktop",
        viewport: { width: 1920, height: 1080 },
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        isMobile: false,
        hasTouch: false,
      },
      {
        name: "tablet",
        viewport: { width: 768, height: 1024 },
        userAgent:
          "Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
        isMobile: true,
        hasTouch: true,
      },
      {
        name: "mobile",
        viewport: { width: 375, height: 812 },
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
        isMobile: true,
        hasTouch: true,
      },
    ];

    for (const b of browsers) {
      console.log(`🔎 Start browser: ${b.name}`);

      // launch args: only pass chromium-specific no-sandbox flags to chromium
      const launchOptions = b.name === "chromium" ? { args: ["--no-sandbox", "--disable-setuid-sandbox"] } : {};
      const browser = await b.launcher.launch(launchOptions);

      for (const vp of viewports) {
        console.log(`📷 Start viewport: ${vp.name} (${vp.viewport.width}x${vp.viewport.height}) on ${b.name}`);

        const context = await browser.newContext({
          baseURL: "http://localhost:8090",
          viewport: vp.viewport,
          userAgent: vp.userAgent,
          isMobile: vp.isMobile,
          hasTouch: vp.hasTouch,
        });

        for (const pageInfo of pages) {
          const page = await context.newPage();
          try {
            console.log(`  - Navigating ${pageInfo.name} on ${vp.name} @ ${b.name}`);
            await page.goto(pageInfo.path, { waitUntil: "networkidle" });

            // 名称包含 viewport id 和浏览器名，便于识别
            await argosScreenshot(page, `${pageInfo.name}-${vp.name}-${b.name}`);
          } finally {
            try {
              await page.close();
            } catch (err) {
              console.warn("Warning: page.close() failed:", err && err.message ? err.message : err);
            }
          }
        }

        await context.close();
        console.log(`✅ ${vp.name} screenshots done on ${b.name}`);
      }

      await browser.close();
      console.log(`✅ ${b.name} done`);
    }
    console.log("🎉 All viewports done");
    process.exit(0);
  } catch (err) {
    console.error("Error in playwright-screenshots:", err);
    process.exit(2);
  }
})();
