import "./generic-header";

import Alpine from "alpinejs";

import "../styles/pages/moment.css";

import momentComment from "../alpine-data/moment-comment";

window.Alpine = Alpine;
Alpine.data("momentComment", momentComment);
Alpine.start();
