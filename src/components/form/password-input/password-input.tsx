import EyeLine from '@iconify-icons/ri/eye-line';
import EyeOffLine from '@iconify-icons/ri/eye-off-line';
import { useState, type ComponentProps } from 'react';
import { cn } from 'cn';
import { Icon } from '../../icon/icon.tsx';
import { Input } from '../input/input.tsx';

type PasswordInputProps = Omit<ComponentProps<typeof Input>, 'type' | 'suffix'>;

/**
 * An `Input` with `type="password"` and a button that shows or hides the
 * value. The type can't be overridden; use `Input` for other types.
 */
export function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      {...props}
      // After the spread, so a `type` slipped past the types still loses.
      type={visible ? 'text' : 'password'}
      suffix={
        <button
          type="button"
          // A fixed name with a pressed state, so screen readers announce the
          // change instead of a different control.
          aria-label="Show password"
          aria-pressed={visible}
          disabled={props.disabled}
          onClick={() => setVisible((value) => !value)}
          className={cn(
            // Pulled over the box's right padding, so the hover fill reaches its border.
            '-mr-3.5 inline-flex w-11 cursor-pointer items-center justify-center self-stretch text-mauve-950 select-none',
            'focus-visible:focus-ring not-disabled:hover:bg-mauve-100 focus-visible:outline-offset-0',
            'disabled:cursor-not-allowed',
            'dark:text-mauve-100 dark:not-disabled:hover:bg-mauve-800',
          )}
        >
          <Icon icon={visible ? EyeOffLine : EyeLine} />
        </button>
      }
    />
  );
}
