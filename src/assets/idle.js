/* 此处 js 不会被编译到最终文件中 */

/**
 * Sets up Justified Gallery.
 * 需要 Jquery 的 Justified Gallery 插件，可考虑用现代手段替代。
 */
function isPrototypeJustifiedGallery() {
  return Boolean($.prototype.justifiedGallery);
}

if (isPrototypeJustifiedGallery()) {
  const options = {
    rowHeight: 140,
    margins: 4,
    lastRow: "justify",
  };
  $(".article-gallery").justifiedGallery(options);
}
