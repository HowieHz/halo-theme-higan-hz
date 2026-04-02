# Dark Content Text Style Component

## Description

This component applies the selected dark-mode content text style preset to regular body text inside article content.

Currently supported presets:

- `soft-gray`: makes dark-mode body text feel softer and more comfortable to read

The `default` preset emits no extra CSS. Non-default presets only affect dark mode and auto mode when the system prefers dark, and they keep headings, blockquotes, links, and code blocks unchanged.

## Usage

Head Content

```html
<th:block th:insert="~{components/dark-content-text-style/template :: head}"></th:block>
```
