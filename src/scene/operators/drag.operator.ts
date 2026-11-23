import * as THREE from 'three';
import { shouldSnap } from '../../domain/puzzle';
import type { PuzzleStore, PieceRuntime } from '../state/puzzle-store';
import type { SceneResources } from '../resources/scene-resources';
export type DragCommand = { type: 'start' | 'move' | 'end'; id?: number; position?: THREE.Vector3 };
export class DragOperator {
  private readonly ray = new THREE.Raycaster(); private readonly cursor = new THREE.Vector2(); private readonly plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -.5);
  private readonly commands: DragCommand[] = []; private readonly offset = new THREE.Vector3();
  private readonly canvas: HTMLCanvasElement;
  private pointerId: number | null = null;
  private readonly down = (e: PointerEvent) => this.pointerDown(e);
  private readonly move = (e: PointerEvent) => this.pointerMove(e);
  private readonly up = (e: PointerEvent) => this.pointerUp(e);
  constructor(private readonly res: SceneResources, private readonly store: PuzzleStore, private readonly animate: (piece: PieceRuntime, lock: boolean) => void) {
    this.canvas = res.renderer.domElement; this.canvas.addEventListener('pointerdown', this.down);
    this.canvas.addEventListener('pointermove', this.move); this.canvas.addEventListener('pointerup', this.up); this.canvas.addEventListener('pointercancel', this.up);
  }
  private rayFrom(e: PointerEvent) { const rect = this.canvas.getBoundingClientRect(); this.cursor.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1); this.ray.setFromCamera(this.cursor, this.res.camera) }
  private onPlane(e: PointerEvent) { this.rayFrom(e); return this.ray.ray.intersectPlane(this.plane, new THREE.Vector3()) }
  private pointerDown(e: PointerEvent) {
    if (this.pointerId !== null) return; this.rayFrom(e);
    const hits = this.ray.intersectObjects(this.store.pieces.filter(p => this.store.session.getState(p.definition.id) === 'resting').map(p => p.mesh), false);
    if (!hits.length) return; const id = hits[0].object.userData.pieceId as number; const pos = this.onPlane(e); if (!pos) return;
    const piece = this.store.pieces[id]; this.offset.copy(piece.mesh.position).sub(pos); this.offset.y = 0;
    this.pointerId = e.pointerId; this.canvas.setPointerCapture(e.pointerId); this.commands.push({ type: 'start', id }); e.preventDefault();
  }
  private pointerMove(e: PointerEvent) {
    if (this.pointerId !== e.pointerId) return; const pos = this.onPlane(e); if (!pos) return;
    pos.add(this.offset); pos.y = .5; this.commands.push({ type: 'move', position: pos })
  }
  private pointerUp(e: PointerEvent) {
    if (this.pointerId !== e.pointerId) return;
    // Preserve final pointer position even without a preceding pointermove event.
    const pos = this.onPlane(e); if (pos) { pos.add(this.offset); pos.y = .5; this.commands.push({ type: 'move', position: pos }) }
    this.pointerId = null; if (this.canvas.hasPointerCapture(e.pointerId)) this.canvas.releasePointerCapture(e.pointerId);
    this.commands.push({ type: 'end' });
  }
  process() {
    for (const cmd of this.commands.splice(0)) {
      if (cmd.type === 'start' && cmd.id !== undefined) { this.store.active = cmd.id; this.store.session.transition(cmd.id, 'dragging'); const mesh = this.store.pieces[cmd.id].mesh; mesh.position.y = .5; }
      if (cmd.type === 'move' && cmd.position && this.store.active !== null) { this.store.pieces[this.store.active].mesh.position.copy(cmd.position) }
      if (cmd.type === 'end' && this.store.active !== null) {
        const id = this.store.active; this.store.active = null; const piece = this.store.pieces[id];
        const lock = shouldSnap({ x: piece.mesh.position.x, y: piece.mesh.position.z }, { x: piece.target.x, y: piece.target.z }, 2);
        this.store.session.transition(id, lock ? 'snapping' : 'dropping'); this.animate(piece, lock);
      }
    }
  }
  onSceneDestroy() { this.canvas.removeEventListener('pointerdown', this.down); this.canvas.removeEventListener('pointermove', this.move); this.canvas.removeEventListener('pointerup', this.up); this.canvas.removeEventListener('pointercancel', this.up) }
}
