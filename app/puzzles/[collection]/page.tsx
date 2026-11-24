import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { collections } from '../../../src/content/collections';
import { LibraryPage } from '../../../src/ui/pages/LibraryPage';
export const dynamicParams = false;
export function generateStaticParams() { return collections.map(c => ({ collection: c.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }): Promise<Metadata> {
  const { collection } = await params;
  const match = collections.find(c => c.slug === collection);
  return match ? { title: match.category + ' Jigsaw Puzzles', description: match.description + ' Free puzzles for children.' } : { title: 'Collection not found', robots: { index: false } };
}
export default async function Page({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const match = collections.find(c => c.slug === collection);
  if (!match) notFound();
  return <LibraryPage category={match.category}/>;
}
