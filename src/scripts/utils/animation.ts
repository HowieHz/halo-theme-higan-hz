// 导入类型定义（仅类型导入，不会在运行时包含）
import type {} from "../types/window-animation";
import "../../styles/mixins/animation.css";
import "./common"; // window.isVisible

import { hideElement, showElement } from "./base-animation";

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
