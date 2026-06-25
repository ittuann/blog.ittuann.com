// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import { unified, rehypeHeadingIds } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.ittuann.com",
  output: "static",
  integrations: [mdx(), sitemap(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeHeadingIds, rehypeKatex],
    }),
    shikiConfig: {
      themes: {
        light: "ayu-light",
        dark: "github-dark",
      },
    },
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Noto Sans Mono",
      cssVariable: "--font-noto-mono",
      fallbacks: ["monospace"],
      weights: [400, 700],
      styles: ["normal"],
    },
    {
      provider: fontProviders.google(),
      name: "Noto Sans SC",
      cssVariable: "--font-noto-sc",
      fallbacks: ["sans-serif"],
      weights: [400, 700],
      styles: ["normal"],
    },
  ],
});
