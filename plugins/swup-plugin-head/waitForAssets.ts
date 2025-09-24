export default function waitForAssets(elements: Element[], timeoutMs: number = 0): Promise<HTMLLinkElement>[] {
  return elements.filter(isStylesheet).map((el) => waitForStylesheet(el, timeoutMs));
}

function isStylesheet(el: Element): el is HTMLLinkElement {
  return el.matches("link[rel=stylesheet][href]");
}

export function waitForStylesheet(element: HTMLLinkElement, timeoutMs: number = 0): Promise<HTMLLinkElement> {
  let timeoutId: ReturnType<typeof setTimeout>;

  const whenLoaded = (cb: () => void) => {
    if (element.sheet) {
      cb();
    } else {
      timeoutId = setTimeout(() => whenLoaded(cb), 10);
    }
  };

  return new Promise((resolve) => {
    whenLoaded(() => resolve(element));
    if (timeoutMs > 0) {
      setTimeout(() => {
        if (timeoutId) clearTimeout(timeoutId);
        resolve(element);
      }, timeoutMs);
    }
  });
}
