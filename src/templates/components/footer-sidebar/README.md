# Footer Sidebar Component

## Description

Wraps the `<main>` content area with an optional sticky sidebar showing the footer bottom content.
When sidebar mode is inactive, the fragment renders `wrapped` as-is without extra DOM.

The sidebar position, opacity, and narrow-screen behavior are all read directly from theme config.

## Usage

```html
<th:block
  th:replace="~{components/footer-sidebar/template :: body(
                wrapped = ~{:: main},
                isSidebar = ${isSidebar},
                isBottomSidebarContent = ${isBottomSidebarContent}
              )}"
>
  <main>
    <th:block th:replace="${content}"></th:block>
  </main>
</th:block>
```

## Parameters

- `wrapped`: The main content fragment, typically `~{:: main}`.
- `isSidebar`: Whether sidebar mode is active (position is set and not `inline`).
- `isBottomSidebarContent`: Whether bottom/sidebar content should render (`is_footer_content_show` or `is_18n_footer_content_show`).
