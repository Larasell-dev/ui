# Contributing

This package is a scaffold. Changes should stay small until something actually depends on it.

## Setup

```bash
vp install
```

Node 22 or newer. The package manager is npm (`package-lock.json`).

## Checks

Run these before opening a pull request:

```bash
vp check
vp test
```

`vp check` formats with Oxfmt, lints with Oxlint, and typechecks. `vp test` runs Vitest in browser mode with Playwright (Chromium, headless). Install the browser once with `npx playwright install chromium`.

CI runs the same two commands on pull requests and pushes to `main`.

## Adding a component

1. Copy the component and any Tailwind tokens it needs from the website.
2. Export it from `src/index.ts`.
3. Add a render test under `tests/`.
