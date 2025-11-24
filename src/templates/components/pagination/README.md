# Pagination Component

## Description

This component provides pagination controls for navigating through paginated content such as posts or archives.
It includes previous and next buttons, and is designed to be easily integrated into various templates.

## Usage

Head Content(for including necessary scripts/styles)

```html
<th:block th:replace="~{components/pagination/template :: headContent}"></th:block>
```

Content Insertion(for displaying pagination controls)

```html
<th:block th:insert="~{components/pagination/template :: content(${posts})}"></th:block>
```

API

- `${posts}`: A pagination object containing pagination data (`hasPrevious()`, `hasNext()`, `prevUrl`, `nextUrl`, `totalPages`, `page`).
