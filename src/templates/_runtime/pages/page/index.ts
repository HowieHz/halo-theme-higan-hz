import "@runtime/global";
import "./styles.css";
import "@runtime/styles/article-header.css";
import "@runtime/styles/article.css";
import { initHeadingAnchors } from "@runtime/scripts/heading-anchor";

document.addEventListener("DOMContentLoaded", () => {
  initHeadingAnchors("article > .content");
});
