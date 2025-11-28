/**
 * 扩展 window 对象的类型定义
 */
declare global {
  interface Window {
    /**
     * 滚动到页面顶部
     */
    scrollToTop: () => void;
  }
}

// 确保这个文件被视为模块
export {};
