# Inline Code Style Component

## Description

This component applies the selected inline code style preset inside `article .content`.

Currently supported presets:

- `soft-fill`: soft background highlight
- `pill`: theme-tinted rounded pill

It only affects inline code and does not change `pre code` multi-line code blocks. The `default` preset keeps the global dotted border style and emits no extra CSS.

## Usage

Body Content

```html
<th:block th:insert="~{components/inline-code-style/template :: body}"></th:block>
```
