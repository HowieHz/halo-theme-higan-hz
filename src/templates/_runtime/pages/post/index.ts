import "@runtime/global";
import "./styles.css";
import "@runtime/styles/article-header.css";
import "@runtime/styles/article.css";
import "@runtime/styles/article-metadata.css";
import { hide, isVisible, scrollToTop, show, toggle } from "@runtime/scripts/animations/base";
import { fadeIn } from "@runtime/scripts/animations/fade-in";
import { fadeOut } from "@runtime/scripts/animations/fade-out";
import { slideDown } from "@runtime/scripts/animations/slide-down";
import { slideUp } from "@runtime/scripts/animations/slide-up";

// Animation durations in milliseconds
const ANIMATION_DURATION = 200;
const POST_HEADER_NAV_ANIMATION_DURATION = 50;

type ViewportMode = "desktop" | "tablet" | "mobile";
type TabletMode = "top" | "quickActions";
type FooterPostPanel = "none" | "menu" | "toc" | "share";

type PostHeaderNavEnvironment = {
  // 当前视口所属断点：desktop 控制桌面端顶部导航，tablet 控制平板端顶部导航，mobile 让顶部导航退出显示。
  viewportMode: ViewportMode;
  // 平板端顶部 #header-post 模式：top 显示 #menu-icon，quickActions 显示 #top-icon-tablet/#toc-icon-tablet。
  tabletMode: TabletMode;
};

type PostHeaderNavIntent = {
  // 用户是否希望展开顶部 #header-post 的 #nav/#actions/#toc。
  isMenuContentOpen: boolean;
  // 用户是否希望展开顶部 #header-post 的 #share-list。
  isShareOpen: boolean;
};

// 顶部 #header-post 导航状态。
// 状态描述“用户意图 + 环境”，不描述具体 DOM display。
type PostHeaderNavState = {
  environment: PostHeaderNavEnvironment;
  intent: PostHeaderNavIntent;
};

type PostHeaderNavElements = {
  // 顶部菜单按钮 #header-post #menu-icon。
  menuIcon: HTMLElement;
  // 顶部导航链接容器 #header-post #nav。
  nav: HTMLElement;
  // 顶部操作按钮容器 #header-post #actions。
  actions: HTMLElement;
  // 顶部桌面端目录容器 #header-post #toc。
  toc: HTMLElement;
  // 顶部分享列表 #header-post #share-list；配置关闭分享按钮时不存在。
  shareList: HTMLElement | null;
  // 平板端滚动后的回到顶部快捷按钮 #header-post #top-icon-tablet。
  topIconTablet: HTMLElement;
  // 平板端滚动后的目录快捷按钮 #header-post #toc-icon-tablet。
  tocIconTablet: HTMLElement;
  // 顶部分享按钮 #header-post #actions #action-share；配置关闭分享按钮时不存在。
  shareButton: HTMLElement | null;
  // 顶部菜单内容集合：#nav/#actions/#toc。
  menuContent: HTMLElement[];
};

type RenderPostHeaderNavOptions = {
  animate?: boolean;
  duration?: number;
};

type PostHeaderNavEvent =
  | { type: "toggleMenuContent" }
  | { type: "toggleShare" }
  | { type: "resize"; environment: PostHeaderNavEnvironment }
  | { type: "tabletScroll"; tabletMode: TabletMode; viewportMode: ViewportMode };

type FooterPostNavEnvironment = {
  // 当前页面滚动位置，用于判断 #actions-footer > #top 显隐。
  scrollY: number;
  // 移动端底部回到顶部按钮 #actions-footer > #top 当前是否显示；scrollY 处于 50~100 滞回区间时保持这个值。
  isTopActionVisible: boolean;
};

type FooterPostNavIntent = {
  // 当前展开的移动端底部子菜单：none 表示 #nav-footer/#toc-footer/#share-footer 全部收起。
  activePanel: FooterPostPanel;
  // 用户当前是否希望显示移动端底部导航栏容器 #footer-post。
  isFooterVisible: boolean;
};

// 移动端底部 #footer-post 导航状态。
// 状态描述 #nav-footer/#toc-footer/#share-footer 当前展开哪一个、#footer-post 是否显示、#actions-footer > #top 是否显示的输入条件。
// 状态不描述具体 DOM display。
type FooterPostNavState = {
  environment: FooterPostNavEnvironment;
  intent: FooterPostNavIntent;
};

type RenderFooterPostNavOptions = {
  // 是否使用 slideUp/slideDown 动画更新 #footer-post 和底部子菜单显隐。
  animate?: boolean;
  // #footer-post 和底部子菜单显隐动画时长，单位毫秒。
  duration?: number;
  // 打开 #toc-footer 后是否把当前 .toc-active 滚动到 #toc-footer 可视区域中间。
  scrollActiveTocIntoView?: boolean;
};

type FooterPostNavElements = {
  // 移动端底部导航栏容器 #footer-post。
  footerNav: HTMLElement;
  // 移动端底部菜单按钮 #actions-footer > #menu。
  footerMenuButton: HTMLElement | null;
  // 移动端底部目录按钮 #actions-footer > #toc。
  footerTocButton: HTMLElement | null;
  // 移动端底部分享按钮 #actions-footer > #share；配置关闭分享按钮时不存在。
  footerShareButton: HTMLElement | null;
  // 移动端底部回到顶部按钮 #actions-footer > #top。
  footerTopIcon: HTMLElement | null;
  // 移动端底部菜单容器 #nav-footer。
  navFooter: HTMLElement | null;
  // 移动端底部目录容器 #toc-footer。
  tocFooter: HTMLElement | null;
  // 移动端底部分享容器 #share-footer；配置关闭分享按钮时不存在。
  shareFooter: HTMLElement | null;
};

type FooterPostNavEvent =
  | { type: "toggleMenu" }
  | { type: "toggleToc" }
  | { type: "toggleShare" }
  | { type: "scroll"; scrollY: number };

function getViewportMode(): ViewportMode {
  // 与模板/CSS 断点保持一致：lg=1024px，sm=640px。
  if (window.innerWidth >= 1024) {
    return "desktop";
  }
  if (window.innerWidth >= 640) {
    return "tablet";
  }
  return "mobile";
}

function getTabletMode(currentMode: TabletMode): TabletMode {
  const topDistance = getTopDistance();

  // 平板端 #header-post 滚动模式：scrollY < 50 显示 #menu-icon，scrollY > 100 显示 #top-icon-tablet 和 #toc-icon-tablet。
  // 50~100 区间维持当前模式，避免临界点附近反复切换。
  if (topDistance < 50) {
    return "top";
  }
  if (topDistance > 100) {
    return "quickActions";
  }
  return currentMode;
}

function createPostHeaderNavState(): PostHeaderNavState {
  const viewportMode = getViewportMode();

  // 初始化顶部 #header-post：桌面端展开 #nav/#actions/#toc，平板端和移动端折叠 #nav/#actions/#toc，#share-list 始终关闭。
  return {
    environment: {
      viewportMode,
      tabletMode: viewportMode === "tablet" ? getTabletMode("top") : "top",
    },
    intent: {
      isMenuContentOpen: viewportMode === "desktop",
      isShareOpen: false,
    },
  };
}

function createFooterPostNavState(): FooterPostNavState {
  const scrollY = getTopDistance();

  // 初始化移动端底部 #footer-post：#footer-post 显示，#nav-footer/#toc-footer/#share-footer 收起，#actions-footer > #top 隐藏。
  return {
    environment: {
      scrollY,
      isTopActionVisible: false,
    },
    intent: {
      activePanel: "none",
      isFooterVisible: true,
    },
  };
}

function createPostHeaderNavEnvironment(currentTabletMode: TabletMode = "top"): PostHeaderNavEnvironment {
  const viewportMode = getViewportMode();

  return {
    viewportMode,
    tabletMode: viewportMode === "tablet" ? getTabletMode(currentTabletMode) : "top",
  };
}

function getPostHeaderNavElements(): PostHeaderNavElements | null {
  const menuIcon = document.querySelector<HTMLElement>("#header-post #menu-icon");
  const nav = document.querySelector<HTMLElement>("#header-post #nav");
  const actions = document.querySelector<HTMLElement>("#header-post #actions");
  const toc = document.querySelector<HTMLElement>("#header-post #toc");
  const shareList = document.querySelector<HTMLElement>("#header-post #share-list");
  const topIconTablet = document.querySelector<HTMLElement>("#header-post #top-icon-tablet");
  const tocIconTablet = document.querySelector<HTMLElement>("#header-post #toc-icon-tablet");
  const shareButton = document.querySelector<HTMLElement>("#header-post #actions #action-share");

  if (!menuIcon || !nav || !actions || !toc || !topIconTablet || !tocIconTablet) {
    return null;
  }

  return {
    menuIcon,
    nav,
    actions,
    toc,
    shareList,
    topIconTablet,
    tocIconTablet,
    shareButton,
    menuContent: [nav, actions, toc],
  };
}

function getFooterPostNavElements(): FooterPostNavElements | null {
  const footerNav = document.querySelector<HTMLElement>("#footer-post");

  if (!footerNav) {
    return null;
  }

  return {
    footerNav,
    footerMenuButton: document.querySelector<HTMLElement>("#actions-footer > #menu"),
    footerTocButton: document.querySelector<HTMLElement>("#actions-footer > #toc"),
    footerShareButton: document.querySelector<HTMLElement>("#actions-footer > #share"),
    footerTopIcon: document.querySelector<HTMLElement>("#actions-footer > #top"),
    navFooter: document.querySelector<HTMLElement>("#nav-footer"),
    tocFooter: document.querySelector<HTMLElement>("#toc-footer"),
    shareFooter: document.querySelector<HTMLElement>("#share-footer"),
  };
}

function reducePostHeaderNavState(state: PostHeaderNavState, event: PostHeaderNavEvent): PostHeaderNavState {
  switch (event.type) {
    case "toggleMenuContent": {
      const isMenuContentOpen = !state.intent.isMenuContentOpen;

      return {
        ...state,
        intent: {
          isMenuContentOpen,
          // #nav/#actions/#toc 收起时同步收起 #share-list，避免分享菜单脱离顶部菜单单独显示。
          isShareOpen: isMenuContentOpen ? state.intent.isShareOpen : false,
        },
      };
    }
    case "toggleShare":
      return {
        ...state,
        intent: {
          ...state.intent,
          isShareOpen: !state.intent.isShareOpen,
        },
      };
    case "resize":
      return {
        environment: event.environment,
        intent: {
          // 桌面端展开 #nav/#actions/#toc；平板端和移动端收起 #nav/#actions/#toc 和 #share-list。
          isMenuContentOpen: event.environment.viewportMode === "desktop",
          isShareOpen: false,
        },
      };
    case "tabletScroll":
      return {
        environment: {
          viewportMode: event.viewportMode,
          tabletMode: event.tabletMode,
        },
        intent: {
          // 进入 quickActions 时隐藏 #menu-icon，并强制收起 #nav/#actions/#toc 和 #share-list。
          isMenuContentOpen: event.tabletMode === "quickActions" ? false : state.intent.isMenuContentOpen,
          isShareOpen: event.tabletMode === "quickActions" ? false : state.intent.isShareOpen,
        },
      };
  }
}

function shouldShowFooterTopAction(scrollY: number, currentValue: boolean): boolean {
  if (scrollY < 50) {
    return false;
  }
  if (scrollY > 100) {
    return true;
  }
  return currentValue;
}

function reduceFooterPostNavState(state: FooterPostNavState, event: FooterPostNavEvent): FooterPostNavState {
  switch (event.type) {
    case "toggleMenu":
      return {
        ...state,
        intent: {
          activePanel: state.intent.activePanel === "menu" ? "none" : "menu",
          isFooterVisible: true,
        },
      };
    case "toggleToc":
      return {
        ...state,
        intent: {
          activePanel: state.intent.activePanel === "toc" ? "none" : "toc",
          isFooterVisible: true,
        },
      };
    case "toggleShare":
      return {
        ...state,
        intent: {
          activePanel: state.intent.activePanel === "share" ? "none" : "share",
          isFooterVisible: true,
        },
      };
    case "scroll": {
      return {
        environment: {
          scrollY: event.scrollY,
          // 移动端底部回到顶部按钮 #actions-footer > #top：scrollY < 50 隐藏，scrollY > 100 显示，50~100 保持当前状态。
          isTopActionVisible: shouldShowFooterTopAction(event.scrollY, state.environment.isTopActionVisible),
        },
        intent: {
          // 移动端底部 #footer-post 页面滚动时关闭 #nav-footer/#toc-footer/#share-footer。
          activePanel: "none",
          // 向上滚动显示 #footer-post，向下滚动隐藏 #footer-post。
          isFooterVisible: event.scrollY <= state.environment.scrollY,
        },
      };
    }
  }
}

function setElementVisibility(
  element: HTMLElement | NodeListOf<HTMLElement> | HTMLElement[],
  isShown: boolean,
  options: Required<RenderPostHeaderNavOptions>,
): void {
  if (Array.isArray(element)) {
    element.forEach((item) => {
      setElementVisibility(item, isShown, options);
    });
    return;
  }

  if (options.animate) {
    if (isShown) {
      fadeIn(element, options.duration);
    } else {
      fadeOut(element, options.duration);
    }
    return;
  }

  if (isShown) {
    show(element);
  } else if (isVisible(element)) {
    // 非动画初始化时，不触碰已经由 Tailwind/CSS 隐藏的元素，避免把 display:none 记为默认显示值。
    hide(element);
  }
}

function setSlideElementVisibility(
  element: HTMLElement,
  isShown: boolean,
  options: Required<Pick<RenderFooterPostNavOptions, "animate" | "duration">>,
): void {
  if (options.animate) {
    if (isShown) {
      slideDown(element, options.duration);
    } else {
      slideUp(element, options.duration);
    }
    return;
  }

  if (isShown) {
    show(element);
  } else {
    hide(element);
  }
}

/**
 * 顶部文章导航唯一显隐出口。
 *
 * 只有这里能控制 #menu-icon、#nav、#actions、#toc、#share-list、#top-icon-tablet、#toc-icon-tablet。
 */
function renderPostHeaderNav(
  state: PostHeaderNavState,
  elements: PostHeaderNavElements,
  options: RenderPostHeaderNavOptions = {},
): void {
  const renderOptions: Required<RenderPostHeaderNavOptions> = {
    animate: options.animate ?? true,
    duration: options.duration ?? POST_HEADER_NAV_ANIMATION_DURATION,
  };

  const isQuickActionsMode =
    state.environment.viewportMode === "tablet" && state.environment.tabletMode === "quickActions";
  const isTopNavEnabled = state.environment.viewportMode !== "mobile";
  const isMenuIconShown = isTopNavEnabled && !isQuickActionsMode;
  const isMenuContentShown = isMenuIconShown && state.intent.isMenuContentOpen;
  const isShareListShown = isMenuContentShown && state.intent.isShareOpen;
  const areTabletQuickActionsShown = isQuickActionsMode;

  // #menu-icon.active、#menu-icon[aria-expanded]、#action-share[aria-expanded] 表达状态里的展开意图。
  // 不从动画中间态或当前 DOM display 反推，避免状态和界面互相覆盖。
  elements.menuIcon.classList.toggle("active", state.intent.isMenuContentOpen);
  elements.menuIcon.setAttribute("aria-expanded", String(state.intent.isMenuContentOpen));
  elements.shareButton?.setAttribute("aria-expanded", String(state.intent.isShareOpen));

  setElementVisibility(elements.menuIcon, isMenuIconShown, renderOptions);
  setElementVisibility(elements.menuContent, isMenuContentShown, renderOptions);
  if (elements.shareList) {
    setElementVisibility(elements.shareList, isShareListShown, renderOptions);
  }
  setElementVisibility(elements.topIconTablet, areTabletQuickActionsShown, renderOptions);
  setElementVisibility(elements.tocIconTablet, areTabletQuickActionsShown, renderOptions);
}

/**
 * 移动端底部文章导航唯一显隐出口。
 *
 * 只有这里能控制 #footer-post、#actions-footer > #menu/#toc/#share/#top、#nav-footer、#toc-footer、#share-footer。
 */
function renderFooterPostNav(
  state: FooterPostNavState,
  elements: FooterPostNavElements,
  options: RenderFooterPostNavOptions = {},
): void {
  const renderOptions = {
    animate: options.animate ?? true,
    duration: options.duration ?? ANIMATION_DURATION,
  };

  elements.footerMenuButton?.setAttribute("aria-expanded", String(state.intent.activePanel === "menu"));
  elements.footerTocButton?.setAttribute("aria-expanded", String(state.intent.activePanel === "toc"));
  elements.footerShareButton?.setAttribute("aria-expanded", String(state.intent.activePanel === "share"));

  setSlideElementVisibility(elements.footerNav, state.intent.isFooterVisible, renderOptions);
  if (elements.navFooter) {
    setSlideElementVisibility(elements.navFooter, state.intent.activePanel === "menu", renderOptions);
  }
  if (elements.tocFooter) {
    setSlideElementVisibility(elements.tocFooter, state.intent.activePanel === "toc", renderOptions);
  }
  if (elements.shareFooter) {
    setSlideElementVisibility(elements.shareFooter, state.intent.activePanel === "share", renderOptions);
  }

  elements.footerTopIcon?.style.setProperty(
    "transform",
    state.environment.isTopActionVisible ? "scale(1)" : "scale(0)",
  );

  if (state.intent.activePanel === "toc" && options.scrollActiveTocIntoView && elements.tocFooter) {
    // 移动端底部目录 #toc-footer 展开后，把当前文章位置对应的 .toc-active 滚到子菜单可视区域中间。
    const activeLink = elements.tocFooter.querySelector<HTMLElement>(".toc-active");

    if (activeLink) {
      setTimeout(() => {
        activeLink.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }, renderOptions.duration);
    }
  }
}

document.addEventListener("click", (e: Event): void => {
  const target = e.target as HTMLElement;
  const scrollElement = target.closest<HTMLElement>("[data-scroll-to-top]");

  if (scrollElement) {
    e.preventDefault();
    scrollToTop();
  }
});

/** 获取页面滚动距离（垂直方向） */
function getTopDistance(): number {
  // const topDistance = window.pageYOffset || // 现代浏览器首选 scrollY 的别名 支持大部分现代浏览器（IE9+）
  // document.documentElement.scrollTop ||  // 标准模式兼容 包括老版本 IE
  // document.body.scrollTop || // 怪异模式兼容
  // 0;
  return window.scrollY || 0;
}

/**
 * Event delegation for toggle functionality on hover Handle mouseover and mouseout events for elements with
 * data-toggle-target attribute
 */
document.addEventListener("mouseover", (e: Event): void => {
  const target = e.target as HTMLElement;
  const toggleElement = target.closest<HTMLElement>("[data-toggle-target]");

  if (toggleElement) {
    const toggleTarget = toggleElement.dataset.toggleTarget;
    if (toggleTarget) {
      toggle(toggleTarget);
    }
  }
});

document.addEventListener("mouseout", (e: Event): void => {
  const target = e.target as HTMLElement;
  const toggleElement = target.closest<HTMLElement>("[data-toggle-target]");

  if (toggleElement) {
    const toggleTarget = toggleElement.dataset.toggleTarget;
    if (toggleTarget) {
      toggle(toggleTarget);
    }
  }
});

document.addEventListener("DOMContentLoaded", (): void => {
  /** 控制博客文章页面中菜单的不同版本 适用于桌面端、平板端和移动端 */
  if (document.querySelector(".post")) {
    const postHeaderNavElements = getPostHeaderNavElements();
    let postHeaderNavState = createPostHeaderNavState();

    if (postHeaderNavElements) {
      renderPostHeaderNav(postHeaderNavState, postHeaderNavElements, { animate: false });
    }

    // 平板端、桌面端顶部菜单按钮 #menu-icon：点击后只切换 #nav/#actions/#toc 的展开状态。
    postHeaderNavElements?.menuIcon.addEventListener("click", (e: Event): void => {
      e.preventDefault();

      postHeaderNavState = reducePostHeaderNavState(postHeaderNavState, { type: "toggleMenuContent" });
      renderPostHeaderNav(postHeaderNavState, postHeaderNavElements);
    });

    // 平板端、桌面端顶部分享按钮 #action-share：点击后只切换 #share-list 的展开状态。
    // #share-list 是否实际显示仍由 renderPostHeaderNav 结合 #nav/#actions/#toc 的展开状态决定。
    postHeaderNavElements?.shareButton?.addEventListener("click", (): void => {
      postHeaderNavState = reducePostHeaderNavState(postHeaderNavState, { type: "toggleShare" });
      renderPostHeaderNav(postHeaderNavState, postHeaderNavElements);
    });

    // 顶部 #header-post resize 逻辑：视口跨断点后按新视口重建顶部导航状态。
    window.addEventListener("resize", (): void => {
      if (!postHeaderNavElements) {
        return;
      }

      postHeaderNavState = reducePostHeaderNavState(postHeaderNavState, {
        type: "resize",
        environment: createPostHeaderNavEnvironment(postHeaderNavState.environment.tabletMode),
      });
      renderPostHeaderNav(postHeaderNavState, postHeaderNavElements);
    });

    // 平板端目录浮层 #toc-overlay-tablet：绑定打开按钮、关闭按钮、背景和目录项点击事件。
    const tocOverlayTablet: HTMLElement | null = document.querySelector("#toc-overlay-tablet");
    const tocOverlayClose: HTMLElement | null = document.querySelector("#toc-overlay-close");
    const tocOverlayBackdrop: HTMLElement | null = document.querySelector("#toc-overlay-backdrop");
    const actionTocTablet: HTMLElement | null = document.querySelector("#action-toc-tablet");
    const actionTocTabletMenu: HTMLElement | null = document.querySelector("#action-toc-tablet-menu");

    // 平板端目录浮层 #toc-overlay-tablet：由 #toc-icon-tablet、#action-toc-tablet、#action-toc-tablet-menu 共用打开/关闭逻辑。
    const toggleTocOverlay = (button: HTMLElement | null): void => {
      if (!tocOverlayTablet || !button) {
        return;
      }
      if (isVisible(tocOverlayTablet)) {
        button.setAttribute("aria-expanded", "false");
        fadeOut(tocOverlayTablet, ANIMATION_DURATION);
      } else {
        button.setAttribute("aria-expanded", "true");
        fadeIn(tocOverlayTablet, ANIMATION_DURATION);

        // 平板端目录浮层打开后，把当前文章位置对应的 .toc-active 滚到浮层可视区域中间。
        const activeLink = tocOverlayTablet.querySelector<HTMLElement>(".toc-active");
        if (activeLink) {
          setTimeout(() => {
            activeLink.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "center",
            });
          }, ANIMATION_DURATION);
        }
      }
    };

    // 平板端滚动后的浮动目录按钮 #toc-icon-tablet：点击打开/关闭 #toc-overlay-tablet。
    postHeaderNavElements?.tocIconTablet.addEventListener("click", (): void => {
      toggleTocOverlay(postHeaderNavElements.tocIconTablet);
    });

    // 平板端顶部 #actions 中的目录按钮 #action-toc-tablet：点击打开/关闭 #toc-overlay-tablet。
    actionTocTablet?.addEventListener("click", (): void => {
      toggleTocOverlay(actionTocTablet);
    });

    // 平板端顶部菜单中的目录按钮 #action-toc-tablet-menu：点击打开/关闭 #toc-overlay-tablet。
    actionTocTabletMenu?.addEventListener("click", (): void => {
      toggleTocOverlay(actionTocTabletMenu);
    });

    // 平板端目录浮层关闭按钮 #toc-overlay-close：点击后关闭 #toc-overlay-tablet。
    tocOverlayClose?.addEventListener("click", (): void => {
      if (tocOverlayTablet) {
        postHeaderNavElements?.tocIconTablet.setAttribute("aria-expanded", "false");
        actionTocTablet?.setAttribute("aria-expanded", "false");
        actionTocTabletMenu?.setAttribute("aria-expanded", "false");
        fadeOut(tocOverlayTablet, ANIMATION_DURATION);
      }
    });

    // 平板端目录浮层背景 #toc-overlay-backdrop：点击后关闭 #toc-overlay-tablet。
    tocOverlayBackdrop?.addEventListener("click", (): void => {
      if (tocOverlayTablet) {
        postHeaderNavElements?.tocIconTablet.setAttribute("aria-expanded", "false");
        actionTocTablet?.setAttribute("aria-expanded", "false");
        actionTocTabletMenu?.setAttribute("aria-expanded", "false");
        fadeOut(tocOverlayTablet, ANIMATION_DURATION);
      }
    });

    // 平板端目录浮层目录项 .toc-link：点击跳转标题后关闭 #toc-overlay-tablet，避免浮层遮挡正文。
    if (tocOverlayTablet) {
      tocOverlayTablet.addEventListener("click", (e: Event): void => {
        const target = e.target;
        if (target instanceof HTMLElement) {
          const tocLink = target.closest<HTMLElement>(".toc-link");
          if (tocLink) {
            postHeaderNavElements?.tocIconTablet.setAttribute("aria-expanded", "false");
            actionTocTablet?.setAttribute("aria-expanded", "false");
            actionTocTabletMenu?.setAttribute("aria-expanded", "false");
            fadeOut(tocOverlayTablet, ANIMATION_DURATION);
          }
        }
      });
    }

    // 平板端顶部 #header-post 页面滚动逻辑：在顶部菜单按钮和回到顶部/目录快捷按钮之间切换。
    // 使用 getTabletMode 的 <50 / >100 滞回区间，避免滚动临界点闪烁。
    window.addEventListener("scroll", (): void => {
      if (!postHeaderNavElements) {
        return;
      }

      const viewportMode = getViewportMode();

      if (viewportMode !== "tablet") {
        return;
      }

      postHeaderNavState = reducePostHeaderNavState(postHeaderNavState, {
        type: "tabletScroll",
        viewportMode,
        tabletMode: getTabletMode(postHeaderNavState.environment.tabletMode),
      });
      renderPostHeaderNav(postHeaderNavState, postHeaderNavElements, { duration: ANIMATION_DURATION });
    });

    const footerPostNavElements = getFooterPostNavElements();
    let footerPostNavState = createFooterPostNavState();

    if (footerPostNavElements) {
      renderFooterPostNav(footerPostNavState, footerPostNavElements, { animate: false });
    }

    // 移动端底部导航栏按钮 #actions-footer > #menu：点击后只切换 #nav-footer 的展开状态。
    footerPostNavElements?.footerMenuButton?.addEventListener("click", (): void => {
      footerPostNavState = reduceFooterPostNavState(footerPostNavState, { type: "toggleMenu" });
      renderFooterPostNav(footerPostNavState, footerPostNavElements);
    });

    // 移动端底部导航栏按钮 #actions-footer > #toc：点击后只切换 #toc-footer 的展开状态。
    footerPostNavElements?.footerTocButton?.addEventListener("click", (): void => {
      const isOpeningToc = footerPostNavState.intent.activePanel !== "toc";

      footerPostNavState = reduceFooterPostNavState(footerPostNavState, { type: "toggleToc" });
      renderFooterPostNav(footerPostNavState, footerPostNavElements, { scrollActiveTocIntoView: isOpeningToc });
    });

    // 移动端底部导航栏按钮 #actions-footer > #share：点击后只切换 #share-footer 的展开状态。
    footerPostNavElements?.footerShareButton?.addEventListener("click", (): void => {
      footerPostNavState = reduceFooterPostNavState(footerPostNavState, { type: "toggleShare" });
      renderFooterPostNav(footerPostNavState, footerPostNavElements);
    });

    /** 移动端 #footer-post 页面滚动逻辑：向上滚动显示 #footer-post，向下滚动隐藏 #footer-post。 */
    if (footerPostNavElements) {
      window.addEventListener("scroll", (): void => {
        const topDistance = getTopDistance();

        footerPostNavState = reduceFooterPostNavState(footerPostNavState, { type: "scroll", scrollY: topDistance });
        renderFooterPostNav(footerPostNavState, footerPostNavElements);
      });
    }

    // Convert TOC spans (generated by [toc]) to clickable anchors
    // Compatible with catalogs generated by [toc] in vditor and similar tools that use span[data-target-id] structure
    const dataSpans = document.querySelectorAll<HTMLElement>("span[data-target-id]");
    if (dataSpans.length > 0) {
      dataSpans.forEach((span) => {
        // already converted or inside a link?
        if (span.closest("a")) return;

        const targetId = span.getAttribute("data-target-id");

        const anchor = document.createElement("a");
        anchor.href = `#${targetId}`;
        if (span.className) {
          anchor.className = span.className;
        }
        while (span.firstChild) {
          anchor.appendChild(span.firstChild);
        }
        span.replaceWith(anchor);
      });
    }
  }
});
