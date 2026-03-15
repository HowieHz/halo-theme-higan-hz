import "../styles/main.css";
import "../styles/mixins/tailwind.css";

// 使此文件成为模块
export {};

document.addEventListener("DOMContentLoaded", (): void => {
  // 二级菜单显示/切换功能
  const submenuToggles: NodeListOf<HTMLElement> = document.querySelectorAll(".submenu-toggle");
  submenuToggles.forEach((toggle) => {
    // 绑定点击切换逻辑
    toggle.addEventListener("click", (event): void => {
      // 阻止默认跳转行为
      event.preventDefault();

      // 找到当前按钮对应的链接元素
      const link = toggle.parentElement?.querySelector(".submenu-link") as HTMLAnchorElement;
      if (!link) return;

      // 读取属性工具函数（避免重复 getAttribute）
      const getAttr = (name: string) => link.getAttribute(name) || "";
      // 拆分子菜单属性（以 ||| 分隔）
      const splitAttr = (name: string) => getAttr(name).split("|||").filter(Boolean);
      // 数字属性转换（字符串 -> number）
      const toInt = (name: string, fallback = 0) => parseInt(getAttr(name) || `${fallback}`, 10);

      // 父菜单数据
      const parentHref = getAttr("data-parent-href");
      const parentTarget = getAttr("data-parent-target");
      const parentLabel = getAttr("data-parent-label");
      // 子菜单数据列表
      const hrefs = splitAttr("data-submenu-hrefs");
      const targets = splitAttr("data-submenu-targets");
      const labels = splitAttr("data-submenu-labels");
      // 菜单总数：1 个父菜单 + N 个子菜单
      const count = toInt("data-submenu-count");
      // 当前显示索引
      let currentIndex = toInt("data-submenu-index");

      // 数据一致性校验：子菜单数量必须与 count 匹配
      if (count === 0 || hrefs.length !== count - 1 || targets.length !== count - 1 || labels.length !== count - 1) {
        console.error("Submenu data is inconsistent");
        return;
      }

      // 计算下一个索引（循环切换）
      currentIndex = (currentIndex + 1) % count;

      // 判断当前是否显示父菜单
      const isParent = currentIndex === 0;
      // 子菜单索引（父菜单之后为子菜单）
      const childIndex = currentIndex - 1;

      // 更新链接与文本内容
      link.href = isParent ? parentHref : hrefs[childIndex] || "";
      link.target = isParent ? parentTarget : targets[childIndex] || "";
      link.textContent = isParent ? parentLabel : labels[childIndex] || "";
      // 同步 aria-label 便于无障碍
      link.setAttribute("aria-label", link.textContent || "");
      // 记录当前索引用于下次切换
      link.setAttribute("data-submenu-index", currentIndex.toString());

      // 更新按钮图标方向
      const icon = toggle.querySelector(".iconify");
      if (icon) {
        // 最后一个子菜单时显示向上箭头
        const isLast = currentIndex === count - 1;
        icon.classList.toggle("material-symbols--keyboard-arrow-up", isLast);
        // 其他情况显示向下箭头
        icon.classList.toggle("material-symbols--keyboard-arrow-down", !isLast);
      }
    });
  });
});
