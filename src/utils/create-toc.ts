import type {} from "../types/window-create-toc";

/**
 * Generates a Table of Contents (TOC) from the headings within a specified HTML content element
 * and injects the generated TOC into a target DOM element.
 *
 * @param contentSelector - CSS selector for the element containing the content from which headings will be retrieved to construct the TOC.
 * @param tocSelector - CSS selector for the DOM element where the generated TOC should be displayed.
 * @param headingSelector - A string of heading selectors (e.g., "h1, h2, h3") to select within the contentSelector element for inclusion in the TOC.
 */
window.initTOC = (contentSelector: string, tocSelector: string, headingSelector: string = "h1, h2, h3, h4") => {
  const contentRootDom = document.querySelector<HTMLElement>(contentSelector);
  const tocRootDom = document.querySelector<HTMLElement>(tocSelector);

  if (!contentRootDom) {
    console.warn(`Element not found for selector: ${contentSelector}`);
    return;
  }
  if (!tocRootDom) {
    console.warn(`Element not found for TOC selector: ${tocSelector}`);
    return;
  }

  const originalHeadings = Array.from(contentRootDom.querySelectorAll<HTMLElement>(headingSelector));

  if (originalHeadings.length === 0) {
    return;
  }

  // Generate slug, compatible with most Markdown parser rules
  const slugify = (str: string) =>
    str
      .trim()
      .toLowerCase()
      .replace(/[\s]+/g, "-") // Convert whitespace to -
      .replace(/[^a-z0-9-]/g, "") // Remove non-alphanumeric and -
      .replace(/-+/g, "-") // Merge consecutive -
      .replace(/^-+|-+$/g, ""); // Remove leading and trailing -

  const usedIds = new Map<string, number>();
  // First, collect existing ids
  originalHeadings.forEach((h) => {
    if (h.id) {
      const baseId = h.id;
      let id = baseId;
      const usedCount = usedIds.get(baseId) ?? 0; // Check how many times this id has been used
      if (usedCount) {
        id = `${baseId}-${usedCount}`;
        h.id = id;
      }
      usedIds.set(id, usedCount + 1);
    }
  });

  // Then, automatically generate ids for headings without id
  originalHeadings.forEach((h) => {
    if (h.id) return;
    console.log(h, h.textContent);
    const baseId = slugify(h.textContent || "heading") || "heading";
    let id = baseId;
    const usedCount = usedIds.get(baseId) ?? 0; // Check how many times this id has been used
    if (usedCount) {
      id = `${baseId}-${usedCount}`;
    }
    h.id = id;
    usedIds.set(id, usedCount + 1);
  });

  // Find the minimum heading level (e.g., if only h2~h4 in content, then minLevel=2)
  const headingLevels = originalHeadings.map((h) => parseInt(h.tagName.slice(1), 10));
  const minLevel = Math.min(...headingLevels);
  const maxLevel = Math.max(...headingLevels);

  // Create the outermost ol#toc-container.toc
  const tocContainer = document.createElement("ol");
  tocContainer.id = "toc-container";
  tocContainer.className = "toc";

  // Build TOC tree structure
  type TOCRoot = {
    level: number;
    children: TOCNode[];
    parent?: TOCNode | TOCRoot;
  };

  type TOCNode = TOCRoot & {
    heading: HTMLElement;
  };

  const tocTreeRoot: TOCRoot = {
    level: minLevel - 1,
    children: [],
  };

  let lastNode: TOCRoot = tocTreeRoot;

  originalHeadings.forEach((heading) => {
    const level = parseInt(heading.tagName.slice(1), 10);
    let parent = lastNode;
    // Roll back to the appropriate parent node
    while (parent.level >= level) {
      parent = parent.parent!;
    }
    const node: TOCNode = {
      level,
      heading,
      children: [],
      parent,
    };
    parent.children.push(node);
    lastNode = node;
  });

  // Render TOC tree as DOM
  const counters: Record<number, number> = {};

  type StackItem = { node: TOCNode; parentOl: HTMLOListElement };
  const stack: StackItem[] = [];
  // Initialize stack with root nodes in reverse order to preserve sequence
  for (let i = tocTreeRoot.children.length - 1; i >= 0; i--) {
    stack.push({ node: tocTreeRoot.children[i], parentOl: tocContainer });
  }

  while (stack.length) {
    const { node, parentOl } = stack.pop()!;
    const level = node.level;
    // Update numbering and reset deeper levels
    counters[level] = (counters[level] || 0) + 1;
    for (let lv = level + 1; lv <= maxLevel; lv++) {
      counters[lv] = 0;
    }
    // Build numbering string
    const numArr: number[] = [];
    for (let lv = minLevel; lv <= level; lv++) {
      numArr.push(counters[lv] || 0);
    }
    const numStr = numArr.join(".");

    // Create li and a
    const li = document.createElement("li");
    li.className = `toc-item toc-level-${level}`;

    const a = document.createElement("a");
    a.href = `#${node.heading.id}`;
    a.classList.add("toc-link", `toc-link-h${level}`);

    // Numbering span
    const spanNum = document.createElement("span");
    spanNum.className = "toc-number";
    spanNum.textContent = numStr + ".";

    // Text span
    const spanText = document.createElement("span");
    spanText.className = "toc-text";
    spanText.textContent = (node.heading.textContent ?? "").trim();

    a.append(spanNum, spanText);
    li.appendChild(a);

    // If there are children, create an OL and push them onto the stack
    if (node.children.length > 0) {
      const childOl = document.createElement("ol");
      childOl.classList.add("toc-child", `toc-child-${level}`);
      li.appendChild(childOl);
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push({ node: node.children[i], parentOl: childOl });
      }
    }

    parentOl.appendChild(li);
  }

  // replace
  tocRootDom.replaceChildren(tocContainer);

  // Cache original headings
  const reversedOriginalHeadings = Array.from(contentRootDom.querySelectorAll<HTMLElement>(headingSelector)).reverse();

  // Cache corresponding TOC links
  const tocLinks = reversedOriginalHeadings.map((h) =>
    tocRootDom.querySelector<HTMLElement>(`.toc-link[href="#${h.id}"]`),
  ) as HTMLElement[];

  const tocActiveClassName = "toc-active";

  // toc collapse control
  function handleTOCScrollHighlight() {
    // remove all active class
    tocLinks.forEach((tocLink) => {
      tocLink?.classList.remove(tocActiveClassName);
    });
    let highlighted: boolean = false;
    for (const [index, heading] of reversedOriginalHeadings.entries()) {
      if (pageYOffset >= heading.offsetTop - 50) {
        tocLinks[index].classList.add(tocActiveClassName);
        highlighted = true;
        break;
      }
    }
    // If no heading is highlighted (i.e., the page is at the very top),
    // highlight the last TOC item (since the traversal order is reversed)
    if (!highlighted) {
      tocLinks[tocLinks.length - 1].classList.add(tocActiveClassName);
    }
    return;
  }

  handleTOCScrollHighlight();
  window.addEventListener("scroll", handleTOCScrollHighlight, { passive: true });
  return;
};
