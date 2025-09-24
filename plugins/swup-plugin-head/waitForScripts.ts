export default function waitForScripts(elements: Element[], timeoutMs: number = 0): Promise<HTMLScriptElement>[] {
  return elements.filter(isScript).map((el) => waitForScript(el, timeoutMs));
}

function isScript(el: Element): el is HTMLScriptElement {
  return el.matches("script[src], script:not([src])");
}

export function waitForScript(element: HTMLScriptElement, timeoutMs: number = 0): Promise<HTMLScriptElement> {
  return new Promise((resolve) => {
    if (element.src) {
      // 对于外部脚本，监听 load/error 事件
      const onLoad = () => {
        element.removeEventListener("load", onLoad);
        element.removeEventListener("error", onError);
        resolve(element);
      };
      const onError = () => {
        element.removeEventListener("load", onLoad);
        element.removeEventListener("error", onError);
        resolve(element); // 即使出错也 resolve，以避免阻塞
      };
      element.addEventListener("load", onLoad);
      element.addEventListener("error", onError);
    } else {
      // 对于内联脚本，假设立即执行完成（同步）
      resolve(element);
    }

    // 如果设置了超时，强制 resolve
    if (timeoutMs > 0) {
      setTimeout(() => resolve(element), timeoutMs);
    }
  });
}
