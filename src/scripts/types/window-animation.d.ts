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
     * 切换元素显示/隐藏状态
     * @param selector - 元素、选择器或 NodeList
     * @param state - 可选的状态参数，true 为显示，false 为隐藏
     */
    toggle: (selector: string | HTMLElement | NodeList, state?: boolean) => HTMLElement | NodeList;
  }
}

// 确保这个文件被视为模块
export {};
