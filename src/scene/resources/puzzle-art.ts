import * as THREE from 'three';
/** Local, repository-hosted artwork; procedural fallback keeps the scene usable if an asset fails. */
export function createPuzzleArtwork(imagePath?: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 1024;
  const ctx = canvas.getContext('2d'); if (!ctx) throw Error('Canvas 2D unavailable');
  const gradient = ctx.createLinearGradient(0, 0, 1024, 1024);
  gradient.addColorStop(0, '#bcebf2'); gradient.addColorStop(1, '#f5c6ad');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1024, 1024);
  ctx.fillStyle = '#ffe6a0'; ctx.beginPath(); ctx.arc(720, 300, 160, 0, Math.PI * 2); ctx.fill();
  const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  if (imagePath) {
    const image = new Image();
    image.onload = () => { if (tex.userData.disposed) return; ctx.clearRect(0, 0, 1024, 1024); ctx.drawImage(image, 0, 0, 1024, 1024); tex.needsUpdate = true; };
    image.src = imagePath;
    const dispose = tex.dispose.bind(tex);
    tex.dispose = () => { tex.userData.disposed = true; image.onload = null; dispose(); };
  }
  return tex;
}
