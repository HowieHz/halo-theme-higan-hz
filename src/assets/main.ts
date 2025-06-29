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
  const mobileMenuIcon = document.querySelector("#header > #nav > ul > .icon");
  const mobileMenu = $("#header > #nav > ul > li:not(:first-child)");
  // 移动端 主页页眉菜单 按钮事件 绑定
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
   * 控制博客文章页面中菜单的不同版本
   * 适用于桌面端、平板端和移动端
   */
  if (document.querySelector(".post")) {
    // 移动端 文章页 底部导航栏 按钮事件 绑定
    document.querySelector("#actions-footer > #menu")?.addEventListener("click", (): void => {
      const navFooter = $("#nav-footer");
      if (navFooter.is(":visible")) {
        navFooter.slideUp(200);
      } else {
        navFooter.slideDown(200);
      }
    });
    document.querySelector("#actions-footer > #toc")?.addEventListener("click", (): void => {
      const tocFooter = $("#toc-footer");
      if (tocFooter.is(":visible")) {
        tocFooter.slideUp(200);
      } else {
        tocFooter.slideDown(200);
      }
    });
    document.querySelector("#actions-footer > #share")?.addEventListener("click", (): void => {
      const shareFooter = $("#share-footer");
      if (shareFooter.is(":visible")) {
        shareFooter.slideUp(200);
      } else {
        shareFooter.slideDown(200);
      }
    });

    // 桌面端 文章页 导航栏 按钮事件 绑定
    document.querySelector("#actions #action-share")?.addEventListener("click", (): void => {
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
      // 在高分辨率笔记本电脑和桌面端显示菜单
      // 大于等于 1024px 的屏幕宽度 页面完成初始化时自动显示菜单
      if (window.matchMedia("(min-width: 1024px)").matches) {
        menuIcon.classList.add("active"); // 为 #header-post .active 样式设置
        window.show(menu);
      }

      // 平板端、桌面端 文章页 菜单 按钮事件
      menuIcon.addEventListener("click", (e: Event): void => {
        e.preventDefault();
        if (window.isVisible(menu)) {
          menuIcon.classList.remove("active"); // 为 #header-post .active 样式设置
          window.fadeOut(menu, 50);
        } else {
          menuIcon.classList.add("active"); // 为 #header-post .active 样式设置
          window.fadeIn(menu, 50);
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
            window.fadeOut(menuIcon, 200);
            window.fadeOut(menu, 200);
            window.fadeIn(topIcon, 200);
          }
        }
      });
    }

    /**
     * 移动端 文章页 底部导航栏 页面滚动相关逻辑
     * 向上滚动时显示移动端导航菜单，
     * 向下滚动时再次隐藏
     */
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
          // 向下滚动 -> 隐藏菜单
          footerNav.slideUp(200);
        } else {
          // 向上滚动 -> 显示菜单
          footerNav.slideDown(200);
        }
        lastScrollTop = topDistance;

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
