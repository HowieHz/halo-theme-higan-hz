import "./styles.css";

import { isVisible } from "../../../scripts/utils/animations";
import { fadeIn } from "../../../scripts/utils/animations/fade-in";
import { fadeOut } from "../../../scripts/utils/animations/fade-out";

document.addEventListener("DOMContentLoaded", (): void => {
  const mobileMenuIcon: HTMLElement | null = document.querySelector("#header > #nav > ul > .icon > a");
  const mobileMenuItems: NodeListOf<HTMLElement> | null = document.querySelectorAll(
    "#header > #nav > ul > li:not(:first-child)",
  );
  // 移动端 主页页眉菜单 按钮事件 绑定
  mobileMenuIcon?.addEventListener("click", (): void => {
    // 检查第一个菜单项是否可见来判断菜单状态
    if (isVisible(mobileMenuItems[0])) {
      // 设置 aria-expanded
      mobileMenuIcon.setAttribute("aria-expanded", "false");
      // 隐藏所有菜单项
      mobileMenuItems.forEach((item) => {
        fadeOut(item, 50);
      });
    } else {
      // 设置 aria-expanded
      mobileMenuIcon.setAttribute("aria-expanded", "true");
      // 显示所有菜单项
      mobileMenuItems.forEach((item) => {
        fadeIn(item, 50);
      });
    }
  });

  // 二级菜单切换功能
  const submenuToggles: NodeListOf<HTMLElement> = document.querySelectorAll(".submenu-toggle");
  submenuToggles.forEach((toggle) => {
    toggle.addEventListener("click", (event): void => {
      event.preventDefault();
      const link = toggle.parentElement?.querySelector(".submenu-link") as HTMLAnchorElement;
      if (!link) return;

      const parentHref = link.getAttribute("data-parent-href") || "";
      const parentTarget = link.getAttribute("data-parent-target") || "";
      const parentLabel = link.getAttribute("data-parent-label") || "";
      const hrefs = link.getAttribute("data-submenu-hrefs")?.split("|||") || [];
      const targets = link.getAttribute("data-submenu-targets")?.split("|||") || [];
      const labels = link.getAttribute("data-submenu-labels")?.split("|||") || [];
      const count = parseInt(link.getAttribute("data-submenu-count") || "0", 10);
      let currentIndex = parseInt(link.getAttribute("data-submenu-index") || "0", 10);

      // 验证数组长度一致性（count = 1 parent + N children）
      if (count === 0 || hrefs.length !== count - 1 || targets.length !== count - 1 || labels.length !== count - 1) {
        console.error("Submenu data is inconsistent");
        return;
      }

      // 循环到下一个菜单项
      currentIndex = (currentIndex + 1) % count;

      // 更新链接
      if (currentIndex === 0) {
        // 显示父菜单
        link.href = parentHref;
        link.target = parentTarget;
        link.textContent = parentLabel;
        link.setAttribute("aria-label", parentLabel);
      } else {
        // 显示子菜单（index 1 对应 children[0]）
        const childIndex = currentIndex - 1;
        link.href = hrefs[childIndex] || "";
        link.target = targets[childIndex] || "";
        link.textContent = labels[childIndex] || "";
        link.setAttribute("aria-label", labels[childIndex] || "");
      }
      link.setAttribute("data-submenu-index", currentIndex.toString());

      // 更新按钮图标
      const icon = toggle.querySelector(".iconify");
      if (icon) {
        if (currentIndex === count - 1) {
          // 最后一个子菜单，显示向上箭头
          icon.classList.remove("material-symbols--keyboard-arrow-down");
          icon.classList.add("material-symbols--keyboard-arrow-up");
        } else {
          // 不是最后一个，显示向下箭头
          icon.classList.remove("material-symbols--keyboard-arrow-up");
          icon.classList.add("material-symbols--keyboard-arrow-down");
        }
      }
    });
  });
});
