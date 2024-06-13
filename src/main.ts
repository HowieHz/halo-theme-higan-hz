import "unfonts.css";
import "./assets/main.js";
import "./styles/tailwind.css";
import "../tmp/styles/theme.css";
import "./styles/main.css";
import "@purge-icons/generated";
import "github-syntax-light/lib/github-light.css";
export * from "./create-toc";
import Alpine from "alpinejs";
import momentComment from "./alpine-data/moment-comment";

window.Alpine = Alpine;
Alpine.data("momentComment", momentComment);
Alpine.start();
