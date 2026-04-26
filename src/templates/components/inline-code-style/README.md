# Inline Code Style Component

## Description

This component applies the selected global inline code style to inline code.

Currently supported presets:

- `dotted-border`: keeps the current dotted-border base style
- `soft-fill`: soft background highlight
- `pill`: theme-tinted rounded pill

It only affects inline code and does not change multi-line code blocks.
The `dotted-border` preset keeps the current base style and emits no
extra CSS. Other presets provide alternative inline-code highlight
styles.

## Usage

Head Content

```html
<th:block th:insert="~{components/inline-code-style/template :: head}"></th:block>
```
