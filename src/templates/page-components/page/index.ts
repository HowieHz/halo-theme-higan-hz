import "@templates/global/main";
import "@templates/css-components/article.css";
import { initHeadingAnchors } from "@templates/ts-components/heading-anchor";

document.addEventListener("DOMContentLoaded", () => {
  initHeadingAnchors("article > .content");
});
