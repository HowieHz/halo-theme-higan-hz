/**
 * 生成页面体积趋势图（Mermaid XY Chart）
 * 从 GitHub releases 的 artifacts 中提取数据并生成图表
 */

import { mkdir, writeFile } from "fs/promises";
import { resolve } from "path";
import { Octokit } from "@octokit/rest";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const START_VERSION = process.env.START_VERSION;
const END_VERSION = process.env.END_VERSION || "";
const CHART_TYPE = process.env.CHART_TYPE || "total";
const OUTPUT_FORMAT = process.env.OUTPUT_FORMAT || "markdown";
const OWNER = "HowieHz";
const REPO = "halo-theme-higan-hz";

const octokit = new Octokit({ auth: GITHUB_TOKEN });

/**
 * 获取指定版本范围内的 releases
 */
async function getReleases(startVersion, endVersion) {
  console.log(`正在获取 ${startVersion} 到 ${endVersion || "最新版本"} 之间的 releases...`);

  const { data: releases } = await octokit.rest.repos.listReleases({
    owner: OWNER,
    repo: REPO,
    per_page: 100,
  });

  // 过滤出指定范围内的版本
  const startIndex = releases.findIndex((r) => r.tag_name === startVersion);
  const endIndex = endVersion ? releases.findIndex((r) => r.tag_name === endVersion) : 0;

  if (startIndex === -1) {
    throw new Error(`找不到起始版本: ${startVersion}`);
  }
  if (endVersion && endIndex === -1) {
    throw new Error(`找不到结束版本: ${endVersion}`);
  }

  // 注意：releases 是从新到旧排序的，所以需要反转范围
  const filteredReleases = releases.slice(endIndex, startIndex + 1).reverse();

  console.log(`找到 ${filteredReleases.length} 个版本`);
  return filteredReleases;
}

/**
 * 获取 release 的 workflow runs
 */
async function getWorkflowRuns(tagName) {
  try {
    // 获取与该 tag 相关的 workflow runs
    const { data: runs } = await octokit.rest.actions.listWorkflowRunsForRepo({
      owner: OWNER,
      repo: REPO,
      event: "release",
      status: "completed",
      per_page: 100,
    });

    // 查找与这个 tag 相关的 workflow run
    const releaseRun = runs.workflow_runs.find((run) => {
      // 检查 head_branch 是否匹配 tag
      return run.head_branch === tagName || run.head_sha;
    });

    return releaseRun;
  } catch (error) {
    console.error(`获取 ${tagName} 的 workflow runs 失败:`, error.message);
    return null;
  }
}

/**
 * 下载并解析 artifact 中的报告数据
 */
async function getReportData(release) {
  try {
    console.log(`正在处理版本 ${release.tag_name}...`);

    const run = await getWorkflowRuns(release.tag_name);
    if (!run) {
      console.log(`  ⚠️  未找到 workflow run，跳过`);
      return null;
    }

    // 获取该 run 的 artifacts
    const { data: artifacts } = await octokit.rest.actions.listWorkflowRunArtifacts({
      owner: OWNER,
      repo: REPO,
      run_id: run.id,
    });

    // 查找 page-size-reports artifact
    const reportArtifact = artifacts.artifacts.find((a) => a.name === "page-size-reports");

    if (!reportArtifact) {
      console.log(`  ⚠️  未找到 page-size-reports artifact，跳过`);
      return null;
    }

    // 下载 artifact
    await octokit.rest.actions.downloadArtifact({
      owner: OWNER,
      repo: REPO,
      artifact_id: reportArtifact.id,
      archive_format: "zip",
    });

    // 解压并读取 JSON（这里需要额外处理 zip 文件）
    // 由于 GitHub API 返回的是 zip 数据，我们需要使用 AdmZip 或类似库
    // 为简化，这里假设我们可以直接从 release notes 或其他地方获取数据
    console.log(`  ✓ 找到 artifact (${reportArtifact.size_in_bytes} bytes)`);

    // 注意：实际实现中需要解压 zip 并读取 JSON
    // 这里暂时返回 null，因为需要额外的 zip 处理逻辑
    console.log(`  ⚠️  需要实现 zip 解压逻辑`);
    return null;
  } catch (error) {
    console.error(`  ❌ 处理失败:`, error.message);
    return null;
  }
}

/**
 * 从 release body 中提取数据（备用方案）
 * 如果 release notes 中包含了性能报告，可以从中提取
 */
function extractDataFromReleaseBody(release) {
  // 尝试从 release body 中提取表格数据
  const body = release.body || "";

  // 查找表格
  const tableRegex = /\| Average.*?\n.*?\*\*(\d+\.?\d*)\((\d+\.?\d*)\)\*\*.*?\*\*(\d+\.?\d*)\((\d+\.?\d*)\)\*\*/s;
  const match = body.match(tableRegex);

  if (match) {
    return {
      version: release.tag_name,
      date: new Date(release.published_at),
      js: parseFloat(match[1]),
      css: parseFloat(match[3]),
      total: null, // 需要从其他列提取
    };
  }

  return null;
}

/**
 * 生成模拟数据（用于测试）
 */
function generateMockData(releases) {
  console.log("\n⚠️  使用模拟数据生成图表（实际使用时需要实现 artifact 下载逻辑）\n");

  return releases.map((release) => ({
    version: release.tag_name,
    date: new Date(release.published_at),
    // 模拟数据：随机波动
    js: 45 + Math.random() * 10,
    css: 12 + Math.random() * 3,
    html: 8 + Math.random() * 2,
    other: 15 + Math.random() * 5,
    total: 80 + Math.random() * 20,
  }));
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

  // 根据图表类型设置标题和 y 轴
  if (chartType === "total") {
    chart += '  title "页面总体积变化趋势 (KB)"\n';
  } else if (chartType === "js-css") {
    chart += '  title "JS & CSS 体积变化趋势 (KB)"\n';
  } else if (chartType === "all-resources") {
    chart += '  title "各类资源体积变化趋势 (KB)"\n';
  }

  chart += '  x-axis "版本" [';
  chart += data.map((d) => `"${d.version}"`).join(", ");
  chart += "]\n";
  chart += '  y-axis "体积 (KB)" 0 --> 150\n';

  // 根据图表类型添加数据线
  if (chartType === "total") {
    chart += "  line [";
    chart += data.map((d) => d.total.toFixed(1)).join(", ");
    chart += "]\n";
  } else if (chartType === "js-css") {
    chart += "  line [";
    chart += data.map((d) => d.js.toFixed(1)).join(", ");
    chart += "]\n";
    chart += "  line [";
    chart += data.map((d) => d.css.toFixed(1)).join(", ");
    chart += "]\n";
  } else if (chartType === "all-resources") {
    chart += "  line [";
    chart += data.map((d) => d.js.toFixed(1)).join(", ");
    chart += "]\n";
    chart += "  line [";
    chart += data.map((d) => d.css.toFixed(1)).join(", ");
    chart += "]\n";
    chart += "  line [";
    chart += data.map((d) => d.html.toFixed(1)).join(", ");
    chart += "]\n";
    chart += "  line [";
    chart += data.map((d) => d.other.toFixed(1)).join(", ");
    chart += "]\n";
  }

  chart += "```\n";
  return chart;
}

/**
 * 生成 Markdown 报告
 */
function generateMarkdownReport(data, chartType) {
  let markdown = `# 页面体积趋势分析\n\n`;
  markdown += `**版本范围:** ${START_VERSION} → ${END_VERSION || "最新版本"}\n`;
  markdown += `**图表类型:** ${chartType}\n`;
  markdown += `**生成时间:** ${new Date().toISOString()}\n\n`;

  // 添加图表
  markdown += `## 趋势图\n\n`;
  markdown += generateMermaidChart(data, chartType);
  markdown += `\n`;

  // 添加数据表格
  markdown += `## 详细数据\n\n`;
  markdown += `| 版本 | 发布日期 | JS (KB) | CSS (KB) | HTML (KB) | 其他 (KB) | 总计 (KB) |\n`;
  markdown += `|------|---------|---------|----------|-----------|-----------|----------|\n`;

  for (const item of data) {
    markdown += `| ${item.version} `;
    markdown += `| ${item.date.toISOString().split("T")[0]} `;
    markdown += `| ${item.js.toFixed(1)} `;
    markdown += `| ${item.css.toFixed(1)} `;
    markdown += `| ${item.html.toFixed(1)} `;
    markdown += `| ${item.other.toFixed(1)} `;
    markdown += `| **${item.total.toFixed(1)}** |\n`;
  }

  // 添加统计信息
  const avgTotal = data.reduce((sum, d) => sum + d.total, 0) / data.length;
  const minTotal = Math.min(...data.map((d) => d.total));
  const maxTotal = Math.max(...data.map((d) => d.total));
  const firstTotal = data[0].total;
  const lastTotal = data[data.length - 1].total;
  const change = lastTotal - firstTotal;
  const changePercent = ((change / firstTotal) * 100).toFixed(1);

  markdown += `\n## 统计摘要\n\n`;
  markdown += `- **平均总体积:** ${avgTotal.toFixed(1)} KB\n`;
  markdown += `- **最小总体积:** ${minTotal.toFixed(1)} KB\n`;
  markdown += `- **最大总体积:** ${maxTotal.toFixed(1)} KB\n`;
  markdown += `- **体积变化:** ${change > 0 ? "+" : ""}${change.toFixed(1)} KB (${changePercent}%)\n`;

  return markdown;
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log("=== 生成页面体积趋势图 ===\n");

    // 获取 releases
    const releases = await getReleases(START_VERSION, END_VERSION);

    // 收集数据
    console.log("\n正在收集数据...");
    const data = [];

    for (const release of releases) {
      // 尝试从 artifact 获取数据
      let reportData = await getReportData(release);

      // 如果失败，尝试从 release body 提取
      if (!reportData) {
        reportData = extractDataFromReleaseBody(release);
      }

      if (reportData) {
        data.push(reportData);
      }
    }

    // 如果没有实际数据，使用模拟数据
    if (data.length === 0) {
      console.log("\n未能获取实际数据，使用模拟数据进行演示...");
      const mockData = generateMockData(releases);
      data.push(...mockData);
    }

    console.log(`\n✓ 收集到 ${data.length} 个版本的数据`);

    // 创建输出目录
    await mkdir("./charts", { recursive: true });

    // 生成图表
    if (OUTPUT_FORMAT === "markdown") {
      console.log("\n生成 Markdown 报告...");
      const markdown = generateMarkdownReport(data, CHART_TYPE);
      await writeFile(resolve("./charts", "size-chart.md"), markdown);
      console.log("✓ Markdown 报告已生成: ./charts/size-chart.md");
    } else {
      console.log("\n生成 Mermaid 图表...");
      const mermaid = generateMermaidChart(data, CHART_TYPE);
      await writeFile(resolve("./charts", "size-chart.mmd"), mermaid);
      console.log("✓ Mermaid 图表已生成: ./charts/size-chart.mmd");
    }

    console.log("\n=== 完成 ===");
  } catch (error) {
    console.error("\n❌ 生成图表失败:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
