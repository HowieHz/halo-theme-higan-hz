---
outline: deep
---

# Responsive Breakpoints

Responsive breakpoints are viewport width ranges used to apply different layouts to the same page across mobile, tablet, and desktop devices.

This project uses the following viewport width ranges to classify device types.

## Breakpoint Definitions

- Mobile: `width < 640px`
- Tablet: `640px <= width < 1024px`
- Desktop: `1024px <= width`

## Preferred Syntax

Use the modern range syntax (Media Queries Level 4):

```css
@media (width < 640px) {
  /* mobile */
}

@media (640px <= width < 1024px) {
  /* tablet */
}

@media (width >= 1024px) {
  /* desktop */
}
```

## Compatible Syntax

If you need broader compatibility with older syntax, use these equivalent rules:

```css
@media not (min-width: 640px) {
  /* mobile */
}

@media (min-width: 640px) and (not (min-width: 1024px)) {
  /* tablet */
}

@media (min-width: 1024px) {
  /* desktop */
}
```

## Implementation Rules

- New page styles should use the breakpoint ranges defined in this specification by default.
- If a component must use non-standard breakpoints, annotate the reason next to the relevant style rule.
- Unless explicitly stated otherwise, breakpoint definitions in both docs and code should remain consistent with this page.
