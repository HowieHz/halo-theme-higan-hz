import picomatch from "picomatch";
import type { IndexHtmlTransformHook, Plugin } from "vite";

/**
 * 替换规则接口
 */
interface ReplaceRule {
  from: string | RegExp;
  to: string;
  include?: string | string[];
  exclude?: string | string[];
}

/**
 * 插件选项接口
 */
interface ReplaceHtmlOptions {
  rules: ReplaceRule[];
}

/**
 * 在 HTML 中批量替换内容的插件
 * @param options 插件配置选项
 * @returns Vite 插件
 */
export default function replaceHtmlPlugin(options: ReplaceHtmlOptions): Plugin {
  const { rules = [] } = options || {};

  const transformHook: IndexHtmlTransformHook = (html, ctx) => {
    let result = html;
    for (const rule of rules) {
      // 检查 include 规则
      if (rule.include) {
        const includePatterns = Array.isArray(rule.include) ? rule.include : [rule.include];
        const isIncludeMatch = picomatch(includePatterns);
        if (!isIncludeMatch(ctx.path)) {
          continue; // 文件不在 include 列表中，跳过此规则
        }
      }

      // 检查 exclude 规则
      if (rule.exclude) {
        const excludePatterns = Array.isArray(rule.exclude) ? rule.exclude : [rule.exclude];
        const isExcludeMatch = picomatch(excludePatterns);
        if (isExcludeMatch(ctx.path)) {
          continue; // 文件在 exclude 列表中，跳过此规则
        }
      }

      result = result.replace(rule.from, rule.to);
    }
    return result;
  };

  return {
    name: "vite-plugin-replace-html",
    enforce: "post",
    transformIndexHtml: {
      order: "post",
      handler: transformHook,
    },
  };
}
