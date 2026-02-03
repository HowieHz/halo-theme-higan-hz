# List Moment Summary Component

## Description

This component displays a summarized list of moments (short posts) with comprehensive details, including author information, publish date, content, and media (photos/videos).
It also shows estimated reading time, word count, supports upvote functionality, and an optional comment section.

## Usage

Head Content (for including necessary scripts/styles)

```html
<th:block th:insert="~{components/list-moment-summary/template :: headContent(moments)}"></th:block>
```

or

```html
<th:block th:insert="~{components/list-moment-summary/template :: headContent}"></th:block>
```

Content Insertion

```html
<th:block th:insert="~{components/list-moment-summary/template :: content(moments, pageTemplateName)}"></th:block>
```

## Parameters

- `moments`: A collection of moment objects to be displayed in the list.
- `pageTemplateName`: pass in a string representing the page template name.
