# Custom Color Scheme Init Component

## Description

This component outputs the custom color schema config script and the inline initialization script used by the base layout.

## Usage

Head Content

```html
<th:block
  th:if="${color_schema == 'custom'
           or theme_dark == 'custom'
           or theme_light == 'custom'
           or theme_auto == 'custom'}"
  th:insert="~{components/custom-color-scheme-init/template :: head}"
></th:block>
```
