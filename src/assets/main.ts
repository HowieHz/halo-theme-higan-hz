// 导入类型定义（仅类型导入，不会在运行时包含。包含了 jQuery 类型和自定义 window 扩展）
import type {} from "../types/window";

// 使此文件成为模块
export {};

// 检测是否为移动设备
window.isMobile = (): boolean => {
  const flag = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  return flag;
};

// 检查元素是否可见
window.isVisible = (element: HTMLElement | null): boolean => {
  if (!element) {
    return false;
  }
  const style = window.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden" && element.offsetParent !== null;
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
   * Shows the responsive navigation menu on mobile.
   */
  // 移动端 页眉菜单 按钮事件
  const mobileMenuIcon = document.querySelector("#header > #nav > ul > .icon");
  const mobileMenu = $("#header > #nav > ul > li:not(:first-child)");
  mobileMenuIcon?.addEventListener("click", (): void => {
    if (mobileMenu.is(":visible")) {
      mobileMenu.slideUp(200, (): void => {
        mobileMenu.removeClass("responsive").css("display", "");
      });
    } else {
      mobileMenu.slideDown(200, (): void => {
        mobileMenu.addClass("responsive").css("display", "");
      });
    }
  });

  /**
   * Controls the different versions of  the menu in blog post articles
   * for Desktop, tablet and mobile.
   */
  if (document.querySelector(".post")) {
    // 移动端 文章页 底部导航栏 按钮事件
    const menuElement: HTMLElement | null = document.querySelector("#actions-footer > #menu");
    menuElement?.addEventListener("click", (): void => {
      const navFooter = $("#nav-footer");
      if (navFooter.is(":visible")) {
        navFooter.slideUp(200);
      } else {
        navFooter.slideDown(200);
      }
    });
    const tocElement: HTMLElement | null = document.querySelector("#actions-footer > #toc");
    tocElement?.addEventListener("click", (): void => {
      const tocFooter = $("#toc-footer");
      if (tocFooter.is(":visible")) {
        tocFooter.slideUp(200);
      } else {
        tocFooter.slideDown(200);
      }
    });
    const shareElement: HTMLElement | null = document.querySelector("#actions-footer > #share");
    shareElement?.addEventListener("click", (): void => {
      const shareFooter = $("#share-footer");
      if (shareFooter.is(":visible")) {
        shareFooter.slideUp(200);
      } else {
        shareFooter.slideDown(200);
      }
    });

    // 桌面端 文章页 导航栏按钮事件
    const actionShareElement: HTMLElement | null = document.querySelector("#actions #action-share");
    actionShareElement?.addEventListener("click", (): void => {
      const shareMenu = $("#share-list");
      if (shareMenu.is(":visible")) {
        shareMenu.slideUp(200);
      } else {
        shareMenu.slideDown(200);
      }
    });

    const menu: HTMLElement | null = document.querySelector("#menu");
    // const nav = document.querySelector("#menu > #nav") as HTMLElement;
    const menuIcon: HTMLElement | null = document.querySelector("#menu-icon");
    const topIcon: HTMLElement | null = document.querySelector("#top-icon-tablet");

    if (menu && menuIcon && topIcon) {
      /**
       * Display the menu on hi-res laptops and desktops.
       */
      // 大于等于 1024px 的屏幕宽度 初始化时就显示菜单
      if (window.matchMedia("(min-width: 1024px)").matches) {
        menuIcon.classList.add("active"); // for #header-post .active style
        window.show(menu);
      }

      /**
       * Display the menu if the menu icon is clicked.
       */
      // 平板端、桌面端 文章页 菜单按钮事件
      menuIcon.addEventListener("click", (e: Event): void => {
        e.preventDefault();
        if (window.isVisible(menu)) {
          menuIcon.classList.remove("active"); // for #header-post .active style
          window.fadeOut(menu, 50);
        } else {
          menuIcon.classList.add("active"); // for #header-post .active style
          window.fadeIn(menu, 50);
        }
      });

      /**
       * Add a scroll listener to the menu to hide/show the navigation links.
       */
      // 平板端 文章页 导航栏、回到顶部按钮 页面滚动相关逻辑
      window.addEventListener("scroll", (): void => {
        const topDistance = getTopDistance();

        // 顶部菜单按钮、顶部菜单、回到顶部按钮 根据页面滚动距离 显示/隐藏
        if (window.matchMedia("(min-width: 640px) and (max-width: 1024px)").matches) {
          if (topDistance < 50) {
            window.fadeIn(menuIcon, 200);
            window.fadeOut(topIcon, 200);
          } else if (topDistance > 100) {
            window.fadeOut(menuIcon, 200);
            window.fadeOut(menu, 200);
            window.fadeIn(topIcon, 200);
          }
        }
        // hide only the navigation links on desktop

        // on tablet, hide the navigation icon as well and
        // show a "scroll to top icon" instead
      });
    }

    /**
     * Show mobile navigation menu after scrolling upwards,
     * hide it again after scrolling downwards.
     */
    // 移动端 文章页 底部导航栏 页面滚动相关逻辑
    const footerNav = $("#footer-post");
    if (footerNav.length) {
      let lastScrollTop = 0;
      const navFooter = $("#nav-footer");
      const tocFooter = $("#toc-footer");
      const shareFooter = $("#share-footer");
      const footerTopIcon: HTMLElement | null = document.querySelector("#actions-footer > #top");
      window.addEventListener("scroll", (): void => {
        const topDistance = getTopDistance();

        // 在滚动时，关闭全部底部导航栏子菜单
        navFooter.slideUp(200);
        tocFooter.slideUp(200);
        shareFooter.slideUp(200);

        if (topDistance > lastScrollTop) {
          // 向下滚动 -> hide menu
          footerNav.slideUp(200);
        } else {
          // 向上滚动 -> show menu
          footerNav.slideDown(200);
        }
        lastScrollTop = topDistance;

        // show a "navigation" icon when close to the top of the page,
        // otherwise show a "scroll to the top" icon
        // 回到顶部按钮 根据页面滚动距离 显示/隐藏
        if (topDistance < 50) {
          footerTopIcon?.style.setProperty("transform", "scale(0)");
        } else if (topDistance > 100) {
          footerTopIcon?.style.setProperty("transform", "scale(1)");
        }
      });
    }
  }
});
