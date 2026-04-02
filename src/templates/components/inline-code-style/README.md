# Inline Code Style Component

## Description

This component applies the selected global inline code style preset to `:not(pre) > code`.

Currently supported presets:

- `soft-fill`: soft background highlight
- `pill`: theme-tinted rounded pill

It only affects inline code and does not change `pre code` multi-line code blocks. The `default` preset keeps the global base `code` style and emits no extra CSS. Non-default presets override the base `code` style from `@layer base`.

## Usage

Head Content

```html
<th:block th:insert="~{components/inline-code-style/template :: head}"></th:block>
```
