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
      components: {
        Footer: "./src/components/Footer.astro",
      },
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        {
          label: "ISPmail for Debian 12",
          // slug: "ispmail-bookworm",
          autogenerate: { directory: "ispmail-debian-12" },
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
