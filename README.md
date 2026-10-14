# @larasell-dev/ui

Bare design system for a customisable Larasell admin. It is React and [Base UI](https://base-ui.com/), styled with the same Tailwind setup as the marketing site.

Nothing consumes this package yet. It exists so the button, tokens, and tooling are in one place.

## What's included

- `src/styles.css`, a Tailwind v4 stylesheet with the website theme (primary palette, heading font, `focus-ring`, typography)
- `Button`, copied from the website button (primary, secondary, tertiary)

## Scripts

```bash
vp install
vp check   # format, lint, and types
vp test
vp pack
npm run storybook
```

`vp` comes from [Vite+](https://viteplus.dev/) (`vite-plus` v1). Without a global install, run the same commands through `npx vp`.
