# Pagination Component

## Description

This component provides pagination controls for navigating paginated content such as posts, moments, or archives.  
It shows previous and next navigation buttons, optionally including page number information, and is designed for easy integration into various templates.

## Usage

Head Content (for including necessary scripts/styles)

```html
<th:block th:insert="~{components/pagination/template :: headContent}"></th:block>
```

Content Insertion (for displaying pagination controls)

```html
<th:block th:insert="~{components/pagination/template :: content(posts)}"></th:block>
```

## Parameters

- `posts`: A pagination object containing pagination data with methods like `hasPrevious()`, `hasNext()` and properties including `prevUrl`, `nextUrl`, `totalPages`, and `page`.
