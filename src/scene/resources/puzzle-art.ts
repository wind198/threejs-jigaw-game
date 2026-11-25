import * as THREE from 'three';

export const ARTWORK_TIMEOUT_MS = 15_000;

/** Await the full image decode; never substitute sample art for a requested asset. */
export function loadPuzzleImage(path: string, signal?: AbortSignal, timeoutMs = ARTWORK_TIMEOUT_MS): Promise<HTMLImageElement> {
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

export async function createPuzzleArtwork(imagePath?: string, signal?: AbortSignal): Promise<THREE.CanvasTexture> {
  const image = imagePath === undefined ? undefined : await loadPuzzleImage(imagePath, signal);
  const canvas = document.createElement('canvas');
  canvas.width = image?.naturalWidth ?? 1024;
  canvas.height = image?.naturalHeight ?? 1024;
  const ctx = canvas.getContext('2d', { colorSpace: 'srgb' });
  if (!ctx) throw new Error('Canvas 2D unavailable');
  if (image) {
    ctx.drawImage(image, 0, 0);
  } else {
    const gradient = ctx.createLinearGradient(0, 0, 1024, 1024);
    gradient.addColorStop(0, '#bcebf2'); gradient.addColorStop(1, '#f5c6ad');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1024, 1024);
    ctx.fillStyle = '#ffe6a0'; ctx.beginPath(); ctx.arc(720, 300, 160, 0, Math.PI * 2); ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}
