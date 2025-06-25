window.isMobile = () => {
  const flag = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  return flag;
};

/**
 * 滚动到页面顶部
 */
window.scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

document.addEventListener("DOMContentLoaded", function () {
  /**
   * Shows the responsive navigation menu on mobile.
   */
  // 移动端 页眉菜单 按钮事件
  const mobileMenuIcon = $("#header > #nav > ul > .icon");
  const mobileMenu = $("#header > #nav > ul > li:not(:first-child)");
  mobileMenuIcon.on("click", function () {
    if (mobileMenu.is(":visible")) {
      mobileMenu.slideUp(200, function () {
        mobileMenu.removeClass("responsive").css("display", "");
      });
    } else {
      mobileMenu.slideDown(200, function () {
        mobileMenu.addClass("responsive").css("display", "");
      });
    }
  });

  /**
   * Controls the different versions of  the menu in blog post articles
   * for Desktop, tablet and mobile.
   */
  if ($(".post").length) {
    // 移动端 文章页 底部导航栏 按钮事件
    $("#actions-footer > #menu").click(function () {
      const navFooter = $("#nav-footer");
      if (navFooter.is(":visible")) {
        navFooter.slideUp(200);
      } else {
        navFooter.slideDown(200);
      }
    });
    $("#actions-footer > #toc").click(function () {
      const tocFooter = $("#toc-footer");
      if (tocFooter.is(":visible")) {
        tocFooter.slideUp(200);
      } else {
        tocFooter.slideDown(200);
      }
    });
    $("#actions-footer > #share").click(function () {
      const shareFooter = $("#share-footer");
      if (shareFooter.is(":visible")) {
        shareFooter.slideUp(200);
      } else {
        shareFooter.slideDown(200);
      }
    });

    // 桌面端 文章页 导航栏按钮事件
    $("#actions #action-share").click(function () {
      const shareMenu = $("#share-list");
      if (shareMenu.is(":visible")) {
        shareMenu.slideUp(200);
      } else {
        shareMenu.slideDown(200);
      }
    });

    const menu = $("#menu");
    // const nav = $("#menu > #nav");
    const menuIcon = $("#menu-icon");

    /**
     * Display the menu on hi-res laptops and desktops.
     */
    // 大于等于 1024px 的屏幕宽度 初始化时就显示菜单
    if (window.matchMedia("(min-width: 1024px)").matches) {
      menuIcon.addClass("active"); // for #header-post .active style
      menu.show();
    }

    /**
     * Display the menu if the menu icon is clicked.
     */
    // 平板端、桌面端 文章页 菜单按钮事件
    menuIcon.on("click", function () {
      if (menu.is(":visible")) {
        menuIcon.removeClass("active"); // for #header-post .active style
        menu.fadeOut(50);
      } else {
        menuIcon.addClass("active"); // for #header-post .active style
        menu.fadeIn(50);
      }
      return false;
    });

    /**
     * Add a scroll listener to the menu to hide/show the navigation links.
     */
    // 平板端 文章页 导航栏、回到顶部按钮 页面滚动相关逻辑
    if (menu.length) {
      const topIcon = $("#top-icon-tablet");
      $(window).on("scroll", function () {
        const topDistance = $(window).scrollTop();

        // hide only the navigation links on desktop
        // if (!nav.is(":visible") && topDistance < 50) {
        //   nav.show();
        // } else if (nav.is(":visible") && topDistance > 100) {
        //   nav.hide();
        // }

        // on tablet, hide the navigation icon as well and
        // show a "scroll to top icon" instead

        // 顶部菜单按钮、顶部菜单、回到顶部按钮 根据页面滚动距离 显示/隐藏
        if (window.matchMedia("(min-width: 640px) and (max-width: 1024px)").matches) {
          if (topDistance < 50) {
            menuIcon.fadeIn(200);
            topIcon.fadeOut(200);
          } else if (topDistance > 100) {
            menuIcon.fadeOut(200);
            menu.fadeOut(200);
            topIcon.fadeIn(200);
          }
        }
      });
    }

    /**
     * Show mobile navigation menu after scrolling upwards,
     * hide it again after scrolling downwards.
     */
    // 移动端 文章页 底部导航栏 页面滚动相关逻辑
    const footerNav = $("#footer-post");
    if (footerNav.length) {
      let lastScrollTop = 0;
      const navFooter = $("#nav-footer");
      const tocFooter = $("#toc-footer");
      const shareFooter = $("#share-footer");
      const footerTopIcon = $("#actions-footer > #top");
      $(window).on("scroll", function () {
        const topDistance = $(window).scrollTop();

        // 在滚动时，关闭全部底部导航栏子菜单
        navFooter.slideUp(200);
        tocFooter.slideUp(200);
        shareFooter.slideUp(200);

        if (topDistance > lastScrollTop) {
          // 向下滚动 -> hide menu
          footerNav.slideUp(200);
        } else {
          // 向上滚动 -> show menu
          footerNav.slideDown(200);
        }
        lastScrollTop = topDistance;

        // show a "navigation" icon when close to the top of the page,
        // otherwise show a "scroll to the top" icon
        // 回到顶部按钮 根据页面滚动距离 显示/隐藏
        if (topDistance < 50) {
          footerTopIcon.css("transform", "scale(0)");
        } else if (topDistance > 100) {
          footerTopIcon.css("transform", "scale(1)");
        }
      });
    }
  }
});
