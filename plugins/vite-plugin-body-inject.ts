import type { Plugin, IndexHtmlTransformHook } from 'vite';

/**
 * 插件选项接口
 */
interface BodyInjectOptions {
  /** 插入到<body>标签之前的内容 */
  beforeBodyOpen?: string;
  /** 插入到<body>标签之后的内容 */
  afterBodyOpen?: string;
  /** 插入到</body>标签之前的内容 */
  beforeBodyClose?: string;
  /** 插入到</body>标签之后的内容 */
  afterBodyClose?: string;
}

/**
 * 在 body 标签周围注入内容的插件
 * @param options 插件配置选项
 * @returns Vite 插件
 */
export default function bodyInjectPlugin(options: BodyInjectOptions = {}): Plugin {
  const {
    beforeBodyOpen = '',
    afterBodyOpen = '',
    beforeBodyClose = '',
    afterBodyClose = ''
  } = options;
  
  const transformHook: IndexHtmlTransformHook = (html) => {
    // 检查是否有<body>标签
    if (!html.includes('<body') || !html.includes('</body>')) {
      console.warn('[vite-plugin-body-inject] No <body> tag found in HTML');
      return html;
    }
    
    // 四个位置的注入，按顺序执行以避免干扰
    let result = html;
    
    // 1. 在<body>标签前插入
    if (beforeBodyOpen) {
      result = result.replace(/(<body[^>]*>)/i, `${beforeBodyOpen}$1`);
    }
    
    // 2. 在<body>标签后插入
    if (afterBodyOpen) {
      result = result.replace(/(<body[^>]*>)/i, `$1${afterBodyOpen}`);
    }
    
    // 3. 在</body>标签前插入
    if (beforeBodyClose) {
      result = result.replace(/<\/body>/i, `${beforeBodyClose}</body>`);
    }
    
    // 4. 在</body>标签后插入
    if (afterBodyClose) {
      result = result.replace(/<\/body>/i, `</body>${afterBodyClose}`);
    }
    
    return result;
  };
  
  return {
    name: 'vite-plugin-body-inject',
    enforce: 'post',
    transformIndexHtml: {
      // 'post' 确保在其他插件处理后执行，这样我们可以捕获所有 body 内容
      order: 'post',
      handler: transformHook
    }
  };
}