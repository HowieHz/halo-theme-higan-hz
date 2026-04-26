/**
 * Inserts a clickable `#` anchor link into each heading. If a heading lacks an `id`, one is generated from its text
 * content. Headings with empty text are skipped.
 *
 * When a `#heading-anchor-svg` element exists in the DOM containing an SVG, that SVG is cloned and injected into each
 * anchor instead of relying on the CSS `::before` symbol.
 *
 * @param contentSelector - CSS selector for the element containing the headings.
 * @param headingSelector - CSS selector for heading elements to process.
 */
export function initHeadingAnchors(contentSelector: string, headingSelector = "h1, h2, h3, h4, h5, h6"): void {
  const contentRoot = document.querySelector<HTMLElement>(contentSelector);
  if (!contentRoot) return;

  const svgTemplate = document.getElementById("heading-anchor-svg") as HTMLTemplateElement | null;
  const svgElement = svgTemplate?.content.querySelector("svg") ?? null;

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

    if (svgElement) {
      const iconSpan = document.createElement("span");
      iconSpan.className = "heading-anchor-icon";
      iconSpan.setAttribute("aria-hidden", "true");
      iconSpan.append(svgElement.cloneNode(true));
      anchor.append(iconSpan);
    }

    heading.append(anchor);
  });
}
