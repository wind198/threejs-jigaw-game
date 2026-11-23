import { create } from 'zustand';
interface GameUIState {
  category: 'All' | 'Animals' | 'Nature' | 'Space';
  paused: boolean;
  setCategory(category: GameUIState['category']): void;
  setPaused(paused: boolean): void;
}
export const useGameUI = create<GameUIState>(set => ({
  category: 'All', paused: false,
  setCategory: category => set({ category }),
  setPaused: paused => set({ paused }),
}));
