import type { Plugin } from "vite";

export default function thymeleafMinify(): Plugin {
  return {
    name: "vite-plugin-thymeleaf-minify",
    enforce: "post",
    transformIndexHtml: {
      order: "post", // 在所有转换之后执行
      handler(html) {
        // 删除 Thymeleaf 原型注释（支持多种前缀格式）
        // 但保留解析器级注释 <!--/*/ ... /*/-->
        html = removeNestedThymeleafComments(html);

        // 清除连续的空行
        html = html.replace(/\n\s*\n/g, "\n");

        return html;
      },
    },
  };
}

/**
 * 使用栈算法删除嵌套的 Thymeleaf 原型注释
 * 支持的格式：
 * - <!--/* ... *\/--> （无前缀）
 * - //<!--/* ... *\/--> （JS 注释前缀，无空格）
 * - // <!--/* ... *\/--> （JS 注释前缀，带空格）
 * 保留解析器级注释：<!--/*\/ ... /*\/-->
 */
function removeNestedThymeleafComments(html: string): string {
  const result: string[] = [];
  let depth = 0;
  let i = 0;

  const START_MARKER = "<!--/*";
  const END_MARKER = "*/-->";
  const EXCLUDE_START = "<!--/*/"; // 解析器级注释开始
  const EXCLUDE_END = "/*/-->"; // 解析器级注释结束
  const PREFIXES = ["// ", "//"]; // 可能的前缀（按长度降序）

  while (i < html.length) {
    let matched = false;

    // 1. 检查解析器级注释的开始（支持所有前缀）
    for (const prefix of PREFIXES) {
      const fullExcludeStart = prefix + EXCLUDE_START;
      if (html.slice(i, i + fullExcludeStart.length) === fullExcludeStart) {
        if (depth === 0) {
          result.push(fullExcludeStart);
        }
        i += fullExcludeStart.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // 无前缀的解析器级注释开始
    if (html.slice(i, i + EXCLUDE_START.length) === EXCLUDE_START) {
      if (depth === 0) {
        result.push(EXCLUDE_START);
      }
      i += EXCLUDE_START.length;
      continue;
    }

    // 2. 检查解析器级注释的结束
    if (html.slice(i, i + EXCLUDE_END.length) === EXCLUDE_END) {
      if (depth === 0) {
        result.push(EXCLUDE_END);
      }
      i += EXCLUDE_END.length;
      continue;
    }

    // 3. 检查原型注释的开始（支持所有前缀）
    for (const prefix of PREFIXES) {
      const fullStartMarker = prefix + START_MARKER;
      if (html.slice(i, i + fullStartMarker.length) === fullStartMarker) {
        depth++;
        i += fullStartMarker.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // 无前缀的原型注释开始
    if (html.slice(i, i + START_MARKER.length) === START_MARKER) {
      depth++;
      i += START_MARKER.length;
      continue;
    }

    // 4. 检查原型注释的结束
    if (html.slice(i, i + END_MARKER.length) === END_MARKER) {
      if (depth > 0) {
        depth--;
      }
      i += END_MARKER.length;
      continue;
    }

    // 5. 如果不在注释内部，保留该字符
    if (depth === 0) {
      result.push(html[i]);
    }
    i++;
  }

  return result.join("");
}
