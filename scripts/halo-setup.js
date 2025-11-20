/**
 * Halo CMS 设置和主题安装脚本
 * 用于在 GitHub Actions 中自动安装和激活主题
 */

import { readFile } from 'fs/promises';
import { resolve } from 'path';

const HALO_URL = process.env.HALO_URL || 'http://localhost:8090';
const THEME_ZIP_PATH = process.env.THEME_ZIP_PATH || '~/builds/target/howiehz-higan-cn.zip';
const THEME_NAME = 'howiehz-higan';
const MAX_RETRIES = 30;
const RETRY_DELAY = 2000;

/**
 * 等待 Halo 服务就绪
 */
async function waitForHalo() {
  console.log('等待 Halo 服务启动...');
  
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await fetch(`${HALO_URL}/actuator/health`);
      if (response.ok) {
        console.log('✓ Halo 服务已就绪');
        return true;
      }
    } catch (error) {
      // 服务还未就绪，继续等待
    }
    
    console.log(`等待中... (${i + 1}/${MAX_RETRIES})`);
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
  }
  
  throw new Error('Halo 服务启动超时');
}

/**
 * 获取认证 token
 */
async function getAuthToken() {
  // 在实际部署中，应该从环境变量或其他安全方式获取
  // 这里使用初始管理员账户
  const response = await fetch(`${HALO_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'admin',
      password: 'admin',
    }),
  });
  
  if (!response.ok) {
    throw new Error('认证失败');
  }
  
  const setCookie = response.headers.get('set-cookie');
  return setCookie;
}

/**
 * 上传并安装主题
 */
async function installTheme(authToken) {
  console.log('上传主题文件...');
  
  const themeFile = await readFile(resolve(THEME_ZIP_PATH));
  const formData = new FormData();
  formData.append('file', new Blob([themeFile]), 'theme.zip');
  
  const response = await fetch(`${HALO_URL}/apis/api.console.halo.run/v1alpha1/themes/install`, {
    method: 'POST',
    headers: {
      'Cookie': authToken,
    },
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`主题安装失败: ${response.status}`);
  }
  
  const result = await response.json();
  console.log('✓ 主题已安装:', result.metadata.name);
  return result.metadata.name;
}

/**
 * 重载主题
 */
async function reloadTheme(authToken, themeName) {
  console.log('重载主题...');
  
  const response = await fetch(
    `${HALO_URL}/apis/api.console.halo.run/v1alpha1/themes/${themeName}/reload`,
    {
      method: 'PUT',
      headers: {
        'Cookie': authToken,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`主题重载失败: ${response.status}`);
  }
  
  console.log('✓ 主题已重载');
}

/**
 * 激活主题
 */
async function activateTheme(authToken, themeName) {
  console.log('激活主题...');
  
  const response = await fetch(
    `${HALO_URL}/apis/api.console.halo.run/v1alpha1/themes/${themeName}/activation`,
    {
      method: 'PUT',
      headers: {
        'Cookie': authToken,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`主题激活失败: ${response.status}`);
  }
  
  console.log('✓ 主题已激活');
}

/**
 * 清除主题缓存
 */
async function invalidateCache(authToken, themeName) {
  console.log('清除主题缓存...');
  
  const response = await fetch(
    `${HALO_URL}/apis/api.console.halo.run/v1alpha1/themes/${themeName}/invalidate-cache`,
    {
      method: 'PUT',
      headers: {
        'Cookie': authToken,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`清除缓存失败: ${response.status}`);
  }
  
  console.log('✓ 缓存已清除');
}

/**
 * 主函数
 */
async function main() {
  try {
    // 1. 等待 Halo 就绪
    await waitForHalo();
    
    // 2. 获取认证
    const authToken = await getAuthToken();
    
    // 3. 安装主题
    const themeName = await installTheme(authToken);
    
    // 4. 重载主题
    await reloadTheme(authToken, themeName);
    
    // 5. 激活主题
    await activateTheme(authToken, themeName);
    
    // 6. 清除缓存
    await invalidateCache(authToken, themeName);
    
    console.log('\n✓ 主题安装和激活完成！');
    console.log(`主题已激活: ${themeName}`);
    console.log(`访问地址: ${HALO_URL}`);
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

main();
