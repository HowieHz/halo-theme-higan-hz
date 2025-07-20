import { Plugin } from 'vite'
import { promises as fs } from 'fs'
import { dirname, join, resolve, sep } from 'path'

interface MoveHtmlOptions {
  /** 目标目录，相对于项目根目录 */
  dest: string
  /** 展平层级，默认为 0（不展平） */
  flatten?: number
  /** 是否删除原始空目录，默认 true */
  removeEmptyDirs?: boolean
}

export default function moveHtmlPlugin(opts: MoveHtmlOptions): Plugin {
  const destDir = resolve(process.cwd(), opts.dest)
  const flattenCount = opts.flatten ?? 0
  const removeEmptyDirs = opts.removeEmptyDirs ?? true

  return {
    name: 'vite-move-html',
    apply: 'build',
    async writeBundle(bundleOptions, bundle) {
      const outDir = bundleOptions.dir
        ? resolve(bundleOptions.dir)
        : dirname(resolve(bundleOptions.file!))

      // 收集所有移动过文件的原始目录
      const movedDirs = new Set<string>()

      for (const fileName of Object.keys(bundle)) {
        if (!fileName.endsWith('.html')) continue

        const srcPath = join(outDir, fileName)
        const segments = fileName.split(/[/\\]/)
        const drop = Math.min(flattenCount, segments.length - 1)
        const newSegments = segments.slice(drop)
        const targetPath = join(destDir, ...newSegments)

        await fs.mkdir(dirname(targetPath), { recursive: true })
        await fs.rename(srcPath, targetPath)
        movedDirs.add(dirname(srcPath))
      }

      if (removeEmptyDirs) {
        // 从深到浅删除空目录，且删除后继续尝试父目录
        const sorted = Array.from(movedDirs).sort((a, b) => b.length - a.length)
        for (const dir of sorted) {
          let cur = dir
          while (cur.startsWith(outDir + sep)) {
            try {
              await fs.rmdir(cur)
              cur = dirname(cur)
            } catch {
              break
            }
          }
        }
      }
    }
  }
}