import "unfonts.css";
import "virtual:uno.css";
import "./assets/main.js";
// import "./assets/tailwind.css";
import "../tmp/styles/theme.css";
import "github-syntax-light/lib/github-light.css";
import "./styles/main.css";
export * from "./create-toc";
import Alpine from "alpinejs";
import momentComment from "./alpine-data/moment-comment";

window.Alpine = Alpine;
Alpine.data("momentComment", momentComment);
Alpine.start();
