/**
 * 扩展 window 对象的类型定义
 */
declare global {
  interface Window {
    /**
     * 检查元素是否可见
     * @param element - 要检查的元素
     * @returns 元素是否可见
     */
    isVisible: (element: HTMLElement | NodeListOf<HTMLElement> | null) => boolean;
  }
}

// 确保这个文件被视为模块
export {};
