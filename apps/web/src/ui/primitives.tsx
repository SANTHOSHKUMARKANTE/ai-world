import Link from 'next/link';
import type { ButtonHTMLAttributes, ComponentProps, HTMLAttributes, ReactNode } from 'react';

function classes(...values: Array<string | undefined | false>): string {
  return values.filter(Boolean).join(' ');
}

export function PageContainer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={classes('aw-container', className)} {...props} />;
}

export function Surface({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={classes('aw-surface', className)} {...props} />;
}

type LinkButtonProps = ComponentProps<typeof Link> & {
  readonly variant?: 'primary' | 'secondary';
  readonly compact?: boolean;
};

export function LinkButton({
  className,
  variant = 'primary',
  compact = false,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={classes(
        'aw-button',
        `aw-button--${variant}`,
        compact && 'aw-button--compact',
        className,
      )}
      {...props}
    />
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly variant?: 'primary' | 'secondary';
  readonly compact?: boolean;
  readonly children: ReactNode;
};

export function Button({
  className,
  variant = 'primary',
  compact = false,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classes(
        'aw-button',
        `aw-button--${variant}`,
        compact && 'aw-button--compact',
        className,
      )}
      {...props}
    />
  );
}
