const { mermaidUrl, mermaidSelector } = document.documentElement.dataset;

const { default: mermaid } = await import(mermaidUrl);
function genUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
  );
}
mermaid.initialize(window.__mermaidConfig);
const mermaidElements = document.querySelectorAll(mermaidSelector);

function renderMermaid(item, id, theme) {
  let rawContent = item.textContent;
  // 如果标签为 text-diagram  data-type 为 mermaid 读取 data-content 为 rawContent，
  // 适配文本绘图插件在默认编辑器的插入
  if (item.tagName === "TEXT-DIAGRAM" && item.getAttribute("data-type") === "mermaid") {
    rawContent = item.getAttribute("data-content");
  }

  let content = theme === null ? rawContent : `%%{init: { "theme": "${theme}" } }%%\n${rawContent}`;

  return mermaid
    .render(`${theme}-${id}`, content)
    .then((mermaidData) => {
      const div = document.createElement("div");
      div.classList.add("rendered-mermaid", theme);
      div.innerHTML = mermaidData.svg;
      item.parentElement.insertBefore(div, item.nextSibling);
      div.setAttribute("data-processed", "true");

      // 为每个 SVG 元素中的 id 添加前缀，
      // 为上游未解决的先解决 https://github.com/mermaid-js/mermaid/issues/5741
      const svgElement = div.querySelector("svg");

      function updateAttribute(refElement, attribute, originalId, newId) {
        const value = refElement.getAttribute(attribute);
        if (value && value.includes(`#${originalId}`)) {
          refElement.setAttribute(attribute, value.replace(`#${originalId}`, `#${newId}`));
        }
      }

      // 更新 id 和 引用 id 的属性
      svgElement.querySelectorAll("[id]").forEach((element) => {
        const originalId = element.getAttribute("id");
        const newId = `${theme}-${id}-${originalId}`;
        element.setAttribute("id", newId);

        // 更新引用这些 id 的元素
        // marker 标签被使用在很多属性上，用 marker 的属性有 marker-start, marker-mid, marker-end
        // symbol 被 use 标签使用，xlink:href 已经被废弃，但是还有一些库在使用，现在用 href
        const elementsUsingId = svgElement.querySelectorAll(
          `[marker-start*="#${originalId}"], [marker-mid*="#${originalId}"], [marker-end*="#${originalId}"], [href*="#${originalId}"]`,
        );
        const attributesToUpdate = ["marker-start", "marker-mid", "marker-end", "xlink:href", "href"];
        elementsUsingId.forEach((refElement) => {
          attributesToUpdate.forEach((attribute) => {
            updateAttribute(refElement, attribute, originalId, newId);
          });
        });
      });

      // 隐藏原始 class="auto" 的元素
      item.style.display = "none";
    })
    .catch((e) => {
      const errorElement = document.querySelector(`#${theme}-${id}`);
      item.innerHTML = `${errorElement.outerHTML}<br>
<div style="text-align: left"><small>${e.message.replace(/\n/, "<br>")}</small></div>`;
      errorElement.parentElement.remove();
    });
}

mermaidElements.forEach(async (item) => {
  const rawContent = item.textContent;

  // 如果已经处理过或者内容为空，就不再处理
  if (item.getAttribute("data-processed") === "true" || rawContent.trim() === "") {
    return;
  }

  const id = "mermaid" + genUUID(); // 生成唯一 id

  // 不是 auto 模式（class 没 auto），直接渲染
  if (!item.classList.contains("auto")) {
    // 如果 class 有 dark 或者 light，就渲染对应主题，否则为 theme 设为 null
    if (item.classList.contains("dark")) {
      renderMermaid(item, id, "dark");
    } else if (item.classList.contains("light")) {
      renderMermaid(item, id, "light");
    } else {
      renderMermaid(item, id, null);
    }
    item.setAttribute("data-processed", "true");
    return;
  }

  // auto 模式下，渲染两种主题
  // 渲染暗黑模式
  renderMermaid(item, id, "dark");
  // 渲染明亮模式
  renderMermaid(item, id, "light");

  item.setAttribute("data-processed", "true");
});
