---
outline: deep
---

# 性能优化

::: tip

如问题仍未解决，可前往 [GitHub Issues](https://github.com/HowieHz/halo-theme-higan-hz/issues) 搜索或提交新的反馈，或加入 QQ 群 `694413711` 获取社区支持。

随时欢迎您为本教程添砖加瓦。

:::

## 使用预先压缩的资源文件

主题发布包分为两类：

- 默认安装包：
  - 文件名：`howiehz-higan-zh-hans.zip`、`howiehz-higan-en.zip`
  - 包含：当前实际构建产物中的 `.br` 预压缩文件，主要是 `.js`、`.css`、`.ttf`、`.ico`。例如 `.js` 对应 `.js.br`
  - 适用：Halo CMS 2.24+ 直连
- 完整预压缩包：
  - 文件名：`howiehz-higan-zh-hans-full-precompressed.zip`、`howiehz-higan-en-full-precompressed.zip`
  - 包含：当前实际构建产物中的 `.gz` / `.br` / `.zst` 预压缩文件，主要是 `.js`、`.css`、`.ttf`、`.ico`。例如 `.js` 对应 `.js.gz`、`.js.br`、`.js.zst`
  - 适用：nginx、Apache、CDN、对象存储或其他自管静态资源服务器
- 压缩等级：
  - `*.gz` — gzip（压缩等级 9，最高）
  - `*.br` — brotli（压缩等级 11，最高）
  - `*.zst` — zstandard（压缩等级 19）

说明：

- HTTP `zstd` 的 `Window_Size` 上限为 8 MB，因此这里使用压缩等级 19。相关说明见 [RFC 9659 第 3 节][rfc9659-section-3] 与 [RFC 9659 第 5.1 节][rfc9659-section-5-1]。
- Halo CMS 2.24+ 在同时存在 `.br` 与 `.gz` 时会优先返回 `.gz`，所以默认安装包只保留 `.br`。
- 当前 Halo CMS 一旦以某种预压缩文件提供过资源（例如 `.br`），就会一直沿用该方式直到重启。若之后删除了该文件，不会自动切换到其他方式，可能直接返回 `500 Internal Server Error`。如果你在不同安装包之间切换后遇到这类错误，请重启 Halo CMS。
- Halo CMS 不会自动提供 `.zst`，如需使用 `.gz` / `.zst`，请使用完整预压缩包并通过反向代理或自管静态资源服务器提供。

[rfc9659-section-3]: https://www.rfc-editor.org/rfc/rfc9659.html#section-3
[rfc9659-section-5-1]: https://www.rfc-editor.org/rfc/rfc9659.html#section-5.1

感谢 [nonzzz/vite-plugin-compression](https://github.com/nonzzz/vite-plugin-compression) 创建的插件。

### 配置服务器以自动提供预先压缩的静态资源

- 直接使用 Halo CMS 时，建议使用默认安装包。
- 使用完整预压缩包并搭配 nginx / Apache / CDN 时，可按客户端支持情况使用预压缩文件。
- 使用 nginx 服务器请参考：[在 nginx 上使用](#nginx-full-precompressed)。
- 使用 Apache 服务器请参考：[在 Apache 上使用](#apache-full-precompressed)。

#### 在 nginx 上使用（完整预压缩安装包） {#nginx-full-precompressed}

<!-- markdownlint-disable MD013 -->

```nginx
http {
    # 启用 gzip_static 模块以提供预压缩的 .gz 文件
    gzip_static on;

    # 如果找不到静态文件则回退到动态 gzip 压缩
    gzip on;
    gzip_types application/atom+xml application/javascript application/json application/vnd.api+json application/rss+xml application/vnd.ms-fontobject application/x-font-opentype application/x-font-truetype application/x-font-ttf application/x-javascript application/xhtml+xml application/xml font/eot font/opentype font/otf font/truetype image/svg+xml image/vnd.microsoft.icon image/x-icon image/x-win-bitmap text/css text/javascript text/plain text/xml;

    # 启用 brotli_static 以提供预压缩的 .br 文件
    # 需要 ngx_brotli 模块: https://github.com/google/ngx_brotli
    brotli_static on;

    # 如果找不到静态文件则回退到动态 Brotli 压缩
    brotli on;
    brotli_types application/atom+xml application/javascript application/json application/vnd.api+json application/rss+xml application/vnd.ms-fontobject application/x-font-opentype application/x-font-truetype application/x-font-ttf application/x-javascript application/xhtml+xml application/xml font/eot font/opentype font/otf font/truetype image/svg+xml image/vnd.microsoft.icon image/x-icon image/x-win-bitmap text/css text/javascript text/plain text/xml;

    # 启用 zstd_static 以提供预压缩的 .zst 文件
    # 需要 zstd-nginx-module 模块: https://github.com/tokers/zstd-nginx-module
    zstd_static on;

    # 如果找不到静态文件则回退到动态 zstd 压缩
    zstd on;
    zstd_types application/atom+xml application/javascript application/json application/vnd.api+json application/rss+xml application/vnd.ms-fontobject application/x-font-opentype application/x-font-truetype application/x-font-ttf application/x-javascript application/xhtml+xml application/xml font/eot font/opentype font/otf font/truetype image/svg+xml image/vnd.microsoft.icon image/x-icon image/x-win-bitmap text/css text/javascript text/plain text/xml;

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

<!-- markdownlint-enable MD013 -->

#### 在 Apache 上使用（完整预压缩安装包） {#apache-full-precompressed}

<!-- markdownlint-disable MD013 -->

```apache
# 启用 mod_deflate 以实现回退动态压缩
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE application/atom+xml application/javascript application/json application/vnd.api+json application/rss+xml application/vnd.ms-fontobject application/x-font-opentype application/x-font-truetype application/x-font-ttf application/x-javascript application/xhtml+xml application/xml font/eot font/opentype font/otf font/truetype image/svg+xml image/vnd.microsoft.icon image/x-icon image/x-win-bitmap text/css text/javascript text/plain text/xml
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

<FilesMatch "\.js\.br$">
    Header set Content-Type "application/javascript"
    Header set Content-Encoding "br"
</FilesMatch>

<FilesMatch "\.js\.zst$">
    Header set Content-Type "application/javascript"
    Header set Content-Encoding "zstd"
</FilesMatch>

<FilesMatch "\.css\.gz$">
    Header set Content-Type "text/css"
    Header set Content-Encoding "gzip"
</FilesMatch>

<FilesMatch "\.css\.br$">
    Header set Content-Type "text/css"
    Header set Content-Encoding "br"
</FilesMatch>

<FilesMatch "\.css\.zst$">
    Header set Content-Type "text/css"
    Header set Content-Encoding "zstd"
</FilesMatch>

<FilesMatch "\.ttf\.gz$">
    Header set Content-Type "font/ttf"
    Header set Content-Encoding "gzip"
</FilesMatch>

<FilesMatch "\.ttf\.br$">
    Header set Content-Type "font/ttf"
    Header set Content-Encoding "br"
</FilesMatch>

<FilesMatch "\.ttf\.zst$">
    Header set Content-Type "font/ttf"
    Header set Content-Encoding "zstd"
</FilesMatch>

<FilesMatch "\.ico\.gz$">
    Header set Content-Type "image/x-icon"
    Header set Content-Encoding "gzip"
</FilesMatch>

<FilesMatch "\.ico\.br$">
    Header set Content-Type "image/x-icon"
    Header set Content-Encoding "br"
</FilesMatch>

<FilesMatch "\.ico\.zst$">
    Header set Content-Type "image/x-icon"
    Header set Content-Encoding "zstd"
</FilesMatch>
```

<!-- markdownlint-enable MD013 -->

## 其他注意事项

本主题已尽量分包，减少外部依赖，降低单页资源大小。在使用过程中请注意以下几点：

1. 请尽量不要引用特别慢的资源：比如体积巨大的图片，访问不通畅的公共 CDN 资源。
2. 请尽量部署 CDN：个人站点带宽所限、机器性能所限，使用 CDN 为静态资源能显著提升加载速度。
3. 使用现代图片格式：如 `WebP`、`AVIF`，能在保有同等图像质量的前提下，减小图片体积。
4. 使用现代字体格式：若采用自定义字体，优先使用 `woff2`，相比 `woff` 或 `ttf` 可显著减小体积并提升加载性能。本主题支持外部字体分包配置，实现按需加载；可使用[在线字体分包器](https://chinese-font.netlify.app/zh-cn/online-split/)进行处理。
