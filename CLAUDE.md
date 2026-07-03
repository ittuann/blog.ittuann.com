# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Introduction

This is a modern personal static blog website based on Astro 6 framework.

This project was created by @ittuann and released as open source under the AGPL-3.0 license in [the GitHub repository](https://github.com/ittuann/blog.ittuann.com).

## Tech Stack

- Framework: Astro 6, with React 19 integration, TypeScript.
- Styling: Tailwind CSS 4
- Components: shadcn/ui, React Bits, Magic UI
- Animation: Motion
- State Management: Zustand
- Icons: Tabler
- Package Manager: pnpm 10

## UI/UX Design

The UI/UX design philosophy of this website emphasizes creativity and uniqueness.

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
- `src/components/home/` — homepage sections (e.g., Hero, Featured Posts, Recent Posts).
- `src/pages/` — file-based routing.
- `src/pages/posts/[...slug].astro` — handles post routes.
- `src/content/posts/` — Markdown/MDX blog posts.
- `src/assets/` — images used in Markdown/MDX blog posts.

## Styling

Uses **Tailwind CSS 4**.

Only use `shadcn/ui` CSS color variables in `src/styles/global.css`. Do not add custom color palettes.

The `@theme` directive in `global.css`. No `tailwind.config.*` file.

Dark mode is toggled via the `.dark`, stored in `localStorage`.

## Component Conventions

- shadcn components are configured via `components.json`. With additional registries magicui and react-bits.
- Path alias `@/*` resolves to `src/*`.

- `.astro` components for layout and static rendering.
- `.tsx` React components for interactivity (e.g., `ThemeToggle.tsx`).

- Animations use the `motion/react` library.
- Client-side state uses `zustand` (`create` from `zustand`). Co-locate the store in the component file when the state is local to one component; create a dedicated `src/store/` file only when state is shared across multiple components.

- Need to write code comments.

## Markdown Posts frontmatter

Defined in `src/content.config.ts`. Posts use a Zod schema with these frontmatter fields:

| Field         | Required | Notes      |
| ------------- | -------- | ---------- |
| `title`       | yes      |            |
| `description` | yes      |            |
| `pubDate`     | yes      |            |
| `updatedDate` | no       |            |
| `tags`        | yes      | `string[]` |
| `category`    | yes      | `string[]` |
| `pinned`      | no       | number     |
| `heroImage`   | no       |            |
