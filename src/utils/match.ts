/**
 * Look up the entry for `value` in `cases`. Every member of `T` needs an entry,
 * and keys outside `T` are rejected.
 */
export function match<T extends PropertyKey, C extends Record<T, unknown>>(
  value: T,
  cases: C & Record<Exclude<keyof C, T>, never>,
): C[T] {
  return cases[value];
}
