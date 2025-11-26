import picomatch from "picomatch";
import type { IndexHtmlTransformHook, Plugin } from "vite";

/**
 * Replace rule interface
 */
interface ReplaceRule {
  from: string | RegExp;
  to: string;
  include?: string | string[];
  exclude?: string | string[];
}

/**
 * Plugin options interface
 */
interface ReplaceHtmlOptions {
  rules: ReplaceRule[];
}

/**
 * Plugin to batch replace content in HTML
 * @param options Plugin configuration options
 * @returns Vite plugin
 */
export default function replaceHtmlPlugin(options: ReplaceHtmlOptions): Plugin {
  const { rules = [] } = options || {};

  const transformHook: IndexHtmlTransformHook = (html, ctx) => {
    let result = html;
    for (const rule of rules) {
      // Check include rules
      if (rule.include) {
        const includePatterns = Array.isArray(rule.include) ? rule.include : [rule.include];
        const isIncludeMatch = picomatch(includePatterns);
        if (!isIncludeMatch(ctx.path)) {
          continue; // File is not in include list, skip this rule
        }
      }

      // Check exclude rules
      if (rule.exclude) {
        const excludePatterns = Array.isArray(rule.exclude) ? rule.exclude : [rule.exclude];
        const isExcludeMatch = picomatch(excludePatterns);
        if (isExcludeMatch(ctx.path)) {
          continue; // File is in exclude list, skip this rule
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
