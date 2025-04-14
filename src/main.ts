import "@purge-icons/generated";

import Alpine from "alpinejs";

import "unfonts.css";
import "../tmp/styles/theme.css";

import momentComment from "./alpine-data/moment-comment";

import "./assets/main.js";
import "./styles/main.css";
import "./styles/tailwind.css";

export * from "./create-toc";

window.Alpine = Alpine;
Alpine.data("momentComment", momentComment);
Alpine.start();
