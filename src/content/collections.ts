import { getPuzzle, puzzles, type PuzzleCategory } from './puzzles';

export const collections = [
  { slug: 'animals', category: 'Animals', title: 'Animal friends', description: 'Meet furry, feathered and finned friends.', coverId: 'animals-forest-friends' },
  { slug: 'nature', category: 'Nature', title: 'Little wonders', description: 'Explore gardens, forests and sunny skies.', coverId: 'nature-happy-garden' },
  { slug: 'space', category: 'Space', title: 'Beyond the stars', description: 'Blast off to planets and distant worlds.', coverId: 'space-moon-adventure' },
  { slug: 'vehicles', category: 'Vehicles', title: 'On the move', description: 'Ride trains, sail boats and take flight.', coverId: 'vehicles-little-train' },
] as const satisfies readonly { slug: string; category: PuzzleCategory; title: string; description: string; coverId: string }[];

export function requirePuzzle(id: string) {
  const puzzle = getPuzzle(id);
  if (!puzzle) throw new Error('Missing curated puzzle: ' + id);
  return puzzle;
}

export const heroPuzzle = requirePuzzle('animals-forest-friends');
export const featuredPuzzles = ['animals-bunny-carrots', 'nature-sunny-sunflower-field', 'space-friendly-rocket-launch', 'vehicles-little-train'].map(requirePuzzle);
export function collectionPuzzles(category: PuzzleCategory) { return puzzles.filter(p => p.category === category); }
