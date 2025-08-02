import "@purge-icons/generated";
import "../../tmp/styles/theme.css";
import "../styles/main.css";
import "../styles/tailwind.css";
// 导入类型定义（仅类型导入，不会在运行时包含。包含了自定义 window 扩展）
import type {} from "../types/window-common";

// 使此文件成为模块
export {};

// 检查元素是否可见
window.isVisible = (element: HTMLElement | null): boolean => {
  if (!element) {
    return false;
  }
  const style = window.getComputedStyle(element);

  // 基本可见性检查
  if (style.display === "none" || style.visibility === "hidden") {
    return false;
  }

  // 对于 position: fixed 的元素，offsetParent 会是 null，但这不意味着不可见
  // 我们需要额外检查元素的位置属性
  if (element.offsetParent === null) {
    // 如果元素是 position: fixed，我们认为它是可见的（只要 display 和 visibility 没问题）
    if (style.position === "fixed") {
      return true;
    }

    // 如果元素或其父元素有 transform 属性，offsetParent 也可能为 null
    // 在这种情况下，我们检查元素的尺寸和位置
    const rect = element.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      return true;
    }

    // 其他情况下，offsetParent 为 null 通常意味着不可见
    return false;
  }

  return true;
};

// 检测是否为移动设备
window.isMobile = (): boolean => {
  const flag = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  return flag;
};

/**
 * 移动端 abbr 标签点击显示 title 属性功能
 * 在移动设备上为 abbr 标签添加点击事件来显示其 title 属性内容
 */
function initMobileAbbrSupport(): void {
  // 仅在移动设备上启用此功能
  if (!window.isMobile()) {
    return;
  }

  const abbrElements: NodeListOf<HTMLElement> = document.querySelectorAll("abbr[title]");

  abbrElements.forEach((abbr: HTMLElement) => {
    // 如果 abbr 元素在链接内，跳过处理以保留链接功能
    if (abbr.closest("a")) {
      return;
    }

    // 保存原始 title 到 data 属性，避免移动端浏览器的默认 tooltip
    const title = abbr.getAttribute("title");
    if (title) {
      abbr.setAttribute("data-title", title);
      abbr.removeAttribute("title"); // 移除 title 避免默认 tooltip
    }

    // 添加点击事件监听器
    abbr.addEventListener("click", (e: Event) => {
      e.preventDefault();
      e.stopPropagation();

      // 先关闭其他已激活的 abbr tooltip
      document.querySelectorAll("abbr.abbr-active").forEach((activeAbbr) => {
        if (activeAbbr !== abbr) {
          activeAbbr.classList.remove("abbr-active");
        }
      });

      // 切换当前 abbr 的激活状态
      abbr.classList.toggle("abbr-active");
    });
  });

  // 点击其他地方时关闭所有 abbr tooltip
  document.addEventListener("click", (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target.closest("abbr")) {
      document.querySelectorAll("abbr.abbr-active").forEach((activeAbbr) => {
        activeAbbr.classList.remove("abbr-active");
      });
    }
  });
}

// 在 DOM 内容加载完成后初始化移动端 abbr 支持
document.addEventListener("DOMContentLoaded", (): void => {
  initMobileAbbrSupport();
});
