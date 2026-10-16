# Contributing

This package is a scaffold. Changes should stay small until something actually depends on it.

## Setup

```bash
vp install
```

Node 24 or newer. The package manager is npm (`package-lock.json`).

## Checks

Run these before opening a pull request:

```bash
vp check
vp test
```

`vp check` formats with Oxfmt, lints with Oxlint, and typechecks. `vp test` runs Vitest in browser mode with Playwright (Chromium, headless). Install the browser once with `npx playwright install chromium`.

CI runs the same two commands on pull requests and pushes to `main`.

## Releases

Releases are automated with [release-please](https://github.com/googleapis/release-please). Every push to `main` runs the `release-please` workflow, which:

1. Maintains a release pull request that bumps `package.json` and `package-lock.json`, updates `CHANGELOG.md`, and appends `chore: release ...` commits from merged conventional commits.
2. When that release PR is merged, publishes a GitHub release tagged with the new version and publishes the package to npm (`@larasell-dev/ui`).

To cut a release, merge the open release PR. To trigger one, merge conventional commits (`fix:`, `feat:`, `feat!:` / `BREAKING CHANGE:`) to `main`.

## Adding a component

1. Copy the component and any Tailwind tokens it needs from the website.
2. Export it from `src/index.ts`.
3. Add a render test under `tests/`.
