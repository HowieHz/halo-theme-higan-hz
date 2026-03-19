# Paragraph First Line Indent Style Component

## Description

This component outputs the inline style block used to apply first-line indentation to content paragraphs.

## Usage

Body Content

```html
<th:block
  th:insert="~{components/paragraph-first-line-indent-style/template :: body(
    indentValue=${theme.config?.custom_page_styles?.paragraph_first_line_indent_value}
  )}"
></th:block>
```
