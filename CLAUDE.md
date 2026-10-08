# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Introduction

This is a modern personal static blog website based on Astro 7 framework.

This project was created by [@ittuann](https://github.com/ittuann) and released as open source under the AGPL-3.0 license in [the GitHub repository](https://github.com/ittuann/blog.ittuann.com).

## Tech Stack

- Framework: Astro 7, with React integration, TypeScript.
- Styling: Tailwind CSS 4
- Components: shadcn/ui, Magic UI, React Bits
- Animation: Motion
- State Management: Zustand
- Icons: Tabler
- Package Manager: pnpm 10

## UI/UX Design

The UI/UX design philosophy of this website emphasizes creativity and uniqueness.

The index landing page features motion-driven animations.

Movement is smooth. Every interaction feels tactile and responsive, with micro-animations that provide satisfying feedback.

Always aim to:
- Ensure layouts are responsive and usable across devices.
- Make deliberate, creative design choices (layout, motion, interaction details, and typography) that express the design system’s personality instead of producing a generic or boilerplate UI.

## Commands

```bash
pnpm dev          # Start local Astro dev server
pnpm build        # Build production site to ./dist/
pnpm check        # Run Astro check types
pnpm preview      # Preview the build locally
pnpm format       # Run Prettier formatting
```

## Architecture

- `src/components/ui/` — shadcn/ui components.
- `src/components/home/` — homepage sections (e.g., Hero, Featured Posts, Recent Posts).
- `src/pages/` — file-based routing.
- `src/pages/posts/[...slug].astro` — blog post route handler.
- `src/content/posts/` — Markdown/MDX blog posts.
- `src/assets/` — images used in Markdown/MDX blog posts.

## UI Styling

Use **Tailwind CSS 4**.

Only use `shadcn/ui` CSS variables in `src/styles/global.css`. Match the nearest ***shadcn primitive**, do not add external or custom color palettes.
Always use predefined color variables (e.g., primary, primary-foreground, etc.) and utility classes (e.g., radius-xl, text-lg, shadow-md, etc.), to maintain UI consistency.
Never hardcoded hex value colors or absolute pixel values.

Most color variables come in pairs: a surface and a foreground that meets contrast on it, and always use them together.

| Role                                     | Use it for                                                  | Don't use it for                                    |
| ---------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------- |
| `background` / `foreground`              | App canvas, default text                                    | Cards, popovers, sidebar (have their own)           |
| `card` / `card-foreground`               | Panels lifted off the canvas                                | The canvas itself                                   |
| `popover` / `popover-foreground`         | Floating menus, dropdowns, hovercards                       | Inline UI                                           |
| `primary` / `primary-foreground`         | The single affirmative action in a flow (Save, Confirm)     | Decorative accents; hover states; secondary actions |
| `secondary` / `secondary-foreground`     | Lower-emphasis actions next to a primary                    | The affirmative action                              |
| `muted` / `muted-foreground`             | De-emphasized text, captions, placeholders, disabled chrome | Body copy; primary actions                          |
| `accent` / `accent-foreground`           | Hover/active backgrounds for ghost buttons and list rows    | Solid filled buttons (use `secondary` instead)      |
| `destructive` / `destructive-foreground` | Delete, discard, irreversible-action buttons; error states  | Cancel buttons (Cancel is not destructive)          |
| `border`                                 | All hairlines: dividers, input outlines, card edges         | Heavy emphasis; that's `ring`                       |
| `input`                                  | Form field background only                                  | Anywhere outside form fields                        |
| `ring`                                   | Focus-visible outlines, active selection halos              | Persistent decoration                               |

The `@theme` directive in `global.css`. No `tailwind.config.*` file.

Dark mode is toggled via the `.dark`, stored in `localStorage`.

## Component Conventions

- React components use `.tsx`. Astro components use `.astro`. React components are hydrated via `client:idle` or `client:visible`.

- `.astro` Astro components for layout and static rendering.
- `.tsx` React components for interactivity.

- shadcn components are configured via `components.json`. With additional registries Magic UI and React Bits.
- Path alias `@/components` resolves to `src/components`.

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
