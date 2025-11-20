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
  const manifestPath = resolve(LIGHTHOUSE_RESULTS_DIR, "manifest.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf-8"));

  const results = [];

  for (const entry of manifest) {
    const reportPath = resolve(LIGHTHOUSE_RESULTS_DIR, entry.jsonPath);
    const report = JSON.parse(await readFile(reportPath, "utf-8"));

    const resourceSummary = report.audits["resource-summary"];
    const items = resourceSummary?.details?.items || [];

    const metrics = {
      url: entry.url,
      script: 0,
      stylesheet: 0,
      font: 0,
      document: 0,
      image: 0,
      other: 0,
      total: 0,
    };

    for (const item of items) {
      const type = item.resourceType;
      const size = item.transferSize || 0;

      if (type in metrics) {
        metrics[type] = size;
      }
      metrics.total += size;
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
  markdown += `## 性能预算参考值\n\n`;
  markdown += `> 📊 以下数值仅作为参考，不会阻塞发布流程\n\n`;
  markdown += `- JS 体积参考：< 1000 KB\n`;
  markdown += `- CSS 体积参考：< 500 KB\n`;
  markdown += `- 字体体积参考：< 500 KB\n`;
  markdown += `- HTML 大小参考：< 200 KB\n`;
  markdown += `- 图片体积参考：< 1000 KB\n`;
  markdown += `- 总体积参考：< 3000 KB\n\n`;

  for (const result of results) {
    const urlPath = new URL(result.url).pathname || "/";
    markdown += `## 页面：${urlPath}\n\n`;
    
    markdown += `### 📦 资源体积详情\n\n`;
    markdown += `| 资源类型 | 实际大小 | 参考值 | 状态 |\n`;
    markdown += `|---------|---------|--------|------|\n`;

    // JS
    const scriptKB = (result.script / 1024).toFixed(2);
    const scriptRef = 1000;
    const scriptPercent = ((result.script / 1024 / scriptRef) * 100).toFixed(1);
    const scriptStatus = result.script <= scriptRef * 1024 ? "✅ 正常" : `⚠️ ${scriptPercent}%`;
    markdown += `| JavaScript | ${scriptKB} KB | ${scriptRef} KB | ${scriptStatus} |\n`;

    // CSS
    const stylesheetKB = (result.stylesheet / 1024).toFixed(2);
    const stylesheetRef = 500;
    const stylesheetPercent = ((result.stylesheet / 1024 / stylesheetRef) * 100).toFixed(1);
    const stylesheetStatus = result.stylesheet <= stylesheetRef * 1024 ? "✅ 正常" : `⚠️ ${stylesheetPercent}%`;
    markdown += `| CSS | ${stylesheetKB} KB | ${stylesheetRef} KB | ${stylesheetStatus} |\n`;

    // Font
    const fontKB = (result.font / 1024).toFixed(2);
    const fontRef = 500;
    const fontPercent = ((result.font / 1024 / fontRef) * 100).toFixed(1);
    const fontStatus = result.font <= fontRef * 1024 ? "✅ 正常" : `⚠️ ${fontPercent}%`;
    markdown += `| 字体 | ${fontKB} KB | ${fontRef} KB | ${fontStatus} |\n`;

    // Document
    const documentKB = (result.document / 1024).toFixed(2);
    const documentRef = 200;
    const documentPercent = ((result.document / 1024 / documentRef) * 100).toFixed(1);
    const documentStatus = result.document <= documentRef * 1024 ? "✅ 正常" : `ℹ️ ${documentPercent}%`;
    markdown += `| HTML | ${documentKB} KB | ${documentRef} KB | ${documentStatus} |\n`;

    // Image
    const imageKB = (result.image / 1024).toFixed(2);
    const imageRef = 1000;
    if (result.image > 0) {
      const imagePercent = ((result.image / 1024 / imageRef) * 100).toFixed(1);
      const imageStatus = result.image <= imageRef * 1024 ? "✅ 正常" : `ℹ️ ${imagePercent}%`;
      markdown += `| 图片 | ${imageKB} KB | ${imageRef} KB | ${imageStatus} |\n`;
    } else {
      markdown += `| 图片 | ${imageKB} KB | ${imageRef} KB | ✅ 无 |\n`;
    }

    // Other
    if (result.other > 0) {
      const otherKB = (result.other / 1024).toFixed(2);
      markdown += `| 其他 | ${otherKB} KB | - | ℹ️ 信息 |\n`;
    }

    // Total
    const totalKB = (result.total / 1024).toFixed(2);
    const totalRef = 3000;
    const totalPercent = ((result.total / 1024 / totalRef) * 100).toFixed(1);
    const totalStatus = result.total <= totalRef * 1024 ? "✅ 正常" : `⚠️ ${totalPercent}%`;
    markdown += `| **总计** | **${totalKB} KB** | **${totalRef} KB** | **${totalStatus}** |\n\n`;
  }

  // 平均值
  if (results.length > 0) {
    const avgTotal = results.reduce((sum, r) => sum + r.total, 0) / results.length;
    const avgScript = results.reduce((sum, r) => sum + r.script, 0) / results.length;
    const avgStylesheet = results.reduce((sum, r) => sum + r.stylesheet, 0) / results.length;
    const avgFont = results.reduce((sum, r) => sum + r.font, 0) / results.length;

    markdown += `## 平均值\n\n`;
    markdown += `- JS: ${(avgScript / 1024).toFixed(2)} KB\n`;
    markdown += `- CSS: ${(avgStylesheet / 1024).toFixed(2)} KB\n`;
    markdown += `- 字体：${(avgFont / 1024).toFixed(2)} KB\n`;
    markdown += `- 总体积：${(avgTotal / 1024).toFixed(2)} KB\n\n`;
  }

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
