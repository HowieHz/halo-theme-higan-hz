import "./styles.css";

import { isVisible, setupAnimation, showElement } from "../index";

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
    if (isVisible(el)) return;

    // 使用统一的显示逻辑
    showElement(el);

    // 移除冲突的类并设置动画
    el.classList.remove("fade-out");
    setupAnimation(el, "fade-in", duration);
  });
}
