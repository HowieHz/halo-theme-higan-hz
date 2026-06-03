import mermaid, { type MermaidConfig, type RenderResult } from "mermaid";

type MermaidRenderThemeMode = "dark" | "light" | null;

type MermaidRenderJob = {
  sourceElement: HTMLElement;
  dataProcessedElement: HTMLElement;
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

function getFrontMatterEndIndex(rawContent: string): number | null {
  const frontMatterMatch = rawContent.match(/^---[ \t]*(?:\r?\n)[\s\S]*?(?:\r?\n)---[ \t]*(?:\r?\n|$)/);

  return frontMatterMatch ? frontMatterMatch[0].length : null;
}

function buildMermaidContent(rawContent: string, theme: MermaidRenderThemeMode): string {
  if (theme === null) {
    return rawContent;
  }

  const initDirective = `%%{init: { "theme": "${theme}" } }%%`;
  const lineBreak = rawContent.includes("\r\n") ? "\r\n" : "\n";
  const frontMatterEndIndex = getFrontMatterEndIndex(rawContent);

  // %%{ ... }%% 注入需要放在用户输入的 frontmatter 后面，其余内容（其他的 %%{ ... }%%、图表正文）前面。
  // 如果用户也给了 %%{ ... }%%，Mermaid 会将多个 init 指令会按出现顺序深度合并；同名配置项以后面的为准。

  if (frontMatterEndIndex === null) {
    return `${initDirective}${lineBreak}${rawContent}`;
  }

  // Mermaid frontmatter must stay at the beginning of the diagram.
  return `${rawContent.slice(0, frontMatterEndIndex)}${initDirective}${lineBreak}${rawContent.slice(frontMatterEndIndex)}`;
}

function isMermaidDataProcessed(dataProcessedElement: HTMLElement): boolean {
  // data-processed="true" 是渲染库用来防止重复渲染的运行时状态标记
  //
  // - Vditor 插件链路：data-processed 由 Vditor.mermaidRender 在调用 mermaid.render(...)
  //   后写入，位置是它命中的 .language-mermaid 节点本身，不是 pre 或外层文章容器。
  // - Mermaid run/init 链路：data-processed 由 Mermaid 自己写入，位置是 run() 命中的元素。
  // - 文本绘图插件默认命中 text-diagram[data-type=mermaid]，所以标记留在外层 text-diagram 上。
  //
  // 动态更新或强制重渲染前需要移除该属性，或重建对应的源节点。
  return dataProcessedElement.getAttribute("data-processed") === "true";
}

function markMermaidSourceProcessed(job: MermaidRenderJob): void {
  // mermaid.render() 不会写入 data-processed；这里按上游链路的实际标记节点补写。
  job.dataProcessedElement.setAttribute("data-processed", "true");
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

function pushMermaidRenderJob(jobs: MermaidRenderJob[], job: MermaidRenderJob): void {
  if (isMermaidDataProcessed(job.dataProcessedElement)) {
    return;
  }

  jobs.push(job);
}

function collectMermaidRenderJobs(container: HTMLElement): MermaidRenderJob[] {
  const jobs: MermaidRenderJob[] = [];

  // 默认编辑器方法一
  container.querySelectorAll<HTMLElement>("pre > code.language-mermaid").forEach((codeElement) => {
    const sourceElement = codeElement.parentElement;
    if (!sourceElement?.matches("pre")) {
      return;
    }
    // 来自官方编辑器的 Mermaid 代码块
    // 特征是 <pre><code class="language-mermaid">...</code></pre>
    // 渲染标记位是 <pre><code class="language-mermaid" data-processed="true">...</code></pre>
    // 内容在 code 元素的文本内容中
    // 测试方法：官方编辑器 + 插入代码块 + 选择 Mermaid 语言
    // 效果：自动识别并明暗双倍渲染
    pushMermaidRenderJob(jobs, {
      sourceElement,
      dataProcessedElement: codeElement,
      rawContent: codeElement.textContent ?? sourceElement.textContent ?? "",
      themes: ["light", "dark"],
    });
  });

  // 默认编辑器方法二
  container.querySelectorAll<HTMLElement>('text-diagram[data-type="mermaid"]').forEach((sourceElement) => {
    // 来自文本绘图插件 https://www.halo.run/store/apps/app-ahBRi
    // 特征是 <text-diagram data-type="mermaid" data-content="..."></text-diagram>
    // 渲染标记位是 <text-diagram data-type="mermaid" data-content="..." data-processed="true"></text-diagram>
    // 内容在 data-content 属性中
    // 测试方法：官方编辑器 + 文本绘图插件 + 插入文本绘图提供的组件
    // 效果：自动识别并明暗双倍渲染
    pushMermaidRenderJob(jobs, {
      sourceElement,
      dataProcessedElement: sourceElement,
      rawContent: sourceElement.getAttribute("data-content") ?? "",
      themes: ["light", "dark"],
    });
  });

  // 默认编辑器方法三/四
  container.querySelectorAll<HTMLElement>("div.mermaid").forEach((sourceElement) => {
    if (sourceElement.childElementCount > 0) {
      return;
    }
    // 来自默认编辑器 HTML 组件的 Mermaid 代码块
    // 特征是 <div class="html-edited"><div class="mermaid xxx">...</div>(若干个)</div>
    // 渲染标记位是 <div class="mermaid xxx" data-processed="true">...</div>
    // 内容在 div.mermaid 的文本内容中
    // 测试方法：默认编辑器 + 插入 HTML 组件 + 输入 <div class="mermaid xxx">...</div>
    // 效果：按照指定的主题模式渲染
    pushMermaidRenderJob(jobs, {
      sourceElement,
      dataProcessedElement: sourceElement,
      rawContent: sourceElement.textContent ?? "",
      themes: getMermaidRenderThemes(sourceElement),
    });
  });

  // Vditor 方法一/二
  container.querySelectorAll<HTMLElement>("div.mermaid > div.language-mermaid").forEach((contentElement) => {
    const sourceElement = contentElement.parentElement;
    if (!sourceElement?.matches("div.mermaid")) {
      return;
    }
    // 来自 Vditor 编辑器插件的 Mermaid 代码块 https://www.halo.run/store/apps/app-uBcYw
    // 特征是 <div class="mermaid xxx"><div class="language-mermaid">...</div></div>
    // 渲染标记位是 <div class="mermaid xxx"><div class="language-mermaid" data-processed="true">...</div></div>
    // 内容在 .language-mermaid 元素的文本内容中
    // 测试方法：Vditor 编辑器 + 输入 ```mermaid ... ```
    // 效果：按照指定的主题模式渲染
    pushMermaidRenderJob(jobs, {
      sourceElement,
      dataProcessedElement: contentElement,
      rawContent: contentElement.textContent ?? "",
      themes: getMermaidRenderThemes(sourceElement),
    });
  });

  // Vditor 编辑器方法三
  container.querySelectorAll<HTMLElement>("div.language-mermaid").forEach((sourceElement) => {
    if (sourceElement.parentElement?.matches("div.mermaid")) {
      return;
    }
    // 来自 Vditor 编辑器插件的 Mermaid 代码块 https://www.halo.run/store/apps/app-uBcYw
    // ```mermaid ... ``` Markdown 渲染后特征是 <div class="language-mermaid">...</div>
    // 渲染标记位是 <div class="language-mermaid" data-processed="true">...</div>
    // 内容在其文本内容中
    // 测试方法：Vditor 编辑器 + 输入 ```mermaid ... ```
    // 效果：自动识别并明暗双倍渲染
    pushMermaidRenderJob(jobs, {
      sourceElement,
      dataProcessedElement: sourceElement,
      rawContent: sourceElement.textContent ?? "",
      themes: ["light", "dark"],
    });
  });

  return jobs;
}

async function renderMermaid(
  sourceElement: HTMLElement,
  rawContent: string,
  id: string,
  theme: MermaidRenderThemeMode,
): Promise<void> {
  const content = buildMermaidContent(rawContent, theme);
  const renderId = `${theme}-${id}`;

  try {
    const mermaidData: RenderResult = await mermaid.render(renderId, content);
    const parentElement = sourceElement.parentElement;
    if (!parentElement) {
      return;
    }

    const div = document.createElement("div");
    // .rendered-mermaid 标记渲染后的 Mermaid 图
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorElement = document.querySelector<HTMLElement>(`#${renderId}`);
    const errorMarkup = errorElement?.outerHTML ?? "";

    sourceElement.innerHTML = `${errorMarkup}<br>
<div style="text-align: left"><small>${errorMessage.replace(/\n/g, "<br>")}</small></div>`;
    errorElement?.parentElement?.remove();
  }
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
      if (isMermaidDataProcessed(job.dataProcessedElement) || job.rawContent.trim() === "") {
        return;
      }

      // Generate a unique id for each render.
      const id = `mermaid${genUUID()}`;

      job.themes.forEach((theme) => {
        void renderMermaid(job.sourceElement, job.rawContent, id, theme);
      });

      markMermaidSourceProcessed(job);
    });
  });
}

initMermaid();
