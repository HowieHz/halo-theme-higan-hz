import type Swup from "swup";

type ModuleKeys =
  | "scrollToTop"
  | "fadeIn"
  | "fadeOut"
  | "slideDown"
  | "slideUp"
  | "show"
  | "hide"
  | "toggle"
  | "isVisible"
  | "swup"
  | "initTOC"
  | "isMobile"
  | "swupScriptsPlugin";

/**
 * 扩展 window 对象的类型定义
 */
declare global {
  interface Window {
    moduleResolve: Record<ModuleKeys, () => void>;
    moduleReady: Record<ModuleKeys, Promise<void>>;
    /**
     * 检查元素是否可见
     * @param element - 要检查的元素
     * @returns 元素是否可见
     */
    isVisible: (element: HTMLElement | NodeListOf<HTMLElement> | null) => boolean;
    /**
     * Swup 实例
     */
    swup: Swup;
    /**
     * 标识这个页面是直接进入的还是通过 Swup 进入的
     */
    isDirectLoad: boolean;
    /**
     * page:view 事件（Swup 不能触发 DOMContentLoaded 的补偿 Hook）是否触发
     */
    isPageViewTriggered: boolean;
    /**
     * DOMContentLoaded 事件补偿 Hook
     */
    onDOMContentLoadedHook: (funcHook: () => void) => void;
    /**
     * load 事件补偿 Hook
     */
    onloadHook: (funcHook: () => void) => void;
  }
}

// 确保这个文件被视为模块
export {};
