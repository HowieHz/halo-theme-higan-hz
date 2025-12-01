import "./styles.css";

import { isVisible } from "../../../scripts/utils/animations";
import { fadeIn } from "../../../scripts/utils/animations/fade-in";
import { fadeOut } from "../../../scripts/utils/animations/fade-out";

document.addEventListener("DOMContentLoaded", (): void => {
  const mobileMenuIcon: HTMLElement | null = document.querySelector("#header > #nav > ul > .icon");
  const mobileMenuItems: NodeListOf<HTMLElement> | null = document.querySelectorAll(
    "#header > #nav > ul > li:not(:first-child)",
  );
  // 移动端 主页页眉菜单 按钮事件 绑定
  mobileMenuIcon?.addEventListener("click", (): void => {
    // 检查第一个菜单项是否可见来判断菜单状态
    if (isVisible(mobileMenuItems[0])) {
      // 隐藏所有菜单项
      mobileMenuItems.forEach((item) => {
        fadeOut(item, 50);
      });
    } else {
      // 显示所有菜单项
      mobileMenuItems.forEach((item) => {
        fadeIn(item, 50);
      });
    }
  });
});
