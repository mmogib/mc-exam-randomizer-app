import { defineConfig } from "vuepress/config";

export default defineConfig({
  /**
   * Type is `DefaultThemeConfig`
   */
  title: "MCER Docs",
  themeConfig: {
    navbar: true,
    sidebar: "auto",
    nav: [
      { text: "Home", link: "/" },
      { text: "Get Started", link: "/getstarted/" },
      { text: "Guide", link: "/guide/" },
    ],
  },
});
