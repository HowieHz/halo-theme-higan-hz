/**
 * 计算多个页面的报告数据的平均值，并生成趋势图
 * 从 all-reports 目录读取各个版本的 JSON 报告，生成 Mermaid 图表
 *
 * 新的文件结构：
 * - 每个页面一个 MD 文件（包含该页面的所有图表）
 * - 一个平均值 MD 文件（包含所有页面平均后的所有图表）
 */

import { readdir, readFile, writeFile } from "fs/promises";
import { resolve } from "path";

const REPORTS_DIR = process.env.REPORTS_DIR || "./all-reports";
const OUTPUT_DIR = process.env.OUTPUT_DIR || "./charts";
const START_VERSION = process.env.START_VERSION;
const END_VERSION = process.env.END_VERSION || "最新版本";

/**
 * 计算多个页面结果的平均值
 */
function calculateAverage(results) {
  const resourceTypes = ["document", "script", "stylesheet", "font", "image", "fetch", "other", "total"];
  const avg = {};

  for (const type of resourceTypes) {
    const transferSum = results.reduce((sum, r) => {
      const value = r.resources?.[type]?.transferSize || 0;
      return sum + value;
    }, 0);
    const resourceSum = results.reduce((sum, r) => {
      const value = r.resources?.[type]?.resourceSize || 0;
      return sum + value;
    }, 0);

    avg[type] = {
      transfer: transferSum / results.length,
      resource: resourceSum / results.length,
    };
  }

  return avg;
}

/**
 * 生成 Mermaid XY Chart
 * @param {Array} data - 数据数组
 * @param {string} title - 图表标题
 * @param {Array} lines - 要显示的数据线配置 [{label, type, sizeType}]
 */
function generateMermaidChart(data, title, lines) {
  // 动态计算宽度：(版本数 - 1) * 100
  const chartWidth = Math.max(600, Math.min(1800, (data.length - 1) * 100));

  let chart = "```mermaid\n";
  chart += "---\n";
  chart += "config:\n";
  chart += "  xyChart:\n";
  chart += `    width: ${chartWidth}\n`;
  chart += "    height: 600\n";
  chart += "  themeVariables:\n";
  chart += "    xyChart:\n";
  chart += "      backgroundColor: transparent\n";
  chart += "---\n";
  chart += "xychart-beta\n";
  chart += `  title "${title}"\n`;
  chart += '  x-axis "Version" [';
  chart += data.map((d) => `"${d.version}"`).join(", ");
  chart += "]\n";

  // 动态计算 y 轴最大值
  let maxValue = 0;
  for (const line of lines) {
    const values = data.map((d) => d.resources[line.type][line.sizeType] / 1024);
    maxValue = Math.max(maxValue, ...values);
  }

  const yAxisMax = Math.ceil((maxValue * 1.1) / 10) * 10;
  chart += `  y-axis "Size (KB)" 0 --> ${yAxisMax}\n`;

  // 添加数据线
  for (const line of lines) {
    chart += "  line [";
    chart += data.map((d) => (d.resources[line.type][line.sizeType] / 1024).toFixed(1)).join(", ");
    chart += "]\n";
  }

  chart += "```\n";
  return chart;
}

/**
 * 生成单个页面的完整 Markdown 报告
 * @param {Array} data - 该页面所有版本的数据
 * @param {string} pageName - 页面名称
 * @param {boolean} isAverage - 是否为平均值报告
 */
function generatePageMarkdown(data, pageName, isAverage = false) {
  const pageTitle = isAverage ? "Average of All Pages" : pageName;

  let markdown = `# Page Size Trend Analysis - ${pageTitle}\n\n`;
  markdown += `**Version Range:** ${START_VERSION} → ${END_VERSION}  \n`;
  markdown += `**Page:** ${pageTitle}  \n`;
  markdown += `**Generated At:** ${new Date().toISOString()}  \n`;
  markdown += `**Tested Versions:** ${data.length}\n\n`;

  // 1. Total 全部资源总和的图表（gzipped）
  markdown += `## 1. Total Resources (gzipped)\n\n`;
  markdown += generateMermaidChart(data, "Total Resources Size Trend (KB, gzipped)", [
    { label: "Total", type: "total", sizeType: "transfer" },
  ]);
  markdown += `\n`;

  // 1.1 Total 对应 raw 版
  markdown += `### 1.1 Total Resources (raw)\n\n`;
  markdown += generateMermaidChart(data, "Total Resources Size Trend (KB, raw)", [
    { label: "Total", type: "total", sizeType: "resource" },
  ]);
  markdown += `\n`;

  // 2. CSS + JS 的图表（gzipped）
  markdown += `## 2. Script & Stylesheet (gzipped)\n\n`;
  markdown += generateMermaidChart(data, "Script & Stylesheet Size Trend (KB, gzipped)", [
    { label: "Script", type: "script", sizeType: "transfer" },
    { label: "Stylesheet", type: "stylesheet", sizeType: "transfer" },
  ]);
  markdown += `\n`;

  // 2.1 CSS + JS 对应 raw 版
  markdown += `### 2.1 Script & Stylesheet (raw)\n\n`;
  markdown += generateMermaidChart(data, "Script & Stylesheet Size Trend (KB, raw)", [
    { label: "Script", type: "script", sizeType: "resource" },
    { label: "Stylesheet", type: "stylesheet", sizeType: "resource" },
  ]);
  markdown += `\n`;

  // 3. 全部种类资源的图表（gzipped）
  markdown += `## 3. All Resource Types (gzipped)\n\n`;
  const allTypes = ["document", "script", "stylesheet", "font", "image", "fetch", "other"];
  markdown += generateMermaidChart(
    data,
    "All Resource Types Size Trend (KB, gzipped)",
    allTypes.map((type) => ({ label: type, type, sizeType: "transfer" })),
  );
  markdown += `\n`;

  // 3.1 全部种类资源对应 raw 版
  markdown += `### 3.1 All Resource Types (raw)\n\n`;
  markdown += generateMermaidChart(
    data,
    "All Resource Types Size Trend (KB, raw)",
    allTypes.map((type) => ({ label: type, type, sizeType: "resource" })),
  );
  markdown += `\n`;

  // 4. 每个种类资源自己的图表（gzipped 和 raw）
  markdown += `## 4. Individual Resource Types\n\n`;

  for (const resourceType of allTypes) {
    const resourceLabel = resourceType.charAt(0).toUpperCase() + resourceType.slice(1);

    // 4.x gzipped 版本
    markdown += `### 4.${allTypes.indexOf(resourceType) + 1} ${resourceLabel} (gzipped)\n\n`;
    markdown += generateMermaidChart(data, `${resourceLabel} Size Trend (KB, gzipped)`, [
      { label: resourceLabel, type: resourceType, sizeType: "transfer" },
    ]);
    markdown += `\n`;

    // 4.x.1 raw 版本
    markdown += `#### 4.${allTypes.indexOf(resourceType) + 1}.1 ${resourceLabel} (raw)\n\n`;
    markdown += generateMermaidChart(data, `${resourceLabel} Size Trend (KB, raw)`, [
      { label: resourceLabel, type: resourceType, sizeType: "resource" },
    ]);
    markdown += `\n`;
  }

  // 添加数据表格
  markdown += `## Detailed Data Table\n\n`;
  markdown += `Unit: KB, Format: gzipped(raw)\n\n`;
  markdown += `| Version | Document | Script | Stylesheet | Font | Image | Fetch | Other | Total |\n`;
  markdown += `|---------|----------|--------|------------|------|-------|-------|-------|-------|\n`;

  for (const item of data) {
    markdown += `| ${item.version} `;
    for (const type of allTypes) {
      const transfer = (item.resources[type].transfer / 1024).toFixed(1);
      const resource = (item.resources[type].resource / 1024).toFixed(1);
      markdown += `| ${transfer}(${resource}) `;
    }
    const totalTransfer = (item.resources.total.transfer / 1024).toFixed(1);
    const totalResource = (item.resources.total.resource / 1024).toFixed(1);
    markdown += `| **${totalTransfer}(${totalResource})** |\n`;
  }

  // 添加统计信息
  if (data.length > 0) {
    const totalAvgTransfer = data.reduce((sum, d) => sum + d.resources.total.transfer, 0) / data.length;
    const totalAvgResource = data.reduce((sum, d) => sum + d.resources.total.resource, 0) / data.length;
    const minTransfer = Math.min(...data.map((d) => d.resources.total.transfer));
    const maxTransfer = Math.max(...data.map((d) => d.resources.total.transfer));
    const minResource = Math.min(...data.map((d) => d.resources.total.resource));
    const maxResource = Math.max(...data.map((d) => d.resources.total.resource));
    const firstTransfer = data[0].resources.total.transfer;
    const lastTransfer = data[data.length - 1].resources.total.transfer;
    const firstResource = data[0].resources.total.resource;
    const lastResource = data[data.length - 1].resources.total.resource;
    const change = lastTransfer - firstTransfer;
    const changePercent = ((change / firstTransfer) * 100).toFixed(1);
    const changeResource = lastResource - firstResource;
    const changePercentResource = ((changeResource / firstResource) * 100).toFixed(1);

    markdown += `\n## Summary Statistics\n\n`;
    markdown += `### Gzipped Size:\n`;
    markdown += `- **Average Total Size:** ${(totalAvgTransfer / 1024).toFixed(1)} KB\n`;
    markdown += `- **Minimum Total Size:** ${(minTransfer / 1024).toFixed(1)} KB\n`;
    markdown += `- **Maximum Total Size:** ${(maxTransfer / 1024).toFixed(1)} KB\n`;
    markdown += `- **Size Change:** ${change > 0 ? "+" : ""}${(change / 1024).toFixed(1)} KB (${changePercent}%)\n\n`;

    markdown += `### Raw Size:\n`;
    markdown += `- **Average Total Size:** ${(totalAvgResource / 1024).toFixed(1)} KB\n`;
    markdown += `- **Minimum Total Size:** ${(minResource / 1024).toFixed(1)} KB\n`;
    markdown += `- **Maximum Total Size:** ${(maxResource / 1024).toFixed(1)} KB\n`;
    markdown += `- **Size Change:** ${changeResource > 0 ? "+" : ""}${(changeResource / 1024).toFixed(1)} KB (${changePercentResource}%)\n`;
  }

  markdown += `\n---\n\n`;
  markdown += `*This report is automatically generated by Lighthouse CI from HowieHz's workflow*\n`;

  return markdown;
}

/**
 * 按页面分组数据
 */
function groupDataByPage(allReports) {
  const pageGroups = {};

  for (const report of allReports) {
    const version = report.version;

    for (const result of report.rawResults || []) {
      const url = result.url;
      if (!pageGroups[url]) {
        pageGroups[url] = [];
      }

      // 标准化数据结构
      const normalizedResources = {};
      const resourceTypes = ["document", "script", "stylesheet", "font", "image", "fetch", "other", "total"];

      for (const type of resourceTypes) {
        if (result.resources?.[type]) {
          normalizedResources[type] = {
            transfer: result.resources[type].transferSize || 0,
            resource: result.resources[type].resourceSize || 0,
          };
        }
      }

      pageGroups[url].push({
        version,
        date: report.date,
        resources: normalizedResources,
      });
    }
  }

  return pageGroups;
}

/**
 * 解析语义化版本号
 */
function parseSemanticVersion(version) {
  const match = version.match(/^v?(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return null;

  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
}

/**
 * 比较两个语义化版本号
 */
function compareSemanticVersions(versionA, versionB) {
  const parsedA = parseSemanticVersion(versionA);
  const parsedB = parseSemanticVersion(versionB);

  if (!parsedA || !parsedB) {
    return versionA.localeCompare(versionB);
  }

  if (parsedA.major !== parsedB.major) {
    return parsedA.major - parsedB.major;
  }

  if (parsedA.minor !== parsedB.minor) {
    return parsedA.minor - parsedB.minor;
  }

  return parsedA.patch - parsedB.patch;
}

/**
 * 从报告目录读取所有版本的完整数据
 */
async function loadAllReportsWithPages() {
  console.log(`正在从 ${REPORTS_DIR} 读取报告...`);

  const reportDirs = await readdir(REPORTS_DIR);
  const reports = [];

  for (const dir of reportDirs) {
    const match = dir.match(/^report-(.+)$/);
    if (!match) continue;

    const version = match[1];
    const reportPath = resolve(REPORTS_DIR, dir, `${version}.json`);

    try {
      const content = await readFile(reportPath, "utf-8");
      const reportData = JSON.parse(content);

      if (reportData.results && reportData.results.length > 0) {
        reports.push({
          version,
          date: reportData.metadata?.generatedAt || new Date().toISOString(),
          rawResults: reportData.results,
        });

        console.log(`✓ 加载 ${version}`);
      }
    } catch (error) {
      console.error(`✗ 加载 ${version} 失败:`, error.message);
    }
  }

  reports.sort((a, b) => compareSemanticVersions(a.version, b.version));
  console.log(`\n共加载 ${reports.length} 个版本的数据\n`);
  console.log(`版本顺序: ${reports.map((r) => r.version).join(", ")}\n`);
  return reports;
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log("=== 生成页面体积趋势报告 ===\n");

    const allReports = await loadAllReportsWithPages();

    if (allReports.length === 0) {
      throw new Error("没有找到任何报告数据");
    }

    const pageGroups = groupDataByPage(allReports);
    const pageUrls = Object.keys(pageGroups);

    console.log(`\n找到 ${pageUrls.length} 个页面\n`);

    let generatedFiles = 0;

    // 1. 生成每个页面的报告文件
    for (const url of pageUrls) {
      const pageData = pageGroups[url];
      const pageName = url.replace("http://localhost:8090", "").replace(/\//g, "-") || "home";
      const fileName = `size-chart-page-${pageName}.md`;

      const markdown = generatePageMarkdown(pageData, url, false);
      await writeFile(resolve(OUTPUT_DIR, fileName), markdown);

      console.log(`✓ 生成页面报告: ${fileName}`);
      generatedFiles++;
    }

    // 2. 生成平均值报告文件
    console.log(`\n正在计算所有页面的平均值...`);

    const avgData = allReports.map((report) => ({
      version: report.version,
      date: report.date,
      resources: calculateAverage(report.rawResults),
    }));

    const avgFileName = `size-chart-average-all-pages.md`;
    const avgMarkdown = generatePageMarkdown(avgData, "Average", true);
    await writeFile(resolve(OUTPUT_DIR, avgFileName), avgMarkdown);

    console.log(`✓ 生成平均值报告: ${avgFileName}`);
    generatedFiles++;

    console.log("\n✓ 所有报告生成完成！");
    console.log(`  - 输出目录: ${OUTPUT_DIR}`);
    console.log(`  - 生成文件: ${generatedFiles} 个`);
    console.log(`  - 页面报告: ${pageUrls.length} 个`);
    console.log(`  - 平均报告: 1 个`);
    console.log(`  - 测试版本: ${allReports.length} 个`);
  } catch (error) {
    console.error("\n❌ 生成报告失败:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
