/**
 * 生成页面体积评估报告
 * 解析 Lighthouse 结果并生成可读的报告
 */

import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";

const LIGHTHOUSE_RESULTS_DIR = process.env.LIGHTHOUSE_RESULTS_DIR || ".lighthouseci";
const OUTPUT_DIR = process.env.OUTPUT_DIR || "./reports";
const OUTPUT_FILENAME = process.env.OUTPUT_FILENAME || "page-size-report";
const JSON_ONLY = process.env.JSON_ONLY === "true";

/**
 * 解析 Lighthouse 结果
 */
async function parseLighthouseResults() {
  const fs = (await import("fs")).promises;
  const path = (await import("path")).default;

  // 直接扫描目录中的所有 Lighthouse 结果文件
  console.log("直接扫描 Lighthouse 结果文件...");

  const files = (await fs.readdir(LIGHTHOUSE_RESULTS_DIR)).filter((f) => f.endsWith(".json") && f.startsWith("lhr-"));

  if (files.length === 0) {
    throw new Error(`在 ${LIGHTHOUSE_RESULTS_DIR} 目录中没有找到 Lighthouse 结果文件`);
  }

  console.log(`找到 ${files.length} 个 Lighthouse 结果文件`);

  // 按 URL 分组结果
  const urlGroups = {};

  for (const file of files) {
    const filePath = resolve(LIGHTHOUSE_RESULTS_DIR, file);
    const report = JSON.parse(await readFile(filePath, "utf-8"));
    const url = report.requestedUrl || report.finalUrl || report.mainDocumentUrl;

    if (!urlGroups[url]) {
      urlGroups[url] = [];
    }
    urlGroups[url].push(filePath);
  }

  // 为每个 URL 创建一个条目（使用最后一个运行结果）
  const entries = [];
  for (const [url, files] of Object.entries(urlGroups)) {
    entries.push({
      url,
      jsonPath: path.basename(files[files.length - 1]),
    });
  }

  const results = [];

  for (const entry of entries) {
    const reportPath = resolve(LIGHTHOUSE_RESULTS_DIR, entry.jsonPath);
    const report = JSON.parse(await readFile(reportPath, "utf-8"));

    // 使用 audits.network-requests.details.items
    const networkRequests = report.audits["network-requests"];
    const items = networkRequests?.details?.items || [];

    // 按资源类型统计
    const resources = {};
    const resourceTypes = ["document", "font", "script", "stylesheet", "image", "fetch", "other"];

    // 初始化所有资源类型
    for (const type of resourceTypes) {
      resources[type] = {
        transferSize: 0,
        resourceSize: 0,
      };
    }

    // 统计资源
    for (const item of items) {
      const url = item.url || "";

      // 忽略 data: 和 blob: URL
      if (url.startsWith("data:") || url.startsWith("blob:")) {
        continue;
      }

      const resourceType = (item.resourceType || "other").toLowerCase();
      const transferSize = item.transferSize || 0;
      const resourceSize = item.resourceSize || 0;

      if (resources[resourceType]) {
        resources[resourceType].transferSize += transferSize;
        resources[resourceType].resourceSize += resourceSize;
      } else {
        // 如果是未知类型，归类到 other
        resources.other.transferSize += transferSize;
        resources.other.resourceSize += resourceSize;
      }
    }

    // 计算总计
    resources.total = {
      transferSize: 0,
      resourceSize: 0,
    };

    for (const type of resourceTypes) {
      resources.total.transferSize += resources[type].transferSize;
      resources.total.resourceSize += resources[type].resourceSize;
    }

    results.push({
      url: entry.url,
      resources,
    });
  }

  return results;
}

/**
 * 生成 Markdown 报告
 */
function generateMarkdownReport(results, metadata = {}) {
  let markdown = `# Page Size Audit Report\n\n`;

  // 添加元数据
  if (
    metadata.haloVersion ||
    metadata.javaVersion ||
    metadata.themeVersion ||
    metadata.lhciVersion ||
    metadata.generatedAt
  ) {
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
    if (metadata.lhciVersion) markdown += `- Lighthouse CI Version: ${metadata.lhciVersion}\n`;
    if (metadata.generatedAt) {
      const date = new Date(metadata.generatedAt);
      markdown += `- Generated At: ${date.toISOString()}\n`;
    }
    markdown += `\n`;
  }

  markdown += `Unit: KB, Format: transfer size(gzipped)/resource size\n\n`;

  // 定义资源类型的显示顺序和标签
  const typeOrder = ["document", "script", "stylesheet", "font", "image", "fetch", "other"];
  const typeLabels = {
    document: "Document",
    script: "Script",
    stylesheet: "Stylesheet",
    font: "Font",
    image: "Image",
    fetch: "Fetch",
    other: "Other",
    total: "All",
  };

  // 生成表头
  markdown += `| Page |`;
  for (const type of typeOrder) {
    markdown += ` ${typeLabels[type]} |`;
  }
  markdown += ` Total |\n`;

  // 生成分隔线
  markdown += `|------|`;
  markdown += `------|`.repeat(typeOrder.length);
  markdown += `-------|\n`;

  // 生成数据行
  for (const result of results) {
    const urlPath = new URL(result.url).pathname || "/";
    markdown += `| ${urlPath} |`;

    for (const type of typeOrder) {
      const transfer = result.resources[type]?.transferSize || 0;
      const resource = result.resources[type]?.resourceSize || 0;
      markdown += ` ${(transfer / 1024).toFixed(2)}/${(resource / 1024).toFixed(2)} |`;
    }

    const totalTransfer = result.resources.total?.transferSize || 0;
    const totalResource = result.resources.total?.resourceSize || 0;
    markdown += ` **${(totalTransfer / 1024).toFixed(2)}/${(totalResource / 1024).toFixed(2)}** |\n`;
  }

  // 计算并添加平均值
  if (results.length > 0) {
    markdown += `| **Average** |`;

    for (const type of typeOrder) {
      const avgTransfer = results.reduce((sum, r) => sum + (r.resources[type]?.transferSize || 0), 0) / results.length;
      const avgResource = results.reduce((sum, r) => sum + (r.resources[type]?.resourceSize || 0), 0) / results.length;
      markdown += ` **${(avgTransfer / 1024).toFixed(2)}/${(avgResource / 1024).toFixed(2)}** |`;
    }

    const avgTotalTransfer =
      results.reduce((sum, r) => sum + (r.resources.total?.transferSize || 0), 0) / results.length;
    const avgTotalResource =
      results.reduce((sum, r) => sum + (r.resources.total?.resourceSize || 0), 0) / results.length;
    markdown += ` **${(avgTotalTransfer / 1024).toFixed(2)}/${(avgTotalResource / 1024).toFixed(2)}** |\n\n`;
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
      lhciVersion: process.env.LHCI_VERSION || null,
      generatedAt: new Date().toISOString(),
    };

    // 生成 JSON 报告
    console.log("生成 JSON 报告...");
    const jsonReport = generateJsonReport(results, metadata);
    await writeFile(resolve(OUTPUT_DIR, `${OUTPUT_FILENAME}.json`), jsonReport);

    console.log("\n✓ 报告生成完成！");
    console.log(`  - JSON: ${resolve(OUTPUT_DIR, `${OUTPUT_FILENAME}.json`)}`);

    // 如果不是仅输出 JSON，也生成 Markdown 报告
    if (!JSON_ONLY) {
      console.log("生成 Markdown 报告...");
      const markdownReport = generateMarkdownReport(results, metadata);
      await writeFile(resolve(OUTPUT_DIR, `${OUTPUT_FILENAME}.md`), markdownReport);

      console.log(`  - Markdown: ${resolve(OUTPUT_DIR, `${OUTPUT_FILENAME}.md`)}`);

      // 输出到控制台
      console.log("\n" + markdownReport);
    }
  } catch (error) {
    console.error("❌ 生成报告失败：", error.message);
    process.exit(1);
  }
}

main();
