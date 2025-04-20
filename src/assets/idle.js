/**
 * Sets up Justified Gallery.
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
