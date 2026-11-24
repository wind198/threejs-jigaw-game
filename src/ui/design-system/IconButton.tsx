import type { ButtonHTMLAttributes } from 'react';
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { 'aria-label': string };
export function IconButton({ className = '', type = 'button', ...props }: Props) {
  return <button {...props} type={type} className={['icon-button', className].filter(Boolean).join(' ')} />;
}
