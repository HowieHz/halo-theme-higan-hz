export const DISPLAY_ORDER = [
  "howiehz-higan-zh-hans.zip",
  "howiehz-higan-zh-hans-tiny.zip",
  "howiehz-higan-zh-hans-full-precompressed.zip",
  "howiehz-higan-en.zip",
  "howiehz-higan-en-tiny.zip",
  "howiehz-higan-en-full-precompressed.zip",
];

function compareByDisplayOrder(left, right) {
  const leftIndex = DISPLAY_ORDER.indexOf(left);
  const rightIndex = DISPLAY_ORDER.indexOf(right);
  const normalizedLeftIndex = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex;
  const normalizedRightIndex = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex;

  if (normalizedLeftIndex !== normalizedRightIndex) {
    return normalizedLeftIndex - normalizedRightIndex;
  }

  return left.localeCompare(right, "en");
}

export function assertKnownAssets(fileNames) {
  const unknown = fileNames.filter((fileName) => !DISPLAY_ORDER.includes(fileName));
  if (unknown.length > 0) {
    throw new Error(`Unknown release assets: ${unknown.join(", ")}`);
  }
}

export function sortByDisplayOrder(fileNames) {
  assertKnownAssets(fileNames);
  return [...fileNames].sort(compareByDisplayOrder);
}
