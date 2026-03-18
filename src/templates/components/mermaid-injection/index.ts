import type {
  MermaidConfig,
  MermaidModule,
  MermaidRenderResult,
  MermaidRuntimeConfig,
  MermaidTheme,
  ReferenceAttribute,
} from "./types";

const MERMAID_CONFIG_HINT =
  "Please provide a Mermaid config as a JS object literal string such as { startOnLoad: false }.";
const MERMAID_LOG_PREFIX = "[Higan Haozi][mermaid-injection]";

function isMermaidConfig(value: unknown): value is MermaidConfig {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function genUUID(): string {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c: string) => {
    const digit = Number(c);
    const randomValue = crypto.getRandomValues(new Uint8Array(1))[0];
    return (digit ^ (randomValue & (15 >> (digit / 4)))).toString(16);
  });
}

function getMermaidRuntimeConfig(): MermaidRuntimeConfig | null {
  const configElement = document.querySelector<HTMLScriptElement>("#mermaid-config");
  const configText = configElement?.textContent?.trim();

  if (!configText) {
    return null;
  }

  const runtimeConfig = JSON.parse(configText) as {
    url: string;
    selector: string;
    config?: string;
  };
  const trimmedConfig = runtimeConfig.config?.trim();

  let parsedConfig: MermaidConfig | undefined;
  if (trimmedConfig) {
    try {
      const objectLiteralConfig = Function(`"use strict"; return (${trimmedConfig});`)() as unknown;
      if (isMermaidConfig(objectLiteralConfig)) {
        parsedConfig = objectLiteralConfig;
      } else {
        console.error(`${MERMAID_LOG_PREFIX} Mermaid config must evaluate to an object. ${MERMAID_CONFIG_HINT}`, {
          config: trimmedConfig,
          parsedConfig: objectLiteralConfig,
        });
      }
    } catch (objectLiteralError: unknown) {
      console.error(
        `${MERMAID_LOG_PREFIX} Failed to parse Mermaid config as a JS object literal string. ${MERMAID_CONFIG_HINT}`,
        {
          config: trimmedConfig,
          objectLiteralError,
        },
      );
    }
  }

  return {
    url: runtimeConfig.url,
    selector: runtimeConfig.selector,
    config: parsedConfig,
  };
}

function updateAttribute(refElement: Element, attribute: ReferenceAttribute, originalId: string, newId: string): void {
  const value = refElement.getAttribute(attribute);
  if (value?.includes(`#${originalId}`)) {
    refElement.setAttribute(attribute, value.replace(`#${originalId}`, `#${newId}`));
  }
}

function renderMermaid(mermaid: MermaidModule, item: HTMLElement, id: string, theme: MermaidTheme): Promise<void> {
  const fallbackContent = item.textContent ?? "";
  let rawContent = fallbackContent;

  // If the element is a text-diagram mermaid block, read from data-content
  // to support content inserted by the default editor of the text-diagram plugin.
  if (item.tagName === "TEXT-DIAGRAM" && item.getAttribute("data-type") === "mermaid") {
    rawContent = item.getAttribute("data-content") ?? fallbackContent;
  }

  const content = theme === null ? rawContent : `%%{init: { "theme": "${theme}" } }%%\n${rawContent}`;
  const renderId = `${theme}-${id}`;

  return mermaid
    .render(renderId, content)
    .then((mermaidData: MermaidRenderResult) => {
      const parentElement = item.parentElement;
      if (!parentElement) {
        return;
      }

      const div = document.createElement("div");
      const divClassNames = ["rendered-mermaid"];
      if (theme !== null) {
        divClassNames.push(theme);
      }

      div.classList.add(...divClassNames);
      div.innerHTML = mermaidData.svg;
      parentElement.insertBefore(div, item.nextSibling);
      div.setAttribute("data-processed", "true");

      // Prefix ids inside each rendered SVG first to avoid collisions before
      // upstream fully addresses the issue: https://github.com/mermaid-js/mermaid/issues/5741
      const svgElement = div.querySelector("svg");
      if (!svgElement) {
        item.style.display = "none";
        return;
      }

      // Update ids and all attributes that reference them.
      svgElement.querySelectorAll("[id]").forEach((element) => {
        const originalId = element.getAttribute("id");
        if (!originalId) {
          return;
        }

        const newId = `${theme}-${id}-${originalId}`;
        element.setAttribute("id", newId);

        const elementsUsingId = svgElement.querySelectorAll(
          `[marker-start*="#${originalId}"], [marker-mid*="#${originalId}"], [marker-end*="#${originalId}"], [href*="#${originalId}"], [xlink\\:href*="#${originalId}"]`,
        );

        // marker references commonly use marker-start, marker-mid, marker-end.
        // symbol/use references may still rely on deprecated xlink:href, so
        // both href and xlink:href need to stay in sync.
        const attributesToUpdate: ReferenceAttribute[] = [
          "marker-start",
          "marker-mid",
          "marker-end",
          "href",
          "xlink:href",
        ];

        elementsUsingId.forEach((refElement) => {
          attributesToUpdate.forEach((attribute) => {
            updateAttribute(refElement, attribute, originalId, newId);
          });
        });
      });

      // Hide the original source element after rendering succeeds.
      item.style.display = "none";
    })
    .catch((error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorElement = document.querySelector<HTMLElement>(`#${renderId}`);
      const errorMarkup = errorElement?.outerHTML ?? "";

      item.innerHTML = `${errorMarkup}<br>
<div style="text-align: left"><small>${errorMessage.replace(/\n/g, "<br>")}</small></div>`;
      errorElement?.parentElement?.remove();
    });
}

async function initMermaid(): Promise<void> {
  const runtimeConfig = getMermaidRuntimeConfig();
  if (!runtimeConfig) {
    return;
  }

  const { url, selector, config } = runtimeConfig;
  const { default: mermaid } = (await import(url)) as {
    default: MermaidModule;
  };

  mermaid.initialize(config);

  document.querySelectorAll<HTMLElement>(selector).forEach((item) => {
    const rawContent = item.textContent ?? "";

    // Skip elements that are already processed or do not contain content.
    if (item.getAttribute("data-processed") === "true" || rawContent.trim() === "") {
      return;
    }

    // Generate a unique id for each render.
    const id = `mermaid${genUUID()}`;

    // Non-auto mode renders only the requested theme variant.
    if (!item.classList.contains("auto")) {
      if (item.classList.contains("dark")) {
        void renderMermaid(mermaid, item, id, "dark");
      } else if (item.classList.contains("light")) {
        void renderMermaid(mermaid, item, id, "light");
      } else {
        void renderMermaid(mermaid, item, id, null);
      }

      item.setAttribute("data-processed", "true");
      return;
    }

    // Auto mode renders both dark and light variants.
    void renderMermaid(mermaid, item, id, "dark");
    void renderMermaid(mermaid, item, id, "light");

    item.setAttribute("data-processed", "true");
  });
}

void initMermaid();
