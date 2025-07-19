// 导入类型定义（仅类型导入，不会在运行时包含。包含了自定义 window 扩展）
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

  // 基本可见性检查
  if (style.display === "none" || style.visibility === "hidden") {
    return false;
  }

  // 对于 position: fixed 的元素，offsetParent 会是 null，但这不意味着不可见
  // 我们需要额外检查元素的位置属性
  if (element.offsetParent === null) {
    // 如果元素是 position: fixed，我们认为它是可见的（只要 display 和 visibility 没问题）
    if (style.position === "fixed") {
      return true;
    }

    // 如果元素或其父元素有 transform 属性，offsetParent 也可能为 null
    // 在这种情况下，我们检查元素的尺寸和位置
    const rect = element.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      return true;
    }

    // 其他情况下，offsetParent 为 null 通常意味着不可见
    return false;
  }

  return true;
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
        window.slideDown(tocFooter, 200);
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

    const footerNav: HTMLElement | null = document.querySelector("#footer-post");
    let lastScrollTop = 0;
    const navFooter: HTMLElement | null = document.querySelector("#nav-footer");
    const tocFooter: HTMLElement | null = document.querySelector("#toc-footer");
    const shareFooter: HTMLElement | null = document.querySelector("#share-footer");
    const footerTopIcon: HTMLElement | null = document.querySelector("#actions-footer > #top");

    /**
     * 移动端 文章页 底部导航栏 页面滚动相关逻辑
     * 向上滚动时显示移动端导航菜单，
     * 向下滚动时再次隐藏
     */
    if (footerNav) {
      window.addEventListener("scroll", (): void => {
        const topDistance = getTopDistance();

        // 在滚动时，关闭全部底部导航栏子菜单
        for (const footer of [navFooter, tocFooter, shareFooter]) {
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
