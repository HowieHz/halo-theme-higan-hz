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
- Insert `inlineInit` before `</body>` to restore liked button styles earlier and reduce FOUC.
