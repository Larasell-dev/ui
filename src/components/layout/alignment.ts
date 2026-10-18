import type { CSSProperties } from 'react';

/** Where children sit on the cross axis: horizontally in a Stack, vertically in an Inline. */
export type Align = 'start' | 'center' | 'end' | 'baseline' | 'stretch';

/** Where children sit on the main axis: vertically in a Stack, horizontally in an Inline. */
export type Justify = 'start' | 'center' | 'end' | 'between';

// Unknown values from untyped callers map to undefined and keep the
// flexbox default.
const alignValues: Record<Align, CSSProperties['alignItems']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  baseline: 'baseline',
  stretch: 'stretch',
};

const justifyValues: Record<Justify, CSSProperties['justifyContent']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
};

export function alignment(align?: Align, justify?: Justify): CSSProperties {
  return {
    alignItems: align && alignValues[align],
    justifyContent: justify && justifyValues[justify],
  };
}
