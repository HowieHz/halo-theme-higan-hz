# Example Component

## Description

This is a template component that serves as a reference for creating new components in the Halo theme.
It demonstrates the standard structure and documentation format for theme components.

## Usage

Head Content (for including necessary scripts/styles)

```html
<th:block th:insert="~{components/example/template :: headContent}"></th:block>
```

Content Insertion

```html
<th:block th:insert="~{components/example/template :: content(parameter)}"></th:block>
```

## Parameters

- `parameter`: Description of the parameter that this component accepts.
