/// <reference types="jquery" />

// 使此文件成为模块
export {};

// 扩展 window 对象的类型
declare global {
  interface Window {
    isMobile: () => boolean;
    scrollToTop: () => void;
    show: (selector: string | HTMLElement | NodeList) => HTMLElement | NodeList;
    hide: (selector: string | HTMLElement | NodeList) => HTMLElement | NodeList;
    toggle: (selector: string | HTMLElement | NodeList, state?: boolean) => HTMLElement | NodeList;
    toggleWithAnimation: (selector: string | HTMLElement, duration?: number, easing?: string) => Promise<HTMLElement>;
  }
}

// 检测是否为移动设备
window.isMobile = (): boolean => {
  const flag = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  return flag;
};

/**
 * 滚动到页面顶部
 */
window.scrollToTop = (): void => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

document.addEventListener("DOMContentLoaded", function (): void {
  /**
   * Shows the responsive navigation menu on mobile.
   */
  // 移动端 页眉菜单 按钮事件
  const mobileMenuIcon = document.querySelector("#header > #nav > ul > .icon");
  const mobileMenu = $("#header > #nav > ul > li:not(:first-child)");
  mobileMenuIcon?.addEventListener("click", function (): void {
    if (mobileMenu.is(":visible")) {
      mobileMenu.slideUp(200, function (): void {
        mobileMenu.removeClass("responsive").css("display", "");
      });
    } else {
      mobileMenu.slideDown(200, function (): void {
        mobileMenu.addClass("responsive").css("display", "");
      });
    }
  });

  /**
   * Controls the different versions of  the menu in blog post articles
   * for Desktop, tablet and mobile.
   */
  if ($(".post").length) {
    // 移动端 文章页 底部导航栏 按钮事件
    const menuElement = document.querySelector("#actions-footer > #menu") as HTMLElement;
    menuElement?.addEventListener("click", (): void => {
      const navFooter = $("#nav-footer");
      if (navFooter.is(":visible")) {
        navFooter.slideUp(200);
      } else {
        navFooter.slideDown(200);
      }
    });
    const tocElement = document.querySelector("#actions-footer > #toc") as HTMLElement;
    tocElement?.addEventListener("click", (): void => {
      const tocFooter = $("#toc-footer");
      if (tocFooter.is(":visible")) {
        tocFooter.slideUp(200);
      } else {
        tocFooter.slideDown(200);
      }
    });
    const shareElement = document.querySelector("#actions-footer > #share") as HTMLElement;
    shareElement?.addEventListener("click", (): void => {
      const shareFooter = $("#share-footer");
      if (shareFooter.is(":visible")) {
        shareFooter.slideUp(200);
      } else {
        shareFooter.slideDown(200);
      }
    });

    // 桌面端 文章页 导航栏按钮事件
    const actionShareElement = document.querySelector("#actions #action-share") as HTMLElement;
    actionShareElement?.addEventListener("click", (): void => {
      const shareMenu = $("#share-list");
      if (shareMenu.is(":visible")) {
        shareMenu.slideUp(200);
      } else {
        shareMenu.slideDown(200);
      }
    });

    const menu = $("#menu");
    // const nav = $("#menu > #nav");
    const menuIcon = $("#menu-icon");

    /**
     * Display the menu on hi-res laptops and desktops.
     */
    // 大于等于 1024px 的屏幕宽度 初始化时就显示菜单
    if (window.matchMedia("(min-width: 1024px)").matches) {
      menuIcon.addClass("active"); // for #header-post .active style
      menu.show();
    }

    /**
     * Display the menu if the menu icon is clicked.
     */
    // 平板端、桌面端 文章页 菜单按钮事件
    menuIcon.on("click", function (): boolean {
      if (menu.is(":visible")) {
        menuIcon.removeClass("active"); // for #header-post .active style
        menu.fadeOut(50);
      } else {
        menuIcon.addClass("active"); // for #header-post .active style
        menu.fadeIn(50);
      }
      return false;
    });

    /**
     * Add a scroll listener to the menu to hide/show the navigation links.
     */
    // 平板端 文章页 导航栏、回到顶部按钮 页面滚动相关逻辑
    if (menu.length) {
      const topIcon = $("#top-icon-tablet");
      $(window).on("scroll", function (): void {
        const topDistance = $(window).scrollTop() || 0;

        // hide only the navigation links on desktop
        // if (!nav.is(":visible") && topDistance < 50) {
        //   nav.show();
        // } else if (nav.is(":visible") && topDistance > 100) {
        //   nav.hide();
        // }

        // on tablet, hide the navigation icon as well and
        // show a "scroll to top icon" instead

        // 顶部菜单按钮、顶部菜单、回到顶部按钮 根据页面滚动距离 显示/隐藏
        if (window.matchMedia("(min-width: 640px) and (max-width: 1024px)").matches) {
          if (topDistance < 50) {
            menuIcon.fadeIn(200);
            topIcon.fadeOut(200);
          } else if (topDistance > 100) {
            menuIcon.fadeOut(200);
            menu.fadeOut(200);
            topIcon.fadeIn(200);
          }
        }
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
      const footerTopIcon = $("#actions-footer > #top");
      $(window).on("scroll", function (): void {
        const topDistance = $(window).scrollTop() || 0;

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
          footerTopIcon.css("transform", "scale(0)");
        } else if (topDistance > 100) {
          footerTopIcon.css("transform", "scale(1)");
        }
      });
    }
  }
});

/**
 * 自定义 Toggle 函数实现
 * 用于显示/隐藏元素的工具函数集合
 * 使用示例：
 *
 * 基本用法
 * toggle('#myElement');                    // 切换显示/隐藏
 * toggle('#myElement', true);              // 强制显示
 * toggle('#myElement', false);             // 强制隐藏
 *
 * 显示/隐藏
 * show('#myElement');                      // 显示元素
 * hide('#myElement');                      // 隐藏元素
 *
 * 带动画的切换
 * toggleWithAnimation('#myElement', 500, 'ease-in-out')
 *   .then(() => console.log('动画完成'));
 *
 * 批量操作
 * toggle(document.querySelectorAll('.toggle-items'));
 */

// 存储元素默认显示值的映射表
const defaultDisplayMap: Record<string, string> = {};

/**
 * 获取元素的默认 display 值
 * @param elem - 要检查的元素
 * @returns 默认的 display 值
 */
function getDefaultDisplay(elem: HTMLElement): string {
  const nodeName = elem.nodeName;
  let display = defaultDisplayMap[nodeName];

  if (display) {
    return display;
  }

  // 创建临时元素来获取默认样式
  const temp = document.createElement(nodeName);
  document.body.appendChild(temp);
  display = window.getComputedStyle(temp).display;
  document.body.removeChild(temp);

  if (display === "none") {
    display = "block";
  }

  defaultDisplayMap[nodeName] = display;
  return display;
}

/**
 * 检查元素是否在 DOM 树中隐藏
 * @param elem - 要检查的元素
 * @returns 是否隐藏
 */
function isHiddenWithinTree(elem: HTMLElement): boolean {
  return elem.offsetParent === null || window.getComputedStyle(elem).display === "none";
}

/**
 * 批量显示/隐藏元素
 * @param elements - 要操作的元素
 * @param show - true 为显示，false 为隐藏
 * @returns 返回元素
 */
function showHide(elements: HTMLElement | NodeList | HTMLElement[], show: boolean): HTMLElement | NodeList {
  // 确保 elements 是数组或类数组对象
  let elementsArray: HTMLElement[];

  if (elements instanceof HTMLElement) {
    elementsArray = [elements];
  } else if (elements instanceof NodeList) {
    elementsArray = Array.from(elements) as HTMLElement[];
  } else {
    elementsArray = elements as HTMLElement[];
  }

  const values: (string | null)[] = [];
  const length = elementsArray.length;

  // 第一次循环：计算新的 display 值
  for (let index = 0; index < length; index++) {
    const elem = elementsArray[index];
    if (!elem || !elem.style) {
      continue;
    }

    const currentDisplay = elem.style.display;

    if (show) {
      // 显示元素
      if (currentDisplay === "none") {
        const storedDisplay = elem.dataset.originalDisplay || null;
        values[index] = storedDisplay;
        if (!storedDisplay) {
          elem.style.display = "";
        }
      }

      if (elem.style.display === "" && isHiddenWithinTree(elem)) {
        values[index] = getDefaultDisplay(elem);
      }
    } else {
      // 隐藏元素
      if (currentDisplay !== "none") {
        values[index] = "none";
        // 记住原始的 display 值
        elem.dataset.originalDisplay = currentDisplay || window.getComputedStyle(elem).display;
      }
    }
  }

  // 第二次循环：应用新的 display 值（避免频繁重排）
  for (let index = 0; index < length; index++) {
    if (values[index] != null) {
      elementsArray[index].style.display = values[index] as string;
    }
  }

  return elements instanceof HTMLElement
    ? elements
    : elements instanceof NodeList
      ? elements
      : (elements as HTMLElement[])[0] || (elements as HTMLElement[])[0];
}

/**
 * 显示元素
 * @param selector - 元素或选择器
 * @returns 返回元素
 */
window.show = function (selector: string | HTMLElement | NodeList): HTMLElement | NodeList {
  const elements = typeof selector === "string" ? document.querySelectorAll(selector) : selector;
  return showHide(elements, true);
};

/**
 * 隐藏元素
 * @param selector - 元素或选择器
 * @returns 返回元素
 */
window.hide = function (selector: string | HTMLElement | NodeList): HTMLElement | NodeList {
  const elements = typeof selector === "string" ? document.querySelectorAll(selector) : selector;
  return showHide(elements, false);
};

/**
 * 切换元素显示/隐藏状态
 * @param selector - 元素或选择器
 * @param state - 可选的状态参数，true 为显示，false 为隐藏
 * @returns 返回元素
 */
window.toggle = function (selector: string | HTMLElement | NodeList, state?: boolean): HTMLElement | NodeList {
  const elements = typeof selector === "string" ? document.querySelectorAll(selector) : selector;

  // 如果指定了 state 参数
  if (typeof state === "boolean") {
    return state ? window.show(elements) : window.hide(elements);
  }

  // 否则根据当前状态切换
  let elementsArray: HTMLElement[];

  if (elements instanceof HTMLElement) {
    elementsArray = [elements];
  } else if (elements instanceof NodeList) {
    elementsArray = Array.from(elements) as HTMLElement[];
  } else {
    elementsArray = elements as HTMLElement[];
  }

  elementsArray.forEach(function (elem: HTMLElement): void {
    if (isHiddenWithinTree(elem)) {
      window.show(elem);
    } else {
      window.hide(elem);
    }
  });

  return elements;
};

/**
 * 带动画的 toggle 函数（使用 CSS 过渡）
 * @param selector - 元素或选择器
 * @param duration - 动画持续时间（毫秒）
 * @param easing - 动画缓动函数
 * @returns 返回 Promise
 */
window.toggleWithAnimation = function (
  selector: string | HTMLElement,
  duration: number = 300,
  easing: string = "ease",
): Promise<HTMLElement> {
  const element = typeof selector === "string" ? (document.querySelector(selector) as HTMLElement) : selector;

  if (!element) {
    return Promise.resolve(element);
  }

  return new Promise((resolve) => {
    const isHidden = isHiddenWithinTree(element);

    // 设置过渡效果
    element.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;

    if (isHidden) {
      // 显示元素
      element.style.display = element.dataset.originalDisplay || "";
      element.style.opacity = "0";
      element.style.transform = "scale(0.9)";

      // 强制重排
      void element.offsetHeight;

      element.style.opacity = "1";
      element.style.transform = "scale(1)";
    } else {
      // 隐藏元素
      element.style.opacity = "0";
      element.style.transform = "scale(0.9)";
    }

    // 动画完成后的处理
    setTimeout(() => {
      if (isHidden) {
        element.style.transition = "";
        element.style.transform = "";
      } else {
        element.style.display = "none";
        element.style.transition = "";
        element.style.transform = "";
        element.style.opacity = "";
      }
      resolve(element);
    }, duration);
  });
};
