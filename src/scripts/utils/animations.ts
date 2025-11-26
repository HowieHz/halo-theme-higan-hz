import { hideElement, setupAnimation, showElement } from "./base-animation";

/**
 * 淡入动画函数 - 使用 CSS 动画，与 show 逻辑保持一致
 * @param element - 要执行动画的元素，支持单个 HTMLElement 或 NodeListOf<HTMLElement>
 * @param duration - 动画持续时间（毫秒）
 */
export function fadeIn(element: HTMLElement | NodeListOf<HTMLElement>, duration = 200): void {
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
}

/**
 * 淡出动画函数 - 使用 CSS 动画，与 hide 逻辑保持一致
 * @param element - 要执行动画的元素，支持单个 HTMLElement 或 NodeListOf<HTMLElement>
 * @param duration - 动画持续时间（毫秒）
 */
export function fadeOut(element: HTMLElement | NodeListOf<HTMLElement>, duration = 200): void {
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
export function show(selector: string | HTMLElement | NodeList): HTMLElement | NodeList {
  const elements = typeof selector === "string" ? document.querySelectorAll(selector) : selector;
  return showHide(elements, true);
}

/**
 * 隐藏元素
 * @param selector - 元素或选择器
 * @returns 返回元素
 */
export function hide(selector: string | HTMLElement | NodeList): HTMLElement | NodeList {
  const elements = typeof selector === "string" ? document.querySelectorAll(selector) : selector;
  return showHide(elements, false);
}
