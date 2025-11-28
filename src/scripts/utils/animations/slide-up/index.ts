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
}
