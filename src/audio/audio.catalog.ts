// Only existing assets are enabled. Add reviewed, locally bundled tracks here.
export type MusicMode = 'browsing' | 'playing';
export const AUDIO_CATALOG: { music: Record<MusicMode, string | null>; snap: readonly string[]; success: string | null } = {
  music: { browsing: null, playing: null },
  snap: ['/assets/audio/piece-snap.wav'],
  success: null,
};
export const AUDIO_MIX = { music: .25, snap: .25, success: .65, duck: .2 } as const;
