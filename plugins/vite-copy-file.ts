import { copyFile, cp, mkdir, stat } from "fs/promises";
import { dirname, join, relative, resolve } from "path";
import fg from "fast-glob";
import { Plugin } from "vite";

interface CopyTarget {
  src: string; // 源文件或通配模式，相对于项目根
  dest: string; // 目标目录或文件路径，相对于项目根
}

interface CopyFileOptions {
  targets: CopyTarget[];
}

export default function copyFilePlugin(opts: CopyFileOptions): Plugin {
  const targets = opts.targets || [];
  return {
    name: "vite-copy-file",
    apply: "build",
    async writeBundle() {
      for (const { src, dest } of targets) {
        const absDest = resolve(process.cwd(), dest);
        const hasGlob = /[*?]/.test(src);
        if (hasGlob) {
          // 扫描匹配文件和目录
          const entries = await fg(src, { cwd: process.cwd(), dot: true, onlyFiles: false });
          // 计算基准目录，用于保持相对结构
          const idx = src.search(/[*?]/);
          const baseDir = dirname(src.slice(0, idx));
          for (const entry of entries) {
            const absSrc = resolve(process.cwd(), entry);
            const rel = relative(baseDir, entry);
            const absTarget = join(absDest, rel);
            const s = await stat(absSrc);
            if (s.isDirectory()) {
              // 复制整个目录
              await cp(absSrc, absTarget, { recursive: true });
            } else {
              // 创建目录并复制文件
              await mkdir(dirname(absTarget), { recursive: true });
              await copyFile(absSrc, absTarget);
            }
          }
        } else {
          const absSrc = resolve(process.cwd(), src);
          const s = await stat(absSrc);
          if (s.isDirectory()) {
            await cp(absSrc, absDest, { recursive: true });
          } else {
            await mkdir(dirname(absDest), { recursive: true });
            await copyFile(absSrc, absDest);
          }
        }
      }
    },
  };
}
