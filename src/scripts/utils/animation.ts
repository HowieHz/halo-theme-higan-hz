// 导入类型定义（仅类型导入，不会在运行时包含）
import type {} from "../types/window-animation";
import "../../styles/mixins/animation.css";

// 使此文件成为模块
export {};

/**
 * 滚动到页面顶部
 */
window.scrollToTop = (): void => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
