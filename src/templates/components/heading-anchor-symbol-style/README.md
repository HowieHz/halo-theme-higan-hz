# Heading Anchor Symbol Style Component

## Description

This component outputs the `--heading-anchor-symbol` CSS custom property on `:root` when a custom symbol is configured, overriding the default `#`.

When `theme.config.post_styles.is_heading_anchor_symbol_raw` is `false` (default), the symbol value is quoted as a CSS string (e.g. `"#"`). When `true`, the value is written as-is, allowing raw CSS `content` values such as `url("data:image/svg+xml,...")`.

## Usage

Body Content

```html
<th:block th:insert="~{components/heading-anchor-symbol-style/template :: body}"></th:block>
```
