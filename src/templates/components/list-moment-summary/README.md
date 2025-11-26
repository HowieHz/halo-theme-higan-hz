# List Moment Summary Component

## Description

This component displays a summarized list of moments (short posts) with comprehensive details, including author information, publish date, content, and media (photos/videos).
It also shows estimated reading time, word count, supports upvote functionality, and an optional comment section.

## Usage

Head Content (for including necessary scripts/styles)

```html
<th:block th:insert="~{components/list-moment-summary/template :: headContent}"></th:block>
```

Content Insertion

```html
<th:block th:insert="~{components/list-moment-summary/template :: content(moments, isIndexPage)}"></th:block>
```

## API

- `moments`: A collection of moment objects to be displayed in the list.
- `isIndexPage`: A boolean indicating whether the current page is the index page.
