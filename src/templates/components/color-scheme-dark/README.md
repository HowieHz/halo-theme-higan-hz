# Dark Color Scheme Component

## Description

Applying `[data-color-scheme="dark"]` forces `color-scheme: only dark`, so the browser will always render Halo using dark mode palettes regardless of the visitor's OS preference.
Use this component when a section or page must stay in dark mode and you want to declare the behavior alongside the rest of your templates.

## Usage

Head Content (for including necessary styles)

```html
<th:block th:insert="~{components/color-scheme-dark/template :: head}"></th:block>
```
