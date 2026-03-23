/**
 * Inserts a clickable `#` anchor link into each heading. If a heading lacks an `id`,
 * one is generated from its text content. Headings with empty text are skipped.
 *
 * @param contentSelector - CSS selector for the element containing the headings.
 * @param headingSelector - CSS selector for heading elements to process.
 */
export function initHeadingAnchors(contentSelector: string, headingSelector = "h1, h2, h3, h4, h5, h6"): void {
  const contentRoot = document.querySelector<HTMLElement>(contentSelector);
  if (!contentRoot) return;

  contentRoot.querySelectorAll<HTMLElement>(headingSelector).forEach((heading) => {
    if (!heading.id) {
      const text = heading.textContent?.trim() ?? "";
      if (!text) return;
      heading.id = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\p{L}\p{N}-]/gu, "");
      if (!heading.id) return;
    }
    if (heading.querySelector(".heading-anchor")) return;

    const anchor = document.createElement("a");
    anchor.href = `#${heading.id}`;
    anchor.className = "heading-anchor";
    anchor.setAttribute("aria-label", `Permalink to "${heading.textContent?.trim() ?? ""}"`);

    heading.append(anchor);
  });
}
