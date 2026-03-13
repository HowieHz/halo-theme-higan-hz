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
    throw new Error(`无法读取报告文件 ${path}: ${error.message}`, { cause: error });
  }
}

/**
 * 格式化大小变化
 * @param {number} change - 变化量（KB）
 * @param {number} baseValue - 基准值（KB）
 * @returns {string} 格式化的字符串，如 "+12.34(+5.67%)" 或 "-12.34(-5.67%)"
 */
function formatChange(change, baseValue) {
  if (change === 0) return "0.000(0.00%)";

  const sign = change > 0 ? "+" : "";
  const percent = baseValue > 0 ? (change / baseValue) * 100 : 0;
  return `${sign}${change.toFixed(3)}(${sign}${percent.toFixed(2)}%)`;
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
 * 生成表格的通用函数
 */
function generateTable(title, data, typeOrder, typeLabels, isCollapsed = false) {
  let content = ``;

  // 表格标题和说明
  content += `Unit: KiB, Format: transfer size (compressed)/resource size\n\n`;

  // 生成表头
  content += `| Page |`;
  for (const type of typeOrder) {
    content += ` ${typeLabels[type]} |`;
  }
  content += ` Total |\n`;
  content += `|------|`;
  content += `------|`.repeat(typeOrder.length);
  content += `-------|\n`;

  // 生成数据行
  for (const row of data) {
    content += row + "\n";
  }
  content += `\n`;

  // 如果需要折叠，使用 details 标签
  if (isCollapsed) {
    return `<details>\n<summary><b>${title}</b></summary>\n\n${content}</details>\n\n`;
  } else {
    return `## ${title}\n\n${content}`;
  }
}

/**
 * 生成变化表格的通用函数
 */
function generateChangesTable(
  title,
  changes,
  typeOrder,
  typeLabels,
  columnsWithChanges,
  formatColoredChange,
  isCollapsed = false,
) {
  let content = ``;

  content += `Unit: KiB, Format: transfer size change(percent)/resource size change(percent)\n\n`;
  content += `🔴 <span style="color: red;">Red = Increase</span> | 🟢 <span style="color: green;">Green = Decrease</span>\n\n`;

  content += `| Page |`;
  for (const type of columnsWithChanges) {
    content += ` ${typeLabels[type]} |`;
  }
  content += ` Total |\n`;
  content += `|------|`;
  content += `------|`.repeat(columnsWithChanges.length);
  content += `-------|\n`;

  for (const change of changes) {
    const urlPath = change.url || "/";
    content += `| ${urlPath} |`;

    for (const type of columnsWithChanges) {
      const { transferChange, resourceChange, baseTransfer, baseResource } = change.types[type];
      content += ` ${formatColoredChange(transferChange, resourceChange, baseTransfer, baseResource)} |`;
    }

    const { transferChange, resourceChange, baseTransfer, baseResource } = change.types.total;
    content += ` **${formatColoredChange(transferChange, resourceChange, baseTransfer, baseResource)}** |\n`;
  }
  content += `\n`;

  if (isCollapsed) {
    return `<details>\n<summary><b>${title}</b></summary>\n\n${content}</details>\n\n`;
  } else {
    return `## ${title}\n\n${content}`;
  }
}

/**
 * 生成比较报告
 */
function generateComparisonReport(currentReport, baseReport) {
  let markdown = ``;

  // 添加测试环境信息
  markdown += `**Test Environment:**\n`;
  if (currentReport.metadata?.haloVersion) {
    markdown += `- Halo CMS Version: ${currentReport.metadata.haloVersion}\n`;
  }
  if (currentReport.metadata?.javaVersion) {
    markdown += `- Java Version: ${currentReport.metadata.javaVersion}\n`;
  }

  // Current 分支的 theme version
  if (currentReport.metadata?.themeVersion) {
    const themeVersion = currentReport.metadata.themeVersion;
    // 如果是 commit hash，添加链接
    if (themeVersion.match(/^[0-9a-f]{40}$/i)) {
      markdown += `- Current Theme Version: [\`${themeVersion.substring(0, 7)}\`](https://github.com/HowieHz/halo-theme-higan-hz/commit/${themeVersion})\n`;
    } else {
      markdown += `- Current Theme Version: ${themeVersion}\n`;
    }
  }

  // Base 分支的 theme version
  if (baseReport.metadata?.themeVersion) {
    const baseThemeVersion = baseReport.metadata.themeVersion;
    // 如果是 commit hash，添加链接
    if (baseThemeVersion.match(/^[0-9a-f]{40}$/i)) {
      markdown += `- Base Theme Version: [\`${baseThemeVersion.substring(0, 7)}\`](https://github.com/HowieHz/halo-theme-higan-hz/commit/${baseThemeVersion})\n`;
    } else {
      markdown += `- Base Theme Version: ${baseThemeVersion}\n`;
    }
  }

  if (currentReport.metadata?.lhciVersion) {
    markdown += `- Lighthouse CI Version: ${currentReport.metadata.lhciVersion}\n`;
  }
  markdown += `\n`;

  markdown += `# Page Size Comparison Report\n\n`;
  markdown += `Comparing **current** branch with **base** branch\n\n`;

  if (currentReport.metadata?.generatedAt) {
    markdown += `- Generated At: ${new Date(currentReport.metadata.generatedAt).toISOString()}\n`;
  }

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

  // 准备所有资源当前值数据
  const allResourcesCurrentData = [];
  for (const currentResult of currentReport.results) {
    const urlPath = currentResult.url || "/";
    let row = `| ${urlPath} |`;

    for (const type of typeOrder) {
      const transfer = (currentResult.resources[type]?.transferSize || 0) / 1024;
      const resource = (currentResult.resources[type]?.resourceSize || 0) / 1024;
      row += ` ${transfer.toFixed(3)}/${resource.toFixed(3)} |`;
    }

    const totalTransfer = (currentResult.resources.total?.transferSize || 0) / 1024;
    const totalResource = (currentResult.resources.total?.resourceSize || 0) / 1024;
    row += ` **${totalTransfer.toFixed(3)}/${totalResource.toFixed(3)}**`;

    allResourcesCurrentData.push(row);
  }

  // 准备主题资源当前值数据
  const themeResourcesCurrentData = [];
  for (const currentResult of currentReport.results) {
    const urlPath = currentResult.url || "/";
    let row = `| ${urlPath} |`;

    // 防御性检查：如果 themeResources 不存在（旧版本报告），使用空对象
    const themeResources = currentResult.themeResources || {};

    for (const type of typeOrder) {
      const transfer = (themeResources[type]?.transferSize || 0) / 1024;
      const resource = (themeResources[type]?.resourceSize || 0) / 1024;
      row += ` ${transfer.toFixed(3)}/${resource.toFixed(3)} |`;
    }

    const totalTransfer = (themeResources.total?.transferSize || 0) / 1024;
    const totalResource = (themeResources.total?.resourceSize || 0) / 1024;
    row += ` **${totalTransfer.toFixed(3)}/${totalResource.toFixed(3)}**`;

    themeResourcesCurrentData.push(row);
  }

  // 计算所有资源变化
  const allChanges = [];
  for (const currentResult of currentReport.results) {
    const baseResult = baseReport.results.find((r) => r.url === currentResult.url);
    if (!baseResult) continue;

    let pageHasChanges = false;
    const pageChanges = {
      url: currentResult.url,
      types: {},
      total: {},
    };

    for (const type of [...typeOrder, "total"]) {
      const currentTransfer = (currentResult.resources[type]?.transferSize || 0) / 1024;
      const currentResource = (currentResult.resources[type]?.resourceSize || 0) / 1024;
      const baseTransfer = (baseResult.resources[type]?.transferSize || 0) / 1024;
      const baseResource = (baseResult.resources[type]?.resourceSize || 0) / 1024;

      const transferChange = currentTransfer - baseTransfer;
      const resourceChange = currentResource - baseResource;

      if (transferChange !== 0 || resourceChange !== 0) {
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
      allChanges.push(pageChanges);
    }
  }

  // 计算主题资源变化
  const themeChanges = [];
  for (const currentResult of currentReport.results) {
    const baseResult = baseReport.results.find((r) => r.url === currentResult.url);
    if (!baseResult) continue;

    let pageHasThemeChanges = false;
    const pageThemeChanges = {
      url: currentResult.url,
      types: {},
      total: {},
    };

    // 防御性检查：如果 themeResources 不存在（旧版本报告），使用空对象
    const currentThemeResources = currentResult.themeResources || {};
    const baseThemeResources = baseResult.themeResources || {};

    for (const type of [...typeOrder, "total"]) {
      const currentTransfer = (currentThemeResources[type]?.transferSize || 0) / 1024;
      const currentResource = (currentThemeResources[type]?.resourceSize || 0) / 1024;
      const baseTransfer = (baseThemeResources[type]?.transferSize || 0) / 1024;
      const baseResource = (baseThemeResources[type]?.resourceSize || 0) / 1024;

      const transferChange = currentTransfer - baseTransfer;
      const resourceChange = currentResource - baseResource;

      if (transferChange !== 0 || resourceChange !== 0) {
        pageHasThemeChanges = true;
      }

      pageThemeChanges.types[type] = {
        transferChange,
        resourceChange,
        baseTransfer,
        baseResource,
      };
    }

    if (pageHasThemeChanges) {
      themeChanges.push(pageThemeChanges);
    }
  }

  // 准备变化表格的列
  const allColumnsWithChanges = [];
  for (const type of typeOrder) {
    const hasAnyChange = allChanges.some((change) => {
      const { transferChange, resourceChange } = change.types[type];
      return transferChange !== 0 || resourceChange !== 0;
    });
    if (hasAnyChange) {
      allColumnsWithChanges.push(type);
    }
  }

  const themeColumnsWithChanges = [];
  for (const type of typeOrder) {
    const hasAnyChange = themeChanges.some((change) => {
      const { transferChange, resourceChange } = change.types[type];
      return transferChange !== 0 || resourceChange !== 0;
    });
    if (hasAnyChange) {
      themeColumnsWithChanges.push(type);
    }
  }

  // 按新顺序输出表格
  // 1. Theme Resources - Changes（展开）
  if (themeChanges.length > 0) {
    markdown += generateChangesTable(
      "Theme Resources - Changes",
      themeChanges,
      typeOrder,
      typeLabels,
      themeColumnsWithChanges,
      formatColoredChange,
      false, // 不折叠
    );
  }

  // 2. All Resources - Changes（折叠）
  if (allChanges.length > 0) {
    markdown += generateChangesTable(
      "All Resources - Changes",
      allChanges,
      typeOrder,
      typeLabels,
      allColumnsWithChanges,
      formatColoredChange,
      true, // 折叠
    );
  }

  // 3. Theme Resources - Current Size（折叠）
  markdown += generateTable(
    "Theme Resources - Current Size",
    themeResourcesCurrentData,
    typeOrder,
    typeLabels,
    true, // 折叠
  );

  // 4. All Resources - Current Size（折叠）
  markdown += generateTable(
    "All Resources - Current Size",
    allResourcesCurrentData,
    typeOrder,
    typeLabels,
    true, // 折叠
  );

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
