/**
 * 计算多个页面的报告数据的平均值，并生成趋势图
 * 从 all-reports 目录读取各个版本的 JSON 报告，生成 Mermaid 图表
 */

import { readdir, readFile, writeFile } from "fs/promises";
import { resolve } from "path";

const REPORTS_DIR = process.env.REPORTS_DIR || "./all-reports";
const OUTPUT_DIR = process.env.OUTPUT_DIR || "./charts";
const CHART_TYPE = process.env.CHART_TYPE || "total";
const START_VERSION = process.env.START_VERSION;
const END_VERSION = process.env.END_VERSION || "最新版本";

/**
 * 计算多个页面结果的平均值
 */
function calculateAverage(results) {
  const resourceTypes = ["document", "script", "stylesheet", "font", "image", "fetch", "other", "total"];
  const avg = {};

  for (const type of resourceTypes) {
    // 注意：JSON 数据结构中是 resources[type].transferSize 和 resources[type].resourceSize
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
 * @param {string} chartType - 图表类型
 * @param {string} sizeType - 大小类型: 'transfer' (gzipped) 或 'resource' (原始)
 * @param {string} resourceType - 资源类型（用于单独资源图表）
 */
function generateMermaidChart(data, chartType, sizeType = 'transfer', resourceType = null) {
  const isGzipped = sizeType === 'transfer';
  const sizeLabel = isGzipped ? 'gzipped' : 'raw';
  
  let chart = "```mermaid\n";
  chart += "---\n";
  chart += "config:\n";
  chart += "  xyChart:\n";
  chart += "    width: 900\n";
  chart += "    height: 600\n";
  chart += "  themeVariables:\n";
  chart += "    xyChart:\n";
  chart += "      backgroundColor: transparent\n";
  chart += "---\n";
  chart += "xychart-beta\n";

  // 根据图表类型设置标题
  if (resourceType) {
    // 单独资源类型的图表
    const resourceLabel = resourceType.charAt(0).toUpperCase() + resourceType.slice(1);
    chart += `  title "${resourceLabel} Size Trend (KB, ${sizeLabel})"\n`;
  } else if (chartType === "script-stylesheet") {
    chart += `  title "Script & Stylesheet Size Trend (KB, ${sizeLabel})"\n`;
  } else if (chartType === "all-resources") {
    chart += `  title "All Resources Size Trend (KB, ${sizeLabel})"\n`;
  }

  chart += '  x-axis "Version" [';
  chart += data.map((d) => `"${d.version}"`).join(", ");
  chart += "]\n";

  // 动态计算 y 轴最大值
  let maxValue = 0;
  if (resourceType) {
    // 单独资源类型
    maxValue = Math.max(...data.map((d) => d.resources[resourceType][sizeType] / 1024));
  } else if (chartType === "script-stylesheet") {
    maxValue = Math.max(
      ...data.map((d) => Math.max(d.resources.script[sizeType] / 1024, d.resources.stylesheet[sizeType] / 1024)),
    );
  } else if (chartType === "all-resources") {
    const types = ["document", "script", "stylesheet", "font", "image", "fetch", "other"];
    maxValue = Math.max(...data.map((d) => Math.max(...types.map((t) => d.resources[t][sizeType] / 1024))));
  }

  // 向上取整到合适的刻度
  const yAxisMax = Math.ceil((maxValue * 1.1) / 10) * 10;
  chart += `  y-axis "Size (KB)" 0 --> ${yAxisMax}\n`;

  // 根据图表类型添加数据线
  if (resourceType) {
    // 单独资源类型
    chart += "  line [";
    chart += data.map((d) => (d.resources[resourceType][sizeType] / 1024).toFixed(1)).join(", ");
    chart += "]\n";
  } else if (chartType === "script-stylesheet") {
    chart += "  line [";
    chart += data.map((d) => (d.resources.script[sizeType] / 1024).toFixed(1)).join(", ");
    chart += "]\n";
    chart += "  line [";
    chart += data.map((d) => (d.resources.stylesheet[sizeType] / 1024).toFixed(1)).join(", ");
    chart += "]\n";
  } else if (chartType === "all-resources") {
    const types = ["document", "script", "stylesheet", "font", "image", "fetch", "other"];
    for (const type of types) {
      chart += "  line [";
      chart += data.map((d) => (d.resources[type][sizeType] / 1024).toFixed(1)).join(", ");
      chart += "]\n";
    }
  }

  chart += "```\n";
  return chart;
}

/**
 * 生成 Markdown 报告
 * @param {Array} data - 数据数组
 * @param {string} chartType - 图表类型
 * @param {string} sizeType - 大小类型: 'transfer' (gzipped) 或 'resource' (原始)
 * @param {string} resourceType - 资源类型（用于单独资源图表）
 */
function generateMarkdownReport(data, chartType, sizeType = 'transfer', resourceType = null) {
  const isGzipped = sizeType === 'transfer';
  const sizeLabel = isGzipped ? 'gzipped' : 'raw';
  
  let markdown = `# Page Size Trend Analysis (${sizeLabel})\n\n`;
  markdown += `**Version Range:** ${START_VERSION} → ${END_VERSION}  \n`;
  markdown += `**Chart Type:** ${chartType}${resourceType ? ` - ${resourceType}` : ''}  \n`;
  markdown += `**Size Type:** ${sizeLabel}  \n`;
  markdown += `**Generated At:** ${new Date().toISOString()}  \n`;
  markdown += `**Tested Versions:** ${data.length}\n\n`;

  // 添加图表
  markdown += `## Trend Chart\n\n`;
  markdown += generateMermaidChart(data, chartType, sizeType, resourceType);
  markdown += `\n`;

  // 添加数据表格
  markdown += `## Detailed Data\n\n`;
  markdown += `Unit: KB, Format: gzipped(original)\n\n`;
  markdown += `| Version | Document | Script | Stylesheet | Font | Image | Fetch | Other | Total |\n`;
  markdown += `|------|----------|--------|------------|------|-------|-------|-------|-------|\n`;

  for (const item of data) {
    markdown += `| ${item.version} `;
    markdown += `| ${(item.resources.document.transfer / 1024).toFixed(1)}(${(item.resources.document.resource / 1024).toFixed(1)}) `;
    markdown += `| ${(item.resources.script.transfer / 1024).toFixed(1)}(${(item.resources.script.resource / 1024).toFixed(1)}) `;
    markdown += `| ${(item.resources.stylesheet.transfer / 1024).toFixed(1)}(${(item.resources.stylesheet.resource / 1024).toFixed(1)}) `;
    markdown += `| ${(item.resources.font.transfer / 1024).toFixed(1)}(${(item.resources.font.resource / 1024).toFixed(1)}) `;
    markdown += `| ${(item.resources.image.transfer / 1024).toFixed(1)}(${(item.resources.image.resource / 1024).toFixed(1)}) `;
    markdown += `| ${(item.resources.fetch.transfer / 1024).toFixed(1)}(${(item.resources.fetch.resource / 1024).toFixed(1)}) `;
    markdown += `| ${(item.resources.other.transfer / 1024).toFixed(1)}(${(item.resources.other.resource / 1024).toFixed(1)}) `;
    markdown += `| **${(item.resources.total.transfer / 1024).toFixed(1)}(${(item.resources.total.resource / 1024).toFixed(1)})** |\n`;
  }

  // 添加统计信息
  if (data.length > 0) {
    const targetType = resourceType || 'total';
    const avgSize = data.reduce((sum, d) => sum + d.resources[targetType][sizeType], 0) / data.length;
    const minSize = Math.min(...data.map((d) => d.resources[targetType][sizeType]));
    const maxSize = Math.max(...data.map((d) => d.resources[targetType][sizeType]));
    const firstSize = data[0].resources[targetType][sizeType];
    const lastSize = data[data.length - 1].resources[targetType][sizeType];
    const change = lastSize - firstSize;
    const changePercent = ((change / firstSize) * 100).toFixed(1);

    const typeLabel = resourceType ? resourceType.charAt(0).toUpperCase() + resourceType.slice(1) : 'Total';
    markdown += `\n## Summary Statistics (${sizeLabel})\n\n`;
    markdown += `- **Average ${typeLabel} Size:** ${(avgSize / 1024).toFixed(1)} KB\n`;
    markdown += `- **Minimum ${typeLabel} Size:** ${(minSize / 1024).toFixed(1)} KB\n`;
    markdown += `- **Maximum ${typeLabel} Size:** ${(maxSize / 1024).toFixed(1)} KB\n`;
    markdown += `- **Size Change:** ${change > 0 ? "+" : ""}${(change / 1024).toFixed(1)} KB (${changePercent}%)\n`;
  }

  markdown += `\n---\n\n`;
  markdown += `*This report is automatically generated by Lighthouse CI*\n`;

  return markdown;
}

/**
 * 按页面分组数据
 */
function groupDataByPage(allReports) {
  const pageGroups = {};

  for (const report of allReports) {
    const version = report.version;

    // 读取原始报告获取每个页面的数据
    for (const result of report.rawResults || []) {
      const url = result.url;
      if (!pageGroups[url]) {
        pageGroups[url] = [];
      }

      // 标准化数据结构：将 transferSize/resourceSize 转换为 transfer/resource
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
 * @param {string} version - 版本号字符串，如 "v1.2.3"
 * @returns {object|null} 解析后的版本对象，如果解析失败则返回 null
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
 * @param {string} versionA - 版本 A
 * @param {string} versionB - 版本 B
 * @returns {number} 如果 A < B 返回负数，A > B 返回正数，A === B 返回 0
 */
function compareSemanticVersions(versionA, versionB) {
  const parsedA = parseSemanticVersion(versionA);
  const parsedB = parseSemanticVersion(versionB);
  
  // 如果有版本无法解析，回退到字符串比较
  if (!parsedA || !parsedB) {
    return versionA.localeCompare(versionB);
  }
  
  // 比较 major 版本
  if (parsedA.major !== parsedB.major) {
    return parsedA.major - parsedB.major;
  }
  
  // 比较 minor 版本
  if (parsedA.minor !== parsedB.minor) {
    return parsedA.minor - parsedB.minor;
  }
  
  // 比较 patch 版本
  return parsedA.patch - parsedB.patch;
}

/**
 * 从报告目录读取所有版本的完整数据（包含每个页面）
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

  // 按语义化版本排序（从旧到新）
  reports.sort((a, b) => compareSemanticVersions(a.version, b.version));
  console.log(`\n共加载 ${reports.length} 个版本的数据\n`);
  console.log(`版本顺序（按语义化版本）: ${reports.map(r => r.version).join(', ')}\n`);
  return reports;
}

/**
 * 生成指定类型和大小类型的所有图表
 * @param {Array} allReports - 所有报告数据
 * @param {Object} pageGroups - 按页面分组的数据
 * @param {string} chartType - 图表类型
 * @param {string} sizeType - 大小类型: 'transfer' (gzipped) 或 'resource' (原始)
 */
async function generateChartsForType(allReports, pageGroups, chartType, sizeType = 'transfer') {
  const sizeLabel = sizeType === 'transfer' ? 'gzipped' : 'raw';
  console.log(`\n=== 生成 ${chartType} 类型图表 (${sizeLabel}) ===`);

  let totalCharts = 0;

  // 平均值数据
  const avgData = allReports.map((report) => ({
    version: report.version,
    date: report.date,
    resources: calculateAverage(report.rawResults),
  }));

  // 1. 首先生成平均值图表（所有模式都有）
  const averageFileName = `size-chart-average-${chartType}-${sizeLabel}.md`;
  const averageMarkdown = generateMarkdownReport(avgData, chartType, sizeType);
  await writeFile(resolve(OUTPUT_DIR, averageFileName), averageMarkdown);
  console.log(`  ✓ 平均值图表: ${averageFileName}`);
  totalCharts++;

  // 2. 根据模式生成额外的单独资源图表
  if (chartType === 'all-resources') {
    // all-resources 模式：额外生成每种资源单独的图表 + total 图表
    
    // 2.1 每种资源单独的图表
    const resourceTypes = ["document", "script", "stylesheet", "font", "image", "fetch", "other"];
    for (const resourceType of resourceTypes) {
      const fileName = `size-chart--about-${chartType}-${resourceType}-${sizeLabel}.md`;
      const markdown = generateMarkdownReport(avgData, chartType, sizeType, resourceType);
      await writeFile(resolve(OUTPUT_DIR, fileName), markdown);
      console.log(`  ✓ ${resourceType} 单独图表: ${fileName}`);
      totalCharts++;
    }

    // 2.2 total 图表
    const totalFileName = `size-chart--about-${chartType}-total-${sizeLabel}.md`;
    const totalMarkdown = generateMarkdownReport(avgData, chartType, sizeType, 'total');
    await writeFile(resolve(OUTPUT_DIR, totalFileName), totalMarkdown);
    console.log(`  ✓ total 图表: ${totalFileName}`);
    totalCharts++;

  } else if (chartType === 'script-stylesheet') {
    // script-stylesheet 模式：额外生成 script 单独 + stylesheet 单独
    
    // 2.1 script 单独图表
    const scriptFileName = `size-chart--about-${chartType}-script-${sizeLabel}.md`;
    const scriptMarkdown = generateMarkdownReport(avgData, chartType, sizeType, 'script');
    await writeFile(resolve(OUTPUT_DIR, scriptFileName), scriptMarkdown);
    console.log(`  ✓ script 单独图表: ${scriptFileName}`);
    totalCharts++;

    // 2.2 stylesheet 单独图表
    const stylesheetFileName = `size-chart--about-${chartType}-stylesheet-${sizeLabel}.md`;
    const stylesheetMarkdown = generateMarkdownReport(avgData, chartType, sizeType, 'stylesheet');
    await writeFile(resolve(OUTPUT_DIR, stylesheetFileName), stylesheetMarkdown);
    console.log(`  ✓ stylesheet 单独图表: ${stylesheetFileName}`);
    totalCharts++;
  }

  // 生成各页面单独图表（保持原有逻辑，但文件名调整）
  let pageChartCount = 0;
  for (const [url, pageData] of Object.entries(pageGroups)) {
    const pageName = url.replace("http://localhost:8090", "").replace(/\//g, "-") || "home";
    const fileName = `size-chart-${pageName}-${chartType}-${sizeLabel}.md`;

    const pageMarkdown = generateMarkdownReport(pageData, chartType, sizeType);
    await writeFile(resolve(OUTPUT_DIR, fileName), pageMarkdown);
    pageChartCount++;
  }

  console.log(`  ✓ 单页图表: ${pageChartCount} 个`);
  totalCharts += pageChartCount;

  return totalCharts;
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log("=== 计算平均值并生成趋势图 ===\n");

    // 加载所有报告（包含每个页面的数据）
    const allReports = await loadAllReportsWithPages();

    if (allReports.length === 0) {
      throw new Error("没有找到任何报告数据");
    }

    // 按页面分组
    const pageGroups = groupDataByPage(allReports);

    let totalCharts = 0;

    // 判断是生成所有类型还是单一类型
    if (CHART_TYPE === "all") {
      // 生成所有类型的图表（移除 total 模式）
      const types = ["script-stylesheet", "all-resources"];
      const sizeTypes = ["transfer", "resource"];
      
      for (const type of types) {
        for (const sizeType of sizeTypes) {
          const count = await generateChartsForType(allReports, pageGroups, type, sizeType);
          totalCharts += count;
        }
      }
    } else {
      // 生成指定类型的图表，包括 gzipped 和 raw 两个版本
      const sizeTypes = ["transfer", "resource"];
      for (const sizeType of sizeTypes) {
        const count = await generateChartsForType(allReports, pageGroups, CHART_TYPE, sizeType);
        totalCharts += count;
      }
    }

    console.log("\n✓ 报告生成完成！");
    console.log(`  - 输出目录: ${OUTPUT_DIR}`);
    console.log(`  - 总计图表: ${totalCharts} 个`);
    console.log(`  - 测试版本: ${allReports.length} 个`);
    console.log(`  - 测试页面: ${Object.keys(pageGroups).length} 个`);
  } catch (error) {
    console.error("\n❌ 生成图表失败:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
