/// <reference types="vitepress/client" />
/// <reference types="@whyframe/core/global" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}
