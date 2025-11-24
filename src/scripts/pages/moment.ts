import "../generic-header";
import "../../styles/mixins/common-post-list.css";
import "../../styles/mixins/article.css";
import "../../styles/pages/moment.css";

import Alpine from "alpinejs";

import momentComment from "../utils/alpine-data/moment-comment";

window.Alpine = Alpine;
Alpine.data("momentComment", momentComment);
Alpine.start();
