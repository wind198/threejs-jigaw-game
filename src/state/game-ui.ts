import { create } from 'zustand';
import type { PuzzleCategory } from '../content/puzzles';
interface GameUIState {
  category: 'All' | PuzzleCategory;
  paused: boolean;
  setCategory(category: GameUIState['category']): void;
  setPaused(paused: boolean): void;
}
export const useGameUI = create<GameUIState>(set => ({
  category: 'All', paused: false,
  setCategory: category => set({ category }),
  setPaused: paused => set({ paused }),
}));
