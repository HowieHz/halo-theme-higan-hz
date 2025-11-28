// 导入类型定义（仅类型导入，不会在运行时包含）
import type {} from "../types/window-animation";
import "../../styles/mixins/animation.css";

import { hide, isVisible, show } from "./animations";

// 使此文件成为模块
export {};

/**
 * 滚动到页面顶部
 */
window.scrollToTop = (): void => {
  window.scrollTo({ top: 0, behavior: "smooth" });
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
    if (!isVisible(elem)) {
      show(elem);
    } else {
      hide(elem);
    }
  });

  return elements;
};
