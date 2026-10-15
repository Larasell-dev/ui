# @larasell-dev/ui

Bare design system for a customisable Larasell admin. It is React and [Base UI](https://base-ui.com/), styled with Tailwind.

This package is one piece of a larger project and does **not** build its own CSS:

- **Admin panel** — the Tailwind entry point. It imports the design tokens from this package, and it alone decides what to scan and purge: its own code, this package, and any extensions. It builds the final admin dashboards.
- **Extensions** — third-party packages that import components from this package. They never import styling; the admin panel already ships it, and its Tailwind build picks up the classes an extension uses.
- **This package** — ships compiled JavaScript and a token stylesheet. It scans no files and emits no Tailwind output.

## What's included

- `dist/index.mjs`, the compiled components (`Button`, `Error`, `Field`, `Inline`, `Input`, `Label`, `Spacer`, `Stack`)
- `src/styles.css`, the stylesheet consumers import; it pulls in the token file and points Tailwind's scanner at `dist`
- `src/theme.css`, the design tokens: the `dark` variant, the website theme (fonts, primary palette), and the `focus-ring` utility

## Consuming

The admin panel's Tailwind stylesheet imports Tailwind and the design system's stylesheet — nothing else:

```css
@import 'tailwindcss';
@import '@larasell-dev/ui/styles.css';
```

The design system owns all styling. Its stylesheet brings in the design tokens (`src/theme.css`) and points Tailwind's scanner at the package's compiled output (`@source '../dist'`, resolved inside the installed package) so every class the components use is generated. The admin panel configures no styles and adds no `@source` of its own for this package.

Extensions only import the components:

```tsx
import { Button } from '@larasell-dev/ui';
```

No CSS import, no Tailwind setup — the classes they end up with are compiled by whichever admin panel runs them. An extension that ships its own Tailwind classes follows the same pattern as this package: a small stylesheet with an `@source` pointing at its compiled output, which the admin panel imports alongside this one.

## Scripts

```bash
vp install
vp check   # format, lint, and types
vp test
vp pack
npm run storybook
```

`vp` comes from [Vite+](https://viteplus.dev/) (`vite-plus` v1). Without a global install, run the same commands through `npx vp`.

Storybook renders the components standalone, so it keeps its own full Tailwind entry (`.storybook/tailwind.css`) that imports `src/theme.css` and scans `src` — mirroring what the admin panel does in production.
