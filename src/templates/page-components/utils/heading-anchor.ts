/**
 * Inserts a clickable `#` anchor link before the text of each heading that has an id,
 * allowing users to copy a direct link to that heading.
 *
 * @param contentSelector - CSS selector for the element containing the headings.
 * @param headingSelector - CSS selector for heading elements to process.
 */
export function initHeadingAnchors(contentSelector: string, headingSelector = "h1, h2, h3, h4, h5, h6"): void {
  const contentRoot = document.querySelector<HTMLElement>(contentSelector);
  if (!contentRoot) return;

  contentRoot.querySelectorAll<HTMLElement>(headingSelector).forEach((heading) => {
    if (!heading.id) return;
    if (heading.querySelector(".heading-anchor")) return;

    const anchor = document.createElement("a");
    anchor.href = `#${heading.id}`;
    anchor.className = "heading-anchor";
    anchor.setAttribute("aria-label", `Permalink to "${heading.textContent?.trim() ?? ""}"`);

    heading.prepend(anchor);
  });
}
