'use client';
import { useMemo, useState } from 'react';
import { Search, X, ArrowDown, BookOpen, Check } from 'lucide-react';
import { useDebounceValue } from 'usehooks-ts';
import type { Puzzle } from '../../../content/puzzles';
import { filterLibrary, visibleLibrary, LIBRARY_PAGE_SIZE, type LibraryFilter, type ArtworkFilter } from '../../../content/library';
import { useCompletedPuzzles } from '../../../state/completed-puzzles';
import { PuzzleCard } from '../../components/PuzzleCard';
import { Button } from '../../design-system/Button';

const statuses: { id: LibraryFilter; label: string }[] = [
  { id: 'all', label: 'All pictures' }, { id: 'new', label: 'Not played yet' }, { id: 'completed', label: 'Completed' },
];
export function LibraryGrid({ puzzles }: { puzzles: readonly Puzzle[] }) {
  const [completedIds] = useCompletedPuzzles();
  const completed = useMemo(() => new Set(completedIds), [completedIds]);
  const [status, setStatus] = useState<LibraryFilter>('all');
  const [complexity, setComplexity] = useState<ArtworkFilter>('all');
  const [query, setQuery] = useState('');
  const [search, setSearch] = useDebounceValue('', 180);
  const [count, setCount] = useState(LIBRARY_PAGE_SIZE);
  const matches = useMemo(() => filterLibrary(puzzles, completed, status, complexity, search), [puzzles, completed, status, complexity, search]);
  const visible = visibleLibrary(matches, count);
  const completedCount = puzzles.filter(p => completed.has(p.id)).length;
  function changeQuery(value: string) { setQuery(value); setSearch(value); setCount(LIBRARY_PAGE_SIZE); }
  function reset() { setStatus('all'); setComplexity('all'); changeQuery(''); }
  return <section className="library-results" aria-label="Puzzle pictures">
    <div className="library-toolbar">
      <div className="library-status" role="group" aria-label="Filter by completion">
        {statuses.map(item => <button key={item.id} type="button" aria-pressed={status === item.id} onClick={() => { setStatus(item.id); setCount(LIBRARY_PAGE_SIZE); }}>{item.id === 'completed' && <Check size={16} aria-hidden/>}{item.label}</button>)}
      </div>
      <div className="library-search-controls">
        <div className="library-search"><Search size={19} aria-hidden/><input type="search" aria-label="Find a picture" placeholder="Find a picture" value={query} onChange={e => changeQuery(e.target.value)}/>{query && <button type="button" aria-label="Clear search" onClick={() => changeQuery('')}><X size={18} aria-hidden/></button>}</div>
        <label className="library-complexity"><span>Picture detail</span><select value={complexity} onChange={e => { setComplexity(e.target.value as ArtworkFilter); setCount(LIBRARY_PAGE_SIZE); }}><option value="all">All details</option><option value="easy">Simple</option><option value="medium">Medium</option><option value="hard">Detailed</option></select></label>
      </div>
    </div>
    <div className="library-result-summary"><p role="status" aria-live="polite">{matches.length} {matches.length === 1 ? 'picture' : 'pictures'}</p><span><Check size={16} aria-hidden/>{completedCount} of {puzzles.length} completed</span></div>
    {visible.length ? <>
      <div className="library-art-grid">{visible.map(puzzle => <PuzzleCard key={puzzle.id} puzzle={puzzle} completed={completed.has(puzzle.id)}/>)}</div>
      <div className="library-load-more">
        <p>Showing {visible.length} of {matches.length} pictures</p>
        {visible.length < matches.length && <Button tone="secondary" onClick={() => setCount(c => c + LIBRARY_PAGE_SIZE)}>Show more pictures <ArrowDown size={18} aria-hidden/></Button>}
      </div>
    </> : <div className="library-empty"><BookOpen size={40} aria-hidden/><h2>No pictures here yet</h2><p>{status === 'completed' ? 'Finish a puzzle to add it to your collection.' : 'Try another search or change your filters.'}</p><Button tone="secondary" onClick={reset}>See all pictures</Button></div>}
  </section>;
}
