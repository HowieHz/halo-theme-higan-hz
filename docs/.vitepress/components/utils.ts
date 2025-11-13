export function trackColorScheme() {
  const appearance = localStorage.getItem("vitepress-theme-appearance") || "auto";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // 设置初始主题，同步 vitepress 主题切换行为
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
