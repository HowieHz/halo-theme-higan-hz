# Post Edit Button Component

## Description

This component renders the optional post edit button and loads its permission check only when enabled.

## Usage

Head Content

```html
<th:block th:insert="~{components/post-edit-button/template :: head}"></th:block>
```

Body Content

```html
<th:block th:insert="~{components/post-edit-button/template :: body(postName=${post.metadata.name})}"></th:block>
```
