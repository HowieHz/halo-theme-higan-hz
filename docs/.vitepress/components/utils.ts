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
}
