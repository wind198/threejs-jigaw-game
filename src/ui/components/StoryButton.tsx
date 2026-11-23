import type { ButtonHTMLAttributes, ReactNode } from 'react';
type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: 'primary' | 'secondary' | 'quiet'; children: ReactNode;
};
export function StoryButton({ tone = 'primary', className = '', children, ...props }: Props) {
  return <button {...props} className={['story-button', 'story-button--' + tone, className].filter(Boolean).join(' ')}>{children}</button>;
}
