import "./styles.css";

import { isVisible, showElement } from "../index";

/**
 * jQuery 风格的滑下动画函数 - 通过高度变化显示元素
 * @param element - 要执行动画的元素
 * @param duration - 动画持续时间（毫秒）
 */
export function slideDown(element: HTMLElement, duration = 200): void {
  if (!element) return;

  // 检查元素是否已经显示，如果已经显示则不触发动画
  if (isVisible(element)) {
    return;
  }

  // 先显示元素，随后设置高度为 0
  showElement(element);

  // 获取元素的自然高度
  const originalHeight = element.scrollHeight;

  // 设置 CSS 变量用于动画
  element.style.setProperty("--target-height", `${originalHeight}px`);

  Object.assign(element.style, {
    height: "0px", // 开始时设置高度为 0
    overflow: "hidden",
    animationDuration: `${duration}ms`,
  });

  // 移除冲突的类并设置动画
  element.classList.remove("slide-up");
  element.classList.add("slide-down");

  const handleAnimationEnd = () => {
    element.classList.remove("slide-down");
    ["animation-duration", "height", "overflow", "--target-height"].forEach((p) => element.style.removeProperty(p));
  };

  element.addEventListener("animationend", handleAnimationEnd, { once: true });
}
