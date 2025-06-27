import toc, { HtmlElementNode } from "@jsdevtools/rehype-toc";
import parse from "rehype-parse";
import slug from "rehype-slug";
import stringify from "rehype-stringify";
import { unified } from "unified";

/**
 * Generates a Table of Contents (TOC) from HTML content and injects it into the specified DOM element
 * @param inputHTML - The HTML content to generate TOC from
 * @param targetDomSelector - CSS selector for the DOM element where TOC will be inserted
 */
export const generateTOC = (inputHTML: string, targetDomSelector: string) => {
  // Early return if input HTML is empty or undefined
  if (!inputHTML) {
    console.warn("inputHTML is empty or undefined");
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
        // @ts-expect-error expect-error
        const children = t.children?.flatMap((item) => item.children);

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
                  // @ts-expect-error expect-error
                  children: [...tocItem.children[0].children],
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

  // Process the HTML, adding heading IDs and Table of Contents
  const outputHTML = processor.processSync(inputHTML);

  // Find the target DOM element where TOC will be inserted
  const targetDom = document.querySelector(targetDomSelector);
  if (!targetDom) {
    console.warn(`Failed to generate toc to targetDom ${targetDom}, processed html is: ${outputHTML}`);
    return;
  }

  // Create a document fragment from the processed HTML and extract the TOC container
  const tocElement = document
    .createRange()
    .createContextualFragment(outputHTML.toString())
    .getElementById("toc-container");

  // Append the TOC element to the target DOM if it exists
  if (tocElement) {
    targetDom.appendChild(tocElement);
  }
  return;
};
