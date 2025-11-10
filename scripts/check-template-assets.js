import { promises as fs } from 'fs'
import { join, resolve, relative } from 'path'

const IGNORE_LEGACY = process.argv.includes('--ignore-legacy')
const templateDir = resolve('templates')
const THEME_PREFIX = 'themes/howiehz-higan/'
const SKIP_PROTOCOLS = ['http://', 'https://', '//', 'data:', 'mailto:', 'tel:', 'javascript:']

// 片段定义缓存: templatePath -> Set<fragmentName>
const fragmentDefinitions = new Map()
// 模板内容缓存
const templateContentCache = new Map()

// 收集入口模板
async function collectEntryTemplates(dir) {
  const templates = []
  const rootEntries = await fs.readdir(dir, { withFileTypes: true })

  for (const entry of rootEntries) {
    const full = join(dir, entry.name)
    // 根目录下的 .html 文件
    if (entry.isFile() && /\.html$/i.test(entry.name)) {
      templates.push(full)
      continue
    }

    // error 目录下的 .html 文件
    if (entry.isDirectory() && entry.name === 'error') {
      const errorEntries = await fs.readdir(full, { withFileTypes: true })
      for (const errorEntry of errorEntries) {
        if (errorEntry.isFile() && /\.html$/i.test(errorEntry.name)) {
          templates.push(join(full, errorEntry.name))
        }
      }
    }
  }

  return templates
}

// 递归收集所有模板（包括片段模板）
async function collectAllTemplates(dir) {
  const templates = []
  
  async function scan(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true })
    
    for (const entry of entries) {
      const full = join(currentDir, entry.name)
      if (entry.isFile() && /\.html$/i.test(entry.name)) {
        templates.push(full)
      } else if (entry.isDirectory()) {
        await scan(full)
      }
    }
  }
  
  await scan(dir)
  return templates
}

function normalizeAssetPath(rawUrl) {
  if (!rawUrl) return null
  const trimmed = rawUrl.trim()
  if (trimmed === '' || trimmed.startsWith('#')) return null
  if (SKIP_PROTOCOLS.some((proto) => trimmed.toLowerCase().startsWith(proto))) return null
  if (trimmed.includes('@{') || trimmed.includes('${')) return null

  let clean = trimmed.replace(/[?#].*$/, '').replace(/^\//, '')
  if (clean.startsWith(THEME_PREFIX)) {
    clean = clean.slice(THEME_PREFIX.length)
  }
  if (!clean.startsWith('assets/')) return null

  return resolve(templateDir, clean)
}

// 解析 Thymeleaf 引用: ~{/fragments/layout :: html} 或 ~{fragments/header::content}
function parseThymeleafReference(ref) {
  if (!ref) return null
  
  let cleaned = ref.trim()
  // 移除 ~{ }
  if (cleaned.startsWith('~{')) {
    cleaned = cleaned.slice(2)
  }
  if (cleaned.endsWith('}')) {
    cleaned = cleaned.slice(0, -1)
  }
  cleaned = cleaned.trim()

  // 如果是空引用 ~{} 返回 null
  if (!cleaned) return null

  // 检查是否包含变量
  if (cleaned.includes('${') || cleaned.includes('@{')) {
    return null
  }

  // 解析 templatePath :: fragmentName，:: 前后可以有任意空格
  const parts = cleaned.split('::').map(p => p.trim())
  const templatePath = parts[0]
  const fragmentName = parts.length > 1 ? parts[1] : null

  if (!templatePath) return null

  return { templatePath, fragmentName }
}

// 将模板路径解析为完整文件路径（相对于 templates 目录）
function resolveTemplatePath(templatePath) {
  // 移除开头的 /
  let path = templatePath.startsWith('/') ? templatePath.slice(1) : templatePath
  
  // 拼接完整路径
  let fullPath = resolve(templateDir, path)
  
  // 如果没有 .html 后缀，添加
  if (!fullPath.endsWith('.html')) {
    fullPath += '.html'
  }
  
  return fullPath
}

// 建立片段定义索引
async function buildFragmentIndex(templates) {
  for (const template of templates) {
    try {
      const html = await fs.readFile(template, 'utf8')
      templateContentCache.set(template, html)
      
      // 查找所有 th:fragment 定义
      const fragmentPattern = /th:fragment\s*=\s*["']([^"']+)["']/gi
      const fragments = new Set()
      let match
      while ((match = fragmentPattern.exec(html))) {
        fragments.add(match[1].trim())
      }
      
      if (fragments.size > 0) {
        fragmentDefinitions.set(template, fragments)
      }
    } catch (err) {
      console.warn(`Failed to read template: ${template}`)
    }
  }
}

// 提取模板中引用的其他模板
function extractTemplateReferences(file) {
  const html = templateContentCache.get(file)
  if (!html) return []
  
  const references = new Set()

  // 匹配 th:replace, th:insert, th:include 的值
  const patterns = [
    /th:replace\s*=\s*["']([^"']+)["']/gi,
    /th:insert\s*=\s*["']([^"']+)["']/gi,
    /th:include\s*=\s*["']([^"']+)["']/gi,
  ]

  for (const pattern of patterns) {
    let match
    pattern.lastIndex = 0
    while ((match = pattern.exec(html))) {
      const value = match[1]
      
      // 可能包含多个 ~{} 引用，比如参数中
      const thRefPattern = /~\{([^}]+)\}/g
      let thMatch
      while ((thMatch = thRefPattern.exec(value))) {
        const parsed = parseThymeleafReference(thMatch[0])
        if (parsed && parsed.templatePath) {
          const resolvedPath = resolveTemplatePath(parsed.templatePath)
          references.add(resolvedPath)
        }
      }
    }
  }

  return Array.from(references)
}

// 递归收集模板及其依赖的所有资源
async function collectAllAssets(template, visited = new Set()) {
  if (visited.has(template)) {
    return []
  }
  visited.add(template)

  const assets = []

  // 检查文件是否存在
  try {
    await fs.access(template)
  } catch {
    return assets
  }

  // 确保模板内容已加载
  if (!templateContentCache.has(template)) {
    const html = await fs.readFile(template, 'utf8')
    templateContentCache.set(template, html)
  }

  const html = templateContentCache.get(template)

  // 提取直接资源引用 (href 和 src)
  const assetPattern = /(?:href|src)\s*=\s*["']([^"']+)["']/gi
  let match
  while ((match = assetPattern.exec(html))) {
    const resolvedPath = normalizeAssetPath(match[1])
    if (resolvedPath) {
      assets.push(resolvedPath)
    }
  }

  // 提取模板引用并递归处理
  const templateRefs = extractTemplateReferences(template)
  for (const refTemplate of templateRefs) {
    const refAssets = await collectAllAssets(refTemplate, visited)
    assets.push(...refAssets)
  }

  return assets
}

async function statTemplateAssets(entryTemplates, templateAssets) {
  const assetSizeCache = new Map()
  const uniqueAccounted = new Set()
  let globalUniqueTotal = 0

  console.log('=== Entry Templates Analysis ===\n')

  for (const template of entryTemplates) {
    const assets = templateAssets.get(template) || []
    const uniqueAssets = [...new Set(assets)]
    const rows = []
    let templateTotal = 0

    for (const assetPath of uniqueAssets) {
      if (!assetPath) continue
      let size = assetSizeCache.get(assetPath)

      if (size === undefined) {
        try {
          const stat = await fs.stat(assetPath)
          size = stat.size
          assetSizeCache.set(assetPath, size)
        } catch {
          assetSizeCache.set(assetPath, null)
          console.warn(`⚠️  Missing asset: ${relative(templateDir, assetPath)}`)
          continue
        }
      }

      if (size == null) continue
      if (IGNORE_LEGACY && assetPath.toLowerCase().includes('legacy')) continue
      templateTotal += size
      rows.push({ assetPath, size })

      if (!uniqueAccounted.has(assetPath)) {
        uniqueAccounted.add(assetPath)
        globalUniqueTotal += size
      }
    }

    console.log(`\n📄 ${relative(templateDir, template)}`)
    
    // 显示依赖的模板片段
    const refs = extractTemplateReferences(template)
    if (refs.length > 0) {
      console.log('   Fragment Dependencies:')
      for (const ref of refs) {
        try {
          await fs.access(ref)
          console.log(`     → ${relative(templateDir, ref)}`)
        } catch {
          console.log(`     → ${relative(templateDir, ref)} ❌ (missing)`)
        }
      }
    }

    if (rows.length === 0) {
      console.log('   (no local assets)')
      continue
    }

    console.log('   Assets:')
    rows
      .sort((a, b) => b.size - a.size)
      .forEach(({ assetPath, size }) =>
        console.log(
          `     ${(size / 1024).toFixed(1).padStart(8)} KB  ${relative(templateDir, assetPath)}`,
        ),
      )

    console.log(`   📊 Total: ${(templateTotal / 1024).toFixed(1)} KB`)
  }

  console.log('\n' + '='.repeat(70))
  console.log(`\n✨ Unique Assets Total: ${(globalUniqueTotal / 1024).toFixed(1)} KB`)
  console.log(`📋 Entry Templates: ${entryTemplates.length}`)
  
  if (IGNORE_LEGACY) {
    console.log('ℹ️  Legacy assets ignored')
  }
}

async function main() {
  console.log('🔍 Scanning templates directory...\n')
  
  // 收集所有模板（用于建立片段索引）
  const allTemplates = await collectAllTemplates(templateDir)
  console.log(`   Found ${allTemplates.length} total templates`)
  
  // 收集入口模板
  const entryTemplates = await collectEntryTemplates(templateDir)
  console.log(`   Found ${entryTemplates.length} entry templates\n`)

  console.log('🏗️  Building fragment index...')
  await buildFragmentIndex(allTemplates)
  console.log(`   Indexed ${fragmentDefinitions.size} templates with fragments\n`)
  
  console.log('📦 Analyzing assets and dependencies...\n')
  const templateAssets = new Map()
  for (const template of entryTemplates) {
    const assets = await collectAllAssets(template)
    templateAssets.set(template, assets)
  }

  await statTemplateAssets(entryTemplates, templateAssets)
}

main().catch((err) => {
  console.error('❌ Error:', err)
  process.exit(1)
})
