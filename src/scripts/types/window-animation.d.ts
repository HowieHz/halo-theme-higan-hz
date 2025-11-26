/**
 * 扩展 window 对象的类型定义
 */
declare global {
  interface Window {
    /**
     * 滚动到页面顶部
     */
    scrollToTop: () => void;

    /**
     * slideDown 效果
     * @param element - 要显示的元素
     * @param duration - 动画持续时间（毫秒），默认 200ms
     */
    slideDown: (element: HTMLElement, duration?: number) => void;

    /**
     * slideUp 效果
     * @param element - 要隐藏的元素
     * @param duration - 动画持续时间（毫秒），默认 200ms
     */
    slideUp: (element: HTMLElement, duration?: number) => void;

    /**
     * 切换元素显示/隐藏状态
     * @param selector - 元素、选择器或 NodeList
     * @param state - 可选的状态参数，true 为显示，false 为隐藏
     */
    toggle: (selector: string | HTMLElement | NodeList, state?: boolean) => HTMLElement | NodeList;
  }
}

// 确保这个文件被视为模块
export {};
