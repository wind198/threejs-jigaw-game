import type { Metadata } from 'next';
import { SetupGate } from '../src/ui/components/SetupGate';
import '../src/ui/design-system/tokens.css';
import '../src/ui/style.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: { default: 'Little Jigsaw 3D — Free Puzzles for Kids', template: '%s | Little Jigsaw 3D' },
  description: 'Play free, gentle 3D jigsaw puzzles for kids aged 3–10. No account, ads or payments required.',
  applicationName: 'Little Jigsaw 3D',
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<SetupGate/></body></html>;
}
