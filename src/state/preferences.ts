import { useLocalStorage } from 'usehooks-ts';
export type Difficulty = 'little' | 'growing' | 'explorer';
export interface Preferences {
  schemaVersion: 1;
  setupCompleted: boolean;
  difficulty: Difficulty;
  hintsEnabled: boolean;
  soundEnabled: boolean;
  animationsEnabled: boolean;
}
export const DEFAULT_PREFERENCES: Preferences = {
  schemaVersion: 1, setupCompleted: false, difficulty: 'little', hintsEnabled: true, soundEnabled: true, animationsEnabled: true,
};
export const PIECES_PER_SIDE: Record<Difficulty, number> = { little: 2, growing: 3, explorer: 5 };
export const STORAGE_KEY = 'little-jigsaw:preferences:v1';
export function normalizePreferences(value: unknown): Preferences {
  if (!value || typeof value !== 'object') return DEFAULT_PREFERENCES;
  const v = value as Partial<Preferences>;
  if (v.schemaVersion !== 1) return DEFAULT_PREFERENCES;
  return {
    schemaVersion: 1,
    setupCompleted: v.setupCompleted === true,
    difficulty: v.difficulty === 'growing' || v.difficulty === 'explorer' ? v.difficulty : 'little',
    hintsEnabled: typeof v.hintsEnabled === 'boolean' ? v.hintsEnabled : true,
    soundEnabled: typeof v.soundEnabled === 'boolean' ? v.soundEnabled : true,
    animationsEnabled: typeof v.animationsEnabled === 'boolean' ? v.animationsEnabled : true,
  };
}
export function useGamePreferences() {
  const [stored, setStored, remove] = useLocalStorage<Preferences>(STORAGE_KEY, DEFAULT_PREFERENCES, {
    deserializer: raw => { try { return normalizePreferences(JSON.parse(raw)); } catch { return DEFAULT_PREFERENCES; } },
  });
  return { preferences: normalizePreferences(stored), setPreferences: setStored, resetPreferences: remove };
}
