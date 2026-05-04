import "@templates/_runtime/global/main";
import "@templates/_runtime/styles/article.css";
import { initHeadingAnchors } from "@templates/_runtime/scripts/heading-anchor";

document.addEventListener("DOMContentLoaded", () => {
  initHeadingAnchors("article > .content");
});
