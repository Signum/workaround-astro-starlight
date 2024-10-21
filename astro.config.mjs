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
          items: [
            // Each item here is one entry in the navigation menu.
            {
              label: "Start Here",
              slug: "ispmail-bookworm",
            },
            {
              label: "Whats' new",
              slug: "ispmail-bookworm/whats-new",
            },
            {
              label: "Migrating your old server",
              slug: "ispmail-bookworm/migrating-from-a-bullseye-to-a-bookworm-server",
            },
            {
              label: "The big picture",
              slug: "ispmail-bookworm/big-picture",
            },
            {
              label: "Types of email domains",
              slug: "ispmail-bookworm/types-of-email-domains",
            },
          ],
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
