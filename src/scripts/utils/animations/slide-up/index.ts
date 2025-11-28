import "./styles.css";

import { hideElement, isVisible } from "../index";

/**
 * jQuery 风格的滑上动画函数 - 通过高度变化隐藏元素
 * @param element - 要执行动画的元素
 * @param duration - 动画持续时间（毫秒）
 */
export function slideUp(element: HTMLElement, duration = 200): void {
  if (!element) return;

  // 检查元素是否已经隐藏，如果已经隐藏则不触发动画
  if (!isVisible(element)) {
    return;
  }

  // 获取当前高度
  const currentHeight = element.offsetHeight;

  // 设置 CSS 变量用于动画
  element.style.setProperty("--target-height", `${currentHeight}px`);

  Object.assign(element.style, {
    height: `${currentHeight}px`, // 设置当前高度并启用 overflow hidden
    overflow: "hidden",
    animationDuration: `${duration}ms`,
  });

  // 移除冲突的类并设置动画
  element.classList.remove("slide-down");
  element.classList.add("slide-up");

  const handleAnimationEnd = () => {
    element.classList.remove("slide-up");
    ["animation-duration", "height", "overflow", "--target-height"].forEach((p) => element.style.removeProperty(p));
    // 动画完成后使用统一的隐藏逻辑
    hideElement(element);
  };

  element.addEventListener("animationend", handleAnimationEnd, { once: true });
}
