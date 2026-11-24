// Music/success stay null until listening approval. Snap uses wooden board seat samples.
export type MusicMode = 'browsing' | 'playing';
export const AUDIO_CATALOG: { music: Record<MusicMode, string | null>; snap: readonly string[]; success: string | null } = {
  music: { browsing: null, playing: null },
  snap: [
    '/assets/audio/candidates/wood-light-0.mp3',
    '/assets/audio/candidates/wood-light-1.mp3',
    '/assets/audio/candidates/wood-medium-0.mp3',
    '/assets/audio/candidates/wood-medium-1.mp3',
  ],
  success: null,
};
export const AUDIO_MIX = { music: .25, snap: .25, success: .65, duck: .2 } as const;
