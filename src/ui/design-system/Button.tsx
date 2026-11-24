import type { ButtonHTMLAttributes } from 'react';
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { tone?: 'primary' | 'secondary' | 'quiet' };
export function Button({ tone = 'primary', className = '', type = 'button', ...props }: Props) {
  return <button {...props} type={type} className={['story-button', 'story-button--' + tone, className].filter(Boolean).join(' ')} />;
}
