import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pageMetadata } from '../../../src/seo/metadata';
import { collections, requirePuzzle } from '../../../src/content/collections';
import { LibraryPage } from '../../../src/ui/pages/LibraryPage';
export const dynamicParams = false;
export function generateStaticParams() { return collections.map(c => ({ collection: c.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }): Promise<Metadata> {
  const { collection } = await params;
  const match = collections.find(c => c.slug === collection);
  return match ? pageMetadata({title:match.category+' Jigsaw Puzzles for Kids',description:match.description+' Play free online jigsaw puzzles with 4, 9 or 25 pieces.',path:'/puzzles/'+match.slug+'/',image:requirePuzzle(match.coverId).image}) : { title: 'Collection not found', robots: { index: false } };
}
export default async function Page({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const match = collections.find(c => c.slug === collection);
  if (!match) notFound();
  return <LibraryPage category={match.category}/>;
}
