# List Post Summary Component

## Description

This component displays a summarized list of posts with comprehensive details, including title, publish date, categories, tags, and views.  
It also shows word count, estimated reading time, excerpt, and cover image.

## Usage

Head Content (for including necessary scripts/styles)

```html
<th:block th:insert="~{components/list-post-summary/template :: headContent}"></th:block>
```

Content Insertion

```html
<th:block th:insert="~{components/list-post-summary/template :: content(posts, pageTemplateName)}"></th:block>
```

## Parameters

- `posts`: A collection of post objects to be displayed in the list.
- `pageTemplateName`: An optional parameter, pass in a string representing the page template name.
