import type { CSSProperties, HTMLAttributes } from 'react';
const illustrations = {
  'fox': '/assets/illustrations/fluent/fox.svg',
  'rabbit': '/assets/illustrations/fluent/rabbit.svg',
  'teddy-bear': '/assets/illustrations/fluent/teddy-bear.svg',
  'rocket': '/assets/illustrations/fluent/rocket.svg',
  'star': '/assets/illustrations/fluent/star.svg',
  'glowing-star': '/assets/illustrations/fluent/glowing-star.svg',
  'sunflower': '/assets/illustrations/fluent/sunflower.svg',
} as const;
export type IllustrationName = keyof typeof illustrations;
export interface IllustrationIconProps extends Omit<HTMLAttributes<HTMLImageElement>, 'children'> {
  name: IllustrationName;
  size?: number | string;
  decorative?: boolean;
  alt?: string;
}
export function IllustrationIcon({ name, size = 32, decorative = false, alt, className = '', style, ...props }: IllustrationIconProps) {
  return <img {...props} src={illustrations[name]} className={['illustration-icon', className].filter(Boolean).join(' ')}
    width={size} height={size} style={{ ...style, width: size, height: size } as CSSProperties}
    alt={decorative ? '' : (alt ?? name.replaceAll('-', ' '))}
    aria-hidden={decorative ? true : undefined} draggable={false} decoding="async" />;
}
