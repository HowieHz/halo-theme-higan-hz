---
outline: deep
---

# Performance Optimization

::: info Info

This documentation is AI-generated. You can help improve it by submitting an [Issue](https://github.com/HowieHz/halo-theme-higan-hz/issues/new).

:::

::: tip

If the issue remains unresolved, visit [GitHub Issues](https://github.com/HowieHz/halo-theme-higan-hz/issues) to search or submit new feedback, or join QQ group `694413711` for community support.

Contributions to this tutorial are always welcome.

:::

## Using Pre-compressed Assets

Pre-compressed versions of the theme's static resources are provided to conserve server memory and bandwidth.

- Pre-compressed file types:
  - `.js`: `.js.gz`, `.js.br`, `.js.zst`
  - `.css`: `.css.gz`, `.css.br`, `.css.zst`
- Corresponding algorithms and compression levels:
  - `.*.gz` — gzip (compression level 9, maximum)
  - `.*.br` — brotli (compression level 11, maximum)
  - `.*.zst` — zstandard (compression level 21, set to maximum minus 1 to avoid out-of-memory errors during build)

Thanks to [nonzzz/vite-plugin-compression](https://github.com/nonzzz/vite-plugin-compression) for creating this plugin.

### Configuring the Server to Serve Pre-compressed Static Assets

- When using Halo CMS directly, the server automatically serves `.br` files.
- For nginx server configuration, refer to: [nginx Configuration](#nginx-configuration).
- For Apache server configuration, refer to: [Apache Configuration](#apache-configuration).

#### nginx Configuration

```nginx
http {
    # Enable gzip_static module to serve pre-compressed .gz files
    gzip_static on;

    # Fallback to dynamic compression if static file not found
    gzip on;
    gzip_types application/atom+xml application/javascript application/json application/vnd.api+json application/rss+xml application/vnd.ms-fontobject application/x-font-opentype application/x-font-truetype application/x-font-ttf application/x-javascript application/xhtml+xml application/xml font/eot font/opentype font/otf font/truetype image/svg+xml image/vnd.microsoft.icon image/x-icon image/x-win-bitmap text/css text/javascript text/plain text/xml;

    # Enable brotli_static to serve pre-compressed .br files
    # Requires ngx_brotli module: https://github.com/google/ngx_brotli
    brotli_static on;

    # Fallback to dynamic compression if static file not found
    brotli on;
    brotli_types application/atom+xml application/javascript application/json application/vnd.api+json application/rss+xml application/vnd.ms-fontobject application/x-font-opentype application/x-font-truetype application/x-font-ttf application/x-javascript application/xhtml+xml application/xml font/eot font/opentype font/otf font/truetype image/svg+xml image/vnd.microsoft.icon image/x-icon image/x-win-bitmap text/css text/javascript text/plain text/xml;

    # Enable zstd_static to serve pre-compressed .zst files
    # Requires zstd-nginx-module module: https://github.com/tokers/zstd-nginx-module
    zstd_static on;

    # Fallback to dynamic compression if static file not found
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

#### Apache Configuration

```apache
# Enable mod_deflate for fallback dynamic compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE application/atom+xml application/javascript application/json application/vnd.api+json application/rss+xml application/vnd.ms-fontobject application/x-font-opentype application/x-font-truetype application/x-font-ttf application/x-javascript application/xhtml+xml application/xml font/eot font/opentype font/otf font/truetype image/svg+xml image/vnd.microsoft.icon image/x-icon image/x-win-bitmap text/css text/javascript text/plain text/xml
</IfModule>

# Serve pre-compressed files
<IfModule mod_rewrite.c>
    RewriteEngine On

    # Serve .zst file if it exists and client supports zstd
    RewriteCond %{HTTP:Accept-Encoding} zstd
    RewriteCond %{REQUEST_FILENAME}.zst -f
    RewriteRule ^(.*)$ $1.zst [L]

    # Serve .br file if it exists and client supports brotli
    RewriteCond %{HTTP:Accept-Encoding} br
    RewriteCond %{REQUEST_FILENAME}.br -f
    RewriteRule ^(.*)$ $1.br [L]

    # Serve .gz file if it exists and client supports gzip
    RewriteCond %{HTTP:Accept-Encoding} gzip
    RewriteCond %{REQUEST_FILENAME}.gz -f
    RewriteRule ^(.*)$ $1.gz [L]
</IfModule>

# Set correct content-type and encoding headers
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

## Important Notes

This theme has been optimized with code splitting, reduced external dependencies, and minimized single-page resource sizes. Please note the following during use:

1. Avoid referencing extremely slow resources: such as huge images or public CDN resources with poor accessibility.
2. Deploy CDN when possible: Personal sites are limited by bandwidth and server performance. Using CDN for static resources can significantly improve loading speed.
3. Use modern image formats: such as `WebP` and `AVIF`, which can reduce image size while maintaining equivalent image quality.
4. Use modern font formats: When using custom fonts, prioritize the `woff2` format, which offers significant improvements in file size and loading performance compared to `woff` and `ttf`. This theme supports configurable font subsetting for optimal on-demand loading; consider using the [online font subsetter](https://chinese-font.netlify.app/zh-cn/online-split/) for preparation.
