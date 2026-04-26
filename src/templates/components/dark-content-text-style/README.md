# Dark Content Text Style Component

## Description

This component applies the selected dark-mode content text style to regular body text inside article content.

Currently supported values:

- `no-adjustment`: emits no extra CSS and keeps the original look

- `soft-gray`: makes dark-mode body text feel softer and more comfortable to read

The legacy `default` value is still treated like `no-adjustment`
for backward compatibility. Non-default styles only affect dark mode
and auto mode when the system prefers dark, and they keep headings,
blockquotes, links, and code blocks unchanged.

## Usage

Head Content

```html
<th:block th:insert="~{components/dark-content-text-style/template :: head}"></th:block>
```
