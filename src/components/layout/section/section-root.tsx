import { createContext, type ReactNode, useId } from 'react';

/** The id of the section's title, so the section is labelled by its header. */
export const SectionTitleId = createContext<string | undefined>(undefined);

/** A part of a page: a header, then its content, either as is or in a `<Section.Card>`. */
export function SectionRoot({ children }: { children: ReactNode }) {
  const titleId = useId();

  return (
    <SectionTitleId value={titleId}>
      <section aria-labelledby={titleId} className="flex flex-col gap-5">
        {children}
      </section>
    </SectionTitleId>
  );
}
