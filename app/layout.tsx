import type { Metadata } from 'next';
import { GameAudioProvider } from '../src/audio/audio.provider';
import '../src/ui/design-system/tokens.css';
import '../src/ui/style.css';
import '../src/ui/styles/storybook.css';
import '../src/ui/styles/library.css';
import '../src/ui/styles/playroom.css';
import '../src/ui/styles/dialogs.css';
import '../src/ui/styles/feedback.css';

import { SITE_NAME, SITE_DESCRIPTION, siteUrl } from '../src/seo/site';
import '../src/ui/styles/puzzle-landing.css';
export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: siteUrl } : {}),
  title: { default: 'Free Online Jigsaw Puzzles for Kids | Little Jigsaw 3D', template: '%s | Little Jigsaw 3D' },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  robots: { index: Boolean(siteUrl), follow: Boolean(siteUrl) },
  icons: { icon: [{url:'/favicon.png',type:'image/png',sizes:'96x96'}] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><GameAudioProvider>{children}</GameAudioProvider></body></html>;
}
