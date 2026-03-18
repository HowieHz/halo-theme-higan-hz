# Instant.page Injection

## Description

This component enables instant.page by importing the package entry and injecting the corresponding module script into the page.
It is used to preload likely next-page navigations and improve perceived page loading speed.

## Usage

Head Content (for including the instant.page module script)

```html
<th:block th:insert="~{components/instantpage-injection/template :: head}"></th:block>
```
