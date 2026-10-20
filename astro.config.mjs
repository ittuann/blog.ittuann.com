// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import { unified, rehypeHeadingIds } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import sarasaMonoVariants from "./src/assets/fonts/sarasa-mono-sc/variants.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.ittuann.com",
  output: "static",
  integrations: [
    mdx(),
    sitemap(),
    react(),
    partytown({ config: { forward: ["dataLayer.push"] } }),
  ],
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
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
  fonts: [
    {
      // Self-hosted local unicode-range slices, see scripts/build-sarasa-mono-sc.py
      provider: fontProviders.local(),
      name: "Sarasa Mono SC",
      cssVariable: "--font-sarasa-mono",
      fallbacks: ["monospace"],
      options: { variants: sarasaMonoVariants },
    },
  ],
});
