import * as THREE from 'three';

export const ARTWORK_TIMEOUT_MS = 15_000;

/** Await the full image decode; never substitute sample art for a requested asset. */
export function loadPuzzleImage(path: string, signal?: AbortSignal, timeoutMs = ARTWORK_TIMEOUT_MS): Promise<HTMLImageElement> {
  if (typeof path !== 'string' || !path.trim()) return Promise.reject(new Error('Puzzle artwork path is required'));
  return new Promise((resolve, reject) => {
    const image = new Image();
    let settled = false;
    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
      image.onload = null;
      image.onerror = null;
      if (error) { image.removeAttribute('src'); reject(error); }
      else resolve(image);
    };
    const abort = () => finish(new Error('Puzzle artwork loading cancelled'));
    const timer = setTimeout(() => finish(new Error('Puzzle artwork loading timed out')), timeoutMs);
    image.onload = () => {
      void (async () => {
        try {
          await image.decode();
          if (!image.naturalWidth || !image.naturalHeight) throw new Error('Empty puzzle artwork');
          finish();
        } catch { finish(new Error('Puzzle artwork failed to decode')); }
      })();
    };
    image.onerror = () => finish(new Error('Puzzle artwork failed to load'));
    if (signal?.aborted) { abort(); return; }
    signal?.addEventListener('abort', abort, { once: true });
    image.src = path;
  });
}

/** Cache only successfully decoded source images, never renderer-owned textures. */
export type ArtworkCache = { path: string; image: HTMLImageElement };
export type ArtworkCacheSlot = { current: ArtworkCache | null };

export async function createPuzzleArtwork(imagePath: string, signal?: AbortSignal, cache?: ArtworkCacheSlot): Promise<THREE.CanvasTexture> {
  if (typeof imagePath !== 'string' || !imagePath.trim()) throw new Error('Puzzle artwork path is required');
  signal?.throwIfAborted();
  const image = cache?.current?.path === imagePath ? cache.current.image : await loadPuzzleImage(imagePath, signal);
  signal?.throwIfAborted();
  if (!image.naturalWidth || !image.naturalHeight) throw new Error('Empty puzzle artwork');
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext('2d', { colorSpace: 'srgb' });
  if (!ctx) throw new Error('Canvas 2D unavailable');
  ctx.drawImage(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  if (cache) cache.current = { path: imagePath, image };
  return texture;
}
