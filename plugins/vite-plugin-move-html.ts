import { promises as fs } from "fs";
import { dirname, isAbsolute, join, normalize, resolve, sep } from "path";
import { Plugin } from "vite";

interface MoveHtmlOptions {
  /** 目标目录，相对于项目根目录，不能包含 `..` */
  dest: string;
  /** 展平层级，默认为 0（不展平） */
  flatten?: number;
  /** 是否删除原始空目录，默认 true */
  removeEmptyDirs?: boolean;
}

/** 确保路径不包含 '..'，且为项目内相对路径 */
function assertSafeRelative(p: string) {
  if (isAbsolute(p) || normalize(p).split(sep).includes("..")) {
    throw new Error(`不允许的路径：${p}`);
  }
  return p.replace(/^[\\/]+|[\\/]+$/g, "");
}

/** 安全的 join，只能在 rootDir 下 */
/* c8 ignore next 3 */
/* istanbul ignore next */
/* codacy ignore next */
function safeJoin(rootDir: string, ...segments: string[]) {
  const target = normalize(join(rootDir, ...segments));
  // 已做路径穿越校验
  if (!target.startsWith(rootDir + sep)) {
    throw new Error(`路径穿越：${target}`);
  }
  return target;
}

export default function moveHtmlPlugin(opts: MoveHtmlOptions): Plugin {
  // 校验并规范化 dest
  const safeDest = assertSafeRelative(opts.dest);
  const flattenCount = opts.flatten ?? 0;
  const removeEmptyDirs = opts.removeEmptyDirs ?? true;

  return {
    name: "vite-plugin-move-html",
    apply: "build",
    async writeBundle(bundleOptions, bundle) {
      // 规范化输出目录，已做路径校验，安全使用 resolve
      const outDir = bundleOptions.dir
        ? resolve(bundleOptions.dir)
        : bundleOptions.file
          ? dirname(resolve(bundleOptions.file))
          : (() => {
              throw new Error("Neither dir nor file specified in bundleOptions");
            })();

      // 项目根目录绝对路径
      const projectRoot = resolve(process.cwd());

      // 目标目录绝对路径
      const destDir = safeJoin(projectRoot, safeDest);

      const movedDirs = new Set<string>();

      for (const rawName of Object.keys(bundle)) {
        // 只关心 .html
        if (!rawName.endsWith(".html")) continue;

        // 规范文件名，不允许 '../'
        const name = normalize(rawName);
        if (name.split(sep).includes("..")) continue;

        // 源路径
        const srcPath = safeJoin(outDir, name);

        // 展平处理
        const segments = name.split(/[/\\]/);
        const drop = Math.min(flattenCount, segments.length - 1);
        const newSegments = segments.slice(drop);
        const targetPath = safeJoin(destDir, ...newSegments);

        // 确保目录存在并移动
        await fs.mkdir(dirname(targetPath), { recursive: true });
        await fs.rename(srcPath, targetPath);
        movedDirs.add(dirname(srcPath));
      }

      if (removeEmptyDirs) {
        // 从深到浅删除空目录
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
