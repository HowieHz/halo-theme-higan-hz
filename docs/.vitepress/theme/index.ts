import "./main.css";

import {
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu,
} from "@nolebase/vitepress-plugin-enhanced-readabilities/client";
import { NolebaseHighlightTargetedHeading } from "@nolebase/vitepress-plugin-highlight-targeted-heading/client";
import { useRoute } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { h } from "vue";

import FrameDefaultLayout from "../components/FrameDefaultLayout.vue";
import FramePostLayout from "../components/FramePostLayout.vue";

import "@nolebase/vitepress-plugin-highlight-targeted-heading/client/style.css";
import "@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css";

export default {
  ...DefaultTheme,
  Layout: () => {
    const route = useRoute();
    if (route.path.startsWith("/halo-theme-higan-haozi/frames/default")) {
      return h(FrameDefaultLayout);
    } else if (route.path.startsWith("/halo-theme-higan-haozi/frames/post")) {
      return h(FramePostLayout);
    } else {
      return h(DefaultTheme.Layout, null, {
        // 为较宽的屏幕的导航栏添加阅读增强菜单
        "nav-bar-content-after": () => [h(NolebaseEnhancedReadabilitiesMenu)],
        // 为较窄的屏幕（通常是小于 iPad Mini）添加阅读增强菜单
        "nav-screen-content-after": () => [h(NolebaseEnhancedReadabilitiesScreenMenu)],
        // 闪烁高亮当前的目标标题
        "layout-top": () => [h(NolebaseHighlightTargetedHeading)],
      });
    }
  },
  enhanceApp() {
    // 其他的配置...
  },
};
