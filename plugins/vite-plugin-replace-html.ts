import type { Plugin, IndexHtmlTransformHook } from 'vite';

/**
 * 替换规则接口
 */
interface ReplaceRule {
  from: string | RegExp;
  to: string;
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

  const transformHook: IndexHtmlTransformHook = (html) => {
    let result = html;
    for (const rule of rules) {
      result = result.replace(rule.from, rule.to);
    }
    return result;
  };

  return {
    name: 'vite-plugin-replace-html',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler: transformHook
    }
  };
}
