export function trackColorScheme() {
  // 设置初始主题，同步 vitepress 主题切换行为
  const appearance = localStorage.getItem("vitepress-theme-appearance") || "auto";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (!appearance || appearance === "auto" ? prefersDark : appearance === "dark") {
    document.documentElement.classList.add("dark"); // 模仿 vitepress 默认 dark 模式会添加 .dark 类名
    document.documentElement.setAttribute("theme", "dark");
    document.documentElement.setAttribute("data-color-scheme", "dark");
  } else {
    document.documentElement.setAttribute("theme", "light");
    document.documentElement.setAttribute("data-color-scheme", "light");
  }

  let prevTheme: string | null = null;

  window.addEventListener("storage", () => {
    let theme = localStorage.getItem("vitepress-theme-appearance");
    if (theme === prevTheme) return;
    prevTheme = theme;

    if (theme === "auto") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("theme", "light");
      document.documentElement.setAttribute("data-color-scheme", "light");
    } else if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("theme", "dark");
      document.documentElement.setAttribute("data-color-scheme", "dark");
    }
  });
}

export function extendStylesScope(appElement: HTMLElement) {
  // 读取 #article-tag 元素的 data-v- 开头属性，为 body 标签和 html 标签添加相同属性，之后给子元素添加相同属性
  const articleTag = appElement;
  let dataAttr: {
    name: string;
    value: string;
  } | null = null;
  if (articleTag) {
    for (const attr of articleTag.attributes) {
      if (attr.name.startsWith("data-v-") && attr.name !== "data-v-app") {
        dataAttr = { name: attr.name, value: attr.value };
        break;
      }
    }
  }
  if (dataAttr) {
    document.body.setAttribute(dataAttr.name, dataAttr.value);
    // body 加上 text-size-normal class 以确保默认文本大小正确
    document.body.classList.add("text-size-normal");
    document.documentElement.setAttribute(dataAttr.name, dataAttr.value);

    const queue = [appElement];

    while (queue.length > 0) {
      const current = queue.shift() as HTMLElement; // 取出队首元素

      // 给当前元素添加属性
      current.setAttribute(dataAttr.name, dataAttr.value);

      // 将所有子元素加入队列
      for (const child of current.children) {
        queue.push(child as HTMLElement);
      }
    }
  }

  // 移除 .vp-app 元素的 loading 类
  appElement.classList.remove("loading");
}

/**
 * Inserts a clickable `#` anchor link into each heading. If a heading lacks an `id`, one is generated from its text
 * content. Headings with empty text are skipped.
 *
 * When a `#heading-anchor-svg` element exists in the DOM containing an SVG, that SVG is cloned and injected into each
 * anchor instead of relying on the CSS `::before` symbol.
 */
export function initHeadingAnchors(contentSelector: string, headingSelector = "h1, h2, h3, h4, h5, h6"): void {
  const contentRoot = document.querySelector<HTMLElement>(contentSelector);
  if (!contentRoot) return;

  const svgTemplate = document.getElementById("heading-anchor-svg") as HTMLTemplateElement | null;
  const svgElement = svgTemplate?.content.querySelector("svg") ?? null;

  contentRoot.querySelectorAll<HTMLElement>(headingSelector).forEach((heading) => {
    if (!heading.id) {
      const text = heading.textContent?.trim() ?? "";
      if (!text) return;
      heading.id = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\p{L}\p{N}-]/gu, "");
      if (!heading.id) return;
    }
    if (heading.querySelector(".heading-anchor")) return;

    const anchor = document.createElement("a");
    anchor.href = `#${heading.id}`;
    anchor.className = "heading-anchor";
    anchor.setAttribute("aria-label", `Permalink to "${heading.textContent?.trim() ?? ""}"`);

    if (svgElement) {
      const iconSpan = document.createElement("span");
      iconSpan.className = "heading-anchor-icon";
      iconSpan.setAttribute("aria-hidden", "true");
      iconSpan.append(svgElement.cloneNode(true));
      anchor.append(iconSpan);
    }

    heading.append(anchor);
  });
}
