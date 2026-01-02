import "./main.css";

import { NolebaseHighlightTargetedHeading } from "@nolebase/vitepress-plugin-highlight-targeted-heading/client";
import { type Theme, useRoute } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { h } from "vue";

import FrameDefaultLayout from "../components/FrameDefaultLayout.vue";
import FramePostLayout from "../components/FramePostLayout.vue";

import "@nolebase/vitepress-plugin-highlight-targeted-heading/client/style.css";

export default {
  extends: DefaultTheme,
  Layout: () => {
    const route = useRoute();
    if (route.path.startsWith("/halo-theme-higan-haozi/frames/default")) {
      return h(FrameDefaultLayout);
    } else if (route.path.startsWith("/halo-theme-higan-haozi/frames/post")) {
      return h(FramePostLayout);
    } else {
      return h(DefaultTheme.Layout, null, {
        // 闪烁高亮当前的目标标题
        "layout-top": () => [h(NolebaseHighlightTargetedHeading)],
      });
    }
  },
} satisfies Theme;
