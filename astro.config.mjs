// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://workaround.org',
	integrations: [
		starlight({
			title: 'ISPmail Guide',
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Start Here', slug: 'ispmail-bookworm' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
			logo: {
				light: './src/assets/logo.svg',
    		dark: './src/assets/logo-dark.svg',
    		replacesTitle: true,
			},
		}),
		sitemap()
	],
});
