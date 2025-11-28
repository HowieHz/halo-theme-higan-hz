import "./styles.css";

import { hideElement, isVisible, setupAnimation } from "../index";

/**
 * 淡出动画函数 - 使用 CSS 动画，与 hide 逻辑保持一致
 * @param element - 要执行动画的元素，支持单个 HTMLElement 或 NodeListOf<HTMLElement>
 * @param duration - 动画持续时间（毫秒）
 */
export function fadeOut(element: HTMLElement | NodeListOf<HTMLElement>, duration = 200): void {
  if (!element) return;

  const elements = element instanceof HTMLElement ? [element] : Array.from(element);

  elements.forEach((el) => {
    if (!isVisible(el)) return;

    // 移除冲突的类并设置动画
    el.classList.remove("fade-in");
    setupAnimation(el, "fade-out", duration, () => {
      // 动画完成后使用统一的隐藏逻辑
      hideElement(el);
    });
  });
}
