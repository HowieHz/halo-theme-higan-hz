# Halo Comment Widget Component

## Description

This component provides a widget for displaying comments on posts in the Halo theme.

## Usage

Head Content (for including necessary scripts/styles)

```html
<th:block th:insert="~{components/halo-comment-widget/template :: headContent}"></th:block>
```

Content Insertion

```html
<div th:if="${haloCommentEnabled}">
  <halo:comment group="content.halo.run" kind="Post" th:attr="name=${post.metadata.name}" />
</div>
```

## Docs

[halo:comment](https://docs.halo.run/developer-guide/theme/template-tag#halo)
