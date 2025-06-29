/// <reference types="jquery" />

/**
 * 扩展 window 对象的类型定义
 */
declare global {
  interface Window {
    /**
     * 检测是否为移动设备
     */
    isMobile: () => boolean;

    /**
     * 检查元素是否可见
     * @param element - 要检查的元素
     * @returns 元素是否可见
     */
    isVisible: (element: HTMLElement | null) => boolean;

    /**
     * 滚动到页面顶部
     */
    scrollToTop: () => void;

    /**
     * fadeIn 效果
     * @param element - 要显示的元素
     * @param duration - 动画持续时间（毫秒），默认200ms
     */
    fadeIn: (element: HTMLElement, duration?: number) => void;

    /**
     * fadeOut 效果
     * @param element - 要隐藏的元素
     * @param duration - 动画持续时间（毫秒），默认200ms
     */
    fadeOut: (element: HTMLElement, duration?: number) => void;

    /**
     * 显示元素
     * @param selector - 元素、选择器或NodeList
     */
    show: (selector: string | HTMLElement | NodeList) => HTMLElement | NodeList;

    /**
     * 隐藏元素
     * @param selector - 元素、选择器或NodeList
     */
    hide: (selector: string | HTMLElement | NodeList) => HTMLElement | NodeList;

    /**
     * 切换元素显示/隐藏状态
     * @param selector - 元素、选择器或NodeList
     * @param state - 可选的状态参数，true为显示，false为隐藏
     */
    toggle: (selector: string | HTMLElement | NodeList, state?: boolean) => HTMLElement | NodeList;
  }
}

// 确保这个文件被视为模块
export {};
