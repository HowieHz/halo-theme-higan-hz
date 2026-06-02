import mermaid, { type MermaidConfig, type RenderResult } from "mermaid";

type MermaidRenderThemeMode = "dark" | "light" | null;

type MermaidRenderJob = {
  sourceElement: HTMLElement;
  rawContent: string;
  themes: MermaidRenderThemeMode[];
};

type ReferenceAttribute = "marker-start" | "marker-mid" | "marker-end" | "xlink:href" | "href";

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

function getMermaidRuntimeConfig(): { selector: string; config?: MermaidConfig } | null {
  const configElement = document.querySelector<HTMLScriptElement>("#mermaid-config");
  const configText = configElement?.textContent?.trim();

  if (!configText) {
    return null;
  }

  const runtimeConfig = JSON.parse(configText) as {
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

function getMermaidRenderThemes(sourceElement: HTMLElement): MermaidRenderThemeMode[] {
  if (sourceElement.classList.contains("auto")) {
    // Auto mode renders both dark and light variants.
    return ["dark", "light"];
  }

  // Non-auto mode renders only the requested theme variant.
  if (sourceElement.classList.contains("dark")) {
    return ["dark"];
  }

  if (sourceElement.classList.contains("light")) {
    return ["light"];
  }

  return [null];
}

function collectMermaidRenderJobs(container: HTMLElement): MermaidRenderJob[] {
  const jobs: MermaidRenderJob[] = [];

  Array.from(container.children).forEach((child) => {
    if (!(child instanceof HTMLElement)) {
      return;
    }

    if (child.getAttribute("data-processed") === "true") {
      return;
    }

    const fallbackContent = child.textContent ?? "";

    // 来自文本绘图插件 https://www.halo.run/store/apps/app-ahBRi
    // 特征是 <text-diagram data-type="mermaid" data-content="..."></text-diagram>
    // 内容在 data-content 属性中
    // 测试方法：官方编辑器 + 文本绘图插件 + 插入文本绘图提供的组件
    if (child.localName === "text-diagram" && child.getAttribute("data-type") === "mermaid") {
      jobs.push({
        sourceElement: child,
        rawContent: child.getAttribute("data-content") ?? fallbackContent,
        themes: [null],
      });
      return;
    }

    // 来自 Vditor 编辑器插件的 Mermaid 代码块 https://www.halo.run/store/apps/app-uBcYw
    // ```mermaid ... ``` 渲染后特征是 <div class="mermaid">...<div class="language-mermaid">...</div></div>
    // 内容在其文本内容中
    // 测试方法: Vditor 编辑器+输入 ```mermaid ... ```
    const codeElement = child.matches("div.mermaid")
      ? child.querySelector<HTMLElement>(":scope > div.language-mermaid")
      : null;
    if (codeElement) {
      jobs.push({
        sourceElement: child,
        rawContent: codeElement.textContent ?? fallbackContent,
        themes: getMermaidRenderThemes(child),
      });
      return;
    }

    // 来自官方编辑器的 Mermaid 代码块
    // 特征是 <pre><code class="language-mermaid">...</code></pre>
    // 内容在 code 元素的文本内容中
    // 测试方法: 官方编辑器 + 插入代码块 + 选择 Mermaid 语言
    const officialCodeElement = child.matches("pre")
      ? child.querySelector<HTMLElement>(":scope > code.language-mermaid")
      : null;
    if (officialCodeElement) {
      jobs.push({
        sourceElement: child,
        rawContent: officialCodeElement.textContent ?? fallbackContent,
        themes: [null],
      });
    }
  });

  return jobs;
}

function renderMermaid(
  sourceElement: HTMLElement,
  rawContent: string,
  id: string,
  theme: MermaidRenderThemeMode,
): Promise<void> {
  const content = theme === null ? rawContent : `%%{init: { "theme": "${theme}" } }%%\n${rawContent}`;
  const renderId = `${theme}-${id}`;

  return mermaid
    .render(renderId, content)
    .then((mermaidData: RenderResult) => {
      const parentElement = sourceElement.parentElement;
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
      parentElement.insertBefore(div, sourceElement.nextSibling);

      // Prefix ids inside each rendered SVG first to avoid collisions before
      // upstream fully addresses the issue: https://github.com/mermaid-js/mermaid/issues/5741
      const svgElement = div.querySelector("svg");
      if (!svgElement) {
        sourceElement.style.display = "none";
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
      sourceElement.style.display = "none";
    })
    .catch((error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorElement = document.querySelector<HTMLElement>(`#${renderId}`);
      const errorMarkup = errorElement?.outerHTML ?? "";

      sourceElement.innerHTML = `${errorMarkup}<br>
<div style="text-align: left"><small>${errorMessage.replace(/\n/g, "<br>")}</small></div>`;
      errorElement?.parentElement?.remove();
    });
}

function initMermaid(): void {
  const runtimeConfig = getMermaidRuntimeConfig();
  if (!runtimeConfig) {
    return;
  }

  const { selector, config } = runtimeConfig;

  mermaid.initialize(config ?? {});

  document.querySelectorAll<HTMLElement>(selector).forEach((container) => {
    collectMermaidRenderJobs(container).forEach((job) => {
      // Skip elements that are already processed or do not contain content.
      if (job.sourceElement.getAttribute("data-processed") === "true" || job.rawContent.trim() === "") {
        return;
      }

      // Generate a unique id for each render.
      const id = `mermaid${genUUID()}`;

      job.themes.forEach((theme) => {
        void renderMermaid(job.sourceElement, job.rawContent, id, theme);
      });

      job.sourceElement.setAttribute("data-processed", "true");
    });
  });
}

initMermaid();
