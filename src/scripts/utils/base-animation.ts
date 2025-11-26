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
 * 显示元素的通用逻辑
 * @param element - 要显示的元素
 */
export function showElement(element: HTMLElement): void {
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
export function hideElement(element: HTMLElement): void {
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
export function setupAnimation(
  element: HTMLElement,
  className: string,
  duration: number,
  onComplete?: () => void,
): void {
  element.classList.add(className);
  element.style.animationDuration = `${duration}ms`;

  const handleAnimationEnd = cleanupAnimation(element, className, onComplete);
  element.addEventListener("animationend", handleAnimationEnd, { once: true });
}
