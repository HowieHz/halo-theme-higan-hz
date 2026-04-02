# Inline Code Style Component

## Description

This component applies the selected global inline code style preset to inline code.

Currently supported presets:

- `soft-fill`: soft background highlight
- `pill`: theme-tinted rounded pill

It only affects inline code and does not change multi-line code blocks. The `default` preset keeps the current base style and emits no extra CSS. Non-default presets provide alternative inline-code highlight styles.

## Usage

Head Content

```html
<th:block th:insert="~{components/inline-code-style/template :: head}"></th:block>
```
