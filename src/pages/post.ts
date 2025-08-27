import "./generic";
import "../utils/create-toc";
import "../styles/pages/post.css";

// 检测是否为移动设备
window.isMobile = (): boolean => {
  const flag = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  return flag;
};

/**
 * 获取页面滚动距离（垂直方向）
 */
function getTopDistance(): number {
  // const topDistance = window.pageYOffset || // 现代浏览器首选 scrollY 的别名 支持大部分现代浏览器（IE9+）
  // document.documentElement.scrollTop ||  // 标准模式兼容 包括老版本 IE
  // document.body.scrollTop || // 怪异模式兼容
  // 0;
  return window.scrollY || 0;
}

document.addEventListener("DOMContentLoaded", (): void => {
  /**
   * 控制博客文章页面中菜单的不同版本
   * 适用于桌面端、平板端和移动端
   */
  if (document.querySelector(".post")) {
    // 移动端 文章页 底部导航栏 按钮事件 绑定
    document.querySelector("#actions-footer > #menu")?.addEventListener("click", (): void => {
      const navFooter: HTMLElement | null = document.querySelector("#nav-footer");
      if (!navFooter) {
        return;
      }
      if (window.isVisible(navFooter)) {
        window.slideUp(navFooter, 200);
      } else {
        window.slideDown(navFooter, 200);
      }
    });
    document.querySelector("#actions-footer > #toc")?.addEventListener("click", (): void => {
      const tocFooter: HTMLElement | null = document.querySelector("#toc-footer");
      if (!tocFooter) {
        return;
      }
      if (window.isVisible(tocFooter)) {
        window.slideUp(tocFooter, 200);
      } else {
        // First, play the slide-down animation
        window.slideDown(tocFooter, 200);

        // Then instantly scroll to active item position
        const activeLink = tocFooter.querySelector<HTMLElement>(".toc-active");

        if (activeLink) {
          setTimeout(() => {
            activeLink.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "center",
            });
          }, 200);
        }
      }
    });
    document.querySelector("#actions-footer > #share")?.addEventListener("click", (): void => {
      const shareFooter: HTMLElement | null = document.querySelector("#share-footer");
      if (!shareFooter) {
        return;
      }
      if (window.isVisible(shareFooter)) {
        window.slideUp(shareFooter, 200);
      } else {
        window.slideDown(shareFooter, 200);
      }
    });

    // 桌面端 文章页 导航栏 按钮事件 绑定
    document.querySelector("#actions #action-share")?.addEventListener("click", (): void => {
      const shareMenu = document.getElementById("share-list");
      if (!shareMenu) {
        return;
      }
      if (window.isVisible(shareMenu)) {
        window.slideUp(shareMenu, 200);
      } else {
        window.slideDown(shareMenu, 200);
      }
    });

    const menuComponents: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>(
      "#menu #nav, #menu #actions, #menu #toc",
    );

    const shareListComponents: HTMLElement | null = document.querySelector<HTMLElement>("#menu #share-list");
    const menuIcon: HTMLElement | null = document.querySelector<HTMLElement>("#menu-icon");
    const topIcon: HTMLElement | null = document.querySelector<HTMLElement>("#top-icon-tablet");

    if (menuComponents && shareListComponents && menuIcon && topIcon) {
      // 在高分辨率笔记本电脑和桌面端显示菜单
      // 大于等于 1024px 的屏幕宽度 页面完成初始化时自动显示菜单
      if (window.matchMedia("(min-width: 1024px)").matches) {
        // menuIcon.classList.add("active"); // 为 #header-post .active 样式设置，模板默认有 active，无需添加
        window.show(menuComponents);
      } else {
        menuIcon.classList.remove("active"); // 为 #header-post .active 样式设置
      }

      // 平板端、桌面端 文章页 菜单 按钮事件
      menuIcon.addEventListener("click", (e: Event): void => {
        e.preventDefault();
        if (window.isVisible(menuComponents)) {
          menuIcon.classList.remove("active"); // 为 #header-post .active 样式设置
          window.fadeOut(menuComponents, 50);
          window.fadeOut(shareListComponents, 50);
        } else {
          menuIcon.classList.add("active"); // 为 #header-post .active 样式设置
          window.fadeIn(menuComponents, 50);
        }
      });

      // 平板端 文章页 导航栏、回到顶部按钮 页面滚动相关逻辑
      // 添加滚动监听器，用于隐藏/显示导航链接
      window.addEventListener("scroll", (): void => {
        const topDistance = getTopDistance();

        // 顶部菜单按钮、顶部菜单、回到顶部按钮 根据页面滚动距离 显示/隐藏
        if (window.matchMedia("(min-width: 640px) and (max-width: 1024px)").matches) {
          if (topDistance < 50) {
            window.fadeIn(menuIcon, 200);
            window.fadeOut(topIcon, 200);
          } else if (topDistance > 100) {
            menuIcon.classList.remove("active"); // 为 #header-post .active 样式设置
            window.fadeOut(menuIcon, 200);
            window.fadeOut(menuComponents, 200);
            window.fadeOut(shareListComponents, 200);
            window.fadeIn(topIcon, 200);
          }
        }
      });
    }

    const footerNav: HTMLElement | null = document.querySelector<HTMLElement>("#footer-post");
    let lastScrollTop = 0;
    const navFooter: HTMLElement | null = document.querySelector<HTMLElement>("#nav-footer");
    const tocFooter: HTMLElement | null = document.querySelector<HTMLElement>("#toc-footer");
    const shareFooter: HTMLElement | null = document.querySelector<HTMLElement>("#share-footer");
    const footerTopIcon: HTMLElement | null = document.querySelector<HTMLElement>("#actions-footer > #top");

    /**
     * 移动端 文章页 底部导航栏 页面滚动相关逻辑
     * 向上滚动时显示移动端导航菜单，
     * 向下滚动时再次隐藏
     */
    if (footerNav) {
      window.addEventListener("scroll", (): void => {
        const topDistance = getTopDistance();

        // 在滚动时，关闭全部底部导航栏子菜单
        for (const footer of [tocFooter, navFooter, shareFooter]) {
          if (footer) window.slideUp(footer, 200);
        }

        if (topDistance > lastScrollTop) {
          // 向下滚动 -> 隐藏菜单
          window.slideUp(footerNav, 200);
        } else {
          // 向上滚动 -> 显示菜单
          window.slideDown(footerNav, 200);
        }
        lastScrollTop = topDistance;

        // 回到顶部按钮 根据页面滚动距离 显示/隐藏
        if (topDistance < 50) {
          // 隐藏回到顶部按钮
          footerTopIcon?.style.setProperty("transform", "scale(0)");
        } else if (topDistance > 100) {
          // 显示回到顶部按钮
          footerTopIcon?.style.setProperty("transform", "scale(1)");
        }
      });
    }
  }
});
