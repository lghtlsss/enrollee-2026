import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';

export const Button = ({
  children,
  ...props
}: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  children: ReactNode;
}) => {
  return <button {...props}>{children}</button>;
};
