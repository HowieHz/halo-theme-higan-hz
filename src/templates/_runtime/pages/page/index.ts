import "@runtime/global/main";
import "./styles.css";
import "@runtime/styles/article.css";
import { initHeadingAnchors } from "@runtime/scripts/heading-anchor";

document.addEventListener("DOMContentLoaded", () => {
  initHeadingAnchors("article > .content");
});
