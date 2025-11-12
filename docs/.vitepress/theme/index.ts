import "./main.css";

import Theme from "vitepress/theme";

import DynamicLayout from "../components/DynamicLayout.vue";

export default {
  ...Theme,
  // use our custom layout component that we'll create next
  Layout: DynamicLayout,
};
