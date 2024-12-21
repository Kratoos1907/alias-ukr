import { cn } from '@/lib/cn';
import { DetailedHTMLProps, ButtonHTMLAttributes } from 'react';

export default function Button({
  className,
  ...props
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button
      {...props}
      className={cn(
        'p-2 bg-slate-300 rounded-md text-black font-bold',
        className
      )}
    />
  );
}
