import { allAudioUrls } from './audio.catalog';

const warmed = new Set<string>();

/** Warm the HTTP cache for every catalog asset (safe before user gesture). */
export function prefetchAllAudio(): void {
  if (typeof document === 'undefined') return;
  for (const href of allAudioUrls()) {
    if (warmed.has(href)) continue;
    warmed.add(href);
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'fetch';
    link.href = href;
    link.crossOrigin = 'anonymous';
    link.setAttribute('data-audio-prefetch', href);
    document.head.appendChild(link);
    void fetch(href, { cache: 'force-cache', credentials: 'same-origin', mode: 'same-origin' }).catch(() => {});
  }
}
