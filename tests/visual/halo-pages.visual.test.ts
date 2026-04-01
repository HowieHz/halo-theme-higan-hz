import { expect, test } from "vitest";
import { page } from "vitest/browser";

import { applyViewport, mountHaloPageFrame, pageTargets, viewportTargets } from "./halo-pages.fixture";

for (const pageTarget of pageTargets) {
  for (const viewportTarget of viewportTargets) {
    test(`matches ${pageTarget.name} on ${viewportTarget.name}`, async () => {
      await applyViewport(viewportTarget.width, viewportTarget.height, page.viewport);
      await mountHaloPageFrame(pageTarget.path, viewportTarget.width, viewportTarget.height);

      const frame = page.getByTestId("visual-frame-wrap");
      await expect.element(frame).toBeInTheDocument();
      await expect(frame).toMatchScreenshot(`${pageTarget.name}-${viewportTarget.name}`);
    });
  }
}
