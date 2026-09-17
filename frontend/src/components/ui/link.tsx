import NextLink, { type LinkProps } from 'next/link';
import type { ReactNode } from 'react';

export const Link = ({
  children,
  className = '',
  ...props
}: LinkProps & { children: ReactNode; className?: string }) => (
  <NextLink
    className={`font-medium text-navy underline-offset-4 transition duration-150 hover:underline ${className}`}
    {...props}>
    {children}
  </NextLink>
);
