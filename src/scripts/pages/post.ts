import "../main";
import "../../styles/pages/post.css";
import "../../styles/mixins/article.css";
import "../../styles/mixins/article-metadata.css";

import { isVisible, scrollToTop, show, toggle } from "../utils/animations";
import { fadeIn } from "../utils/animations/fade-in";
import { fadeOut } from "../utils/animations/fade-out";
import { slideDown } from "../utils/animations/slide-down";
import { slideUp } from "../utils/animations/slide-up";

// Animation durations in milliseconds
const ANIMATION_DURATION = 200;

document.addEventListener("click", (e: Event): void => {
  const target = e.target as HTMLElement;
  const scrollElement = target.closest<HTMLElement>("[data-scroll-to-top]");

  if (scrollElement) {
    e.preventDefault();
    scrollToTop();
  }
});

/**
 * 获取页面滚动距离（垂直方向）
 */
function getTopDistance(): number {
  // const topDistance = window.pageYOffset || // 现代浏览器首选 scrollY 的别名 支持大部分现代浏览器（IE9+）
  // document.documentElement.scrollTop ||  // 标准模式兼容 包括老版本 IE
  // document.body.scrollTop || // 怪异模式兼容
  // 0;
  return window.scrollY || 0;
}

/**
 * Event delegation for toggle functionality on hover
 * Handle mouseover and mouseout events for elements with data-toggle-target attribute
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
  /**
   * 控制博客文章页面中菜单的不同版本
   * 适用于桌面端、平板端和移动端
   */
  if (document.querySelector(".post")) {
    // 移动端 文章页 底部导航栏 按钮事件 绑定
    const footerMenuButton: HTMLElement | null = document.querySelector("#actions-footer > #menu");
    const footerTocButton: HTMLElement | null = document.querySelector("#actions-footer > #toc");
    const footerShareButton: HTMLElement | null = document.querySelector("#actions-footer > #share");
    footerMenuButton?.addEventListener("click", (): void => {
      const navFooter: HTMLElement | null = document.querySelector("#nav-footer");
      if (!navFooter) {
        return;
      }
      if (isVisible(navFooter)) {
        footerMenuButton.setAttribute("aria-expanded", "false");
        slideUp(navFooter, 200);
      } else {
        footerMenuButton.setAttribute("aria-expanded", "true");
        slideDown(navFooter, 200);
      }
    });
    footerTocButton?.addEventListener("click", (): void => {
      const tocFooter: HTMLElement | null = document.querySelector("#toc-footer");
      if (!tocFooter) {
        return;
      }
      if (isVisible(tocFooter)) {
        footerTocButton.setAttribute("aria-expanded", "false");
        slideUp(tocFooter, 200);
      } else {
        footerTocButton.setAttribute("aria-expanded", "true");
        // First, play the slide-down animation
        slideDown(tocFooter, 200);

        // Then instantly scroll to active item position
        const activeLink = tocFooter.querySelector<HTMLElement>(".toc-active");

        if (activeLink) {
          setTimeout(() => {
            activeLink.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "center",
            });
          }, 200);
        }
      }
    });
    footerShareButton?.addEventListener("click", (): void => {
      const shareFooter: HTMLElement | null = document.querySelector("#share-footer");
      if (!shareFooter) {
        return;
      }
      if (isVisible(shareFooter)) {
        footerShareButton.setAttribute("aria-expanded", "false");
        slideUp(shareFooter, 200);
      } else {
        footerShareButton.setAttribute("aria-expanded", "true");
        slideDown(shareFooter, 200);
      }
    });

    // 桌面端 文章页 导航栏 按钮事件 绑定
    const shareButton: HTMLElement | null = document.querySelector("#actions #action-share");
    shareButton?.addEventListener("click", (): void => {
      const shareMenu = document.getElementById("share-list");
      if (!shareMenu) {
        return;
      }
      if (isVisible(shareMenu)) {
        shareButton.setAttribute("aria-expanded", "false");
        slideUp(shareMenu, 200);
      } else {
        shareButton.setAttribute("aria-expanded", "true");
        slideDown(shareMenu, 200);
      }
    });

    const menuComponents: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>(
      "#menu #nav, #menu #actions, #menu #toc",
    );

    const shareListComponents: HTMLElement | null = document.querySelector<HTMLElement>("#menu #share-list");
    const menuIcon: HTMLElement | null = document.querySelector<HTMLElement>("#menu-icon");
    const topIcon: HTMLElement | null = document.querySelector<HTMLElement>("#top-icon-tablet");
    const tocIconTablet: HTMLElement | null = document.querySelector<HTMLElement>("#toc-icon-tablet");

    if (menuComponents && shareListComponents && menuIcon && topIcon && tocIconTablet) {
      // 在高分辨率笔记本电脑和桌面端显示菜单
      // 大于等于 1024px 的屏幕宽度 页面完成初始化时自动显示菜单
      if (window.matchMedia("(min-width: 1024px)").matches) {
        // menuIcon.classList.add("active"); // 为 #header-post .active 样式设置，模板默认有 active，无需添加
        show(menuComponents);
      } else {
        menuIcon.classList.remove("active"); // 为 #header-post .active 样式设置
        menuIcon.setAttribute("aria-expanded", "false"); // aria-expanded 属性设置为 false，表示菜单初始为折叠状态
      }

      // 平板端、桌面端 文章页 菜单 按钮事件
      menuIcon.addEventListener("click", (e: Event): void => {
        e.preventDefault();
        if (isVisible(menuComponents)) {
          menuIcon.classList.remove("active"); // 为 #header-post .active 样式设置
          menuIcon.setAttribute("aria-expanded", "false"); // 切换 aria-expanded 属性值
          fadeOut(menuComponents, 50); // 隐藏菜单
          // 收起二级菜单
          shareButton?.setAttribute("aria-expanded", "false");
          fadeOut(shareListComponents, 50); // 隐藏分享菜单
        } else {
          menuIcon.classList.add("active"); // 为 #header-post .active 样式设置
          menuIcon.setAttribute("aria-expanded", "true"); // 切换 aria-expanded 属性值
          fadeIn(menuComponents, 50); // 显示菜单
        }
      });

      // 平板端 TOC 按钮和 overlay 事件
      const tocOverlayTablet: HTMLElement | null = document.querySelector("#toc-overlay-tablet");
      const tocOverlayClose: HTMLElement | null = document.querySelector("#toc-overlay-close");
      const tocOverlayBackdrop: HTMLElement | null = document.querySelector("#toc-overlay-backdrop");

      // TOC 按钮点击事件
      tocIconTablet.addEventListener("click", (): void => {
        if (!tocOverlayTablet) {
          return;
        }
        if (isVisible(tocOverlayTablet)) {
          tocIconTablet.setAttribute("aria-expanded", "false");
          fadeOut(tocOverlayTablet, ANIMATION_DURATION);
        } else {
          tocIconTablet.setAttribute("aria-expanded", "true");
          fadeIn(tocOverlayTablet, ANIMATION_DURATION);

          // 滚动到激活的目录项
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
      });

      // 关闭按钮点击事件
      tocOverlayClose?.addEventListener("click", (): void => {
        if (tocOverlayTablet) {
          tocIconTablet.setAttribute("aria-expanded", "false");
          fadeOut(tocOverlayTablet, ANIMATION_DURATION);
        }
      });

      // 点击背景关闭
      tocOverlayBackdrop?.addEventListener("click", (): void => {
        if (tocOverlayTablet) {
          tocIconTablet.setAttribute("aria-expanded", "false");
          fadeOut(tocOverlayTablet, ANIMATION_DURATION);
        }
      });

      // 平板端 文章页 导航栏、回到顶部按钮、TOC 按钮 页面滚动相关逻辑
      // 添加滚动监听器，用于隐藏/显示导航链接
      window.addEventListener("scroll", (): void => {
        const topDistance = getTopDistance();

        // 顶部菜单按钮、顶部菜单、回到顶部按钮、TOC 按钮 根据页面滚动距离 显示/隐藏
        if (window.matchMedia("(min-width: 640px) and (max-width: 1024px)").matches) {
          if (topDistance < 50) {
            fadeIn(menuIcon, 200);
            fadeOut(topIcon, 200);
            fadeOut(tocIconTablet, 200);
          } else if (topDistance > 100) {
            menuIcon.classList.remove("active"); // 为 #header-post .active 样式设置
            fadeOut(menuIcon, 200);
            menuIcon.setAttribute("aria-expanded", "false"); // 切换 aria-expanded 属性值
            fadeOut(menuComponents, 200);
            shareButton?.setAttribute("aria-expanded", "false");
            fadeOut(shareListComponents, 200);
            fadeIn(topIcon, 200);
            fadeIn(tocIconTablet, 200);
          }
        }
      });
    }

    const footerNav: HTMLElement | null = document.querySelector<HTMLElement>("#footer-post");
    let lastScrollTop = 0;
    const navFooter: HTMLElement | null = document.querySelector<HTMLElement>("#nav-footer");
    const tocFooter: HTMLElement | null = document.querySelector<HTMLElement>("#toc-footer");
    const shareFooter: HTMLElement | null = document.querySelector<HTMLElement>("#share-footer");
    const footerTopIcon: HTMLElement | null = document.querySelector<HTMLElement>("#actions-footer > #top");

    /**
     * 移动端 文章页 底部导航栏 页面滚动相关逻辑
     * 向上滚动时显示移动端导航菜单，
     * 向下滚动时再次隐藏
     */
    if (footerNav) {
      window.addEventListener("scroll", (): void => {
        const topDistance = getTopDistance();

        // 在滚动时，关闭全部底部导航栏子菜单
        footerTocButton?.setAttribute("aria-expanded", "false");
        footerMenuButton?.setAttribute("aria-expanded", "false");
        footerShareButton?.setAttribute("aria-expanded", "false");
        for (const footer of [tocFooter, navFooter, shareFooter]) {
          if (footer) {
            slideUp(footer, 200);
          }
        }

        if (topDistance > lastScrollTop) {
          // 向下滚动 -> 隐藏菜单
          slideUp(footerNav, 200);
        } else {
          // 向上滚动 -> 显示菜单
          slideDown(footerNav, 200);
        }
        lastScrollTop = topDistance;

        // 回到顶部按钮 根据页面滚动距离 显示/隐藏
        if (topDistance < 50) {
          // 隐藏回到顶部按钮
          footerTopIcon?.style.setProperty("transform", "scale(0)");
        } else if (topDistance > 100) {
          // 显示回到顶部按钮
          footerTopIcon?.style.setProperty("transform", "scale(1)");
        }
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
