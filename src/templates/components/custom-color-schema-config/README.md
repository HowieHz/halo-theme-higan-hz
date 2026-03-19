# Custom Color Schema Config Component

## Description

This component outputs the inline script that prepares the `allCustomColorSchema` config used by the base layout.

## Usage

Head Content

```html
<th:block
  th:if="${color_schema == 'custom'
           or theme_dark == 'custom'
           or theme_light == 'custom'
           or theme_auto == 'custom'}"
  th:insert="~{components/custom-color-schema-config/template :: head}"
></th:block>
```
