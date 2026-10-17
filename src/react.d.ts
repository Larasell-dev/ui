import 'react';

// Lets `style` take CSS custom properties, e.g. `style={{ '--columns': 4 }}`.
declare module 'react' {
  interface CSSProperties {
    [property: `--${string}`]: string | number | undefined;
  }
}
