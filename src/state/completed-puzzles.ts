'use client';
import { useLocalStorage } from 'usehooks-ts';
export const COMPLETED_PUZZLES_KEY = 'little-jigsaw:completed:v1';
export function normalizeCompleted(value: unknown): string[] {
  return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === 'string' && id.length > 0))] : [];
}
export function useCompletedPuzzles() {
  return useLocalStorage<string[]>(COMPLETED_PUZZLES_KEY, [], {
    initializeWithValue: false,
    deserializer: raw => { try { return normalizeCompleted(JSON.parse(raw)); } catch { return []; } },
  });
}
