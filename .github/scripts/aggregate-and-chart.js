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
 * 从报告目录读取所有版本的数据
 */
async function loadAllReports() {
  console.log(`正在从 ${REPORTS_DIR} 读取报告...`);

  const reportDirs = await readdir(REPORTS_DIR);
  const reports = [];

  for (const dir of reportDirs) {
    // 目录名格式：report-v1.45.0
    const match = dir.match(/^report-(.+)$/);
    if (!match) continue;

    const version = match[1];
    const reportPath = resolve(REPORTS_DIR, dir, `${version}.json`);

    try {
      const content = await readFile(reportPath, "utf-8");
      const reportData = JSON.parse(content);

      // 提取第一个结果的平均数据（假设报告中包含多个页面的数据）
      if (reportData.results && reportData.results.length > 0) {
        // 计算所有页面的平均值
        const avgData = calculateAverage(reportData.results);

        reports.push({
          version,
          date: reportData.metadata?.generatedAt || new Date().toISOString(),
          resources: avgData,
        });

        console.log(`✓ 加载 ${version}`);
      }
    } catch (error) {
      console.error(`✗ 加载 ${version} 失败:`, error.message);
    }
  }

  // 按版本排序
  reports.sort((a, b) => a.version.localeCompare(b.version));

  console.log(`\n共加载 ${reports.length} 个版本的数据\n`);
  return reports;
}

/**
 * 计算多个页面结果的平均值
 */
function calculateAverage(results) {
  const resourceTypes = ["document", "script", "stylesheet", "font", "image", "fetch", "other", "total"];
  const avg = {};

  for (const type of resourceTypes) {
    const transferSum = results.reduce((sum, r) => sum + (r.resources[type]?.transferSize || 0), 0);
    const resourceSum = results.reduce((sum, r) => sum + (r.resources[type]?.resourceSize || 0), 0);

    avg[type] = {
      transfer: transferSum / results.length,
      resource: resourceSum / results.length,
    };
  }

  return avg;
}

/**
 * 生成 Mermaid XY Chart
 */
function generateMermaidChart(data, chartType) {
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
    chart += '  title "页面总体积变化趋势 (KB, gzipped)"\n';
  } else if (chartType === "script-stylesheet") {
    chart += '  title "Script & Stylesheet 体积变化趋势 (KB, gzipped)"\n';
  } else if (chartType === "all-resources") {
    chart += '  title "各类资源体积变化趋势 (KB, gzipped)"\n';
  }

  chart += '  x-axis "版本" [';
  chart += data.map((d) => `"${d.version}"`).join(", ");
  chart += "]\n";
  
  // 动态计算 y 轴最大值
  let maxValue = 0;
  if (chartType === "total") {
    maxValue = Math.max(...data.map((d) => d.resources.total.transfer / 1024));
  } else if (chartType === "script-stylesheet") {
    maxValue = Math.max(
      ...data.map((d) => Math.max(d.resources.script.transfer / 1024, d.resources.stylesheet.transfer / 1024))
    );
  } else if (chartType === "all-resources") {
    const types = ["document", "script", "stylesheet", "font", "image", "fetch", "other"];
    maxValue = Math.max(...data.map((d) => Math.max(...types.map((t) => d.resources[t].transfer / 1024))));
  }
  
  // 向上取整到合适的刻度
  const yAxisMax = Math.ceil(maxValue * 1.1 / 10) * 10;
  chart += `  y-axis "体积 (KB)" 0 --> ${yAxisMax}\n`;

  // 根据图表类型添加数据线
  if (chartType === "total") {
    chart += "  line [";
    chart += data.map((d) => (d.resources.total.transfer / 1024).toFixed(1)).join(", ");
    chart += "]\n";
  } else if (chartType === "script-stylesheet") {
    chart += "  line [";
    chart += data.map((d) => (d.resources.script.transfer / 1024).toFixed(1)).join(", ");
    chart += "]\n";
    chart += "  line [";
    chart += data.map((d) => (d.resources.stylesheet.transfer / 1024).toFixed(1)).join(", ");
    chart += "]\n";
  } else if (chartType === "all-resources") {
    const types = ["document", "script", "stylesheet", "font", "image", "fetch", "other"];
    for (const type of types) {
      chart += "  line [";
      chart += data.map((d) => (d.resources[type].transfer / 1024).toFixed(1)).join(", ");
      chart += "]\n";
    }
  }

  chart += "```\n";
  return chart;
}

/**
 * 生成 Markdown 报告
 */
function generateMarkdownReport(data, chartType) {
  let markdown = `# 页面体积趋势分析\n\n`;
  markdown += `**版本范围:** ${START_VERSION} → ${END_VERSION}\n`;
  markdown += `**图表类型:** ${chartType}\n`;
  markdown += `**生成时间:** ${new Date().toISOString()}\n`;
  markdown += `**测试版本数:** ${data.length}\n\n`;

  // 添加图表
  markdown += `## 趋势图\n\n`;
  markdown += generateMermaidChart(data, chartType);
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
    const avgTotal = data.reduce((sum, d) => sum + d.resources.total.transfer, 0) / data.length;
    const minTotal = Math.min(...data.map((d) => d.resources.total.transfer));
    const maxTotal = Math.max(...data.map((d) => d.resources.total.transfer));
    const firstTotal = data[0].resources.total.transfer;
    const lastTotal = data[data.length - 1].resources.total.transfer;
    const change = lastTotal - firstTotal;
    const changePercent = ((change / firstTotal) * 100).toFixed(1);

    markdown += `\n## 统计摘要 (gzipped)\n\n`;
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
 * 主函数
 */
async function main() {
  try {
    console.log("=== 汇总数据并生成趋势图 ===\n");

    // 加载所有报告
    const data = await loadAllReports();

    if (data.length === 0) {
      throw new Error("没有找到任何报告数据");
    }

    // 生成图表
    console.log("生成 Markdown 报告...");
    const markdown = generateMarkdownReport(data, CHART_TYPE);
    await writeFile(resolve(OUTPUT_DIR, "size-chart.md"), markdown);

    console.log("\n✓ 报告生成完成！");
    console.log(`  - 输出文件: ${resolve(OUTPUT_DIR, "size-chart.md")}`);
    console.log(`  - 包含版本: ${data.length} 个`);

    // 输出到控制台
    console.log("\n" + markdown);
  } catch (error) {
    console.error("\n❌ 生成图表失败:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
