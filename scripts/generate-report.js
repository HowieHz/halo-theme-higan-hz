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
  } catch {
    console.log("manifest.json 不存在，尝试从 links.json 读取...");
    
    // 如果 manifest.json 不存在，尝试从 links.json 读取
    const linksPath = resolve(LIGHTHOUSE_RESULTS_DIR, "links.json");
    try {
      // 读取 links.json（虽然我们不使用它的内容，但检查它是否存在）
      await readFile(linksPath, "utf-8");
      
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
    } catch {
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
      script: { transfer: 0, resource: 0 },
      stylesheet: { transfer: 0, resource: 0 },
      font: { transfer: 0, resource: 0 },
      document: { transfer: 0, resource: 0 },
      image: { transfer: 0, resource: 0 },
      other: { transfer: 0, resource: 0 },
      total: { transfer: 0, resource: 0 },
    };

    for (const item of items) {
      const type = item.resourceType;
      const transferSize = item.transferSize || 0;
      const resourceSize = item.resourceSize || 0;

      if (type in metrics && metrics[type].transfer !== undefined) {
        metrics[type].transfer += transferSize;
        metrics[type].resource += resourceSize;
      }
      metrics.total.transfer += transferSize;
      metrics.total.resource += resourceSize;
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

  // 紧凑的单表格显示所有页面
  markdown += `| 页面 | JS (gzip/原始) | CSS (gzip/原始) | 外部资源 (gzip/原始) | HTML (gzip/原始) | 整体 (gzip/原始) |\n`;
  markdown += `|------|----------------|-----------------|---------------------|------------------|------------------|\n`;

  for (const result of results) {
    const urlPath = new URL(result.url).pathname || "/";
    const externalTransfer = result.total.transfer - result.document.transfer;
    const externalResource = result.total.resource - result.document.resource;
    
    markdown += `| ${urlPath} `;
    markdown += `| ${(result.script.transfer / 1024).toFixed(1)}/${(result.script.resource / 1024).toFixed(1)} `;
    markdown += `| ${(result.stylesheet.transfer / 1024).toFixed(1)}/${(result.stylesheet.resource / 1024).toFixed(1)} `;
    markdown += `| ${(externalTransfer / 1024).toFixed(1)}/${(externalResource / 1024).toFixed(1)} `;
    markdown += `| ${(result.document.transfer / 1024).toFixed(1)}/${(result.document.resource / 1024).toFixed(1)} `;
    markdown += `| **${(result.total.transfer / 1024).toFixed(1)}/${(result.total.resource / 1024).toFixed(1)}** |\n`;
  }

  // 平均值
  if (results.length > 0) {
    const avgScriptT = results.reduce((sum, r) => sum + r.script.transfer, 0) / results.length;
    const avgScriptR = results.reduce((sum, r) => sum + r.script.resource, 0) / results.length;
    const avgStyleT = results.reduce((sum, r) => sum + r.stylesheet.transfer, 0) / results.length;
    const avgStyleR = results.reduce((sum, r) => sum + r.stylesheet.resource, 0) / results.length;
    const avgDocT = results.reduce((sum, r) => sum + r.document.transfer, 0) / results.length;
    const avgDocR = results.reduce((sum, r) => sum + r.document.resource, 0) / results.length;
    const avgTotalT = results.reduce((sum, r) => sum + r.total.transfer, 0) / results.length;
    const avgTotalR = results.reduce((sum, r) => sum + r.total.resource, 0) / results.length;
    const avgExtT = results.reduce((sum, r) => sum + (r.total.transfer - r.document.transfer), 0) / results.length;
    const avgExtR = results.reduce((sum, r) => sum + (r.total.resource - r.document.resource), 0) / results.length;

    markdown += `| **平均** `;
    markdown += `| **${(avgScriptT / 1024).toFixed(1)}/${(avgScriptR / 1024).toFixed(1)}** `;
    markdown += `| **${(avgStyleT / 1024).toFixed(1)}/${(avgStyleR / 1024).toFixed(1)}** `;
    markdown += `| **${(avgExtT / 1024).toFixed(1)}/${(avgExtR / 1024).toFixed(1)}** `;
    markdown += `| **${(avgDocT / 1024).toFixed(1)}/${(avgDocR / 1024).toFixed(1)}** `;
    markdown += `| **${(avgTotalT / 1024).toFixed(1)}/${(avgTotalR / 1024).toFixed(1)}** |\n\n`;
  }

  markdown += `*单位：KB (gzip压缩后/原始大小)*\n\n`;
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
