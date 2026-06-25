# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Introduction

This is a modern personal static blog website based on Astro 6 framework.

## Tech Stack

- Framework: Astro 6, with React 19 integration, TypeScript.
- Styling: Tailwind CSS 4
- Components: shadcn/ui, React Bits, Magic UI
- Animation: Motion
- State Management: Zustand
- Icons: Tabler
- Package Manager: pnpm 10

## UI/UX Design

The website’s UI/UX design philosophy emphasises creativity and uniqueness.

The index landing page features motion-driven animations.

## Commands

```bash
pnpm build        # Build production site to ./dist/
pnpm check        # Astro check types
pnpm dev          # Start local Astro dev server
pnpm preview      # Preview build locally
pnpm format       # Run Prettier formatting
```

## Architecture

- `src/components/ui/` — shadcn/ui components.
- `src/components/home/` — homepage sections (Hero, Featured Posts, Recent Posts).
- `src/pages/` — file-based routing. `posts/[...slug].astro` handles dynamic post routes.
- `src/content/posts/` — Markdown/MDX blog posts
- `src/assets/` — images used in the blog posts.

## Styling

Uses **Tailwind CSS 4**, with the `@theme` directive in `src/styles/global.css` — no `tailwind.config.*` file.

Only use `shadcn/ui` CSS color variables in `global.css`. Do not add custom color palettes.

Design tokens are CSS variables in `oklch` color space.

Path alias `@/*` resolves to `src/*`. shadcn components are configured via `components.json` (style: radix-vega, icons: Tabler).

## Component Conventions

- `.astro` components for layout and static rendering.
- `.tsx` React components for interactivity (e.g., `ThemeToggle.tsx`).
- Dark mode is toggled via the `.dark` class on `<html>` (stored in `localStorage`).
- Animations use the `motion` library, and `tw-animate-css`.
- Client-side state uses **Zustand** (`create` from `zustand`). Co-locate the store in the component file when the state is local to one component; create a dedicated `src/store/` file only when state is shared across multiple components.

## Content Collections

Defined in `src/content.config.ts`. Posts use a Zod schema with these frontmatter fields:

| Field         | Required | Notes                                                          |
| ------------- | -------- | -------------------------------------------------------------- |
| `title`       | yes      |                                                                |
| `description` | yes      |                                                                |
| `pubDate`     | yes      |                                                                |
| `updatedDate` | no       |                                                                |
| `tags`        | no       | `string[]`, defaults to `[]`                                   |
| `category`    | no       | `string[]`, defaults to `[]`                                   |
| `pinned`      | no       | number — higher = higher priority on homepage featured section |
| `heroImage`   | no       |                                                                |
