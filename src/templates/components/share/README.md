# Share Component

## Description

This component renders the share action list used by post-style pages.
It also provides a head fragment for loading the module script that handles native browser sharing.

## Usage

Head Content (for including the share module script)

```html
<th:block th:insert="~{components/share/template :: head}"></th:block>
```

Body Content (for rendering the share action list)

```html
<th:block
  th:insert="~{components/share/template :: body(originPermalink=${post.status.permalink}, title=${post.spec?.title})}"
></th:block>
```

## Parameters

- `originPermalink`: The original permalink path of the current post or page.
- `title`: The share title used for native sharing and share URLs.
