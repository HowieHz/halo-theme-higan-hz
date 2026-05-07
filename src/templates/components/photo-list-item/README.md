# Photo List Item Component

## Description

This component renders a single photo `<li>` with responsive image
sources and an optional inline style suffix for fade-in behavior.

## Usage

```html
<th:block th:replace="~{components/photo-list-item/template :: body(${photo}, '')}"></th:block>
<th:block th:replace="~{components/photo-list-item/template :: body(${photo}, 'opacity: 0; ')}"></th:block>
```
