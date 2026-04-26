# Heading Anchor SVG Component

## Description

This component renders a `<template id="heading-anchor-svg">` containing the user-configured SVG icon when `theme.config.post_styles.heading_anchor_svg` is non-empty.  
The `initHeadingAnchors` function reads
`template.content.querySelector("svg")`, clones the SVG, and injects
it into each `.heading-anchor` link as a `.heading-anchor-icon` span.
When an SVG icon is present, the CSS `::before` symbol is suppressed
via `:has(.heading-anchor-icon)::before { content: none }`.

## Usage

Body Content

```html
<th:block th:insert="~{components/heading-anchor-svg/template :: body}"></th:block>
```
