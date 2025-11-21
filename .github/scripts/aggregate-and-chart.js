/**
 * 汇总多个版本的报告数据并生成趋势图
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
 */
function generateMermaidChart(data, chartType, sizeType = 'transfer') {
  const isGzipped = sizeType === 'transfer';
  const sizeLabel = isGzipped ? 'gzipped' : '原始';
  
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
  if (chartType === "total") {
    chart += `  title "页面总体积变化趋势 (KB, ${sizeLabel})"\n`;
  } else if (chartType === "script-stylesheet") {
    chart += `  title "Script & Stylesheet 体积变化趋势 (KB, ${sizeLabel})"\n`;
  } else if (chartType === "all-resources") {
    chart += `  title "各类资源体积变化趋势 (KB, ${sizeLabel})"\n`;
  }

  chart += '  x-axis "版本" [';
  chart += data.map((d) => `"${d.version}"`).join(", ");
  chart += "]\n";

  // 动态计算 y 轴最大值
  let maxValue = 0;
  if (chartType === "total") {
    maxValue = Math.max(...data.map((d) => d.resources.total[sizeType] / 1024));
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
  chart += `  y-axis "体积 (KB)" 0 --> ${yAxisMax}\n`;

  // 根据图表类型添加数据线
  if (chartType === "total") {
    chart += "  line [";
    chart += data.map((d) => (d.resources.total[sizeType] / 1024).toFixed(1)).join(", ");
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
 */
function generateMarkdownReport(data, chartType, sizeType = 'transfer') {
  const isGzipped = sizeType === 'transfer';
  const sizeLabel = isGzipped ? 'gzipped' : '原始';
  
  let markdown = `# 页面体积趋势分析 (${sizeLabel})\n\n`;
  markdown += `**版本范围:** ${START_VERSION} → ${END_VERSION}\n`;
  markdown += `**图表类型:** ${chartType}\n`;
  markdown += `**大小类型:** ${sizeLabel}\n`;
  markdown += `**生成时间:** ${new Date().toISOString()}\n`;
  markdown += `**测试版本数:** ${data.length}\n\n`;

  // 添加图表
  markdown += `## 趋势图\n\n`;
  markdown += generateMermaidChart(data, chartType, sizeType);
  markdown += `\n`;

  // 添加数据表格
  markdown += `## 详细数据\n\n`;
  markdown += `Unit: KB, Format: gzipped(original)\n\n`;
  markdown += `| 版本 | Document | Script | Stylesheet | Font | Image | Fetch | Other | Total |\n`;
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
    const avgTotal = data.reduce((sum, d) => sum + d.resources.total[sizeType], 0) / data.length;
    const minTotal = Math.min(...data.map((d) => d.resources.total[sizeType]));
    const maxTotal = Math.max(...data.map((d) => d.resources.total[sizeType]));
    const firstTotal = data[0].resources.total[sizeType];
    const lastTotal = data[data.length - 1].resources.total[sizeType];
    const change = lastTotal - firstTotal;
    const changePercent = ((change / firstTotal) * 100).toFixed(1);

    markdown += `\n## 统计摘要 (${sizeLabel})\n\n`;
    markdown += `- **平均总体积:** ${(avgTotal / 1024).toFixed(1)} KB\n`;
    markdown += `- **最小总体积:** ${(minTotal / 1024).toFixed(1)} KB\n`;
    markdown += `- **最大总体积:** ${(maxTotal / 1024).toFixed(1)} KB\n`;
    markdown += `- **体积变化:** ${change > 0 ? "+" : ""}${(change / 1024).toFixed(1)} KB (${changePercent}%)\n`;
  }

  markdown += `\n---\n\n`;
  markdown += `*此报告由 Lighthouse CI 自动生成*\n`;

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

      pageGroups[url].push({
        version,
        date: report.date,
        resources: result.resources,
      });
    }
  }

  return pageGroups;
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

  reports.sort((a, b) => a.version.localeCompare(b.version));
  console.log(`\n共加载 ${reports.length} 个版本的数据\n`);
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

  // 生成汇总图表
  const avgData = allReports.map((report) => ({
    version: report.version,
    date: report.date,
    resources: calculateAverage(report.rawResults),
  }));

  const aggregateFileName = `size-chart-aggregate-${chartType}-${sizeLabel}.md`;
  const aggregateMarkdown = generateMarkdownReport(avgData, chartType, sizeType);
  await writeFile(resolve(OUTPUT_DIR, aggregateFileName), aggregateMarkdown);
  console.log(`  ✓ 汇总图表: ${aggregateFileName}`);

  // 生成各页面单独图表
  let chartCount = 0;
  for (const [url, pageData] of Object.entries(pageGroups)) {
    const pageName = url.replace("http://localhost:8090", "").replace(/\//g, "-") || "home";
    const fileName = `size-chart-${pageName}-${chartType}-${sizeLabel}.md`;

    const pageMarkdown = generateMarkdownReport(pageData, chartType, sizeType);
    await writeFile(resolve(OUTPUT_DIR, fileName), pageMarkdown);
    chartCount++;
  }

  console.log(`  ✓ 单页图表: ${chartCount} 个`);
  return chartCount + 1;
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log("=== 汇总数据并生成趋势图 ===\n");

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
      // 生成所有三种类型的图表，每种类型生成 gzipped 和 raw 两个版本
      const types = ["total", "script-stylesheet", "all-resources"];
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
