# Footer Bottom Content Component

## Description

Renders unified bottom/sidebar content with i18n support:

- default content from `theme.config?.styles?.footer_content`
- matched i18n content from `theme.config?.styles?.i18n_footer_content`
- fallback default-language i18n content (`default-footer-content`)

It is designed to be reused by both inline footer-bottom and floating sidebar modes.

## Usage

```html
<th:block
  th:insert="~{components/footer-bottom-content/template :: body(
               className = 'footer-bottom',
               classAppend = '',
               styleText = ''
              )}"
></th:block>
```

## Parameters

- `className`: Base class for each rendered block (default: `footer-bottom`).
- `classAppend`: Extra classes appended to each rendered block.
- `styleText`: Inline style text applied to each rendered block.
