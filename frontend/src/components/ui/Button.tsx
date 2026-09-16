import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';

export const Button = ({
  children,
  className,
  ...props
}: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  children: ReactNode;
}) => {
  return (
    <button
      className={`cursor-pointer rounded-2xl border-2 p-2 transition duration-150 hover:bg-gray-800 ${className}`}
      {...props}>
      {children}
    </button>
  );
};
