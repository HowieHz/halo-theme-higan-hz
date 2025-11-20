/**
 * 扩展 window 对象的类型定义
 */
declare global {
  interface Window {
    initTOC: (contentSelector: string, tocSelector: string, headingSelector?: string) => void;
  }
}

// 确保这个文件被视为模块
export {};
