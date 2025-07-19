/**
 * 扩展 window 对象的类型定义
 */
declare global {
  interface Window {
    /**
     * 检测是否为移动设备
     */
    isMobile: () => boolean;
  }
}

// 确保这个文件被视为模块
export {};
