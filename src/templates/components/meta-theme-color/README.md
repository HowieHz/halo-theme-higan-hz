# Meta Theme Color Component

## Description

This component outputs the non-self-closing `<meta name="theme-color">` tags used by the base layout.

The tags are split by `prefers-color-scheme` so browsers can choose a light or dark theme color before runtime scripts finish.

## Usage

Head Content

```html
<th:block th:insert="~{components/meta-theme-color/template :: head}"></th:block>
```
