/**
 * Generates Tables of Contents (TOCs) from the headings within a specified HTML content element and injects the
 * generated TOCs into target DOM elements.
 *
 * @param contentSelector - CSS selector for the element containing the content from which headings will be retrieved to
 *   construct the TOC.
 * @param tocSelectors - CSS selectors for the DOM elements where the generated TOCs should be displayed.
 * @param headingSelector - A string of heading selectors (e.g., "h1, h2, h3") to select within the contentSelector
 *   element for inclusion in the TOC.
 */
export function initTOCs(contentSelector: string, tocSelectors: string[], headingSelector = "h1, h2, h3, h4"): void {
  const logPrefix = "[Higan Haozi][toc]";
  const contentRootDom = document.querySelector<HTMLElement>(contentSelector);

  if (!contentRootDom) {
    console.warn(`${logPrefix} Element not found for selector: ${contentSelector}`);
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
      const usedCount = usedIds.get(baseId) ?? 0; // Check how many times this id has been used
      if (usedCount) {
        h.id = `${baseId}-${usedCount}`;
      }
      usedIds.set(baseId, usedCount + 1);
    }
  });

  // Then, automatically generate ids for headings without id
  originalHeadings.forEach((h) => {
    if (h.id) return;
    const baseId = slugify(h.textContent || "heading") || "heading";
    let id = baseId;
    const usedCount = usedIds.get(baseId) ?? 0; // Check how many times this id has been used
    if (usedCount) {
      id = `${baseId}-${usedCount}`;
    }
    h.id = id;
    usedIds.set(baseId, usedCount + 1);
  });

  // Find the minimum heading level (e.g., if only h2~h4 in content, then minLevel=2)
  const headingLevels = originalHeadings.map((h) => parseInt(h.tagName.slice(1), 10));
  const minLevel = Math.min(...headingLevels);
  const maxLevel = Math.max(...headingLevels);

  // Build TOC tree structure
  interface TOCRoot {
    level: number;
    children: TOCNode[];
    parent?: TOCNode | TOCRoot;
  }

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
    while (parent.level >= level && parent.parent) {
      // parent.parent 一定存在，但为了避免使用条件断言，因此判断
      parent = parent.parent;
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

  interface StackItem {
    node: TOCNode;
    parentOl: HTMLOListElement;
  }

  function createTOCContainer(): HTMLOListElement {
    // Create the outermost TOC list
    const tocContainer = document.createElement("ol");
    tocContainer.className = "toc-container";

    // Render TOC tree as DOM
    const counters: Record<number, number> = {};
    const stack: StackItem[] = [];
    // Initialize stack with root nodes in reverse order to preserve sequence
    for (let i = tocTreeRoot.children.length - 1; i >= 0; i--) {
      stack.push({ node: tocTreeRoot.children[i], parentOl: tocContainer });
    }

    while (true) {
      const item = stack.pop();
      if (!item) {
        break;
      }
      const { node, parentOl } = item;
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
      a.className = `toc-link toc-link-h${level}`;

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
        childOl.className = `toc-child toc-child-${level}`;
        li.appendChild(childOl);
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ node: node.children[i], parentOl: childOl });
        }
      }

      parentOl.appendChild(li);
    }

    return tocContainer;
  }

  // Cache original headings
  const reversedOriginalHeadings = [...originalHeadings].reverse();
  const tocActiveClassName = "toc-active";

  tocSelectors.forEach((tocSelector) => {
    const tocRootDom = document.querySelector<HTMLElement>(tocSelector);

    if (!tocRootDom) {
      console.warn(`${logPrefix} Element not found for TOC selector: ${tocSelector}`);
      return;
    }
    const tocRoot = tocRootDom;

    // replace
    tocRoot.replaceChildren(createTOCContainer());

    // Cache corresponding TOC links
    const tocLinks = reversedOriginalHeadings.map((h) =>
      tocRoot.querySelector<HTMLElement>(`.toc-link[href="#${h.id}"]`),
    );

    let lastActiveLink: HTMLElement | null = null; // Cache the previously active TOC item

    // toc collapse control
    function handleTOCScrollHighlight() {
      let highlighted = false;
      let activeLink: HTMLElement | null = null;

      for (const [index, heading] of reversedOriginalHeadings.entries()) {
        if (pageYOffset >= heading.offsetTop - 50) {
          activeLink = tocLinks[index];
          highlighted = true;
          break;
        }
      }

      // If no heading is highlighted (i.e., the page is at the very top),
      // highlight the last TOC item (since the traversal order is reversed)
      if (!highlighted) {
        activeLink = tocLinks[tocLinks.length - 1];
      }

      // If the active item has not changed, do nothing
      if (activeLink === lastActiveLink) {
        return;
      }

      // Remove the old one first, then add the new one to avoid the menu collapsing and expanding again.
      // If you remove the class before adding it, collapsing the TOC will result in a short menu with only the top-level headings.
      // When you expand it again, the TOC will jump back to the top.
      if (activeLink) {
        activeLink.classList.add(tocActiveClassName);
      }
      if (lastActiveLink) {
        lastActiveLink.classList.remove(tocActiveClassName);
      }

      lastActiveLink = activeLink;

      // Auto-scroll TOC container to keep active item visible (desktop only)
      if (activeLink && tocRoot.id === "toc-desktop") {
        activeLink.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
    }

    handleTOCScrollHighlight();
    window.addEventListener("scroll", handleTOCScrollHighlight, { passive: true });
  });
  return;
}
