import type { Metadata } from 'next';
import { LibraryPage } from '../../src/ui/pages/LibraryPage';
export const metadata: Metadata = { title: 'Choose a Free Puzzle', description: 'Browse our growing collection of free animal, nature, space and vehicle jigsaw puzzles for children.' };
export default function Page() { return <LibraryPage/>; }
