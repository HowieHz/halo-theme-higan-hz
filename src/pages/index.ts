import "../utils/common";
import "../utils/animation";

document.addEventListener("DOMContentLoaded", (): void => {
  const mobileMenuIcon: HTMLElement | null = document.querySelector("#header > #nav > ul > .icon");
  const mobileMenuItems: NodeListOf<HTMLElement> | null = document.querySelectorAll(
    "#header > #nav > ul > li:not(:first-child)",
  );
  // 移动端 主页页眉菜单 按钮事件 绑定
  mobileMenuIcon?.addEventListener("click", (): void => {
    // 检查第一个菜单项是否可见来判断菜单状态
    if (window.isVisible(mobileMenuItems[0])) {
      // 隐藏所有菜单项
      mobileMenuItems.forEach((item) => {
        window.fadeOut(item, 50);
      });
    } else {
      // 显示所有菜单项
      mobileMenuItems.forEach((item) => {
        window.fadeIn(item, 50);
      });
    }
  });
});
