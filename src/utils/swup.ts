// 导入类型定义（仅类型导入，不会在运行时包含。包含了自定义 window 扩展）
import type {} from "../types/window-common";

import SwupA11yPlugin from "@swup/a11y-plugin";
import SwupDebugPlugin from "@swup/debug-plugin";
import SwupPreloadPlugin from "@swup/preload-plugin";
import SwupScrollPlugin from "@swup/scroll-plugin";
import Swup from "swup";

import SwupHeadPlugin from "../../plugins/swup-plugin-head";
import SwupScriptsPlugin from "../../plugins/swup-plugin-scripts";

// 使此文件成为模块
export {};

window.swup = new Swup({
  plugins: [
    new SwupPreloadPlugin(),
    new SwupScrollPlugin(),
    new SwupHeadPlugin({
      awaitScripts: true,
    }),
    new SwupScriptsPlugin(),
    new SwupDebugPlugin(),
    new SwupA11yPlugin({
      announcements: {
        "zh-CN": {
          visit: "已导航至：{title}",
          url: "新页面地址：{url}",
        },
        zh: {
          visit: "已导航至：{title}",
          url: "新页面地址：{url}",
        },
        "zh-TW": {
          visit: "已導覽至：{title}",
          url: "新頁面地址：{url}",
        },
        "zh-HK": {
          visit: "已導航至：{title}",
          url: "新頁面地址：{url}",
        },
        "zh-SG": {
          visit: "已导航至：{title}",
          url: "新页面地址：{url}",
        },
        en: {
          visit: "Navigated to: {title}",
          url: "New page at {url}",
        },
        "en-US": {
          visit: "Navigated to: {title}",
          url: "New page at {url}",
        },
        "en-CA": {
          visit: "Navigated to: {title}",
          url: "New page at {url}",
        },
        "en-UK": {
          visit: "Navigated to: {title}",
          url: "New page at {url}",
        },
        "en-GB": {
          visit: "Navigated to: {title}",
          url: "New page at {url}",
        },
        "es-ES": {
          visit: "Navegado a: {title}",
          url: "Nueva página en {url}",
        },
        "it-IT": {
          visit: "Navigato a: {title}",
          url: "Nuova pagina a {url}",
        },
        "ja-JP": {
          visit: "{title} に移動しました",
          url: "新しいページの URL: {url}",
        },
        "de-DE": {
          visit: "Navigiert zu: {title}",
          url: "Neue Seite unter {url}",
        },
        "fr-FR": {
          visit: "Navigué vers : {title}",
          url: "Nouvelle page à {url}",
        },
        "*": {
          visit: "{title}",
          url: "{url}",
        },
      },
    }),
  ],
  hooks: {
    "visit:start.before": () => {
      window.isDirectLoad = false;
      window.isPageViewTriggered = false;
    },
    "visit:end.before": () => {
      window.isPageViewTriggered = true;
    },
  },
});
window.moduleResolve.swup(); // 调用 resolve 函数
