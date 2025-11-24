import "../../../../styles/mixins/list/moment/summary.css";
import "../../../../styles/mixins/list/post/common.css";
import "../../../../styles/mixins/article.css";

import Alpine from "alpinejs";

import momentComment from "../../alpine-data/moment-comment";

window.Alpine = Alpine;
Alpine.data("momentComment", momentComment);
Alpine.start();
