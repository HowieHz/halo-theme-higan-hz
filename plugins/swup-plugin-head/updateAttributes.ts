export default function updateAttributes(target: Element, source: Element, filters: (string | RegExp)[] = []): void {
  const keep = new Set<string>();

  for (const { name, value } of getAttributes(source, filters)) {
    target.setAttribute(name, value);
    keep.add(name);
  }

  for (const { name } of getAttributes(target, filters)) {
    if (!keep.has(name)) {
      target.removeAttribute(name);
    }
  }
}

function getAttributes(el: Element, filters: (string | RegExp)[] = []): Attr[] {
  const all = Array.from(el.attributes);
  if (!filters.length) return all;

  return all.filter(({ name }) =>
    filters.some((pattern) => (pattern instanceof RegExp ? pattern.test(name) : name === pattern)),
  );
}
