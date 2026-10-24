import { cva } from 'class-variance-authority';

/**
 * The colors of each button variant, shared by Button and IconButton. Only colors live
 * here: each button sets its own size and spacing.
 */
export const buttonColors = cva('', {
  variants: {
    variant: {
      primary: [
        'border border-mauve-950 bg-mauve-950 text-mauve-50 not-data-disabled:hover:border-mauve-800 not-data-disabled:hover:bg-mauve-800 not-data-disabled:active:border-mauve-900 not-data-disabled:active:bg-mauve-900',
        'dark:border-mauve-100 dark:bg-mauve-100 dark:text-mauve-950 dark:not-data-disabled:hover:border-white dark:not-data-disabled:hover:bg-white',
      ],
      secondary: [
        'border-border border bg-white text-mauve-950 not-data-disabled:hover:bg-mauve-100',
        'dark:bg-mauve-900 dark:text-mauve-100 dark:not-data-disabled:hover:bg-mauve-800',
      ],
      tertiary: [
        'border border-transparent bg-transparent text-mauve-950 no-underline not-data-disabled:hover:bg-mauve-100 not-data-disabled:hover:no-underline focus-visible:no-underline',
        'dark:text-mauve-100 dark:not-data-disabled:hover:bg-mauve-800',
      ],
      destructive: [
        'border border-red-600 bg-red-600 text-white not-data-disabled:hover:border-red-700 not-data-disabled:hover:bg-red-700 not-data-disabled:active:border-red-800 not-data-disabled:active:bg-red-800',
        'dark:border-red-500 dark:bg-red-500 dark:not-data-disabled:hover:border-red-400 dark:not-data-disabled:hover:bg-red-400',
      ],
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});
