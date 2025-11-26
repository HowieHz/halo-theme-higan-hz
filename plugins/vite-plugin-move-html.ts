import { promises as fs } from "fs";
import { dirname, isAbsolute, join, normalize, resolve, sep } from "path";
import { Plugin } from "vite";

interface MoveHtmlOptions {
  /** Target directory, relative to project root, cannot contain `..` */
  dest: string;
  /** Flatten level, defaults to 0 (no flattening) */
  flatten?: number;
  /** Whether to delete original empty directories, defaults to true */
  removeEmptyDirs?: boolean;
}

/** Ensure path does not contain '..', and is a relative path within the project */
function assertSafeRelative(p: string) {
  if (isAbsolute(p) || normalize(p).split(sep).includes("..")) {
    throw new Error(`Disallowed path: ${p}`);
  }
  return p.replace(/^[\\/]+|[\\/]+$/g, "");
}

/** Safe join, can only be within rootDir */
/* c8 ignore next 3 */
/* istanbul ignore next */
/* codacy ignore next */
function safeJoin(rootDir: string, ...segments: string[]) {
  const target = normalize(join(rootDir, ...segments));
  // Path traversal validation has been done
  if (!target.startsWith(rootDir + sep)) {
    throw new Error(`Path traversal: ${target}`);
  }
  return target;
}

export default function moveHtmlPlugin(opts: MoveHtmlOptions): Plugin {
  // Validate and normalize dest
  const safeDest = assertSafeRelative(opts.dest);
  const flattenCount = opts.flatten ?? 0;
  const removeEmptyDirs = opts.removeEmptyDirs ?? true;

  return {
    name: "vite-plugin-move-html",
    apply: "build",
    enforce: "post",

    async writeBundle(bundleOptions, bundle) {
      // Normalize output directory, path validation has been done, safe to use resolve
      const outDir = bundleOptions.dir
        ? resolve(bundleOptions.dir)
        : bundleOptions.file
          ? dirname(resolve(bundleOptions.file))
          : (() => {
              throw new Error("Neither dir nor file specified in bundleOptions");
            })();

      // Project root absolute path
      const projectRoot = resolve(process.cwd());

      // Target directory absolute path
      const destDir = safeJoin(projectRoot, safeDest);

      const movedDirs = new Set<string>();

      for (const rawName of Object.keys(bundle)) {
        // Only care about .html files
        if (!rawName.endsWith(".html")) continue;

        // Normalize filename, '../' not allowed
        const name = normalize(rawName);
        if (name.split(sep).includes("..")) continue;

        // Source path
        const srcPath = safeJoin(outDir, name);

        // Flatten processing
        const segments = name.split(/[/\\]/);
        const drop = Math.min(flattenCount, segments.length - 1);
        const newSegments = segments.slice(drop);
        const targetPath = safeJoin(destDir, ...newSegments);

        // Ensure directory exists and move
        await fs.mkdir(dirname(targetPath), { recursive: true });
        await fs.rename(srcPath, targetPath);
        movedDirs.add(dirname(srcPath));
      }

      if (removeEmptyDirs) {
        // Delete empty directories from deep to shallow
        const sorted = Array.from(movedDirs).sort((a, b) => b.length - a.length);
        for (const dir of sorted) {
          let cur = dir;
          while (cur.startsWith(outDir + sep)) {
            try {
              await fs.rmdir(cur);
              cur = dirname(cur);
            } catch {
              break;
            }
          }
        }
      }
    },
  };
}
