# Upvote Runtime Component

## Description

This component provides a reusable upvote runtime for post and moment templates.
It reads page-level upvote parameters from `data-*` attributes and handles click submission, local storage state, count updates, and active button styling.

## Usage

Head Content

```html
<th:block th:insert="~{components/upvote-runtime/template :: head}"></th:block>
```

Config Content

```html
<th:block
  th:insert="~{components/upvote-runtime/template :: body(
    storageKey='higan.likes.post.ids',
    group='content.halo.run',
    plural='posts',
    nameAttribute='data-post-name',
    triggerSelector='a.upvote-button[data-post-name]',
    countSelector='span[data-post-name]',
    networkRequestFailedMsg=#{common.error.networkRequestFailed}
  )}"
></th:block>
```

Tail Content

```html
<th:block th:insert="~{components/upvote-runtime/template :: inlineInit}"></th:block>
```

## Parameters

- `storageKey`: The localStorage key used to persist liked item ids.
- `group`: The Halo tracker API group value.
- `plural`: The Halo tracker API plural value.
- `nameAttribute`: The attribute name that stores the upvote target id on trigger and count elements.
- `triggerSelector`: The selector used to match clickable upvote elements.
- `countSelector`: The selector used to match upvote count elements.
- `networkRequestFailedMsg`: The localized alert message shown when the network request fails.

## Notes

- Insert `head` once to load the module runtime.
- Insert `body(...)` where the page provides upvote runtime config.
- Insert `inlineInit` immediately before `</body>` to restore liked button styles and reduce FOUC.

### Why `inlineInit` reduces FOUC

`inlineInit` is a plain synchronous `<script>` (not a module). The browser executes it
immediately as it parses that position in the document, before `DOMContentLoaded` fires.

The module loaded by `head` is deferred by design: module scripts never block parsing and
always run after the document is parsed. This means without `inlineInit`, liked-button
styles (e.g. accent color) would not be applied until after the full page has loaded,
producing a visible flash.

Placing `inlineInit` just before `</body>` ensures that:

1. All upvote trigger elements are already present in the DOM at execution time.
2. localStorage is read and button styles are applied synchronously, before the first paint
   of that part of the page reaches the user.
