import type {} from "../types/window-create-toc";

import toc, { HtmlElementNode } from "@jsdevtools/rehype-toc";
import parse from "rehype-parse";
import slug from "rehype-slug";
import stringify from "rehype-stringify";
import { unified } from "unified";

/**
 * Generates a Table of Contents (TOC) from the headings within a specified HTML content element
 * and injects the generated TOC into a target DOM element.
 *
 * @param contentSelector - CSS selector for the element containing the content from which headings will be retrieved to construct the TOC.
 * @param tocSelector - CSS selector for the DOM element where the generated TOC should be displayed.
 * @param headingSelector - A string of heading selectors (e.g., "h1, h2, h3") to select within the contentSelector element for inclusion in the TOC.
 */
window.initTOC = (contentSelector: string, tocSelector: string, headingSelector: string = "h1, h2, h3, h4") => {
  // Early return if input HTML is empty or undefined
  const contentRootDom = document.querySelector<HTMLElement>(contentSelector);
  if (!contentRootDom) {
    console.warn(`Element not found for selector: ${contentSelector}`);
    return;
  }

  // Create a Rehype processor with the TOC plugin
  const processor = unified()
    .use(parse) // Parse HTML into a syntax tree
    .use(slug) // Add id attributes to headings
    .use(toc, {
      // Define CSS classes for TOC elements
      cssClasses: {
        list: "toc-child",
        toc: "toc",
        link: "toc-link",
        listItem: "toc-item",
      },
      /**
       * Customize the overall TOC structure
       * @param t - The TOC element node
       * @returns Modified TOC structure with custom container
       */
      customizeTOC(t: HtmlElementNode) {
        const children = t.children?.flatMap((item) => (item as HtmlElementNode).children || []) || [];

        return {
          type: "element",
          tagName: "ol",
          properties: {
            id: "toc-container",
            className: "toc",
          },
          children: children,
        };
      },
      /**
       * Customize individual TOC items with numbering and structure
       * @param tocItem - The original TOC item element
       * @param heading - The heading element this TOC item refers to
       * @returns Modified TOC item with custom numbering and structure
       */
      customizeTOCItem(tocItem, heading) {
        // Extract heading level from tag name (h1, h2, h3, etc.)
        const headingNumber = parseInt(heading.tagName.slice(-1), 10);
        let depth = headingNumber;
        return {
          type: "element",
          tagName: "li",
          properties: {
            className: `toc-item toc-level-${headingNumber}`,
          },
          children: [
            {
              ...tocItem.children[0],
              children: [
                // Add numbering span
                {
                  type: "element",
                  tagName: "span",
                  properties: {
                    class: "toc-number",
                  },
                  children: [
                    {
                      type: "text",
                      value: `${depth++}.`,
                    },
                  ],
                },
                // Add text content span
                {
                  type: "element",
                  tagName: "span",
                  properties: {
                    class: "toc-text",
                  },
                  children: [...((tocItem.children[0] as HtmlElementNode).children || [])],
                },
              ],
            },
            // Preserve any nested TOC items
            ...tocItem.children.slice(1),
          ],
        };
      },
    })
    .use(stringify); // Convert syntax tree back to HTML string

  // Find the target DOM element where TOC will be inserted
  const tocRootDom = document.querySelector<HTMLElement>(tocSelector);
  if (!tocRootDom) {
    console.warn(`Element not found for TOC selector: ${tocSelector}`);
    return;
  }

  // Append the TOC element to the target DOM
  const tocFragment = document
    .createRange()
    .createContextualFragment(processor.processSync(contentRootDom.innerHTML).toString());
  const tocContainer = tocFragment.getElementById("toc-container");
  if (tocContainer) {
    tocRootDom.appendChild(tocContainer);
  }

  // Cache original headings
  const reversedOriginalHeadings = Array.from(contentRootDom.querySelectorAll<HTMLElement>(headingSelector)).reverse();

  // Cache corresponding TOC links
  const tocLinks = reversedOriginalHeadings.map((h) =>
    tocRootDom.querySelector<HTMLElement>(`.toc-link[href="#${h.id}"]`),
  ) as HTMLElement[];

  const tocActiveClassName = "toc-active";

  // toc collapse control
  window.addEventListener(
    "scroll",
    () => {
      // remove all active class
      tocLinks.forEach((tocLink) => {
        tocLink?.classList.remove(tocActiveClassName);
      });
      for (const [index, heading] of reversedOriginalHeadings.entries()) {
        if (pageYOffset >= heading.offsetTop - 50) {
          tocLinks[index].classList.add(tocActiveClassName);
        }
      }
    },
    { passive: true },
  );
  return;
};
