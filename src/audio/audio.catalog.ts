export type MusicMode = 'browsing' | 'playing';
export const AUDIO_CATALOG: { music: Record<MusicMode, string | null>; snap: readonly string[]; success: string | null } = {
  music: {
    browsing: '/assets/audio/candidates/browse.mp3',
    playing: '/assets/audio/candidates/play.mp3',
  },
  // PCM WAV: reliable Web Audio decode after gesture (MP3 often fails while AudioContext is suspended).
  snap: [
    '/assets/audio/candidates/wood-light-0.wav',
    '/assets/audio/candidates/wood-light-1.wav',
    '/assets/audio/candidates/wood-medium-0.wav',
    '/assets/audio/candidates/wood-medium-1.wav',
  ],
  success: '/assets/audio/candidates/clear-jingle.wav',
};
export const AUDIO_MIX = { music: .28, snap: .35, success: .7, duck: .2 } as const;
