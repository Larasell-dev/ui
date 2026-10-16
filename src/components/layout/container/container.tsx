import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, CSSProperties } from 'react';
import { cn } from 'cn';

const containerVariants = cva('mx-auto w-full px-4 sm:px-6 lg:px-8', {
  variants: {
    size: {
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-7xl',
      full: 'max-w-none',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});

type ContainerProps = Omit<ComponentProps<'div'>, 'className' | 'style'> &
  VariantProps<typeof containerVariants> & {
    DANGEROUS_className?: string;
    DANGEROUS_style?: CSSProperties;
  };

export function Container({
  size,
  DANGEROUS_className,
  DANGEROUS_style,
  ...props
}: ContainerProps) {
  return (
    <div
      {...props}
      className={cn(containerVariants({ size }), DANGEROUS_className)}
      style={DANGEROUS_style}
    />
  );
}
