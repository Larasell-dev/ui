// The default Tailwind spacing scale: https://tailwindcss.com/docs/padding
export const spacingScale = [
  0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24,
  28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96,
] as const;

export type Spacing = (typeof spacingScale)[number];

// Same value Tailwind generates for `gap-4`, `h-4`, etc., so it follows the
// theme's `--spacing` (Tailwind's default is 0.25rem).
export function spacing(value: Spacing): string {
  return `calc(var(--spacing, 0.25rem) * ${value})`;
}
