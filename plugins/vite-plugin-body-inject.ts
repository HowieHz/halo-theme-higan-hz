import picomatch from "picomatch";
import type { IndexHtmlTransformHook, Plugin } from "vite";

/**
 * Exclude rule type
 * - String: glob pattern matching (e.g., 'admin/**\/*.html')
 * - RegExp: regular expression matching
 * - Function: custom matching logic
 * - Array: combination of multiple rules
 */
type ExcludeRule = string | RegExp | ((path: string) => boolean);

/**
 * Plugin options interface
 */
interface BodyInjectOptions {
  /** Content to insert before the <body> tag */
  beforeBodyOpen?: string;
  /** Content to insert after the <body> tag */
  afterBodyOpen?: string;
  /** Content to insert before the </body> tag */
  beforeBodyClose?: string;
  /** Content to insert after the </body> tag */
  afterBodyClose?: string;
  /** Exclude rules - matched paths will not have content injected */
  exclude?: ExcludeRule | ExcludeRule[];
}

/**
 * Check if the path should be excluded
 * @param path Path to check
 * @param exclude Exclude rules
 * @returns Returns true if should be excluded, false otherwise
 */
function shouldExclude(path: string, exclude?: ExcludeRule | ExcludeRule[]): boolean {
  if (!exclude) {
    return false;
  }

  const rules = Array.isArray(exclude) ? exclude : [exclude];

  for (const rule of rules) {
    // String type - use picomatch for glob matching
    if (typeof rule === "string") {
      const isMatch = picomatch(rule);
      if (isMatch(path)) {
        return true;
      }
    }
    // Regular expression type
    else if (rule instanceof RegExp) {
      if (rule.test(path)) {
        return true;
      }
    }
    // Function type
    else if (typeof rule === "function") {
      if (rule(path)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Plugin to inject content around the body tag
 * @param options Plugin configuration options
 * @returns Vite plugin
 */
export default function bodyInjectPlugin(options: BodyInjectOptions = {}): Plugin {
  const { beforeBodyOpen = "", afterBodyOpen = "", beforeBodyClose = "", afterBodyClose = "", exclude } = options;

  const transformHook: IndexHtmlTransformHook = (html, ctx) => {
    // Check if the path should be excluded
    if (shouldExclude(ctx.path, exclude)) {
      console.log(`[vite-plugin-body-inject] Skipping ${ctx.path} (matched exclude rule)`);
      return html;
    }

    // Check if there is a <body> tag
    if (!html.includes("<body") || !html.includes("</body>")) {
      console.warn(`[vite-plugin-body-inject] No <body> tag found in ${ctx.path}`);
      return html;
    }

    // Inject at four positions, executed in order to avoid interference
    let result = html;

    // 1. Insert before the <body> tag
    if (beforeBodyOpen) {
      result = result.replace(/(<body(?=\s|>)[^>]*>)/i, `${beforeBodyOpen}$1`);
    }

    // 2. Insert after the <body> tag
    if (afterBodyOpen) {
      result = result.replace(/(<body(?=\s|>)[^>]*>)/i, `$1${afterBodyOpen}`);
    }

    // 3. Insert before the </body> tag
    if (beforeBodyClose) {
      result = result.replace(/<\/body>/i, `${beforeBodyClose}</body>`);
    }

    // 4. Insert after the </body> tag
    if (afterBodyClose) {
      result = result.replace(/<\/body>/i, `</body>${afterBodyClose}`);
    }

    return result;
  };

  return {
    name: "vite-plugin-body-inject",
    enforce: "post",
    transformIndexHtml: {
      // 'post' ensures execution after other plugins, allowing us to capture all body content
      order: "post",
      handler: transformHook,
    },
  };
}
