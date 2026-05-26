import "@runtime/global";
import "./styles.css";
import "@runtime/styles/article-header.css";
import "@runtime/styles/article.css";
import "@runtime/styles/article-metadata.css";
import { hide, isVisible, scrollToTop, show } from "@runtime/scripts/animations/base";
import { fadeIn } from "@runtime/scripts/animations/fade-in";
import { fadeOut } from "@runtime/scripts/animations/fade-out";
import { slideDown } from "@runtime/scripts/animations/slide-down";
import { slideUp } from "@runtime/scripts/animations/slide-up";

// Animation durations in milliseconds
const ANIMATION_DURATION = 200;
const POST_HEADER_NAV_ANIMATION_DURATION = 50;
const POST_HEADER_ARTICLE_AVOIDANCE_GAP = 16;
const POST_HEADER_ARTICLE_AVOIDANCE_SHRINK_DURATION = 50;
const POST_HEADER_ARTICLE_AVOIDANCE_RESTORE_DURATION = 200;
// 页面滚动滞回阈值：低于 LOW 进入靠近顶部状态，高于 HIGH 进入已滚动状态。
// 顶部 #header-post 平板 quickActions 和移动端底部 #actions-footer > #top 共用这组阈值，但各自维护自己的导航状态。
const SCROLL_HYSTERESIS_LOW = 50;
const SCROLL_HYSTERESIS_HIGH = 100;

type ViewportMode = "desktop" | "tablet" | "mobile";
type TabletMode = "top" | "quickActions";

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
  // 顶部导航根容器 #header-post，用于观察顶部菜单可视尺寸变化。
  headerPost: HTMLElement;
  // 文章标题区域内需要单独避让顶部菜单的目标：#article-header > h1 和 #article-header > .meta。
  articleAvoidanceTargets: PostHeaderArticleAvoidanceTarget[];
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
  // #action-share 点击展开/收起 #share-list 时使用 slide；其他顶部导航状态变化仍使用 fade。
  shareListAnimation?: "fade" | "slide";
};

type PostHeaderNavEvent =
  | { type: "toggleMenuContent" }
  | { type: "toggleShare" }
  | { type: "resize"; environment: PostHeaderNavEnvironment }
  | { type: "tabletScroll"; tabletMode: TabletMode; viewportMode: ViewportMode };

type FooterPostNavEnvironment = {
  // 当前页面滚动位置，用于判断 #actions-footer > #top 显隐。
  scrollY: number;
  // 移动端底部回到顶部按钮 #actions-footer > #top 当前是否显示；scrollY 处于 LOW~HIGH 滞回区间时保持这个值。
  isTopActionVisible: boolean;
};

type FooterPostNavIntent = {
  // 移动端底部菜单容器 #nav-footer 是否展开。
  isMenuOpen: boolean;
  // 移动端底部目录容器 #toc-footer 是否展开。
  isTocOpen: boolean;
  // 移动端底部分享容器 #share-footer 是否展开。
  isShareOpen: boolean;
  // 用户当前是否希望显示移动端底部导航栏容器 #footer-post。
  isFooterVisible: boolean;
};

// 移动端底部 #footer-post 导航状态。
// 状态描述 #nav-footer/#toc-footer/#share-footer 是否展开、#footer-post 是否显示、#actions-footer > #top 是否显示的输入条件。
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

type RectBounds = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type VisibleRect = RectBounds & {
  width: number;
  height: number;
};

type PostHeaderArticleAvoidanceTarget = {
  element: HTMLElement;
  initialMarginInlineEnd: string | null;
  initialComputedMarginInlineEnd: number;
  initialTransition: string | null;
};
type PostHeaderArticleAvoidanceTransitionMode = "shrink" | "restore";

let schedulePostHeaderArticleAvoidanceAfterDomChange = (): void => {};
let postHeaderArticleAvoidanceFrame: number | null = null;
let postHeaderArticleAvoidanceTimeout: number | null = null;

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

  // 平板端 #header-post 滚动模式：scrollY < LOW 显示 #menu-icon，scrollY > HIGH 显示 #top-icon-tablet 和 #toc-icon-tablet。
  // LOW~HIGH 区间维持当前模式，避免临界点附近反复切换。
  if (topDistance < SCROLL_HYSTERESIS_LOW) {
    return "top";
  }
  if (topDistance > SCROLL_HYSTERESIS_HIGH) {
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

  // 初始化移动端底部 #footer-post：#footer-post 显示，#nav-footer/#toc-footer/#share-footer 收起，#actions-footer > #top 按当前滚动位置显隐。
  // scrollY 使用页面当前位置，避免浏览器恢复滚动位置后第一次滚动方向误判。
  return {
    environment: {
      scrollY,
      isTopActionVisible: shouldShowFooterTopAction(scrollY, false),
    },
    intent: {
      isMenuOpen: false,
      isTocOpen: false,
      isShareOpen: false,
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
  const headerPost = document.querySelector<HTMLElement>("#header-post");
  const articleHeaderTitle = document.querySelector<HTMLElement>("#article-header > h1");
  const articleHeaderMeta = document.querySelector<HTMLElement>("#article-header > .meta");
  const menuIcon = document.querySelector<HTMLElement>("#header-post #menu-icon");
  const nav = document.querySelector<HTMLElement>("#header-post #nav");
  const actions = document.querySelector<HTMLElement>("#header-post #actions");
  const toc = document.querySelector<HTMLElement>("#header-post #toc");
  const shareList = document.querySelector<HTMLElement>("#header-post #share-list");
  const topIconTablet = document.querySelector<HTMLElement>("#header-post #top-icon-tablet");
  const tocIconTablet = document.querySelector<HTMLElement>("#header-post #toc-icon-tablet");
  const shareButton = document.querySelector<HTMLElement>("#header-post #actions #action-share");

  if (!headerPost || !menuIcon || !nav || !actions || !toc || !topIconTablet || !tocIconTablet) {
    return null;
  }

  return {
    headerPost,
    articleAvoidanceTargets: [articleHeaderTitle, articleHeaderMeta]
      .filter((element): element is HTMLElement => element !== null)
      .map((element) => ({
        element,
        initialMarginInlineEnd: element.style.getPropertyValue("margin-inline-end") || null,
        initialComputedMarginInlineEnd: Number.parseFloat(window.getComputedStyle(element).marginInlineEnd) || 0,
        initialTransition: element.style.getPropertyValue("transition") || null,
      })),
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
  if (scrollY < SCROLL_HYSTERESIS_LOW) {
    return false;
  }
  if (scrollY > SCROLL_HYSTERESIS_HIGH) {
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
          ...state.intent,
          isMenuOpen: !state.intent.isMenuOpen,
          isFooterVisible: true,
        },
      };
    case "toggleToc":
      return {
        ...state,
        intent: {
          ...state.intent,
          isTocOpen: !state.intent.isTocOpen,
          isFooterVisible: true,
        },
      };
    case "toggleShare":
      return {
        ...state,
        intent: {
          ...state.intent,
          isShareOpen: !state.intent.isShareOpen,
          isFooterVisible: true,
        },
      };
    case "scroll": {
      return {
        environment: {
          scrollY: event.scrollY,
          // 移动端底部回到顶部按钮 #actions-footer > #top：scrollY < LOW 隐藏，scrollY > HIGH 显示，LOW~HIGH 保持当前状态。
          isTopActionVisible: shouldShowFooterTopAction(event.scrollY, state.environment.isTopActionVisible),
        },
        intent: {
          // 移动端底部 #footer-post 页面滚动时关闭 #nav-footer/#toc-footer/#share-footer。
          isMenuOpen: false,
          isTocOpen: false,
          isShareOpen: false,
          // 向上滚动显示 #footer-post，向下滚动隐藏 #footer-post。
          isFooterVisible: event.scrollY <= state.environment.scrollY,
        },
      };
    }
  }
}

function setElementVisibility(
  element: HTMLElement | HTMLElement[],
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

function doRectsOverlapVertically(firstRect: RectBounds, secondRect: RectBounds): boolean {
  // #article-header > h1/.meta 只需要避让和自身 Y 轴相交的顶部菜单元素。
  return firstRect.top < secondRect.bottom && firstRect.bottom > secondRect.top;
}

function getViewportClippedRect(element: HTMLElement): VisibleRect | null {
  // 桌面端/平板端避让只关心用户当前能看到的矩形；元素超出 viewport 的部分不计入 h1/.meta 避让。
  const rect = element.getBoundingClientRect();
  const top = Math.max(0, rect.top);
  const right = Math.min(window.innerWidth, rect.right);
  const bottom = Math.min(window.innerHeight, rect.bottom);
  const left = Math.max(0, rect.left);
  const width = right - left;
  const height = bottom - top;

  if (width <= 0 || height <= 0) {
    return null;
  }

  return {
    top,
    right,
    bottom,
    left,
    width,
    height,
  };
}

function getCurrentPostHeaderArticleAvoidanceMargin(target: HTMLElement): number {
  const value = Number(target.dataset.postHeaderAvoidanceMarginInlineEnd);

  return Number.isFinite(value) ? value : 0;
}

function getRenderedPostHeaderArticleAvoidanceMargin(target: PostHeaderArticleAvoidanceTarget): number {
  const value =
    Number.parseFloat(window.getComputedStyle(target.element).marginInlineEnd) - target.initialComputedMarginInlineEnd;

  return Number.isFinite(value) ? Math.max(0, value) : getCurrentPostHeaderArticleAvoidanceMargin(target.element);
}

function setPostHeaderArticleAvoidanceTargetTransition(
  target: PostHeaderArticleAvoidanceTarget,
  mode: PostHeaderArticleAvoidanceTransitionMode,
): void {
  const duration =
    mode === "shrink" ? POST_HEADER_ARTICLE_AVOIDANCE_SHRINK_DURATION : POST_HEADER_ARTICLE_AVOIDANCE_RESTORE_DURATION;
  const transition = `margin-inline-end ${duration}ms ease`;
  target.element.style.setProperty(
    "transition",
    target.initialTransition ? `${target.initialTransition}, ${transition}` : transition,
  );
}

function restorePostHeaderArticleAvoidanceTargetMargin(target: PostHeaderArticleAvoidanceTarget): void {
  // 桌面端/平板端顶部菜单不再覆盖目标元素时，撤销写到 #article-header > h1 或 #article-header > .meta 的 margin-inline-end。
  // 往右恢复标题/元信息可用宽度时加短过渡，减少鼠标掠过 #header-post 操作按钮时的抖动。
  const currentAvoidanceMargin = getCurrentPostHeaderArticleAvoidanceMargin(target.element);
  if (currentAvoidanceMargin > 0) {
    setPostHeaderArticleAvoidanceTargetTransition(target, "restore");
  }
  delete target.element.dataset.postHeaderAvoidanceMarginInlineEnd;

  if (target.initialMarginInlineEnd) {
    target.element.style.setProperty("margin-inline-end", target.initialMarginInlineEnd);
  } else {
    target.element.style.removeProperty("margin-inline-end");
  }
}

function restorePostHeaderArticleAvoidanceMargin(elements: PostHeaderNavElements): void {
  // 移动端顶部 #header-post 退出显示时，撤销 #article-header > h1 和 #article-header > .meta 上的避让 margin。
  elements.articleAvoidanceTargets.forEach((target) => {
    restorePostHeaderArticleAvoidanceTargetMargin(target);
  });
}

function getPostHeaderArticleAvoidanceCandidates(elements: PostHeaderNavElements): HTMLElement[] {
  // 只测量顶部菜单里可能靠近 #article-header > h1 或 #article-header > .meta 的元素。
  // 不直接测量整个 #header-post，因为平板端 quickActions 的 #top-icon-tablet/#toc-icon-tablet 是 fixed 到右下角的快捷按钮。
  const infoItems = Array.from(elements.actions.querySelectorAll<HTMLElement>(".info"));
  const candidates = [
    elements.menuIcon,
    elements.nav,
    elements.actions,
    elements.shareList,
    elements.toc,
    ...infoItems,
  ];

  return candidates.filter((element): element is HTMLElement => Boolean(element));
}

function updatePostHeaderArticleAvoidanceTarget(
  target: PostHeaderArticleAvoidanceTarget,
  elements: PostHeaderNavElements,
): void {
  // 桌面端/平板端 #article-header > h1 和 #article-header > .meta 分开避让。
  // 每个目标只根据自己当前可见的 X/Y 边界，计算和顶部 #header-post 可见子元素的重叠宽度。
  const targetRect = target.element.getBoundingClientRect();
  const targetVisibleRect = getViewportClippedRect(target.element);

  if (!targetVisibleRect) {
    restorePostHeaderArticleAvoidanceTargetMargin(target);
    return;
  }

  const currentAvoidanceMargin = getCurrentPostHeaderArticleAvoidanceMargin(target.element);
  const targetNaturalRight = targetRect.right + getRenderedPostHeaderArticleAvoidanceMargin(target);
  const overlappingCandidateRects = getPostHeaderArticleAvoidanceCandidates(elements)
    .filter((element) => isVisible(element))
    .map((element) => getViewportClippedRect(element))
    .filter((rect): rect is VisibleRect => {
      return (
        rect !== null &&
        doRectsOverlapVertically(rect, targetVisibleRect) &&
        rect.left < targetNaturalRight &&
        rect.right > targetVisibleRect.left
      );
    });

  if (overlappingCandidateRects.length === 0) {
    restorePostHeaderArticleAvoidanceTargetMargin(target);
    return;
  }

  const visibleLeft = Math.min(...overlappingCandidateRects.map((rect) => rect.left));
  // #article-header > h1/.meta 只避让“目标元素自然右边界”和顶部菜单可见左边界之间的重叠宽度。
  // 不使用 window.innerWidth - visibleLeft，避免把顶部菜单右侧到视口边缘的空白也算进避让距离。
  const requiredMargin = Math.max(0, Math.ceil(targetNaturalRight - visibleLeft + POST_HEADER_ARTICLE_AVOIDANCE_GAP));
  // #article-header > h1/.meta 需要向左缩小时使用更短过渡，减少顶部菜单覆盖窗口。
  // #article-header > h1/.meta 往右恢复可用宽度时使用更长过渡，缓冲 #header-post hover 文案造成的尺寸变化。
  if (requiredMargin !== currentAvoidanceMargin) {
    setPostHeaderArticleAvoidanceTargetTransition(
      target,
      requiredMargin > currentAvoidanceMargin ? "shrink" : "restore",
    );
  }

  target.element.dataset.postHeaderAvoidanceMarginInlineEnd = String(requiredMargin);
  target.element.style.setProperty(
    "margin-inline-end",
    `calc(${target.initialMarginInlineEnd || "0px"} + ${requiredMargin}px)`,
  );
}

function updatePostHeaderArticleAvoidance(elements: PostHeaderNavElements): void {
  // 桌面端/平板端 #article-header > h1/.meta 避让逻辑：逐个计算是否需要避让顶部 #header-post。
  // 移动端顶部 #header-post 退出显示，底部 #footer-post 不参与这个避让计算。
  if (getViewportMode() === "mobile") {
    restorePostHeaderArticleAvoidanceMargin(elements);
    return;
  }

  elements.articleAvoidanceTargets.forEach((target) => {
    updatePostHeaderArticleAvoidanceTarget(target, elements);
  });
}

function schedulePostHeaderArticleAvoidance(elements: PostHeaderNavElements, delay = 0): void {
  // 顶部 #header-post 的 fade/slide 动画会在结束时改变最终 display，高度/宽度需要立即算一次、动画结束后再算一次。
  const update = (): void => {
    if (postHeaderArticleAvoidanceFrame !== null) {
      return;
    }

    postHeaderArticleAvoidanceFrame = window.requestAnimationFrame(() => {
      postHeaderArticleAvoidanceFrame = null;
      updatePostHeaderArticleAvoidance(elements);
    });
  };

  update();

  if (delay > 0) {
    if (postHeaderArticleAvoidanceTimeout !== null) {
      window.clearTimeout(postHeaderArticleAvoidanceTimeout);
    }

    postHeaderArticleAvoidanceTimeout = window.setTimeout(() => {
      postHeaderArticleAvoidanceTimeout = null;
      update();
    }, delay);
  }
}

function observePostHeaderArticleAvoidanceChanges(elements: PostHeaderNavElements): void {
  // 桌面端目录 #toc 在 DOMContentLoaded 后生成，hover 文案和分享列表也会改变 #header-post 的实际尺寸。
  // ResizeObserver 捕获这些非点击路径的尺寸变化，再触发 #article-header > h1/.meta 避让重算。
  if (!("ResizeObserver" in window)) {
    return;
  }

  const resizeObserver = new ResizeObserver(() => {
    schedulePostHeaderArticleAvoidance(elements);
  });
  const observedElements = [
    elements.headerPost,
    elements.menuIcon,
    elements.nav,
    elements.actions,
    elements.shareList,
    elements.toc,
    ...elements.articleAvoidanceTargets.map((target) => target.element),
  ];

  observedElements.forEach((element) => {
    if (element) {
      resizeObserver.observe(element);
    }
  });
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
    shareListAnimation: options.shareListAnimation ?? "fade",
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
    if (renderOptions.shareListAnimation === "slide") {
      setSlideElementVisibility(elements.shareList, isShareListShown, renderOptions);
    } else {
      setElementVisibility(elements.shareList, isShareListShown, renderOptions);
    }
  }
  setElementVisibility(elements.topIconTablet, areTabletQuickActionsShown, renderOptions);
  setElementVisibility(elements.tocIconTablet, areTabletQuickActionsShown, renderOptions);

  // 桌面端/平板端 #header-post 显隐或动画改变可视尺寸后，重新计算 #article-header > h1/.meta 右侧避让。
  // 移动端底部 #footer-post 不走这条路径，避免把底部导航尺寸算进文章标题区域。
  schedulePostHeaderArticleAvoidance(elements, renderOptions.animate ? renderOptions.duration : 0);
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

  elements.footerMenuButton?.setAttribute("aria-expanded", String(state.intent.isMenuOpen));
  elements.footerTocButton?.setAttribute("aria-expanded", String(state.intent.isTocOpen));
  elements.footerShareButton?.setAttribute("aria-expanded", String(state.intent.isShareOpen));

  setSlideElementVisibility(elements.footerNav, state.intent.isFooterVisible, renderOptions);
  if (elements.navFooter) {
    setSlideElementVisibility(elements.navFooter, state.intent.isMenuOpen, renderOptions);
  }
  if (elements.tocFooter) {
    setSlideElementVisibility(elements.tocFooter, state.intent.isTocOpen, renderOptions);
  }
  if (elements.shareFooter) {
    setSlideElementVisibility(elements.shareFooter, state.intent.isShareOpen, renderOptions);
  }

  elements.footerTopIcon?.style.setProperty(
    "transform",
    state.environment.isTopActionVisible ? "scale(1)" : "scale(0)",
  );

  if (state.intent.isTocOpen && options.scrollActiveTocIntoView && elements.tocFooter) {
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

function bindPostHeaderActionHoverText(elements: PostHeaderNavElements): void {
  // 桌面端/平板端顶部 #actions 按钮 hover 文案：按钮提供 data-text，#actions > .info 是唯一显示槽。
  const infoElement = elements.actions.querySelector<HTMLElement>(".info");

  if (!infoElement) {
    return;
  }

  const getActionElement = (event: MouseEvent): HTMLElement | null => {
    const target = event.target instanceof Element ? event.target : null;
    const actionElement = target?.closest<HTMLElement>("[data-text]");

    return actionElement && elements.actions.contains(actionElement) ? actionElement : null;
  };

  elements.actions.addEventListener("mouseover", (event) => {
    const actionElement = getActionElement(event);

    if (!actionElement || (event.relatedTarget instanceof Node && actionElement.contains(event.relatedTarget))) {
      return;
    }

    const text = actionElement.dataset.text;

    if (!text) {
      return;
    }

    infoElement.textContent = text;
    show(infoElement);
    schedulePostHeaderArticleAvoidanceAfterDomChange();
  });

  elements.actions.addEventListener("mouseout", (event) => {
    const actionElement = getActionElement(event);

    if (!actionElement || (event.relatedTarget instanceof Node && actionElement.contains(event.relatedTarget))) {
      return;
    }

    hide(infoElement);
    infoElement.textContent = "";
    schedulePostHeaderArticleAvoidanceAfterDomChange();
  });
}

document.addEventListener("DOMContentLoaded", (): void => {
  /** 控制博客文章页面中菜单的不同版本 适用于桌面端、平板端和移动端 */
  if (document.querySelector(".post")) {
    const postHeaderNavElements = getPostHeaderNavElements();
    let postHeaderNavState = createPostHeaderNavState();

    if (postHeaderNavElements) {
      // 桌面端/平板端顶部 #header-post：hover 文案、目录生成、分享菜单动画都会改变顶部菜单可视尺寸。
      // 这些变化统一触发 #article-header > h1/.meta 右侧避让，避免标题文字或元信息和顶部菜单重叠。
      schedulePostHeaderArticleAvoidanceAfterDomChange = () => {
        schedulePostHeaderArticleAvoidance(postHeaderNavElements, ANIMATION_DURATION);
      };
      observePostHeaderArticleAvoidanceChanges(postHeaderNavElements);
      bindPostHeaderActionHoverText(postHeaderNavElements);
      renderPostHeaderNav(postHeaderNavState, postHeaderNavElements, { animate: false });

      // 平板端、桌面端顶部菜单按钮 #menu-icon：点击后只切换 #nav/#actions/#toc 的展开状态。
      postHeaderNavElements.menuIcon.addEventListener("click", (e: Event): void => {
        e.preventDefault();

        postHeaderNavState = reducePostHeaderNavState(postHeaderNavState, { type: "toggleMenuContent" });
        renderPostHeaderNav(postHeaderNavState, postHeaderNavElements);
      });

      // 平板端、桌面端顶部分享按钮 #action-share：点击后只切换 #share-list 的展开状态。
      // #share-list 是否实际显示仍由 renderPostHeaderNav 结合 #nav/#actions/#toc 的展开状态决定。
      postHeaderNavElements.shareButton?.addEventListener("click", (): void => {
        postHeaderNavState = reducePostHeaderNavState(postHeaderNavState, { type: "toggleShare" });
        renderPostHeaderNav(postHeaderNavState, postHeaderNavElements, {
          duration: ANIMATION_DURATION,
          shareListAnimation: "slide",
        });
      });

      // 顶部 #header-post resize 逻辑：视口跨断点后按新视口重建顶部导航状态。
      window.addEventListener("resize", (): void => {
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
      const tocOverlayControls = [postHeaderNavElements.tocIconTablet, actionTocTablet, actionTocTabletMenu].filter(
        (control): control is HTMLElement => control !== null,
      );

      // 平板端目录浮层控制按钮：#toc-overlay-tablet 打开或关闭时，同步所有入口按钮的 aria-expanded。
      const setTocOverlayControlsExpanded = (isExpanded: boolean): void => {
        tocOverlayControls.forEach((control) => {
          control.setAttribute("aria-expanded", String(isExpanded));
        });
      };

      // 平板端目录浮层 #toc-overlay-tablet：关闭浮层并同步 #toc-icon-tablet/#action-toc-tablet/#action-toc-tablet-menu。
      const closeTocOverlay = (): void => {
        if (!tocOverlayTablet) {
          return;
        }

        setTocOverlayControlsExpanded(false);
        fadeOut(tocOverlayTablet, ANIMATION_DURATION);
      };

      // 平板端目录浮层 #toc-overlay-tablet：由 #toc-icon-tablet、#action-toc-tablet、#action-toc-tablet-menu 共用打开/关闭逻辑。
      const toggleTocOverlay = (): void => {
        if (!tocOverlayTablet) {
          return;
        }
        if (isVisible(tocOverlayTablet)) {
          closeTocOverlay();
        } else {
          setTocOverlayControlsExpanded(true);
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
      postHeaderNavElements.tocIconTablet.addEventListener("click", (): void => {
        toggleTocOverlay();
      });

      // 平板端顶部 #actions 中的目录按钮 #action-toc-tablet：点击打开/关闭 #toc-overlay-tablet。
      actionTocTablet?.addEventListener("click", (): void => {
        toggleTocOverlay();
      });

      // 平板端顶部菜单中的目录按钮 #action-toc-tablet-menu：点击打开/关闭 #toc-overlay-tablet。
      actionTocTabletMenu?.addEventListener("click", (): void => {
        toggleTocOverlay();
      });

      // 平板端目录浮层关闭按钮 #toc-overlay-close：点击后关闭 #toc-overlay-tablet。
      tocOverlayClose?.addEventListener("click", (): void => {
        closeTocOverlay();
      });

      // 平板端目录浮层背景 #toc-overlay-backdrop：点击后关闭 #toc-overlay-tablet。
      tocOverlayBackdrop?.addEventListener("click", (): void => {
        closeTocOverlay();
      });

      // 平板端目录浮层目录项 .toc-link：点击跳转标题后关闭 #toc-overlay-tablet，避免浮层遮挡正文。
      if (tocOverlayTablet) {
        tocOverlayTablet.addEventListener("click", (e: Event): void => {
          const target = e.target;
          if (target instanceof HTMLElement) {
            const tocLink = target.closest<HTMLElement>(".toc-link");
            if (tocLink) {
              closeTocOverlay();
            }
          }
        });
      }

      // 平板端顶部 #header-post 页面滚动逻辑：在顶部菜单按钮和回到顶部/目录快捷按钮之间切换。
      // 使用 getTabletMode 的 LOW/HIGH 滞回区间，避免滚动临界点闪烁。
      window.addEventListener("scroll", (): void => {
        const viewportMode = getViewportMode();

        if (viewportMode === "desktop") {
          // 桌面端 #header-post 固定在右上角；页面滚动会改变 #article-header > h1/.meta 与顶部菜单的 Y 轴相交关系。
          schedulePostHeaderArticleAvoidance(postHeaderNavElements);
          return;
        }

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
    }

    const footerPostNavElements = getFooterPostNavElements();
    let footerPostNavState = createFooterPostNavState();

    if (footerPostNavElements) {
      renderFooterPostNav(footerPostNavState, footerPostNavElements, { animate: false });

      // 移动端底部导航栏按钮 #actions-footer > #menu：点击后只切换 #nav-footer 的展开状态。
      footerPostNavElements.footerMenuButton?.addEventListener("click", (): void => {
        footerPostNavState = reduceFooterPostNavState(footerPostNavState, { type: "toggleMenu" });
        renderFooterPostNav(footerPostNavState, footerPostNavElements);
      });

      // 移动端底部导航栏按钮 #actions-footer > #toc：点击后只切换 #toc-footer 的展开状态。
      footerPostNavElements.footerTocButton?.addEventListener("click", (): void => {
        const isOpeningToc = !footerPostNavState.intent.isTocOpen;

        footerPostNavState = reduceFooterPostNavState(footerPostNavState, { type: "toggleToc" });
        renderFooterPostNav(footerPostNavState, footerPostNavElements, { scrollActiveTocIntoView: isOpeningToc });
      });

      // 移动端底部导航栏按钮 #actions-footer > #share：点击后只切换 #share-footer 的展开状态。
      footerPostNavElements.footerShareButton?.addEventListener("click", (): void => {
        footerPostNavState = reduceFooterPostNavState(footerPostNavState, { type: "toggleShare" });
        renderFooterPostNav(footerPostNavState, footerPostNavElements);
      });

      /** 移动端 #footer-post 页面滚动逻辑：向上滚动显示 #footer-post，向下滚动隐藏 #footer-post。 */
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
