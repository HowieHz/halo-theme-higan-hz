import "../shared/main";
import "../utils/article.css";
import { initHeadingAnchors } from "../utils/heading-anchor";

document.addEventListener("DOMContentLoaded", () => {
  initHeadingAnchors("article > .content");
});
