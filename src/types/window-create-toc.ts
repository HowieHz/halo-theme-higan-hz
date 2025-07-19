/**
 * 扩展 window 对象的类型定义
 */
declare global {
  interface Window {
    generateTOC: (inputHTML: string, targetDomSelector: string) => void;
  }
}

// 确保这个文件被视为模块
export {};
