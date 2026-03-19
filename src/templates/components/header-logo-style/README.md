# Header Logo Style Component

## Description

This component outputs the inline style block used to render the header logo background image and image-set sources.

## Usage

Body Content

```html
<th:block
  th:insert="~{components/header-logo-style/template :: body(
    fallbackLogoPng=${fallbackLogoPng},
    logoUri=${logoUri},
    imageType=${imageType},
    fallbackLogoWebp=${fallbackLogoWebp}
  )}"
></th:block>
```
