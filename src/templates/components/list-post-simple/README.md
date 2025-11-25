# List Post Simple Component

## Description

This component displays a simple list of posts with minimal details such as title, publish date, and optional view count. It provides a compact view suitable for archives, sidebars, or pages where space is limited.

## Usage

Head Content (for including necessary scripts/styles)

```html
<th:block th:insert="~{components/list-post-simple/template :: headContent(showPagination)}"></th:block>
```

Content Insertion

```html
<th:block th:insert="~{components/list-post-simple/template :: content(posts, showPagination)}"></th:block>
```

## API

- `posts`: A collection of post objects to be displayed in the list.
- `showPagination`: An optional boolean indicating whether to display pagination controls. Defaults to `false` if not provided.
