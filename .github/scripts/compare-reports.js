/**
 * 比较两个页面体积报告并生成差异报告
 * 用于 PR 中比较当前版本与 base 版本的差异
 */

import { readFile, writeFile } from "fs/promises";

const CURRENT_REPORT = process.env.CURRENT_REPORT || "./reports-current/page-size-report.json";
const BASE_REPORT = process.env.BASE_REPORT || "./reports-base/page-size-report.json";
const OUTPUT_FILE = process.env.OUTPUT_FILE || "./comparison-report.md";

/**
 * 读取 JSON 报告
 */
async function readReport(path) {
  try {
    const content = await readFile(path, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`无法读取报告文件 ${path}: ${error.message}`);
  }
}

/**
 * 格式化大小变化
 * @param {number} change - 变化量（KB）
 * @param {number} baseValue - 基准值（KB）
 * @returns {string} 格式化的字符串，如 "+12.34(+5.67%)" 或 "-12.34(-5.67%)"
 */
function formatChange(change, baseValue) {
  if (change === 0) return "0.00(0.00%)";

  const sign = change > 0 ? "+" : "";
  const percent = baseValue > 0 ? (change / baseValue) * 100 : 0;
  return `${sign}${change.toFixed(2)}(${sign}${percent.toFixed(2)}%)`;
}

/**
 * 为变化添加颜色标记
 * @param {number} transferChange - transfer size 变化
 * @param {number} resourceChange - resource size 变化
 * @param {number} baseTransfer - base transfer size
 * @param {number} baseResource - base resource size
 * @returns {string} 带颜色标记的字符串
 */
function formatColoredChange(transferChange, resourceChange, baseTransfer, baseResource) {
  // 如果两个值都没有变化，用 - 表示省略
  if (transferChange === 0 && resourceChange === 0) {
    return "-";
  }
  
  const transferStr = formatChange(transferChange, baseTransfer);
  const resourceStr = formatChange(resourceChange, baseResource);

  // 为 transfer size 添加颜色和 emoji
  let coloredTransfer = transferStr;
  if (transferChange > 0) {
    coloredTransfer = `🔴 <span style="color: red;">${transferStr}</span>`;
  } else if (transferChange < 0) {
    coloredTransfer = `🟢 <span style="color: green;">${transferStr}</span>`;
  }
  
  // 为 resource size 添加颜色和 emoji
  let coloredResource = resourceStr;
  if (resourceChange > 0) {
    coloredResource = `🔴 <span style="color: red;">${resourceStr}</span>`;
  } else if (resourceChange < 0) {
    coloredResource = `🟢 <span style="color: green;">${resourceStr}</span>`;
  }

  return `${coloredTransfer}/${coloredResource}`;
}

/**
 * 生成比较报告
 */
function generateComparisonReport(currentReport, baseReport) {
  let markdown = `# Page Size Comparison Report\n\n`;
  markdown += `Comparing **current** branch with **base** branch\n\n`;

  // 添加测试环境信息
  markdown += `**Test Environment:**\n`;
  if (currentReport.metadata?.haloVersion) {
    markdown += `- Halo CMS Version: ${currentReport.metadata.haloVersion}\n`;
  }
  if (currentReport.metadata?.generatedAt) {
    markdown += `- Generated At: ${new Date(currentReport.metadata.generatedAt).toISOString()}\n`;
  }
  markdown += `\n`;

  // 定义资源类型
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

  // 第一个表格：当前值
  markdown += `## Current Size\n\n`;
  markdown += `Unit: KB, Format: transfer size(gzipped)/resource size\n\n`;
  markdown += `| Page |`;
  for (const type of typeOrder) {
    markdown += ` ${typeLabels[type]} |`;
  }
  markdown += ` Total |\n`;
  markdown += `|------|`;
  markdown += `------|`.repeat(typeOrder.length);
  markdown += `-------|\n`;

  // 生成当前值的数据行
  for (const currentResult of currentReport.results) {
    const urlPath = new URL(currentResult.url).pathname || "/";
    markdown += `| ${urlPath} |`;

    for (const type of typeOrder) {
      const transfer = (currentResult.resources[type]?.transferSize || 0) / 1024;
      const resource = (currentResult.resources[type]?.resourceSize || 0) / 1024;
      markdown += ` ${transfer.toFixed(2)}/${resource.toFixed(2)} |`;
    }

    const totalTransfer = (currentResult.resources.total?.transferSize || 0) / 1024;
    const totalResource = (currentResult.resources.total?.resourceSize || 0) / 1024;
    markdown += ` **${totalTransfer.toFixed(2)}/${totalResource.toFixed(2)}** |\n`;
  }
  markdown += `\n`;

  // 第二个表格：变化（仅当有变化时显示）
  let hasChanges = false;
  const changes = [];

  // 计算变化
  for (const currentResult of currentReport.results) {
    const baseResult = baseReport.results.find((r) => r.url === currentResult.url);
    if (!baseResult) continue;

    let pageHasChanges = false;
    const pageChanges = {
      url: currentResult.url,
      types: {},
      total: {},
    };

    // 检查各类型的变化
    for (const type of [...typeOrder, "total"]) {
      const currentTransfer = (currentResult.resources[type]?.transferSize || 0) / 1024;
      const currentResource = (currentResult.resources[type]?.resourceSize || 0) / 1024;
      const baseTransfer = (baseResult.resources[type]?.transferSize || 0) / 1024;
      const baseResource = (baseResult.resources[type]?.resourceSize || 0) / 1024;

      const transferChange = currentTransfer - baseTransfer;
      const resourceChange = currentResource - baseResource;

      if (transferChange !== 0 || resourceChange !== 0) {
        hasChanges = true;
        pageHasChanges = true;
      }

      pageChanges.types[type] = {
        transferChange,
        resourceChange,
        baseTransfer,
        baseResource,
      };
    }

    if (pageHasChanges) {
      changes.push(pageChanges);
    }
  }

  // 如果有变化，生成变化表格
  if (hasChanges) {
    markdown += `## Changes\n\n`;
    markdown += `Unit: KB, Format: transfer size change(percent)/resource size change(percent)\n\n`;
    markdown += `🔴 <span style="color: red;">Red = Increase</span> | 🟢 <span style="color: green;">Green = Decrease</span>\n\n`;
    markdown += `| Page |`;
    for (const type of typeOrder) {
      markdown += ` ${typeLabels[type]} |`;
    }
    markdown += ` Total |\n`;
    markdown += `|------|`;
    markdown += `------|`.repeat(typeOrder.length);
    markdown += `-------|\n`;

    // 生成变化数据行
    for (const change of changes) {
      const urlPath = new URL(change.url).pathname || "/";
      markdown += `| ${urlPath} |`;

      for (const type of typeOrder) {
        const { transferChange, resourceChange, baseTransfer, baseResource } = change.types[type];
        markdown += ` ${formatColoredChange(transferChange, resourceChange, baseTransfer, baseResource)} |`;
      }

      const { transferChange, resourceChange, baseTransfer, baseResource } = change.types.total;
      markdown += ` **${formatColoredChange(transferChange, resourceChange, baseTransfer, baseResource)}** |\n`;
    }
    markdown += `\n`;
  }

  markdown += `---\n\n`;
  markdown += `*This comparison report is automatically generated*\n`;

  return markdown;
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log("读取报告文件...");
    const currentReport = await readReport(CURRENT_REPORT);
    const baseReport = await readReport(BASE_REPORT);

    console.log("生成比较报告...");
    const comparisonReport = generateComparisonReport(currentReport, baseReport);

    console.log("保存比较报告...");
    await writeFile(OUTPUT_FILE, comparisonReport);

    console.log(`\n✓ 比较报告生成完成！`);
    console.log(`  - 输出文件: ${OUTPUT_FILE}`);
    console.log(`\n${comparisonReport}`);
  } catch (error) {
    console.error("❌ 生成比较报告失败：", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
