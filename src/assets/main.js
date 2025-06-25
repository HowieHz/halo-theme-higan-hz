window.isMobile = () => {
  const flag = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  return flag;
};

/**
 * 滚动到页面顶部
 */
window.scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

document.addEventListener("DOMContentLoaded", function () {
  /**
   * Shows the responsive navigation menu on mobile.
   */
  // 移动端 页眉菜单 按钮事件
  const mobileMenuIcon = $("#header > #nav > ul > .icon");
  const mobileMenu = $("#header > #nav > ul > li:not(:first-child)");
  mobileMenuIcon.on("click", function () {
    if (mobileMenu.is(":visible")) {
      mobileMenu.slideUp(200, function () {
        mobileMenu.removeClass("responsive").css("display", "");
      });
    } else {
      mobileMenu.slideDown(200, function () {
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
    $("#actions-footer > #menu").click(function () {
      const navFooter = $("#nav-footer");
      if (navFooter.is(":visible")) {
        navFooter.slideUp(200);
      } else {
        navFooter.slideDown(200);
      }
    });
    $("#actions-footer > #toc").click(function () {
      const tocFooter = $("#toc-footer");
      if (tocFooter.is(":visible")) {
        tocFooter.slideUp(200);
      } else {
        tocFooter.slideDown(200);
      }
    });
    $("#actions-footer > #share").click(function () {
      const shareFooter = $("#share-footer");
      if (shareFooter.is(":visible")) {
        shareFooter.slideUp(200);
      } else {
        shareFooter.slideDown(200);
      }
    });

    // 桌面端 文章页 导航栏按钮事件
    $("#actions #action-share").click(function () {
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
    menuIcon.on("click", function () {
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
      $(window).on("scroll", function () {
        const topDistance = $(window).scrollTop();

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
      $(window).on("scroll", function () {
        const topDistance = $(window).scrollTop();

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
 */

// 存储元素默认显示值的映射表
const defaultDisplayMap = {};

/**
 * 获取元素的默认 display 值
 * @param {HTMLElement} elem - 要检查的元素
 * @returns {string} 默认的 display 值
 */
function getDefaultDisplay(elem) {
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
 * @param {HTMLElement} elem - 要检查的元素
 * @returns {boolean} 是否隐藏
 */
function isHiddenWithinTree(elem) {
  return elem.offsetParent === null || window.getComputedStyle(elem).display === "none";
}

/**
 * 批量显示/隐藏元素
 * @param {HTMLElement|NodeList|Array} elements - 要操作的元素
 * @param {boolean} show - true 为显示，false 为隐藏
 * @returns {HTMLElement|NodeList|Array} 返回元素
 */
function showHide(elements, show) {
  // 确保 elements 是数组或类数组对象
  if (!elements.length && elements.nodeType) {
    elements = [elements];
  }

  const values = [];
  const length = elements.length;

  // 第一次循环：计算新的 display 值
  for (let index = 0; index < length; index++) {
    const elem = elements[index];
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
      elements[index].style.display = values[index];
    }
  }

  return elements;
}

/**
 * 显示元素
 * @param {HTMLElement|NodeList|string} selector - 元素或选择器
 * @returns {HTMLElement|NodeList} 返回元素
 */
window.show = function (selector) {
  const elements = typeof selector === "string" ? document.querySelectorAll(selector) : selector;
  return showHide(elements, true);
};

/**
 * 隐藏元素
 * @param {HTMLElement|NodeList|string} selector - 元素或选择器
 * @returns {HTMLElement|NodeList} 返回元素
 */
window.hide = function (selector) {
  const elements = typeof selector === "string" ? document.querySelectorAll(selector) : selector;
  return showHide(elements, false);
};

/**
 * 切换元素显示/隐藏状态
 * @param {HTMLElement|NodeList|string} selector - 元素或选择器
 * @param {boolean} [state] - 可选的状态参数，true 为显示，false 为隐藏
 * @returns {HTMLElement|NodeList} 返回元素
 */
window.toggle = function (selector, state) {
  const elements = typeof selector === "string" ? document.querySelectorAll(selector) : selector;

  // 如果指定了 state 参数
  if (typeof state === "boolean") {
    return state ? window.show(elements) : window.hide(elements);
  }

  // 否则根据当前状态切换
  const elementsArray = elements.length ? Array.from(elements) : [elements];

  elementsArray.forEach(function (elem) {
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
 * @param {HTMLElement|string} selector - 元素或选择器
 * @param {number} [duration=300] - 动画持续时间（毫秒）
 * @param {string} [easing='ease'] - 动画缓动函数
 * @returns {Promise} 返回 Promise
 */
window.toggleWithAnimation = function (selector, duration = 300, easing = "ease") {
  const element = typeof selector === "string" ? document.querySelector(selector) : selector;

  if (!element) {
    return Promise.resolve();
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

// 使用示例：
/*
// 基本用法
toggle('#myElement');                    // 切换显示/隐藏
toggle('#myElement', true);              // 强制显示
toggle('#myElement', false);             // 强制隐藏

// 显示/隐藏
show('#myElement');                      // 显示元素
hide('#myElement');                      // 隐藏元素

// 带动画的切换
toggleWithAnimation('#myElement', 500, 'ease-in-out')
  .then(() => console.log('动画完成'));

// 批量操作
toggle(document.querySelectorAll('.toggle-items'));
*/
