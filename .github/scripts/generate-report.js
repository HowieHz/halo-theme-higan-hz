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
      const files = (await fs.readdir(LIGHTHOUSE_RESULTS_DIR)).filter(
        (f) => f.endsWith(".json") && f.startsWith("lhr-"),
      );

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
          jsonPath: path.basename(files[files.length - 1]),
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
      // resourceSize 可能是未压缩大小，但如果为 0 则尝试使用 transferSize 作为原始大小的估计
      // 或者检查是否有其他字段如 size
      const resourceSize = item.resourceSize || item.size || transferSize;

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
function generateMarkdownReport(results, metadata = {}) {
  let markdown = `# Page Size Audit Report\n\n`;

  // 添加元数据
  if (metadata.haloVersion || metadata.javaVersion || metadata.themeVersion) {
    markdown += `**Test Environment:**\n`;
    if (metadata.haloVersion) markdown += `- Halo CMS Version: ${metadata.haloVersion}\n`;
    if (metadata.javaVersion) markdown += `- Java Version: ${metadata.javaVersion}\n`;
    if (metadata.themeVersion) {
      // 如果是 commit hash，添加链接
      if (metadata.themeVersion.match(/^[0-9a-f]{40}$/i)) {
        markdown += `- Theme Version: [\`${metadata.themeVersion.substring(0, 7)}\`](https://github.com/HowieHz/halo-theme-higan-hz/commit/${metadata.themeVersion})\n`;
      } else {
        markdown += `- Theme Version: ${metadata.themeVersion}\n`;
      }
    }
    markdown += `\n`;
  }

  markdown += `Unit: KB(gzip/origin)\n\n`;

  // 简化的表格
  markdown += `| Page | JS | CSS | Other Resources | All External Resources | HTML | Total |\n`;
  markdown += `|------|----|----|-----------------|------------------------|------|-------|\n`;

  for (const result of results) {
    const urlPath = new URL(result.url).pathname || "/";
    // 其他资源 = 总计 - JS - CSS - HTML
    const otherTransfer =
      result.total.transfer - result.script.transfer - result.stylesheet.transfer - result.document.transfer;
    const otherResource =
      result.total.resource - result.script.resource - result.stylesheet.resource - result.document.resource;
    // 全部外部资源 = 总计 - HTML
    const externalTransfer = result.total.transfer - result.document.transfer;
    const externalResource = result.total.resource - result.document.resource;

    markdown += `| ${urlPath} `;
    markdown += `| ${(result.script.transfer / 1024).toFixed(1)}/${(result.script.resource / 1024).toFixed(1)} `;
    markdown += `| ${(result.stylesheet.transfer / 1024).toFixed(1)}/${(result.stylesheet.resource / 1024).toFixed(1)} `;
    markdown += `| ${(otherTransfer / 1024).toFixed(1)}/${(otherResource / 1024).toFixed(1)} `;
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
    const avgOtherT =
      results.reduce(
        (sum, r) => sum + (r.total.transfer - r.script.transfer - r.stylesheet.transfer - r.document.transfer),
        0,
      ) / results.length;
    const avgOtherR =
      results.reduce(
        (sum, r) => sum + (r.total.resource - r.script.resource - r.stylesheet.resource - r.document.resource),
        0,
      ) / results.length;
    const avgExtT = results.reduce((sum, r) => sum + (r.total.transfer - r.document.transfer), 0) / results.length;
    const avgExtR = results.reduce((sum, r) => sum + (r.total.resource - r.document.resource), 0) / results.length;

    markdown += `| **Average** `;
    markdown += `| **${(avgScriptT / 1024).toFixed(1)}/${(avgScriptR / 1024).toFixed(1)}** `;
    markdown += `| **${(avgStyleT / 1024).toFixed(1)}/${(avgStyleR / 1024).toFixed(1)}** `;
    markdown += `| **${(avgOtherT / 1024).toFixed(1)}/${(avgOtherR / 1024).toFixed(1)}** `;
    markdown += `| **${(avgExtT / 1024).toFixed(1)}/${(avgExtR / 1024).toFixed(1)}** `;
    markdown += `| **${(avgDocT / 1024).toFixed(1)}/${(avgDocR / 1024).toFixed(1)}** `;
    markdown += `| **${(avgTotalT / 1024).toFixed(1)}/${(avgTotalR / 1024).toFixed(1)}** |\n\n`;
  }

  markdown += `*This report is automatically generated by Lighthouse CI*\n`;

  return markdown;
}

/**
 * 生成 JSON 报告
 */
function generateJsonReport(results, metadata) {
  return JSON.stringify(
    {
      metadata,
      timestamp: new Date().toISOString(),
      results,
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

    // 收集元数据
    const metadata = {
      haloVersion: process.env.HALO_VERSION || null,
      javaVersion: process.env.JAVA_VERSION || null,
      themeVersion: process.env.THEME_VERSION || process.env.GITHUB_SHA || null,
    };

    console.log("生成 Markdown 报告...");
    const markdownReport = generateMarkdownReport(results, metadata);
    await writeFile(resolve(OUTPUT_DIR, "page-size-report.md"), markdownReport);

    console.log("生成 JSON 报告...");
    const jsonReport = generateJsonReport(results, metadata);
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
