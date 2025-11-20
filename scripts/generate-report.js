/**
 * 生成页面体积评估报告
 * 解析 Lighthouse 结果并生成可读的报告
 */

import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";

const LIGHTHOUSE_RESULTS_DIR = process.env.LIGHTHOUSE_RESULTS_DIR || ".lighthouseci";
const OUTPUT_DIR = process.env.OUTPUT_DIR || "./reports";

/**
 * 解析 Lighthouse 结果
 */
async function parseLighthouseResults() {
  const fs = (await import("fs")).promises;
  const path = (await import("path")).default;

  // 尝试先读取 manifest.json
  let entries = null;
  const manifestPath = resolve(LIGHTHOUSE_RESULTS_DIR, "manifest.json");
  
  try {
    const manifest = JSON.parse(await readFile(manifestPath, "utf-8"));
    entries = manifest;
  } catch (e) {
    console.log("manifest.json 不存在，尝试从 links.json 读取...");
    
    // 如果 manifest.json 不存在，尝试从 links.json 读取
    const linksPath = resolve(LIGHTHOUSE_RESULTS_DIR, "links.json");
    try {
      const links = JSON.parse(await readFile(linksPath, "utf-8"));
      
      // 从 links.json 提取信息并查找对应的 JSON 文件
      entries = [];
      
      // 列出目录中的所有 JSON 文件
      const files = (await fs.readdir(LIGHTHOUSE_RESULTS_DIR)).filter(f => f.endsWith('.json') && f.startsWith('lhr-'));
      
      // 按 URL 分组结果
      const urlGroups = {};
      
      for (const file of files) {
        const filePath = resolve(LIGHTHOUSE_RESULTS_DIR, file);
        const report = JSON.parse(await readFile(filePath, "utf-8"));
        const url = report.mainDocumentUrl || report.finalUrl;
        
        if (!urlGroups[url]) {
          urlGroups[url] = [];
        }
        urlGroups[url].push(filePath);
      }
      
      // 为每个 URL 创建一个条目（使用最后一个运行结果）
      for (const [url, files] of Object.entries(urlGroups)) {
        entries.push({
          url,
          jsonPath: path.basename(files[files.length - 1])
        });
      }
    } catch (linkError) {
      throw new Error("无法读取 manifest.json 或 links.json");
    }
  }

  const results = [];

  for (const entry of entries) {
    const reportPath = resolve(LIGHTHOUSE_RESULTS_DIR, entry.jsonPath);
    const report = JSON.parse(await readFile(reportPath, "utf-8"));

    const resourceSummary = report.audits["resource-summary"];
    const items = resourceSummary?.details?.items || [];

    const metrics = {
      url: entry.url,
      script: 0,
      stylesheet: 0,
      font: 0,
      document: 0,
      image: 0,
      other: 0,
      total: 0,
    };

    for (const item of items) {
      const type = item.resourceType;
      const size = item.transferSize || 0;

      if (type in metrics) {
        metrics[type] = size;
      }
      metrics.total += size;
    }

    results.push(metrics);
  }

  return results;
}

/**
 * 生成 Markdown 报告
 */
function generateMarkdownReport(results, version) {
  let markdown = `# 页面体积评估报告 - v${version}\n\n`;
  markdown += `生成时间：${new Date().toISOString()}\n\n`;

  for (const result of results) {
    const urlPath = new URL(result.url).pathname || "/";
    markdown += `## ${urlPath}\n\n`;
    
    // 计算外部资源（除了 HTML 的其他所有资源）
    const externalResources = result.total - result.document;
    
    markdown += `| 资源类型 | 大小 |\n`;
    markdown += `|---------|------|\n`;
    markdown += `| 全部 JS | ${(result.script / 1024).toFixed(2)} KB |\n`;
    markdown += `| 全部 CSS | ${(result.stylesheet / 1024).toFixed(2)} KB |\n`;
    markdown += `| 全部外部资源 | ${(externalResources / 1024).toFixed(2)} KB |\n`;
    markdown += `| HTML 页面 | ${(result.document / 1024).toFixed(2)} KB |\n`;
    markdown += `| **整体大小** | **${(result.total / 1024).toFixed(2)} KB** |\n\n`;
  }

  // 平均值
  if (results.length > 0) {
    const avgTotal = results.reduce((sum, r) => sum + r.total, 0) / results.length;
    const avgScript = results.reduce((sum, r) => sum + r.script, 0) / results.length;
    const avgStylesheet = results.reduce((sum, r) => sum + r.stylesheet, 0) / results.length;
    const avgDocument = results.reduce((sum, r) => sum + r.document, 0) / results.length;
    const avgExternal = results.reduce((sum, r) => sum + (r.total - r.document), 0) / results.length;

    markdown += `## 平均值\n\n`;
    markdown += `| 资源类型 | 平均大小 |\n`;
    markdown += `|---------|----------|\n`;
    markdown += `| 全部 JS | ${(avgScript / 1024).toFixed(2)} KB |\n`;
    markdown += `| 全部 CSS | ${(avgStylesheet / 1024).toFixed(2)} KB |\n`;
    markdown += `| 全部外部资源 | ${(avgExternal / 1024).toFixed(2)} KB |\n`;
    markdown += `| HTML 页面 | ${(avgDocument / 1024).toFixed(2)} KB |\n`;
    markdown += `| **整体大小** | **${(avgTotal / 1024).toFixed(2)} KB** |\n\n`;
  }

  markdown += `---\n\n`;
  markdown += `*此报告由 Lighthouse CI 自动生成*\n`;

  return markdown;
}

/**
 * 生成 JSON 报告
 */
function generateJsonReport(results, version) {
  return JSON.stringify(
    {
      version,
      timestamp: new Date().toISOString(),
      results,
      budgets: {
        script: 204800,
        stylesheet: 102400,
        font: 102400,
        document: 51200,
        total: 512000,
      },
    },
    null,
    2,
  );
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log("解析 Lighthouse 结果...");
    const results = await parseLighthouseResults();

    const version = process.env.RELEASE_VERSION || "未知版本";

    console.log("生成 Markdown 报告...");
    const markdownReport = generateMarkdownReport(results, version);
    await writeFile(resolve(OUTPUT_DIR, "page-size-report.md"), markdownReport);

    console.log("生成 JSON 报告...");
    const jsonReport = generateJsonReport(results, version);
    await writeFile(resolve(OUTPUT_DIR, "page-size-report.json"), jsonReport);

    console.log("\n✓ 报告生成完成！");
    console.log(`  - Markdown: ${resolve(OUTPUT_DIR, "page-size-report.md")}`);
    console.log(`  - JSON: ${resolve(OUTPUT_DIR, "page-size-report.json")}`);

    // 输出到控制台
    console.log("\n" + markdownReport);
  } catch (error) {
    console.error("❌ 生成报告失败：", error.message);
    process.exit(1);
  }
}

main();
