# Agent guidance

## Tests

Tests run in Vitest browser mode (`vp test`) without any CSS.

- Never load Tailwind or other styles in tests. Don't import stylesheets in test files, and don't add the Tailwind Vite plugin or CSS type declarations to make that work.
- Don't test how things look: computed styles such as outlines, colors, masks, or sizes. Those would need the styles loaded. Check them in Storybook instead.
- Do test the DOM: attributes, classes passed through props such as `DANGEROUS_className`, roles and accessible names, focus, and whether elements are present or visible (`toBeVisible`, `toBeInTheDocument`).
- Prefer a `data-testid` over walking the DOM to reach an element that has no role or label.
