# List Post Summary Component

## Description

This component displays a summarized list of posts with comprehensive details such as title, publish date, categories, tags, views, word count, estimated reading time, excerpt, and cover image.

## Usage

Head Content (for including necessary scripts/styles)

```html
<th:block th:insert="~{components/list-post-summary/template :: headContent}"></th:block>
```

Content Insertion

```html
<th:block th:insert="~{components/list-post-summary/template :: content(posts)}"></th:block>
```

## API

- `posts`: A collection of post objects to be displayed in the list.
