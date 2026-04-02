declare const __HALO_VISUAL_BASE_URL__: string;

export const pageTargets = [
  { name: "home", path: "/" },
  { name: "archives", path: "/archives" },
  { name: "archives-hello-halo", path: "/archives/hello-halo" },
  { name: "tags", path: "/tags" },
  { name: "tags-halo", path: "/tags/halo" },
  { name: "categories", path: "/categories" },
  { name: "categories-default", path: "/categories/default" },
  { name: "author-admin", path: "/authors/admin" },
  { name: "about", path: "/about" },
] as const;

export const viewportTargets = [
  { name: "desktop", width: 1280, height: 720 },
  { name: "tablet", width: 834, height: 1194 },
  { name: "mobile", width: 390, height: 844 },
] as const;

const screenshotPadding = {
  horizontal: 40,
  vertical: 56,
} as const;

function frameMarkup(path: string, width: number, height: number): string {
  const src = `${__HALO_VISUAL_BASE_URL__}${path}`;

  return `
    <style>
      :root {
        color-scheme: light;
      }

      * {
        box-sizing: border-box;
      }

      body {
        background: #f3f4f6;
        margin: 0;
        min-height: 100vh;
        padding: 24px;
      }

      [data-testid="visual-shell"] {
        display: flex;
        justify-content: center;
      }

      [data-testid="visual-frame-wrap"] {
        background: #fff;
        border: 1px solid rgb(15 23 42 / 8%);
        border-radius: 20px;
        box-shadow: 0 20px 48px rgb(15 23 42 / 12%);
        overflow: hidden;
        width: ${width}px;
      }

      [data-testid="visual-frame-meta"] {
        align-items: center;
        background: #f8fafc;
        border-bottom: 1px solid rgb(15 23 42 / 8%);
        color: #475569;
        display: flex;
        font:
          600 13px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        gap: 10px;
        min-height: 44px;
        padding: 0 16px;
      }

      [data-testid="visual-frame"] {
        border: 0;
        display: block;
        height: ${height}px;
        width: ${width}px;
      }

      [data-testid="visual-frame-dot"] {
        background: #cbd5e1;
        border-radius: 999px;
        display: inline-block;
        height: 10px;
        width: 10px;
      }
    </style>
    <main data-testid="visual-shell">
      <section data-testid="visual-frame-wrap">
        <header data-testid="visual-frame-meta">
          <span data-testid="visual-frame-dot"></span>
          <span data-testid="visual-frame-dot"></span>
          <span data-testid="visual-frame-dot"></span>
          <span>${path}</span>
        </header>
        <iframe
          data-testid="visual-frame"
          loading="eager"
          referrerpolicy="no-referrer"
          src="${src}"
          title="Halo page preview: ${path}"
        ></iframe>
      </section>
    </main>
  `;
}

export async function mountHaloPageFrame(path: string, width: number, height: number): Promise<void> {
  document.body.innerHTML = frameMarkup(path, width, height);

  const iframe = document.querySelector<HTMLIFrameElement>('[data-testid="visual-frame"]');
  if (!iframe) {
    throw new Error("Visual iframe was not created.");
  }

  await new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error(`Timed out while loading ${path}`));
    }, 45_000);

    iframe.addEventListener(
      "load",
      () => {
        window.clearTimeout(timer);
        window.setTimeout(resolve, 1_500);
      },
      { once: true },
    );
  });
}

export async function applyViewport(
  width: number,
  height: number,
  viewport: (width: number, height: number) => Promise<void>,
) {
  await viewport(width + screenshotPadding.horizontal * 2, height + screenshotPadding.vertical * 2);
}
