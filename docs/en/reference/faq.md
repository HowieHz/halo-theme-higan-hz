---
outline: deep
---

::: info Info

This documentation is AI-generated. You can help improve it by submitting an [Issue](https://github.com/HowieHz/halo-theme-higan-hz/issues/new).

:::

# FAQ

This document summarizes the most common questions and solutions encountered during use and secondary development.

::: tip

If the problem remains unsolved, you can search for or submit new feedback at [GitHub Issues](https://github.com/HowieHz/halo-theme-higan-hz/issues), or join QQ group `694413711` for community support.

:::

## General Usage Questions

### How to point a menu to a specific tag or category page

- Create a "Custom Link" in the menu with any name, and fill in the link address according to the [Template Map](/en/reference/template-map). For example, tag archive `/tags/{actual-tag-slug}`, category archive `/categories/{actual-category-slug}`.
- Paths for more pages (such as tag list, category list, archive page) can be found in [Template File and Access Path Mapping](/en/reference/template-map).
- After submitting the changes, refresh the front end to confirm the results.

### Styling issues after enabling the theme

1. Please confirm that all static resources are returned normally. You can filter `.css` in the Network panel of the browser's developer tools (`DevTools`) to check.
2. If using CDN or reverse proxy caching, please refresh the cache; if the previous cache header configuration was incorrect, try a forced browser refresh (`Ctrl + F5`) to get the latest resources.

### Custom fonts not working

- If you have entered a font name, please ensure the value matches the `Full name` or `PostScript Name` inside the font file.
- Check the Network panel in the browser's developer tools (DevTools) to see if the font file is loaded successfully.

### Multilingual menu enabled but not working

Please read the [Multilingual Menu Usage Guide](/en/tutorial/i18n#multilingual-menu-usage-guide).

### How to reset all configurations to default values

Go to `/console/theme`, then click the three dots on the far right of the theme name row, and finally click the "Reset" button.

### How to export theme configuration

Go to `/console/theme`, then click the three dots on the far right of the theme name row, and finally click the "Export Theme Configuration" button.

## Development and Debugging

### How to quickly verify styles in development mode?

- Please refer to [Halo Theme Hot Reload Using Symbolic Links](https://erzbir.com/archives/symlink-halo-theme-hot-reload)

### Page language setting priority

The `lang` attribute priority for the site root tag `<html>`:

1. The `language` metadata explicitly specified in the metadata of [posts](/en/guide/metadata-configuration#post-page-title), [categories](/en/guide/metadata-configuration#category-page-title), [tags](/en/guide/metadata-configuration#tag-metadata), and [pages](/en/guide/metadata-configuration#page-metadata).
2. URL query parameter `?lang=`.
3. The [default page language](/en/guide/theme-configuration#default-page-language) in theme settings.
4. If all of the above are empty, it falls back to `zh`.
