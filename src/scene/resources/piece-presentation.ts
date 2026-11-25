import type * as THREE from 'three';
import type { PieceRuntime } from '../state/puzzle-store';

/** A synchronous transaction: no browser paint or pointer event can interleave these steps. */
export function presentPreparedPieces(
  renderer: Pick<THREE.WebGLRenderer, 'initTexture' | 'compile' | 'render' | 'getContext'>,
  scene: THREE.Scene,
  camera: THREE.Camera,
  artwork: THREE.Texture,
  pieces: readonly PieceRuntime[],
  expectedCount: number,
  poseIntro: () => void,
) {
  if (!expectedCount || pieces.length !== expectedCount ||
      pieces.some(p => p.mesh.visible || !Array.isArray(p.mesh.material) ||
        (p.mesh.material[0] as THREE.MeshBasicMaterial).map !== artwork)) {
    throw new Error('Incomplete or inconsistent puzzle artwork');
  }
  const gl = renderer.getContext();
  if (gl.isContextLost()) throw new Error('Puzzle WebGL context lost');
  try {
    renderer.initTexture(artwork);
    // Compile while all meshes participate; no frame is presented during compilation.
    for (const p of pieces) p.mesh.visible = true;
    renderer.compile(scene, camera);
    poseIntro();
    scene.updateMatrixWorld(true);
    renderer.render(scene, camera);
    if (gl.isContextLost()) throw new Error('Puzzle WebGL context lost during artwork presentation');
  } catch (error) {
    for (const p of pieces) p.mesh.visible = false;
    throw error;
  }
}
