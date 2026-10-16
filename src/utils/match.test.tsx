import { expect, expectTypeOf, test } from 'vite-plus/test';
import type { JSX } from 'react';
import { match } from './match.ts';

type State = 'idle' | 'loading' | 'error';

const cases = {
  idle: 'Ready',
  loading: 'Please wait',
  error: 'Something went wrong',
};

test('returns the entry for the value', () => {
  const state = 'loading' as State;

  expect(match(state, cases)).toBe('Please wait');
});

test('infers the result type from the entries', () => {
  const state = 'idle' as State;

  expectTypeOf(
    match(state, { idle: 1, loading: 2, error: 3 }),
  ).toEqualTypeOf<number>();
  expectTypeOf(
    match(state, { idle: <p />, loading: <p />, error: <p /> }),
  ).toEqualTypeOf<JSX.Element>();
});

test('rejects missing and unknown entries', () => {
  const state = 'idle' as State;

  // @ts-expect-error `error` is missing
  match(state, { idle: 'a', loading: 'b' });

  // @ts-expect-error `done` is not a State
  match(state, { idle: 'a', loading: 'b', error: 'c', done: 'd' });
});
