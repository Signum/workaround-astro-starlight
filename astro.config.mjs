// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import sitemap from "@astrojs/sitemap";
import matomo from "astro-matomo";
import remarkSmartypants from "remark-smartypants";

// https://astro.build/config
export default defineConfig({
  site: "https://workaround.org",
  integrations: [
    starlight({
      lastUpdated: true,
      title: "ISPmail Guide",
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/Signum/workaround-astro-starlight" },
        { icon: "matrix", label: "Matrix", href: "https://riot.im/app/#/room/#ispmail:matrix.org" },
        { icon: "rss", label: "Feed", href: "https://comentario.workaround.org/api/rss/comments?domain=0f111a27-fbfa-48af-8beb-ab12e612d92f" },
      ],
      // https://expressive-code.com/key-features/word-wrap/#configuration
      components: {
        Footer: "./src/components/Footer.astro",
      },
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        {
          label: "ISPmail for Debian 13",
          // slug: "ispmail-bookworm",
          autogenerate: { directory: "ispmail-trixie" },
        },
        {
          label: "ISPmail for Debian 12",
          // slug: "ispmail-bookworm",
          autogenerate: { directory: "ispmail-bookworm" },
        },
        {
          label: "Misc articles",
          autogenerate: { directory: "articles" },
        },
      ],
      logo: {
        light: "./src/assets/logo.svg",
        dark: "./src/assets/logo-dark.svg",
        replacesTitle: true,
      },
    }),
    // https://github.com/felix-berlin/astro-matomo
    matomo({
      enabled: import.meta.env.PROD, // Only load in production
      host: "https://matomo.workaround.org/",
      setCookieDomain: "*.workaround.org",
      trackerUrl: "js/", // defaults to matomo.php
      srcUrl: "js/", // defaults to matomo.js
      siteId: 1,
      heartBeatTimer: 5,
      disableCookies: true,
      debug: false,
    }),
    sitemap(),
  ],

  markdown: {
    remarkPlugins: [
      // remove the substitution of -- to –
      // @ts-ignore
      [remarkSmartypants, { dashes: false }],
    ],
  },
});
