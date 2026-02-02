---
outline: deep
---

<!-- markdownlint-disable MD013 -->

# Template Files and Access Path Mapping

::: info Info

This documentation is AI-generated. You can help improve it by submitting an [Issue](https://github.com/HowieHz/halo-theme-higan-hz/issues/new).

:::

The following table summarizes the main template files of this theme, corresponding access paths, and Halo CMS official template documentation.

This is useful for secondary development, configuring menu paths, and referencing when setting hyperlinks in other scenarios.

## Halo Built-in Pages

Template files are located in the `src/templates` folder.  
In the default access path column in the table, `{xxx}` represents variables (please fill in actual values), and `(xxx)` represents optional values (please fill in as needed).

| Template File               | Page Rendered       | Default Access Path                                                                              | Documentation                                                                           |
| --------------------------- | ------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `index.html`                | Home Page           | `/(page/{page})`                                                                                 | [Index](https://docs.halo.run/developer-guide/theme/template-variables/index_)          |
| `post.html`                 | Post Detail         | `/archives/{slug}` (can be modified in Halo CMS backend)                                         | [Post](https://docs.halo.run/developer-guide/theme/template-variables/post)             |
| `page.html`                 | Single Page         | `/{slug}`                                                                                        | [Page](https://docs.halo.run/developer-guide/theme/template-variables/page)             |
| `page-like-post-style.html` | Single Page         | `/{slug}` (Custom template: [Post Page Style](/en/guide/metadata-configuration#post-page-style)) | [Page](https://docs.halo.run/developer-guide/theme/template-variables/page)             |
| `archives.html`             | Post Archive        | `/archives(/{year}(/{month}))`                                                                   | [Archives](https://docs.halo.run/developer-guide/theme/template-variables/archives)     |
| `tags.html`                 | Tag Collection      | `/tags`                                                                                          | [Tags](https://docs.halo.run/developer-guide/theme/template-variables/tags)             |
| `tag.html`                  | Tag Detail          | `/tags/{slug}`                                                                                   | [Tag](https://docs.halo.run/developer-guide/theme/template-variables/tag)               |
| `categories.html`           | Category Collection | `/categories`                                                                                    | [Categories](https://docs.halo.run/developer-guide/theme/template-variables/categories) |
| `category.html`             | Category Detail     | `/categories/{slug}`                                                                             | [Category](https://docs.halo.run/developer-guide/theme/template-variables/category)     |
| `author.html`               | Author Detail       | `/authors/{name}`                                                                                | [Author](https://docs.halo.run/developer-guide/theme/template-variables/author)         |
| `error/*.html`              | Error Page          | No fixed access path, determined by exception                                                    | [Error Pages](https://docs.halo.run/developer-guide/theme/template-variables/error)     |

## Plugin Pages

Template files are located in the `src/templates` folder.  
In the default access path column in the table, `{xxx}` represents variables (please fill in actual values), and `(xxx)` represents optional values.

| Template File  | Page                        | Default Path                                   | Required Plugin                                                   |
| -------------- | --------------------------- | ---------------------------------------------- | ----------------------------------------------------------------- |
| `links.html`   | Links List                  | `/links`                                       | [plugin-links](https://github.com/halo-sigs/plugin-links)         |
| `photos.html`  | Photos Page                 | `/photos`, `/photos/page/{page}`               | [plugin-photos](https://github.com/halo-sigs/plugin-photos)       |
| `moments.html` | Moments List                | `/moments(/page/{page})(?tag={tag})`           | [plugin-moments](https://github.com/halo-sigs/plugin-moments)     |
| `moment.html`  | Moment Detail               | `/moments/{name}`                              | [plugin-moments](https://github.com/halo-sigs/plugin-moments)     |
| `friends.html` | Moments (Feed Subscription) | `/friends(/page/{page})(?linkName={linkName})` | [plugin-friends](https://github.com/chengzhongxue/plugin-friends) |

### Other Plugin Adaptations

| File Location                                              | Description                              | Required Plugin                                                                                                                    |
| ---------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `src\styles\mixins\colors\mixins\comment-widget-vars.styl` | Official comment widget style adaptation | [plugin-comment-widget](https://github.com/halo-dev/plugin-comment-widget?tab=readme-ov-file#%E4%B8%BB%E9%A2%98%E9%80%82%E9%85%8D) |
