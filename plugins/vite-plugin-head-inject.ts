import type { IndexHtmlTransformHook, Plugin } from "vite";

/**
 * 插件选项接口
 */
interface HeadInjectOptions {
  /** 插入到<head>标签之前的内容 */
  beforeHeadOpen?: string;
  /** 插入到<head>标签之后的内容 */
  afterHeadOpen?: string;
  /** 插入到</head>标签之前的内容 */
  beforeHeadClose?: string;
  /** 插入到</head>标签之后的内容 */
  afterHeadClose?: string;
}

/**
 * 在 head 标签周围注入内容的插件
 * @param options 插件配置选项
 * @returns Vite 插件
 */
export default function headInjectPlugin(options: HeadInjectOptions = {}): Plugin {
  const { beforeHeadOpen = "", afterHeadOpen = "", beforeHeadClose = "", afterHeadClose = "" } = options;

  const transformHook: IndexHtmlTransformHook = (html) => {
    // 检查是否有<head>标签
    if (!html.includes("<head") || !html.includes("</head>")) {
      console.warn("[vite-plugin-head-inject] No <head> tag found in HTML");
      return html;
    }

    // 四个位置的注入，按顺序执行以避免干扰
    let result = html;

    // 1. 在<head>标签前插入
    if (beforeHeadOpen) {
      result = result.replace(/(<head[^>]*>)/i, `${beforeHeadOpen}$1`);
    }

    // 2. 在<head>标签后插入
    if (afterHeadOpen) {
      result = result.replace(/(<head[^>]*>)/i, `$1${afterHeadOpen}`);
    }

    // 3. 在</head>标签前插入
    if (beforeHeadClose) {
      result = result.replace(/<\/head>/i, `${beforeHeadClose}</head>`);
    }

    // 4. 在</head>标签后插入
    if (afterHeadClose) {
      result = result.replace(/<\/head>/i, `</head>${afterHeadClose}`);
    }

    return result;
  };

  return {
    name: "vite-plugin-head-inject",
    enforce: "post",
    transformIndexHtml: {
      // 'post' 确保在其他插件处理后执行，这样我们可以捕获所有头部内容
      order: "post",
      handler: transformHook,
    },
  };
}
