# 模板文件信息

## Halo CMS 内置

### 首页

- 模板路径：/src/templates/index.html
- 访问路径：/
- 文档链接：[首页](https://docs.halo.run/developer-guide/theme/template-variables/index_)

### 文章

- 模板路径：/src/templates/post.html
- 访问路径：默认为 /archives/:slug，用户可手动更改为其他路由形式
- 文档链接：[文章](https://docs.halo.run/developer-guide/theme/template-variables/post)

### 单页面

- 模板路径：/src/templates/page.html
- 访问路径：/:slug
- 文档链接：[单页面](https://docs.halo.run/developer-guide/theme/template-variables/page)

### 文章归档

- 模板路径：/src/templates/archives.html
- 访问路径
  - /archives
  - /archives/:year
  - /archives/:year/:month
- 文档链接：[文章归档](https://docs.halo.run/developer-guide/theme/template-variables/archives)

### 文章标签集合

- 模板路径：/src/templates/tags.html
- 访问路径：/tags
- 文档链接：[文章标签集合](https://docs.halo.run/developer-guide/theme/template-variables/tags)

### 标签归档

- 模板路径：/src/templates/tag.html
- 访问路径：/tags/:slug
- 文档链接：[标签归档](https://docs.halo.run/developer-guide/theme/template-variables/tag)

### 文章分类集合

- 模板路径：/src/templates/categories.html
- 访问路径：/categories
- 文档链接：[文章分类集合](https://docs.halo.run/developer-guide/theme/template-variables/categories)

### 分类归档

- 模板路径：/src/templates/category.html
- 访问路径：/categories/:slug
- 文档链接：[分类归档](https://docs.halo.run/developer-guide/theme/template-variables/category)

### 作者归档

- 模板路径：/src/templates/author.html
- 访问路径：/authors/:name
- 文档链接：[作者归档](https://docs.halo.run/developer-guide/theme/template-variables/author)

### 认证页面

<!-- - 模板路径：
- 访问路径： -->
- 文档链接：[认证页面](https://docs.halo.run/developer-guide/theme/template-variables/auth)

### 错误页面

- 模板路径：/src/templates/error/{404,4xx,500,5xx,error}.html
- 访问路径：无固定访问路径，由异常决定
- 文档链接：[错误页面](https://docs.halo.run/developer-guide/theme/template-variables/error)

## 额外插件支持

### 链接管理插件

- 模板路径：/src/templates/links.html
- 访问路径：/links
- 文档链接：[plugin-links](https://github.com/halo-sigs/plugin-links?tab=readme-ov-file)

### 相册管理插件

- 模板路径：/src/templates/photos.html
- 访问路径：/photos | /photos/page/{page}
- 文档链接：[plugin-photos](https://github.com/halo-sigs/plugin-photos?tab=readme-ov-file)

### 瞬间管理插件

#### 列表页面

- 模板路径：/src/templates/moments.html
- 访问路径：/moments?tag={tag} | moments/page/{page}?tag={tag}
- 文档链接：[plugin-moments#列表页面](https://github.com/halo-sigs/plugin-moments?tab=readme-ov-file#%E5%88%97%E8%A1%A8%E9%A1%B5%E9%9D%A2-moments)

#### 详情页面

- 模板路径：/src/templates/moment.html
- 访问路径：/moments/{name}
- 文档链接：[plugin-moments#详情页面](https://github.com/halo-sigs/plugin-moments?tab=readme-ov-file#%E8%AF%A6%E6%83%85%E9%A1%B5%E9%9D%A2-momentsname)

### 通用评论组件插件

- 文档链接：[plugin-comment-widget#主题适配](https://github.com/halo-dev/plugin-comment-widget?tab=readme-ov-file#%E4%B8%BB%E9%A2%98%E9%80%82%E9%85%8D)
