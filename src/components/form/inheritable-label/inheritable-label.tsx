import { Field } from '@base-ui/react/field';
import { cn } from 'cn';
import type { ReactNode } from 'react';
import { LinkM, LinkUnlinkM } from '../../../icons.ts';
import { Icon } from '../../icon/icon.tsx';

type InheritableLabelProps = {
  children: ReactNode;
  /** Whether the field takes its value from its parent, e.g. a variant from its product. */
  inherited: boolean;
  onInheritedChange: (inherited: boolean) => void;
  /** Accessible names of the chain button in both states, so apps can translate them. */
  linkLabel: string;
  unlinkLabel: string;
  DANGEROUS_className?: string;
};

/**
 * A field's label with a chain button: linked, the field shows and keeps its parent's value;
 * unlinked, it has its own, which may be empty.
 */
export function InheritableLabel({
  children,
  inherited,
  onInheritedChange,
  linkLabel,
  unlinkLabel,
  DANGEROUS_className,
}: InheritableLabelProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-1.5', DANGEROUS_className)}
    >
      <button
        type="button"
        aria-pressed={inherited}
        aria-label={inherited ? unlinkLabel : linkLabel}
        title={inherited ? unlinkLabel : linkLabel}
        onClick={() => onInheritedChange(!inherited)}
        className={cn(
          'inline-flex size-6 cursor-pointer items-center justify-center',
          'focus-visible:focus-ring hover:bg-state-selected-neutral-default',
          inherited ? 'text-intent-accent' : 'text-base-tertiary',
        )}
      >
        <Icon icon={inherited ? LinkM : LinkUnlinkM} />
      </button>
      <Field.Label className="type-label-md text-base-primary select-none">
        {children}
      </Field.Label>
    </span>
  );
}
