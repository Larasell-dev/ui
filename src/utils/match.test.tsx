import { expect, expectTypeOf, test, vi } from 'vite-plus/test';
import type { JSX } from 'react';
import { match } from './match.ts';

type State = 'idle' | 'loading' | 'error';

test('returns the result of the matching entry only', () => {
  const state = 'loading' as State;
  const idle = vi.fn(() => 'Ready');
  const error = vi.fn(() => 'Something went wrong');

  expect(match(state, { idle, loading: () => 'Please wait', error })).toBe(
    'Please wait',
  );
  expect(idle).not.toHaveBeenCalled();
  expect(error).not.toHaveBeenCalled();
});

test('infers the result type from the entries', () => {
  const state = 'idle' as State;

  expectTypeOf(
    match(state, { idle: () => 1, loading: () => 2, error: () => 3 }),
  ).toEqualTypeOf<number>();
  expectTypeOf(
    match(state, {
      idle: () => <p />,
      loading: () => <p />,
      error: () => <p />,
    }),
  ).toEqualTypeOf<JSX.Element>();
});

test('rejects missing and unknown entries', () => {
  const state = 'idle' as State;

  // @ts-expect-error `error` is missing
  match(state, { idle: () => 'a', loading: () => 'b' });

  match(state, {
    idle: () => 'a',
    loading: () => 'b',
    error: () => 'c',
    // @ts-expect-error `done` is not a State
    done: () => 'd',
  });
});
