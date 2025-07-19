import "@purge-icons/generated";

import Alpine from "alpinejs";

import "../tmp/styles/theme.css";

import momentComment from "./alpine-data/moment-comment";

import "./assets/fonts/meslo-LG/MesloLGS-Regular.woff2";
import "./assets/fonts/meslo-LG/MesloLGS-Regular.woff";
import "./assets/fonts/meslo-LG/MesloLGS-Regular.ttf";
import "./utils/animation";
import "./utils/main";
import "./styles/main.css";
import "./styles/tailwind.css";

export * from "./utils/create-toc";

window.Alpine = Alpine;
Alpine.data("momentComment", momentComment);
Alpine.start();
