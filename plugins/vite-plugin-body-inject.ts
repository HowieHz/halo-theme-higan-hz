import picomatch from "picomatch";
import type { IndexHtmlTransformHook, Plugin } from "vite";

/**
 * 排除规则类型
 * - 字符串：glob 模式匹配 (如 'admin/**​/*.html')
 * - 正则表达式：正则匹配
 * - 函数：自定义匹配逻辑
 * - 数组：多个规则的组合
 */
type ExcludeRule = string | RegExp | ((path: string) => boolean);

/**
 * 插件选项接口
 */
interface BodyInjectOptions {
  /** 插入到<body>标签之前的内容 */
  beforeBodyOpen?: string;
  /** 插入到<body>标签之后的内容 */
  afterBodyOpen?: string;
  /** 插入到</body>标签之前的内容 */
  beforeBodyClose?: string;
  /** 插入到</body>标签之后的内容 */
  afterBodyClose?: string;
  /** 排除规则 - 匹配的路径将不会被注入内容 */
  exclude?: ExcludeRule | ExcludeRule[];
}

/**
 * 检查路径是否应该被排除
 * @param path 待检查的路径
 * @param exclude 排除规则
 * @returns 如果应该排除返回 true，否则返回 false
 */
function shouldExclude(path: string, exclude?: ExcludeRule | ExcludeRule[]): boolean {
  if (!exclude) {
    return false;
  }

  const rules = Array.isArray(exclude) ? exclude : [exclude];

  for (const rule of rules) {
    // 字符串类型 - 使用 picomatch 进行 glob 匹配
    if (typeof rule === "string") {
      const isMatch = picomatch(rule);
      if (isMatch(path)) {
        return true;
      }
    }
    // 正则表达式类型
    else if (rule instanceof RegExp) {
      if (rule.test(path)) {
        return true;
      }
    }
    // 函数类型
    else if (typeof rule === "function") {
      if (rule(path)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * 在 body 标签周围注入内容的插件
 * @param options 插件配置选项
 * @returns Vite 插件
 */
export default function bodyInjectPlugin(options: BodyInjectOptions = {}): Plugin {
  const { beforeBodyOpen = "", afterBodyOpen = "", beforeBodyClose = "", afterBodyClose = "", exclude } = options;

  const transformHook: IndexHtmlTransformHook = (html, ctx) => {
    // 检查路径是否应该被排除
    if (shouldExclude(ctx.path, exclude)) {
      console.log(`[vite-plugin-body-inject] Skipping ${ctx.path} (matched exclude rule)`);
      return html;
    }

    console.log(ctx.path);
    // 检查是否有<body>标签
    if (!html.includes("<body") || !html.includes("</body>")) {
      console.warn(`[vite-plugin-body-inject] No <body> tag found in ${ctx.path}`);
      return html;
    }

    // 四个位置的注入，按顺序执行以避免干扰
    let result = html;

    // 1. 在<body>标签前插入
    if (beforeBodyOpen) {
      result = result.replace(/(<body[^>]*>)/i, `${beforeBodyOpen}$1`);
    }

    // 2. 在<body>标签后插入
    if (afterBodyOpen) {
      result = result.replace(/(<body[^>]*>)/i, `$1${afterBodyOpen}`);
    }

    // 3. 在</body>标签前插入
    if (beforeBodyClose) {
      result = result.replace(/<\/body>/i, `${beforeBodyClose}</body>`);
    }

    // 4. 在</body>标签后插入
    if (afterBodyClose) {
      result = result.replace(/<\/body>/i, `</body>${afterBodyClose}`);
    }

    return result;
  };

  return {
    name: "vite-plugin-body-inject",
    enforce: "post",
    transformIndexHtml: {
      // 'post' 确保在其他插件处理后执行，这样我们可以捕获所有 body 内容
      order: "post",
      handler: transformHook,
    },
  };
}
