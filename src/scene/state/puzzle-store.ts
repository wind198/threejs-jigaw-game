import * as THREE from 'three';
import { generatePieces, PuzzleSession, type PieceDefinition } from '../../domain/puzzle';
export type PieceRuntime = { definition: PieceDefinition; mesh: THREE.Mesh; home: THREE.Vector3; target: THREE.Vector3 };
export type PuzzleConfig = { size: number; image: string; animationsEnabled?: () => boolean; onError?: (error: unknown) => void };
export class PuzzleStore {
  session: PuzzleSession;
  pieces: PieceRuntime[] = [];
  active: number | null = null;
  callbacks: { onProgress: (count: number) => void; onComplete: () => void } = { onProgress: () => {}, onComplete: () => {} };
  constructor(readonly config: PuzzleConfig = { size: 3, image: '/assets/puzzles/sunny-valley.svg' }) {
    this.session = new PuzzleSession(generatePieces(config.size, config.size));
  }
  reset() {
    this.session = new PuzzleSession(generatePieces(this.config.size, this.config.size));
    this.pieces = []; this.active = null; this.callbacks.onProgress(0);
  }
}
