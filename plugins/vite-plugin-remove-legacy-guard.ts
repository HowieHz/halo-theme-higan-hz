import { promises as fs } from "fs";
import { dirname, resolve } from "path";
import picomatch from "picomatch";
import type { Plugin } from "vite";

/**
 * 插件选项接口
 */
interface RemoveLegacyGuardOptions {
  /** 需要检查的文件路径模式（glob 格式） */
  include?: string | string[];
  /** Vite base 路径 */
  base?: string;
}

/**
 * 检查内容是否为空 legacy guard 函数
 */
function isLegacyGuardOnly(content: string): boolean {
  const normalizedContent = content.replace(/\s+/g, "");
  const legacyGuardPattern =
    /^exportfunction__vite_legacy_guard\(\)\{import\.meta\.url[,;]import\(`_`\)\.catch\(\(\)=>1\)[,;]\(asyncfunction\*\(\)\{\}\)\(\)\.next\(\)\}$/;
  return legacyGuardPattern.test(normalizedContent);
}

/**
 * 移除只包含 legacy guard 函数的空 JS 文件及其 script 标签的插件
 * @param options 插件配置选项
 * @returns Vite 插件
 */
export default function removeLegacyGuardPlugin(options: RemoveLegacyGuardOptions = {}): Plugin {
  const {
    // 默认检查 fragments 和 components 目录下的 HTML 文件
    include = ["/src/templates/fragments/**/*.html", "/src/templates/components/**/*.html"],
    // 默认为根路径，与 Vite 的 base 配置对应
    base = "/",
  } = options;

  // 将 include 规则转换为数组
  const includePatterns = Array.isArray(include) ? include : [include];
  const isIncludeMatch = picomatch(includePatterns);

  // 用于存储需要处理的信息：script src 到对应的 HTML 文件路径
  const scriptsToCheck = new Map<string, Set<string>>();

  return {
    name: "vite-plugin-remove-legacy-guard",
    apply: "build",

    // 第一阶段：在 HTML 转换时收集信息
    transformIndexHtml: {
      order: "post",
      async handler(html, ctx) {
        // 检查文件是否在 include 列表中
        if (!isIncludeMatch(ctx.path)) {
          return html;
        }

        console.log(`[vite-plugin-remove-legacy-guard] 检查文件：${ctx.path}`);

        // 匹配所有 script 标签，收集 src
        const scriptRegex = /<script\s+type="module"\s+crossorigin\s+src="([^"]+)"[^>]*><\/script>/g;
        let match;

        while ((match = scriptRegex.exec(html)) !== null) {
          const scriptSrc = match[1];
          console.log(`[vite-plugin-remove-legacy-guard]   发现 script 标签：src="${scriptSrc}"`);

          if (!scriptsToCheck.has(scriptSrc)) {
            scriptsToCheck.set(scriptSrc, new Set());
          }
          scriptsToCheck.get(scriptSrc)?.add(ctx.path);
        }
      },
    },

    // 第二阶段：在 writeBundle 时处理文件
    async writeBundle(bundleOptions) {
      // 获取输出目录，优先使用 bundleOptions.dir，其次使用 bundleOptions.file 的目录，最后回退到当前工作目录
      const outDir_ = bundleOptions.dir
        ? resolve(bundleOptions.dir)
        : bundleOptions.file
          ? dirname(resolve(bundleOptions.file))
          : process.cwd();

      console.log(`\n[vite-plugin-remove-legacy-guard] 处理 legacy guard 文件`);

      for (const [scriptSrc, htmlPaths] of scriptsToCheck.entries()) {
        console.log(`\n[vite-plugin-remove-legacy-guard] 检查：${scriptSrc}`);

        // 移除 base 路径前缀
        let relativePath = scriptSrc;
        if (scriptSrc.startsWith(base)) {
          relativePath = scriptSrc.slice(base.length);
        }

        // 构建完整路径
        const filePath = resolve(outDir_, relativePath);
        console.log(`[vite-plugin-remove-legacy-guard]   文件路径：${filePath}`);

        try {
          // 读取文件内容
          const fileContent = await fs.readFile(filePath, "utf-8");

          // 检查是否为空 legacy guard 文件
          if (isLegacyGuardOnly(fileContent)) {
            console.log(`[vite-plugin-remove-legacy-guard]   ✓ 检测到空 legacy guard 文件`);

            // 删除 JS 文件
            await fs.unlink(filePath);
            console.log(`[vite-plugin-remove-legacy-guard]   ✓ 已删除：${filePath}`);

            // 从相关 HTML 文件中移除 script 标签
            for (const htmlPath of htmlPaths) {
              console.log(`[vite-plugin-remove-legacy-guard]   → 从 HTML 移除 script: ${htmlPath}`);
              // 标记供后续处理
            }
          } else {
            console.log(`[vite-plugin-remove-legacy-guard]   ✗ 文件包含其他内容，保留`);
          }
        } catch (err) {
          console.log(`[vite-plugin-remove-legacy-guard]   ⚠️ 处理失败：${err}`);
        }
      }
    },
  };
}
