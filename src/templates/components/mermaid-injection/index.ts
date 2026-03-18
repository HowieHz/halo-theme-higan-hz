import type {
  MermaidConfig,
  MermaidModule,
  MermaidRenderResult,
  MermaidTheme,
  ReferenceAttribute,
} from "./types";

declare global {
  interface Window {
    __mermaidConfig?: MermaidConfig;
  }
}

function genUUID(): string {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c: string) => {
    const digit = Number(c);
    const randomValue = crypto.getRandomValues(new Uint8Array(1))[0];
    return (digit ^ (randomValue & (15 >> (digit / 4)))).toString(16);
  });
}

function updateAttribute(
  refElement: Element,
  attribute: ReferenceAttribute,
  originalId: string,
  newId: string,
): void {
  const value = refElement.getAttribute(attribute);
  if (value?.includes(`#${originalId}`)) {
    refElement.setAttribute(attribute, value.replace(`#${originalId}`, `#${newId}`));
  }
}

function renderMermaid(
  mermaid: MermaidModule,
  item: HTMLElement,
  id: string,
  theme: MermaidTheme,
): Promise<void> {
  const fallbackContent = item.textContent ?? "";
  let rawContent = fallbackContent;

  // 如果标签为 text-diagram 且 data-type 为 mermaid，
  // 则读取 data-content 作为原始内容，适配文本绘图插件在默认编辑器中的插入。
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

      // 为每个 SVG 元素中的 id 添加前缀，
      // 先规避上游尚未解决的冲突问题：https://github.com/mermaid-js/mermaid/issues/5741
      const svgElement = div.querySelector("svg");
      if (!svgElement) {
        item.style.display = "none";
        return;
      }

      // 更新 id。
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
        // 更新引用这些 id 的元素。
        // marker 常见引用属性有 marker-start、marker-mid、marker-end。
        // symbol 可能被 use 引用；xlink:href 虽已废弃，但仍有一些库在使用，现在也要兼容 href。
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

      // 隐藏原始元素。
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
  const { mermaidUrl, mermaidSelector } = document.documentElement.dataset;
  if (!mermaidUrl || !mermaidSelector) {
    return;
  }

  const { default: mermaid } = (await import(mermaidUrl)) as {
    default: MermaidModule;
  };

  mermaid.initialize(window.__mermaidConfig);

  document.querySelectorAll<HTMLElement>(mermaidSelector).forEach((item) => {
    const rawContent = item.textContent ?? "";

    // 如果已经处理过或者内容为空，就不再处理。
    if (item.getAttribute("data-processed") === "true" || rawContent.trim() === "") {
      return;
    }

    // 生成唯一 id。
    const id = `mermaid${genUUID()}`;

    // 不是 auto 模式（class 不含 auto），直接渲染。
    if (!item.classList.contains("auto")) {
      // 如果 class 有 dark 或者 light，就渲染对应主题；否则 theme 设为 null。
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

    // auto 模式下，渲染两种主题。
    // 渲染暗黑模式。
    void renderMermaid(mermaid, item, id, "dark");
    // 渲染明亮模式。
    void renderMermaid(mermaid, item, id, "light");

    item.setAttribute("data-processed", "true");
  });
}

void initMermaid();
