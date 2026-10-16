/**
 * Look up the entry for `value` in `cases` and call it, so only the matching
 * entry is evaluated. Every member of `T` needs an entry, and keys outside `T`
 * are rejected.
 */
export function match<
  T extends PropertyKey,
  C extends Record<T, () => unknown>,
>(value: T, cases: C & Record<Exclude<keyof C, T>, never>): ReturnType<C[T]> {
  return (cases as C)[value]() as ReturnType<C[T]>;
}
