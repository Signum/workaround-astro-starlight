// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: "https://workaround.org",
  integrations: [
    starlight({
      lastUpdated: true,
      title: "ISPmail Guide",
      // https://expressive-code.com/key-features/word-wrap/#configuration
      components: {
        Footer: "./src/components/Footer.astro",
      },
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        {
          label: "ISPmail for Debian 12",
          // slug: "ispmail-bookworm",
          autogenerate: { directory: "ispmail-bookworm" },
        },
        // {
        //   label: "Reference",
        //   autogenerate: { directory: "reference" },
        // },
      ],
      logo: {
        light: "./src/assets/logo.svg",
        dark: "./src/assets/logo-dark.svg",
        replacesTitle: true,
      },
    }),
    sitemap(),
  ],
});
