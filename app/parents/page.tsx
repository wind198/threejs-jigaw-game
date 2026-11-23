import type { Metadata } from 'next';
import { ParentsEntry } from '../../src/ui/components/ParentsEntry';
export const metadata: Metadata = { title: 'For Parents', description: 'Game preferences, privacy information and optional adult support for Little Jigsaw 3D.', robots: { index: false, follow: false } };
export default function Page() { return <ParentsEntry/>; }
