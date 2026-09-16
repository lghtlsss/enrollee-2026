import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

export const Input = ({
  className,
  ...props
}: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) => {
  return <input className={`border-2 p-2 ${className}`} {...props} />;
};
