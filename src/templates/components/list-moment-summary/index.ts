import "./styles.css";
import "@templates/css-components/article.css";
import Alpine from "alpinejs";

import momentComment from "./alpine-data/moment-comment";

declare global {
  interface Window {
    Alpine: typeof Alpine;
  }
}

window.Alpine = Alpine;
Alpine.data("momentComment", momentComment);
Alpine.start();
