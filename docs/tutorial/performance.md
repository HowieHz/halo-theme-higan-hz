---
outline: deep
---

# 性能优化

::: tip

如问题仍未解决，可前往 [GitHub Issues](https://github.com/HowieHz/halo-theme-higan-hz/issues) 搜索或提交新的反馈，或加入 QQ 群 `694413711` 获取社区支持。

随时欢迎您为本教程添砖加瓦。

:::

## 使用预先压缩的资源文件

主题的静态资源已提供预先压缩版本，以节省服务器内存和带宽。

- 进行了预压缩的文件类型：
  - `.js`：`.js.gz`、`.js.br`、`.js.zst`
  - `.css`：`.css.gz`、`.css.br`、`.css.zst`
- 对应算法与压缩等级：
  - `.*.gz` — gzip（压缩等级 9，最高）
  - `.*.br` — brotli（压缩等级 11，最高）
  - `.*.zst` — zstandard（压缩等级 21，已使用最大值减 1，以避免构建时内存不足）

感谢 [nonzzz/vite-plugin-compression](https://github.com/nonzzz/vite-plugin-compression) 创建的插件。

### 配置服务器以自动提供预先压缩的静态资源

- 直接使用 Halo CMS 时，服务器会自动提供 `.br` 文件。
- 使用 Nginx 服务器请参考：[在 Nginx 上使用](#在-nginx-上使用)。
- 使用 Apache 服务器请参考：[在 Apache 上使用](#在-apache-上使用)。

#### 在 Nginx 上使用

```nginx
http {
    # 启用 gzip_static 模块以提供预压缩的 .gz 文件
    gzip_static on;

    # 启用 brotli_static 以提供预压缩的 .br 文件
    # 需要 ngx_brotli 模块: https://github.com/google/ngx_brotli
    brotli_static on;

    # 启用 zstd_static 以提供预压缩的 .zst 文件
    # 需要 zstd-nginx-module 模块: https://github.com/tokers/zstd-nginx-module
    zstd_static on;

    # 如果找不到静态文件则回退到动态压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    server {
        listen 80;
        server_name example.com;
        root /var/www/html;

        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

#### 在 Apache 上使用

```apache
# 启用 mod_deflate 以实现回退动态压缩
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# 提供预压缩文件
<IfModule mod_rewrite.c>
    RewriteEngine On

    # 如果存在 .zst 文件且客户端支持 zstd，则提供该文件
    RewriteCond %{HTTP:Accept-Encoding} zstd
    RewriteCond %{REQUEST_FILENAME}.zst -f
    RewriteRule ^(.*)$ $1.zst [L]

    # 如果存在 .br 文件且客户端支持 brotli，则提供该文件
    RewriteCond %{HTTP:Accept-Encoding} br
    RewriteCond %{REQUEST_FILENAME}.br -f
    RewriteRule ^(.*)$ $1.br [L]

    # 如果存在 .gz 文件且客户端支持 gzip，则提供该文件
    RewriteCond %{HTTP:Accept-Encoding} gzip
    RewriteCond %{REQUEST_FILENAME}.gz -f
    RewriteRule ^(.*)$ $1.gz [L]
</IfModule>

# 设置正确的 content-type 和 encoding headers
<FilesMatch "\.js\.gz$">
    Header set Content-Type "application/javascript"
    Header set Content-Encoding "gzip"
</FilesMatch>

<FilesMatch "\.css\.gz$">
    Header set Content-Type "text/css"
    Header set Content-Encoding "gzip"
</FilesMatch>

<FilesMatch "\.js\.br$">
    Header set Content-Type "application/javascript"
    Header set Content-Encoding "br"
</FilesMatch>

<FilesMatch "\.css\.br$">
    Header set Content-Type "text/css"
    Header set Content-Encoding "br"
</FilesMatch>

<FilesMatch "\.js\.zst$">
    Header set Content-Type "application/javascript"
    Header set Content-Encoding "zstd"
</FilesMatch>

<FilesMatch "\.css\.zst$">
    Header set Content-Type "text/css"
    Header set Content-Encoding "zstd"
</FilesMatch>
```

## 其他注意事项

本主题已尽量分包，减少外部依赖，降低单页资源大小。在使用过程中请注意以下几点：

1. 请尽量不要引用特别慢的资源：比如体积巨大的图片，访问不通畅的公共 CDN 资源。
2. 请尽量部署 CDN：个人站点带宽所限、机器性能所限，使用 CDN 为静态资源能显著提升加载速度。
3. 使用现代图片格式：如 `WebP`、`AVIF`，能在保有同等图像质量的前提下，减小图片体积。
4. 使用现代字体格式：若采用自定义字体，优先使用 `woff2`，相比 `woff` 或 `ttf` 可显著减小体积并提升加载性能。本主题支持外部字体分包配置，实现按需加载；可使用[在线字体分包器](https://chinese-font.netlify.app/zh-cn/online-split/)进行处理。
