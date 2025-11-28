// 导入类型定义（仅类型导入，不会在运行时包含）
import type {} from "../types/window-animation";
import "../../styles/mixins/animation.css";
import "./common"; // window.isVisible

import { hide, hideElement, show, showElement } from "./animations";

// 使此文件成为模块
export {};

/**
 * 滚动到页面顶部
 */
window.scrollToTop = (): void => {
  window.scrollTo({ top: 0, behavior: "smooth" });
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
 * 切换元素显示/隐藏状态
 * @param selector - 元素或选择器
 * @param state - 可选的状态参数，true 为显示，false 为隐藏
 * @returns 返回元素
 */
window.toggle = function (selector: string | HTMLElement | NodeList, state?: boolean): HTMLElement | NodeList {
  const elements = typeof selector === "string" ? document.querySelectorAll(selector) : selector;

  // 如果指定了 state 参数
  if (typeof state === "boolean") {
    return state ? show(elements) : hide(elements);
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
      show(elem);
    } else {
      hide(elem);
    }
  });

  return elements;
};
