# Higan Haozi

![GitHub](https://img.shields.io/github/license/HowieHz/halo-theme-higan-hz)
![GitHub all releases](https://img.shields.io/github/downloads/HowieHz/halo-theme-higan-hz/total)
![GitHub release (latest by date)](https://img.shields.io/github/downloads/HowieHz/halo-theme-higan-hz/latest/total)
![GitHub repo size](https://img.shields.io/github/repo-size/HowieHz/halo-theme-higan-hz)
[![Halo Version](https://img.shields.io/badge/Halo-2.19+-brightgreen.svg)](https://halo.run)

## 说明

一款响应式、简洁清爽的个人网站 Halo CMS 主题。

想了解更多吗？欢迎访问[文档](https://howiehz.top/halo-theme-higan-hz/)进一步了解此主题。
也可以访问[示例站点](https://howiehz.top/)进行体验。

## 特点

在简洁清爽的基础上，本主题秉持以下核心理念：

1. 响应式设计（适配不同屏幕尺寸）
2. [多语言支持](https://howiehz.top/halo-theme-higan-hz/tutorial/i18n)
3. [强可配置性](https://howiehz.top/halo-theme-higan-hz/guide/theme-configuration)
4. [兼容性良好](https://howiehz.top/halo-theme-higan-hz/guide/what-is-higan-haozi#浏览器兼容性)
5. [插件兼容性](https://howiehz.top/halo-theme-higan-hz/guide/plugin-compatibility)
6. [高性能表现](https://howiehz.top/halo-theme-higan-hz/guide/what-is-higan-haozi#lighthouse)

## 预览

下图展示了主题部分配色风格：

![preview-1](./docs/public/preview-1.png)

## 一些话

<!-- markdownlint-disable MD013 -->

如果你喜欢这个主题，欢迎 [Star⭐](#star-history)、[Issue🐛](https://github.com/HowieHz/halo-theme-higan-hz/issues) 或 [Pull Request🔀](https://github.com/HowieHz/halo-theme-higan-hz/pulls) 支持项目迭代。
你的支持是我持续更新的最大动力！

<!-- markdownlint-enable MD013 -->

如果你愿意支持我，也欢迎进群交流，让我知道除了我自己，还有许多人在使用这个主题😀

- [主题交流群（QQ）](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=QCcmLkzDHUT22qP_-MVYSYDwlL_Jf55Y&authKey=KWfge330T3nQAJy96gacr8eyp8u0egY3tNGBFAnNjqdBdMJKQLp9I9efUU9aMiGM&noverify=0&group_code=694413711)

欢迎基于本项目二次开发，不论需求多么独特，只要是本主题没实现的，就欢迎你来提 [Issue](https://github.com/HowieHz/halo-theme-higan-hz/issues/new)。

最初，这个项目只是为了解决自己的一些需求。没想到现如今已有不少小伙伴在使用，并通过各种方式反馈建议，帮助我不断优化和完善。衷心感谢大家的支持与鼓励！
另外，感谢所有通过打赏支持本项目的小伙伴，特此列出名单：[赞助名单](#感谢赞助)

## Lighthouse

Lighthouse 测试结果：

![Lighthouse-result-2024-04-15-post](./docs/img/Lighthouse-result-2024-04-15-post.png)

## 贡献指南

见 [CONTRIBUTING](./CONTRIBUTING)

## 项目状态

### Repobeats analytics

![Alt](https://repobeats.axiom.co/api/embed/b02231ee758d8477f8fdb3b166fcf0488cbe7377.svg "Repobeats analytics image")

### Star History

[![Star History Chart](https://api.star-history.com/svg?repos=HowieHz/halo-theme-higan-hz&type=Date)](https://star-history.com/#HowieHz/halo-theme-higan-hz&Date)

## 感谢赞助

<details><summary>点我展开赞助列表</summary>

- GreenTomato 赞助 66.66 CNY 于 2025 年 2 月 14 日
- [默小班](hhttps://www.memxb.top/) 赞助 5 CNY 于 2025 年 2 月 12 日
- [boyving](https://www.imdream.cn/) 赞助 18.80 CNY 于 2025 年 2 月 10 日
- [bilibili@氵青一色但不是清一色](https://space.bilibili.com/37264956) 赞助 5 CNY 于 2025 年 1 月 20 日
- [bilibili@氵青一色但不是清一色](https://space.bilibili.com/37264956) 赞助 5 CNY 于 2025 年 1 月 11 日

</details>

---

### 配置项说明

为方便查找，本主题将选项分类到多栏目下，而不是像原主题集中在一个“样式”栏下。  
现分类为“全局”，“总体样式”，“首页样式”，“文章页样式”，“分类集合页样式”，“自定义页面样式”，“瞬间页样式”，“RSS”，“社交资料”。

解释：“现主题设置项位置”（原主题设置项位置）-> 小括号内的为“现主题设置项位置”对应的“原主题设置项位置“。

例：在[增加于“总体样式”](#增加于总体样式)这一章节中有如下文字：

- “配色方案”（样式 - 配色方案）

其含义为“总体样式 - 配色方案”对应原主题“样式 - 配色方案”选项。

#### 增加于“全局”

1. 新增“默认页面语言”选项，允许指定站点的默认语言。（如配置值为空，则默认为“zh”。）
   - 如需切换页面语言，可在 URL 后添加 ?lang=语言代码，例如：<https://example.com/?lang=en>
2. 添加“多语言功能前缀匹配模式”，如启用此项，则多语言功能将启用前缀匹配模式。
3. 添加“浏览器语言自动跳转”
4. 添加“多语言菜单支持”，允许用户定义多套菜单适用于不同语言。
   - 此项使用教程请看 [多语言菜单使用指南](https://howiehz.top/halo-theme-higan-hz/tutorial/i18n#多语言菜单使用指南)
5. 添加“CSP:upgrade-insecure-requests”选项，避免 HTTPS 协议网页引用 HTTP 资源时报错。
   - 相关文档：[CSP: upgrade-insecure-requests - HTTP | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/upgrade-insecure-requests)
6. 增加“仅允许使用指定域名访问”。使用场景：防止站点被恶意镜像后的流量流失。
7. 增加“自定义资源位置地址”，允许指定资源位置地址（如主要 CSS 资源，主要 JavaScript 资源）。
8. 增加“instant.page 支持”，自动加载 instant.page 脚本，以提升页面加载速度。

#### 增加于“总体样式”

1. 允许启用自定义字体文件
   - 启用后，可上传 .woff2/.woff/.ttf/.otf/.eot/.ttc/.otc/.sfnt 字体文件，主题会优先使用这些文件替换默认字体
   - 可填写字体名称（全名/PostScript 名），如 `'My Custom Font Regular'` 或 `'MyCustomFont-Regular'`。如不填写，则即使用户本地已安装该字体，也会继续从网络下载
2. <a id="more-color-scheme"></a>“配色方案”（样式 - 配色方案）
   - 添加“跟随系统”配色方案
   - 添加蓝色系列配色方案
3. 支持自定义配色方案
   - 使用步骤
     1. 在此处创建自定义配色方案，填写好对应信息，记住"自定义配色方案识别码"
     2. “配色方案”、”自动模式配色方案“（需启用“浅色/深色模式切换按钮”）、“浅色模式配色方案”（需启用“浅色/深色模式切换按钮”），“深色模式配色方案”（需启用“浅色/深色模式切换按钮”），中选择“自定义配色选项”。
     3. 在选项下方新出现的输入框中填写你的"自定义配色方案识别码"
     4. 即可使用你自定义的配色方案

        <details><summary>点我展开自定义配色示例</summary>

        深色模式示例（启用 CSS 原始输出模式）  
        实际使用时请将填写的”识别码“替换 {id}

        ```css
        html[theme="theme-{id}"] {
          --color-accent-1: #2bbc8a;
          --color-accent-2: #eee;
          --color-accent-3: #ccc;
          --color-border: #908d8d;
          --color-divide: #616161;
          --color-footer-mobile-1: #a4a3a3;
          --color-footer-mobile-2: #27292b;
          --color-footer-mobile-3: #212326;
          --color-quote: #ccffb6;
          --color-scrollbar: #999;
          --color-text: #d5d7d8;
          --color-time: #adaeaf;
          --toc-level-2: #e3e3e3;
          --toc-level-3: #b0b0b0;
          --toc-level-4: #636363;
          --color-avatar-border: #212326;
          --color-background: #1d1f21;
          --color-background-code: #212326;
          --color-background-numbers: 29, 31, 33;
          --color-card-hover: #212326;
          --color-card-hover-numbers: 33, 35, 38;
          --color-link-hover: #d480aa;
          --color-link-hover-70-alpha: rgba(212, 128, 170, 0.7);
        }
        html[theme="theme-{id}"] comment-widget {
          --halo-comment-widget-component-form-input-bg-color: #1d1f21 !important;
          --halo-comment-widget-component-form-input-border-color: #636363 !important;
        }
        ```

        浅色模式示例（启用 CSS 原始输出模式）  
        实际使用时请将填写的”识别码“替换 {id}

        ```css
        html[theme="theme-{id}"] {
          --color-accent-1: #2bbc8a;
          --color-accent-2: #383838;
          --color-accent-3: #676767;
          --color-border: #666;
          --color-divide: #e5e7eb;
          --color-footer-mobile-1: #666;
          --color-footer-mobile-2: #e6e6e6;
          --color-footer-mobile-3: #fafafa;
          --color-quote: #2bbc8a;
          --color-scrollbar: #aaa;
          --color-text: #333;
          --color-time: #595858;
          --toc-level-2: #383838;
          --toc-level-3: #666;
          --toc-level-4: #888;
          --color-avatar-border: #fafafa;
          --color-background: #fff;
          --color-background-code: #fafafa;
          --color-background-numbers: 255, 255, 255;
          --color-card-hover: #fafafa;
          --color-card-hover-numbers: 250, 250, 250;
          --color-link-hover: #d480aa;
          --color-link-hover-70-alpha: rgba(212, 128, 170, 0.7);
        }
        html[theme="theme-{id}"] comment-widget {
          --halo-comment-widget-component-form-input-bg-color: #fff !important;
        }
        ```

        自动模式示例（启用 CSS 原始输出模式）  
        实际使用时请将填写的”识别码“替换 {id}

        ```css
        html[theme="theme-{id}"] {
          --color-accent-1: #2bbc8a;
          --color-accent-2: #383838;
          --color-accent-3: #676767;
          --color-border: #666;
          --color-divide: #e5e7eb;
          --color-footer-mobile-1: #666;
          --color-footer-mobile-2: #e6e6e6;
          --color-footer-mobile-3: #fafafa;
          --color-quote: #2bbc8a;
          --color-scrollbar: #aaa;
          --color-text: #333;
          --color-time: #595858;
          --toc-level-2: #383838;
          --toc-level-3: #666;
          --toc-level-4: #888;
          --color-avatar-border: #fafafa;
          --color-background: #fff;
          --color-background-code: #fafafa;
          --color-background-numbers: 255, 255, 255;
          --color-card-hover: #fafafa;
          --color-card-hover-numbers: 250, 250, 250;
          --color-link-hover: #d480aa;
          --color-link-hover-70-alpha: rgba(212, 128, 170, 0.7);
        }
        html[theme="theme-{id}"] comment-widget {
          --halo-comment-widget-component-form-input-bg-color: #fff !important;
        }

        @media (prefers-color-scheme: dark) {
          html[theme="theme-{id}"] {
            --color-accent-1: #2bbc8a;
            --color-accent-2: #eee;
            --color-accent-3: #ccc;
            --color-border: #908d8d;
            --color-divide: #616161;
            --color-footer-mobile-1: #a4a3a3;
            --color-footer-mobile-2: #27292b;
            --color-footer-mobile-3: #212326;
            --color-quote: #ccffb6;
            --color-scrollbar: #999;
            --color-text: #d5d7d8;
            --color-time: #adaeaf;
            --toc-level-2: #e3e3e3;
            --toc-level-3: #b0b0b0;
            --toc-level-4: #636363;
            --color-avatar-border: #212326;
            --color-background: #1d1f21;
            --color-background-code: #212326;
            --color-background-numbers: 29, 31, 33;
            --color-card-hover: #212326;
            --color-card-hover-numbers: 33, 35, 38;
            --color-link-hover: #d480aa;
            --color-link-hover-70-alpha: rgba(212, 128, 170, 0.7);
          }
          html[theme="theme-{id}"] comment-widget {
            --halo-comment-widget-component-form-input-bg-color: #1d1f21 !important;
            --halo-comment-widget-component-form-input-border-color: #636363 !important;
          }
        }
        ```

        </details>

4. <a id="theme-switch-button-anchor"></a>可在大标题旁添加浅色/深色模式切换按钮（切换顺序 浅色模式 -> 深色模式 -> 自动模式 -> 浅色模式）
   - 注：“自动模式配色方案”选择一种浅色方案即可禁用自动模式。
   - 自动模式配色方案：指定“浅色/深色模式切换按钮”切换到自动模式时的配色方案
   - 浅色模式配色方案：指定“浅色/深色模式切换按钮”切换到浅色模式时的配色方案
   - 深色模式配色方案：指定“浅色/深色模式切换按钮”切换到深色模式时的配色方案
   - 根据浏览器设置自动切换配色：如果启用这项，首先会读取浏览器中已保存的配色选择，如果没有保存的选择，则会根据浏览器主题设置自动切换为浅/深色配色。
   - 保存配色设置到浏览器中：如果启用这项，按下配色切换按钮后，将会保存当前的配色选择到浏览器存储中。
5. 对于内容区域宽度给予更大的配置自由度
   （说明：原主题在之后的更新里更新了自适应最大宽度设置，内容区域最大宽度将随着屏幕宽度的变化而变化。但是在文字内容较少时（如主页），会显得内容显示位置偏左，因此“可自定义内容区域最大宽度”默认开启。
   如果你想使用上游的最大宽度设置模式，请关闭“总体样式 - 自定义内容区域最大宽度”这一项设置，并且推荐同时开启“内容区域最小宽度”，“自定义内容区域宽度属性”并保持默认值，可有效解决文字较少时内容显示偏左的问题）
   1. 可自定义内容区域最大宽度
      （默认值为 48rem。允许全部 CSS 长度单位，如：48rem, 780px, 70vw, 70%。宽度最大值设置较大时可能会出现内容整体偏左的现象。为解决这个问题，可同时开启“内容区域最小宽度”，“自定义内容区域宽度属性”并保持默认值。）
   2. 可自定义内容区域最小宽度
      （默认值为 48rem。允许全部 CSS 长度单位，如：48rem, 780px, 70vw, 70%。当此设置宽度小于窗口宽度时，主题会使用窗口宽度。以避免出现横向滚动条。）
      - 允许强制应用内容区域最小宽度
        （强制使内容显示区域不小于设定的最小宽度，即使出现横向滚动条。）
   3. 可自定义内容区域宽度属性
      （默认值为 fit-content。默认值效果为：使内容区域宽度=最宽的内容的宽度。（此项实际是在设置内容区域的 width 属性对应的样式值））
6. 允许关闭页眉头像
7. 允许在菜单中添加“随机文章”项
8. 允许关闭页眉菜单
9. 允许关闭页码
10. 允许在站点底部显示站点统计信息
    - 支持自由调整顺序、数量
    - 支持选择图标/文字
11. 允许关闭页面底部主题信息
    - 支持调整其中的主题名
    - 支持调整其中的 Halo 版本名
12. 允许关闭页面底部版权信息
    - 版权信息自定义署名
13. 允许设定是否强制页脚在页面最底部
14. 允许关闭页面底部菜单
15. 允许添加内容到页脚最底部
16. 多语言页面最底部内容支持
17. 允许关闭三级标题（h3）下方下划线
18. 允许保留引用块中的空行
19. 允许在引用块前添加引号（引用块在 Markdown 中使用 > 表示）
20. 允许在引用块后添加引号（引用块在 Markdown 中使用 > 表示）
21. 允许保留表格每行底部的表格线
    - 支持自由设置该表格线宽度
22. 允许设置标题上边距倍率
23. 允许设置标题下边距倍率
24. 允许设置段落上边距倍率
25. 允许设置段落下边距倍率

#### 增加于“首页样式”

1. 允许设定主页 HTML 标题，而不是取值于“Halo 设置 - 基本设置 - 站点标题”
2. 允许同时开启一言（hitokoto）和个人简介/公告栏
3. 支持自定义一言（hitokoto）链接
4. 允许自定义随机句子
5. 多语言个人简介/公告栏支持
6. 允许隐藏社交资料图标左侧文字
7. 允许隐藏文字列表标题
8. 允许用户修改主页上的固定文本 _[guqing/halo-theme-higan#86](https://github.com/guqing/halo-theme-higan/issues/86)_
   - 现为支持国际化（i18n），如想编辑固定文字，请到 halo 主题目录（themes），找到 howiehz-higan 文件夹里的 i18n 文件夹，找到对应语言的 properties 文件，修改保存即可（如中文是 zh.properties）
9. 主页列表布局可以在简洁文章列表/多元文章列表/瞬间列表中选择
10. 允许自定义简洁列表
    - 允许显示文章阅读量
11. 允许自定义多元列表
    - 允许显示文章分类
    - 允许显示文章标签
    - 允许显示文章阅读量
    - 允许显示文章预计阅读时间
    - 允许显示文章字数统计
    - 允许隐藏文章摘要
    - 允许限制文章摘要行数上限
    - 允许隐藏跳转文章链接所用提示文字
    - 允许显示文章封面
12. 允许自由选择是否开关文章列表置顶图标，以及选择图标位置
13. 允许自定义瞬间列表
    - 允许设定显示条数
    - 允许选择是否显示条目作者头像和昵称

#### 增加于“文章页样式”

1. 可为文章内容段落添加最小高度，以改善空行显示效（优化文章段落空行显示）
2. 允许启用段落首行缩进
   - 允许自定义缩进长度
3. 将“文章标题大写”（样式 - 文章标题大写）配置项移动到这一栏下
4. 允许选择是否显示文章发布时间
   - 可选左侧显示文字：发表于
5. 允许选择是否显示文章更新时间
   - 可选左侧显示文字：更新于
6. 允许关闭文章阅读量
7. 允许显示文章预计阅读时间
8. 允许显示文章字数统计
9. 允许关闭桌面端菜单中的分享按钮
10. 允许自定义侧边目录最大宽度
11. 允许选择是否启用文章末尾的分隔线
12. 可在文章底部添加点赞按钮
    - 允许设置图标大小
    - 允许设置是否展示获赞数
    - 允许设置位置（靠左，居中，靠右）
13. 可显示推荐文章
    - 可设置推荐文章数
    - 注：原理是读取当前文章第一个分类，并且随机输出其中若干个文章。如果当前文章在列表中将会被剔除，因此推荐文章可能小于当前推荐文章数。如果当前文章未设置分类，该功能会被禁用。如果分类仅有一篇文章，该功能会被禁用。
14. 可显示相邻文章导航
15. 允许选择是否启用文章评论区
16. 允许关闭移动端底部导航栏
    - 允许关闭移动端底部导航栏中的分享按钮

#### 添加于“分类集合页样式”

1. 允许选择是否显示每个分类下的文章数量
   - 允许设置在“文章数量”左侧的字符
   - 允许设置在“文章数量”右侧的字符
2. 允许选择是否显示多层分类

#### 添加于“分类详情页样式”

1. 允许文章列表显示文章阅读量
2. 允许显示该页面 RSS 订阅按钮（需要启用 [RSS 订阅插件](https://github.com/halo-dev/plugin-feed)([应用市场页面](https://www.halo.run/store/apps/app-KhIVw))）

#### 添加于“标签集合页样式”

1. 允许选择是否显示每个标签下的文章数量
   - 允许设置在“文章数量”左侧的字符
   - 允许设置在“文章数量”右侧的字符
2. 允许选择标签排序方式

#### 添加于“标签详情页样式”

1. 允许文章列表显示文章阅读量
2. 允许显示该页面 RSS 订阅按钮（需要启用 [RSS 订阅插件](https://github.com/halo-dev/plugin-feed)([应用市场页面](https://www.halo.run/store/apps/app-KhIVw))）

#### 添加于“作者详情页样式”

1. 允许显示该页面 RSS 订阅按钮（需要启用 [RSS 订阅插件](https://github.com/halo-dev/plugin-feed)([应用市场页面](https://www.halo.run/store/apps/app-KhIVw))）

#### 添加于"归档页样式"

1. 允许按照发布年份和月份折叠文章列表
   - 允许配置展开折叠动画时间

#### 增加于“自定义页面样式”

1. 可为文章内容段落添加最小高度，以改善空行显示效（优化文章段落空行显示）
2. 允许启用段落首行缩进
   - 允许自定义缩进长度
3. 允许显示文章预计阅读时间
4. 允许显示文章字数统计
5. 允许启用类文章页样式（启用后，自定义页面将使用类似文章页的布局和样式，主要体现在桌面端顶部菜单（侧边目录，回到顶端按钮，分享菜单），移动端底部菜单（类似文章页）。菜单、目录相关设置与“文章页样式”下的设置保持一致。）
6. 允许选择是否启用正文内容与评论区间的分隔线
7. 允许选择是否启用评论区

#### 增加于“相册页样式”

[适配对应 plugin-photos 插件](https://howiehz.top/halo-theme-higan-hz/guide/plugin-compatibility#图库页)

1. 允许设置图片圆角宽度
2. 允许设置图片渐入动画时间
3. 允许关闭分组标题
4. 允许启用瀑布流布局
   - 允许设置瀑布流最大最小列数
   - 允许设置瀑布流最小图片宽度
   - 允许设置瀑布流间隔宽度
5. 进阶配置（此处的配置项需要前端知识）
   - 自定义图片 onmouseover 属性
   - 自定义图片 onmouseout 属性

#### 增加于“瞬间页样式”

[适配对应 plugin-moments 插件](https://howiehz.top/halo-theme-higan-hz/guide/plugin-compatibility#瞬间页)

1. 允许显示帖文预计阅读时间
2. 允许显示帖文字数统计
3. 允许选择是否启用点赞按钮
4. 允许选择是否启用评论区

#### 增加于“社交资料/RSS”

1. 允许设置多个重复的社交平台，并且允许任意排列，增减
2. 支持插入纯文本
3. 支持完全自定义（图标，链接，无障碍标签）
4. 在原支持 RSS, Dribbble, Email, Facebook, Github, Instagram, QQ, Telegram, X, Weibo 的基础上  
   额外增加对 BiliBili, Reddit, Stack Overflow, YouTube, 豆瓣，网易云音乐，知乎的支持  
   注：没有简书和 CSDN(Copy, Steal and pay-Download Net) 的原因是平台过于小众，甚至 iconify 找不到它们的图标
   注：将“首页 RSS 展示”（社交资料-RSS）配置项移动到这一栏下，允许自定义 RSS 地址

#### 添加于“页面分享按钮设置”

此处分享按钮应用于文章页/自定义页面在桌面模式下/移动端模式下的分享按钮

1. 允许多个重复的分享链接，并且允许任意排列，增减
2. 支持完全自定义（图标，链接，无障碍标签）
3. 在原支持 Facebook，E-mail，X，Pinterest，LinkedIn 的基础上
   额外增加对 QQ，WeChat/QRcode（二维码生成），Qzone，Douban，Weibo，Telegram，调用浏览器分享页面 的支持

#### 添加于“错误页样式”

1. 允许启用页面自动重定向（包括重定向倒计时）
   - 允许设置跳转目标链接
   - 允许设置跳转等待时间
