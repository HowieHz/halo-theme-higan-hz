import "./styles.css";
import "../list-post-simple/styles.css";
import "/src/styles/mixins/article.css";

import Alpine from "alpinejs";

import momentComment from "./alpine-data/moment-comment";

window.Alpine = Alpine;
Alpine.data("momentComment", momentComment);
Alpine.start();
