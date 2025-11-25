# List Moment Summary Component

## Description

This component displays a summarized list of moments (posts) with essential details such as title, excerpt, author, date, and interaction options.

## Usage

Head Content(for including necessary scripts/styles)

```html
<th:block th:insert="~{components/list-moment-summary/template :: headContent}"></th:block>
```

Content Insertion

```html
<th:block th:insert="~{components/list-moment-summary/template :: content(moments, isIndexPage)}"></th:block>
```

API

- `moments`: A collection of moment objects to be displayed in the list.
- `isIndexPage`: A boolean indicating if the current page is the index page.
