# Page Edit Button Component

## Description

This component renders the optional page edit button and loads its permission check only when enabled.

## Usage

Head Content

```html
<th:block th:insert="~{components/page-edit-button/template :: head}"></th:block>
```

Body Content

```html
<th:block th:insert="~{components/page-edit-button/template :: body(pageName=${singlePage.metadata.name})}"></th:block>
```
