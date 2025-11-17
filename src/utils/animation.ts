// 导入类型定义（仅类型导入，不会在运行时包含）
import type {} from "../types/window-animation";
import "../styles/mixins/animation.css";
import "./common"; // window.isVisible

// 使此文件成为模块
export {};

/**
 * 滚动到页面顶部
 */
window.scrollToTop = (): void => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

/**
 * 显示元素的通用逻辑
 * @param element - 要显示的元素
 */
function showElement(element: HTMLElement): void {
  const currentDisplay = element.style.display;

  if (currentDisplay === "none") {
    const storedDisplay = element.dataset.originalDisplay || null;
    if (storedDisplay) {
      element.style.display = storedDisplay;
    } else {
      element.style.display = "";
    }
  }

  /**
   * 处理特殊情况：当内联样式被清空后，元素仍然不可见
   *
   * 原因：清空内联样式 (display = "") 后，元素会使用 CSS 规则中的 display 值
   * 如果 CSS 规则设置了 display: none，元素仍然不可见
   *
   * 解决方案：强制设置该 HTML 标签的浏览器默认 display 值来覆盖 CSS 规则
   * 例如：div → "block", span → "inline", table → "table"
   *
   * 示例场景：
   * CSS: .my-div { display: none; }
   * JS:  element.style.display = ""; // 清空内联样式，但 CSS 规则仍生效
   * 结果：元素仍然隐藏
   * 修复：element.style.display = "block"; // 覆盖 CSS 规则
   */
  if (element.style.display === "" && !window.isVisible(element)) {
    element.style.display = getDefaultDisplay(element);
  }
}

/**
 * 隐藏元素的通用逻辑
 * @param element - 要隐藏的元素
 */
function hideElement(element: HTMLElement): void {
  const currentDisplay = element.style.display;
  if (currentDisplay !== "none") {
    // 记住原始的 display 值
    element.dataset.originalDisplay = currentDisplay || window.getComputedStyle(element).display;
    element.style.display = "none";
  }
}

/**
 * CSS 动画的通用清理函数
 * @param element - 动画元素
 * @param className - 要移除的 CSS 类名
 * @param callback - 额外的清理回调
 */
function cleanupAnimation(element: HTMLElement, className: string, callback?: () => void): () => void {
  return () => {
    element.classList.remove(className);
    element.style.animationDuration = "";
    callback?.();
  };
}

/**
 * 设置 CSS 动画的通用函数
 * @param element - 动画元素
 * @param className - 要添加的 CSS 类名
 * @param duration - 动画持续时间
 * @param onComplete - 动画完成后的回调
 */
function setupAnimation(element: HTMLElement, className: string, duration: number, onComplete?: () => void): void {
  element.classList.add(className);
  element.style.animationDuration = `${duration}ms`;

  const handleAnimationEnd = cleanupAnimation(element, className, onComplete);
  element.addEventListener("animationend", handleAnimationEnd, { once: true });
}

/**
 * 淡入动画函数 - 使用 CSS 动画，与 window.show 逻辑保持一致
 * @param element - 要执行动画的元素，支持单个 HTMLElement 或 NodeListOf<HTMLElement>
 * @param duration - 动画持续时间（毫秒）
 */
window.fadeIn = function (element: HTMLElement | NodeListOf<HTMLElement>, duration = 200): void {
  if (!element) return;

  const elements = element instanceof HTMLElement ? [element] : Array.from(element);

  elements.forEach((el) => {
    // 已经可见则跳过
    if (window.isVisible(el)) return;

    // 使用统一的显示逻辑
    showElement(el);

    // 移除冲突的类并设置动画
    el.classList.remove("fade-out");
    setupAnimation(el, "fade-in", duration);
  });
};

/**
 * 淡出动画函数 - 使用 CSS 动画，与 window.hide 逻辑保持一致
 * @param element - 要执行动画的元素，支持单个 HTMLElement 或 NodeListOf<HTMLElement>
 * @param duration - 动画持续时间（毫秒）
 */
window.fadeOut = function (element: HTMLElement | NodeListOf<HTMLElement>, duration = 200): void {
  if (!element) return;

  const elements = element instanceof HTMLElement ? [element] : Array.from(element);

  elements.forEach((el) => {
    if (!window.isVisible(el)) return;

    // 移除冲突的类并设置动画
    el.classList.remove("fade-in");
    setupAnimation(el, "fade-out", duration, () => {
      // 动画完成后使用统一的隐藏逻辑
      hideElement(el);
    });
  });
};

/**
 * jQuery 风格的滑下动画函数 - 通过高度变化显示元素
 * @param element - 要执行动画的元素
 * @param duration - 动画持续时间（毫秒）
 */
window.slideDown = function (element: HTMLElement, duration = 200): void {
  if (!element) return;

  // 检查元素是否已经显示，如果已经显示则不触发动画
  if (window.isVisible(element)) {
    return;
  }

  // 先显示元素但设置高度为 0
  showElement(element);

  // 获取元素的自然高度
  const originalHeight = element.scrollHeight;

  // 设置 CSS 变量用于动画
  element.style.setProperty("--slide-target-height", `${originalHeight}px`);

  // 开始时设置高度为 0
  element.style.height = "0px";
  element.style.overflow = "hidden";

  // 移除冲突的类并设置动画
  element.classList.remove("slide-up");
  element.classList.add("slide-down");
  element.style.animationDuration = `${duration}ms`;

  const handleAnimationEnd = () => {
    element.classList.remove("slide-down");
    element.style.animationDuration = "";
    element.style.height = "";
    element.style.overflow = "";
    element.style.removeProperty("--slide-target-height");
  };

  element.addEventListener("animationend", handleAnimationEnd, { once: true });
};

/**
 * jQuery 风格的滑上动画函数 - 通过高度变化隐藏元素
 * @param element - 要执行动画的元素
 * @param duration - 动画持续时间（毫秒）
 */
window.slideUp = function (element: HTMLElement, duration = 200): void {
  if (!element) return;

  // 检查元素是否已经隐藏，如果已经隐藏则不触发动画
  if (!window.isVisible(element)) {
    return;
  }

  // 获取当前高度
  const currentHeight = element.offsetHeight;

  // 设置 CSS 变量用于动画
  element.style.setProperty("--slide-target-height", `${currentHeight}px`);

  // 设置当前高度并启用 overflow hidden
  element.style.height = `${currentHeight}px`;
  element.style.overflow = "hidden";

  // 移除冲突的类并设置动画
  element.classList.remove("slide-down");
  element.classList.add("slide-up");
  element.style.animationDuration = `${duration}ms`;

  const handleAnimationEnd = () => {
    element.classList.remove("slide-up");
    element.style.animationDuration = "";
    element.style.height = "";
    element.style.overflow = "";
    element.style.removeProperty("--slide-target-height");
    // 动画完成后使用统一的隐藏逻辑
    hideElement(element);
  };

  element.addEventListener("animationend", handleAnimationEnd, { once: true });
};

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

  // 直接使用提取的通用函数
  elementsArray.forEach((elem) => {
    if (!elem || !elem.style) return;

    if (show) {
      showElement(elem);
    } else {
      hideElement(elem);
    }
  });

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
    if (!window.isVisible(elem)) {
      window.show(elem);
    } else {
      window.hide(elem);
    }
  });

  return elements;
};
