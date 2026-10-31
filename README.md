# @larasell-dev/ui

Bare design system for a customisable Larasell admin. It is React and [Base UI](https://base-ui.com/), styled with Tailwind.

This package is one piece of a larger project and does **not** build its own CSS:

- **Admin panel** — the Tailwind entry point. It imports the design tokens from this package, and it alone decides what to scan and purge: its own code, this package, and any extensions. It builds the final admin dashboards.
- **Extensions** — third-party packages that import components from this package. They never import styling; the admin panel already ships it, and its Tailwind build picks up the classes an extension uses.
- **This package** — ships compiled JavaScript and a token stylesheet. It scans no files and emits no Tailwind output.

## What's included

- `dist/index.mjs`, the compiled components (`Button`, `Error`, `Field`, `Icon`, `Inline`, `Input`, `Label`, `Spacer`, `Stack`)
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

### Icons

`Icon` renders a [Remix Icon](https://remixicon.com). Import the icons from `@larasell-dev/ui/icons`; the app needs no extra packages or build setup:

```tsx
import { Icon } from '@larasell-dev/ui';
import { ErrorWarningLine } from '@larasell-dev/ui/icons';

<Icon icon={ErrorWarningLine} label="Error" />;
```

Every Remix icon is available under its PascalCase name: `error-warning-line` becomes `ErrorWarningLine`. Names can't start with a digit, so `24-hours-fill` and `4k-line` become `TwentyFourHoursFill` and `FourKLine`. Each icon is a separate export, so the app's bundler keeps only the icons it imports.

The icons are generated from the pinned `@iconify-icons/ri` package into `src/icons.ts`, so each release of the design system pins the icon set. After bumping `@iconify-icons/ri`, run `npm run generate-icons`.

### Lint rules

`@larasell-dev/ui/eslint` is an [Oxlint JS plugin](https://oxc.rs/docs/guide/usage/linter/js-plugins.html) that enforces the design system's rules on class names. Each rule lives in its own directory under `src/eslint/rules`, next to its tests. Extend its `recommended` config to enable all of them, in `oxlint.config.ts`:

```ts
import { recommended } from '@larasell-dev/ui/eslint';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [recommended],
});
```

Or in the `lint` block of a Vite+ `vite.config.ts`: `lint: { extends: [recommended] }`. A `.oxlintrc.json` can't extend a package; list the plugin and its rules (`larasell/no-margin`, `larasell/no-off-scale-font-size`, `larasell/prefer-cn`, `larasell/shadow-tokens`, `larasell/plane-tokens`) yourself there.

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
