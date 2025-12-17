import { argosScreenshot } from "@argos-ci/playwright";
import { chromium, firefox, devices as pwDevices, webkit } from "playwright";

(async () => {
  try {
    // Determine which browsers to run from PLAYWRIGHT_BROWSERS env var (comma or space separated)
    const raw = (process.env.PLAYWRIGHT_BROWSERS || "").trim();
    const requested = raw
      ? raw
          .split(/[,\s]+/)
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean)
      : [];

    // Map supported install names to Playwright browser launchers and options
    const browserFactory = {
      chromium: { launcher: chromium, launchOptions: {} },
      "chromium-headless-shell": { launcher: chromium, launchOptions: {} },
      "chromium-tip-of-tree-headless-shell": { launcher: chromium, launchOptions: {} },
      "bidi-chromium": { launcher: chromium, launchOptions: {} },
      chrome: { launcher: chromium, launchOptions: { channel: "chrome" } },
      "chrome-beta": { launcher: chromium, launchOptions: { channel: "chrome-beta" } },
      msedge: { launcher: chromium, launchOptions: { channel: "msedge" } },
      "msedge-beta": { launcher: chromium, launchOptions: { channel: "msedge-beta" } },
      "msedge-dev": { launcher: chromium, launchOptions: { channel: "msedge-dev" } },
      firefox: { launcher: firefox, launchOptions: {} },
      webkit: { launcher: webkit, launchOptions: {} },
      "webkit-wsl": { launcher: webkit, launchOptions: {} },
    };

    let browsers = [];
    if (requested.length > 0) {
      for (const name of requested) {
        if (browserFactory[name]) {
          const entry = browserFactory[name];
          browsers.push({ name, launcher: entry.launcher, launchOptions: entry.launchOptions });
        } else {
          console.warn(`⚠️ Unknown/unsupported browser requested: ${name}`);
        }
      }
    }
    if (browsers.length === 0) {
      // default to chromium for safety
      browsers = [{ name: "chromium", launcher: chromium, launchOptions: {} }];
      console.log("ℹ️ No valid PLAYWRIGHT_BROWSERS requested; defaulting to chromium");
    }

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

    // Use Playwright's built-in device descriptors for consistency with playwright.config.ts
    // Map logical viewport names to Playwright device keys
    const deviceMap = [
      { name: "desktop", key: "Desktop Chrome" },
      { name: "tablet", key: "iPad (gen 11)" },
      { name: "mobile", key: "iPhone 12" },
    ];

    // Build viewports array from device descriptors; if a descriptor isn't available,
    // fall back to a reasonable default.
    const viewports = deviceMap.map((d) => {
      const desc = pwDevices[d.key];
      if (desc) {
        return {
          name: d.name,
          descriptorKey: d.key,
          descriptor: desc,
        };
      }
      console.warn(`⚠️ Playwright device not found: ${d.key}; using fallback viewport`);
      return {
        name: d.name,
        descriptorKey: d.key,
        descriptor: {
          viewport: d.name === "desktop" ? { width: 1920, height: 1080 } : { width: 375, height: 812 },
          userAgent: "",
          isMobile: d.name !== "desktop",
          hasTouch: d.name !== "desktop",
        },
      };
    });

    for (const b of browsers) {
      console.log(`🔎 Start browser: ${b.name}`);

      // merge configured launchOptions with necessary defaults
      const launchOptions = Object.assign({}, b.launchOptions || {});
      // For Chromium-based launchers, ensure no-sandbox flags in CI
      if (b.launcher === chromium) {
        launchOptions.args = (launchOptions.args || []).concat(["--no-sandbox", "--disable-setuid-sandbox"]);
      }
      const browser = await b.launcher.launch(launchOptions);

      for (const vp of viewports) {
        const vw = vp.descriptor.viewport || {};
        const vwLabel = vw.width && vw.height ? `${vw.width}x${vw.height}` : "unknown";
        console.log(`📷 Start viewport: ${vp.name} (${vwLabel}) on ${b.name} [device=${vp.descriptorKey}]`);

        const contextOpts = Object.assign({}, vp.descriptor, { baseURL: "http://localhost:8090" });
        const context = await browser.newContext(contextOpts);

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
