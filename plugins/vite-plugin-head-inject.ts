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
interface HeadInjectOptions {
  /** Content to insert before the <head> tag */
  beforeHeadOpen?: string;
  /** Content to insert after the <head> tag */
  afterHeadOpen?: string;
  /** Content to insert before the </head> tag */
  beforeHeadClose?: string;
  /** Content to insert after the </head> tag */
  afterHeadClose?: string;
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
 * Plugin to inject content around the head tag
 * @param options Plugin configuration options
 * @returns Vite plugin
 */
export default function headInjectPlugin(options: HeadInjectOptions = {}): Plugin {
  const { beforeHeadOpen = "", afterHeadOpen = "", beforeHeadClose = "", afterHeadClose = "", exclude } = options;

  const transformHook: IndexHtmlTransformHook = (html, ctx) => {
    // Check if the path should be excluded
    if (shouldExclude(ctx.path, exclude)) {
      console.log(`[vite-plugin-head-inject] Skipping ${ctx.path} (matched exclude rule)`);
      return html;
    }

    // Check if there is a <head> tag
    if (!html.includes("<head") || !html.includes("</head>")) {
      console.warn(`[vite-plugin-head-inject] No <head> tag found in ${ctx.path}`);
      return html;
    }

    // Inject at four positions, executed in order to avoid interference
    let result = html;

    // 1. Insert before the <head> tag
    if (beforeHeadOpen) {
      result = result.replace(/(<head[^>]*>)/i, `${beforeHeadOpen}$1`);
    }

    // 2. Insert after the <head> tag
    if (afterHeadOpen) {
      result = result.replace(/(<head[^>]*>)/i, `$1${afterHeadOpen}`);
    }

    // 3. Insert before the </head> tag
    if (beforeHeadClose) {
      result = result.replace(/<\/head>/i, `${beforeHeadClose}</head>`);
    }

    // 4. Insert after the </head> tag
    if (afterHeadClose) {
      result = result.replace(/<\/head>/i, `</head>${afterHeadClose}`);
    }

    return result;
  };

  return {
    name: "vite-plugin-head-inject",
    enforce: "post",
    transformIndexHtml: {
      // 'post' ensures execution after other plugins, allowing us to capture all head content
      order: "post",
      handler: transformHook,
    },
  };
}
