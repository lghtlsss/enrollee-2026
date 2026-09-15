import NextLink, { LinkProps } from 'next/link';
import { ReactNode } from 'react';
export const Link = ({ children, ...props }: LinkProps & { children: ReactNode }) => {
  return (
    <NextLink className="transition duration-150 hover:text-blue-600" {...props}>
      {children}
    </NextLink>
  );
};
