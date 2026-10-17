// Same pattern as Base UI: a namespace re-export gives `<Table.Root>` dot
// notation while staying static, so bundlers drop the parts nobody uses.
export * as Table from './table.parts.ts';
