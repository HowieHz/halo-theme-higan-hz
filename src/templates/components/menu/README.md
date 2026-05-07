# Menu Component

## Description

This component renders the shared site menu fragments, including:

- the menu container with optional mobile toggle icon
- the base menu list
- menu items
- submenu-capable menu item content

## Usage

Head Content (for including necessary scripts/styles)

```html
<th:block th:insert="~{components/menu/template :: head}"></th:block>
```

Menu Content

```html
<th:block th:insert="~{components/menu/template :: menu(showIcon=true)}"></th:block>
```

Base Menu Content

```html
<th:block th:insert="~{components/menu/template :: base-menu}"></th:block>
```

## Parameters

- `showIcon`: Whether to render the menu toggle icon entry.
