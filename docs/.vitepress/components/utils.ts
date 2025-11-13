export function trackColorScheme() {
  // 设置初始主题，同步 vitepress 主题切换行为
  const appearance = localStorage.getItem("vitepress-theme-appearance") || "auto";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (!appearance || appearance === "auto" ? prefersDark : appearance === "dark") {
    // document.documentElement.classList.add("dark"); vitepress 默认 dark 模式会添加 .dark 类名
    document.documentElement.setAttribute("theme", "dark");
  } else {
    document.documentElement.setAttribute("theme", "light");
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
    } else if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("theme", "dark");
    }
  });
}

export function extendStylesScope() {
  // 读取 #article-tag 元素的 data-v- 开头属性，为 body 标签和 html 标签添加相同属性，解决部分浏览器插件无法识别 body 上的 data-v- 开头属性的问题
  const articleTag = document.getElementById("article-tag");
  if (articleTag) {
    for (const attr of articleTag.attributes) {
      if (attr.name.startsWith("data-v-") && attr.name !== "data-v-app") {
        document.body.setAttribute(attr.name, attr.value);
        document.documentElement.setAttribute(attr.name, attr.value);
      }
    }
  }
}
