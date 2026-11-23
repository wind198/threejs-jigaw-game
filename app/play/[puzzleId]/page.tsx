import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPuzzle, puzzles } from '../../../src/content/puzzles';
import { GamePage } from '../../../src/ui/pages/GamePage';

export const dynamicParams = false;
export function generateStaticParams() { return puzzles.map(puzzle => ({ puzzleId: puzzle.id })); }
export async function generateMetadata({ params }: { params: Promise<{ puzzleId: string }> }): Promise<Metadata> {
  const { puzzleId } = await params;
  const puzzle = getPuzzle(puzzleId);
  if (!puzzle) return { title: 'Puzzle Not Found', robots: { index: false } };
  return {
    title: puzzle.title + ' — Free Jigsaw Puzzle',
    description: puzzle.description + '. Play this free 3D puzzle in your browser with no ads or account.',
    openGraph: { title: puzzle.title + ' | Little Jigsaw 3D', description: puzzle.description, images: [puzzle.image] },
  };
}
export default async function Page({ params }: { params: Promise<{ puzzleId: string }> }) {
  const { puzzleId } = await params;
  const puzzle = getPuzzle(puzzleId);
  if (!puzzle) notFound();
  return <GamePage puzzle={puzzle}/>;
}
