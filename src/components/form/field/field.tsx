import { Field as BaseField } from '@base-ui/react/field';
import type { ComponentProps, ReactNode } from 'react';
import { Error } from '../error/error.tsx';
import { Input } from '../input/input.tsx';
import { Label, type Required } from '../label/label.tsx';
import { cn } from 'cn';

type InputEvents = Pick<
  ComponentProps<typeof Input>,
  'onChange' | 'onInput' | 'onFocus' | 'onBlur' | 'onKeyDown'
>;

type FieldProps = {
  label: ReactNode;
  name: string;
  error?: string;
  required?: Required;
  description?: ReactNode;
  children?: ReactNode;
  DANGEROUS_className?: string;
} & InputEvents;

export function Field({
  label,
  name,
  error,
  required,
  description,
  children,
  DANGEROUS_className,
  onChange,
  onInput,
  onFocus,
  onBlur,
  onKeyDown,
}: FieldProps) {
  return (
    <BaseField.Root
      name={name}
      invalid={!!error}
      className={cn(
        'flex w-full flex-col items-start gap-1.5',
        DANGEROUS_className,
      )}
    >
      <Label required={required}>{label}</Label>
      {children !== undefined ? (
        children
      ) : (
        <Input
          required={required === true}
          onChange={onChange}
          onInput={onInput}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
      )}
      {description && (
        <BaseField.Description className="text-sm text-mauve-600 dark:text-mauve-400">
          {description}
        </BaseField.Description>
      )}
      {error && <Error match>{error}</Error>}
    </BaseField.Root>
  );
}
