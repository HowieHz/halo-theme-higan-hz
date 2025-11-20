/**
 * 生成页面体积评估报告
 * 解析 Lighthouse 结果并生成可读的报告
 */

import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

const LIGHTHOUSE_RESULTS_DIR = process.env.LIGHTHOUSE_RESULTS_DIR || '.lighthouseci';
const OUTPUT_DIR = process.env.OUTPUT_DIR || './reports';

/**
 * 格式化字节大小
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}

/**
 * 解析 Lighthouse 结果
 */
async function parseLighthouseResults() {
  const manifestPath = resolve(LIGHTHOUSE_RESULTS_DIR, 'manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf-8'));
  
  const results = [];
  
  for (const entry of manifest) {
    const reportPath = resolve(LIGHTHOUSE_RESULTS_DIR, entry.jsonPath);
    const report = JSON.parse(await readFile(reportPath, 'utf-8'));
    
    const resourceSummary = report.audits['resource-summary'];
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
  markdown += `生成时间: ${new Date().toISOString()}\n\n`;
  markdown += `## 性能预算\n\n`;
  markdown += `- JS 体积: < 200 KB\n`;
  markdown += `- CSS 体积: < 100 KB\n`;
  markdown += `- 字体体积: < 100 KB\n`;
  markdown += `- HTML 大小: < 50 KB\n`;
  markdown += `- 总体积: < 500 KB\n\n`;
  
  for (const result of results) {
    const urlPath = new URL(result.url).pathname || '/';
    markdown += `## 页面: ${urlPath}\n\n`;
    
    // JS
    const scriptKB = (result.script / 1024).toFixed(2);
    const scriptStatus = result.script <= 204800 ? '✅' : '❌';
    markdown += `- ${scriptStatus} **JS 体积**: ${scriptKB} KB / 200 KB`;
    if (result.script > 204800) {
      const over = ((result.script - 204800) / 1024).toFixed(2);
      markdown += ` (超出 ${over} KB)`;
    }
    markdown += '\n';
    
    // CSS
    const stylesheetKB = (result.stylesheet / 1024).toFixed(2);
    const stylesheetStatus = result.stylesheet <= 102400 ? '✅' : '❌';
    markdown += `- ${stylesheetStatus} **CSS 体积**: ${stylesheetKB} KB / 100 KB`;
    if (result.stylesheet > 102400) {
      const over = ((result.stylesheet - 102400) / 1024).toFixed(2);
      markdown += ` (超出 ${over} KB)`;
    }
    markdown += '\n';
    
    // Font
    const fontKB = (result.font / 1024).toFixed(2);
    const fontStatus = result.font <= 102400 ? '✅' : '❌';
    markdown += `- ${fontStatus} **字体体积**: ${fontKB} KB / 100 KB`;
    if (result.font > 102400) {
      const over = ((result.font - 102400) / 1024).toFixed(2);
      markdown += ` (超出 ${over} KB)`;
    }
    markdown += '\n';
    
    // Document
    const documentKB = (result.document / 1024).toFixed(2);
    const documentStatus = result.document <= 51200 ? '✅' : '⚠️';
    markdown += `- ${documentStatus} **HTML 大小**: ${documentKB} KB / 50 KB\n`;
    
    // Image
    if (result.image > 0) {
      const imageKB = (result.image / 1024).toFixed(2);
      markdown += `- ℹ️ **图片体积**: ${imageKB} KB\n`;
    }
    
    // Total
    const totalKB = (result.total / 1024).toFixed(2);
    const totalStatus = result.total <= 512000 ? '✅' : '❌';
    markdown += `- ${totalStatus} **总体积**: ${totalKB} KB / 500 KB`;
    if (result.total > 512000) {
      const over = ((result.total - 512000) / 1024).toFixed(2);
      markdown += ` (超出 ${over} KB)`;
    }
    markdown += '\n\n';
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
    markdown += `- 字体: ${(avgFont / 1024).toFixed(2)} KB\n`;
    markdown += `- 总体积: ${(avgTotal / 1024).toFixed(2)} KB\n\n`;
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
    2
  );
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('解析 Lighthouse 结果...');
    const results = await parseLighthouseResults();
    
    const version = process.env.RELEASE_VERSION || '未知版本';
    
    console.log('生成 Markdown 报告...');
    const markdownReport = generateMarkdownReport(results, version);
    await writeFile(resolve(OUTPUT_DIR, 'page-size-report.md'), markdownReport);
    
    console.log('生成 JSON 报告...');
    const jsonReport = generateJsonReport(results, version);
    await writeFile(resolve(OUTPUT_DIR, 'page-size-report.json'), jsonReport);
    
    console.log('\n✓ 报告生成完成！');
    console.log(`  - Markdown: ${resolve(OUTPUT_DIR, 'page-size-report.md')}`);
    console.log(`  - JSON: ${resolve(OUTPUT_DIR, 'page-size-report.json')}`);
    
    // 输出到控制台
    console.log('\n' + markdownReport);
    
  } catch (error) {
    console.error('❌ 生成报告失败:', error.message);
    process.exit(1);
  }
}

main();
