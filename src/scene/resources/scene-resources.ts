import * as THREE from 'three';
import { createPuzzleArtwork } from './puzzle-art';
import { createPieceMesh } from '../geometry/piece-mesh';
import { createPlayroomLayout, frameLayout, pieceRadius, type PlayroomLayout } from '../layouts/playroom-layout';
import { scatterPieces } from '../layouts/scatter-layout';
import { dropOnTray } from '../layouts/drop-layout';
import { settleStack } from '../layouts/stack-layout';
import { RESTING_Y, LOCKED_Y, TRAY_CENTER_Y, TRAY_DEPTH_Y } from '../geometry/piece-dimensions';
import { PuzzleStore } from '../state/puzzle-store';
export class SceneResources {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.OrthographicCamera(-8, 8, 5, -5, .1, 100);
  readonly renderer: THREE.WebGLRenderer;
  private artwork?: THREE.CanvasTexture;
  readonly objects: THREE.Object3D[] = [];
  private resizeObserver: ResizeObserver;
  private layout!: PlayroomLayout;
  private trayMeshes: THREE.Mesh[] = [];
  private scatterPending = true;
  private settledCount = -1;
  private settlePending = false;
  private appliedAspect = 0;
  private dirty = true;
  private aspect = 0;
  constructor(readonly container: HTMLElement, readonly store: PuzzleStore) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.28;
    this.scene.background = new THREE.Color('#efe5d2');
    this.camera.position.set(0, 18, 0); this.camera.up.set(0, 0, -1); this.camera.lookAt(0, 0, 0);
    container.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.touchAction = 'none';
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x9d9f8f, 2.4));
    const light = new THREE.DirectionalLight(0xfff5db, 3.4);
    light.position.set(-1.2, 16, -1.6); light.castShadow = true; light.shadow.mapSize.set(2048, 2048);
    Object.assign(light.shadow.camera, { left: -13, right: 13, top: 13, bottom: -13, near: 1, far: 35 });
    light.shadow.bias = -.00015; light.shadow.normalBias = .006;
    this.scene.add(light); this.objects.push(light);
    this.buildBoard();
    this.resizeObserver = new ResizeObserver(() => this.resize()); this.resizeObserver.observe(container); this.resize();
  }
  async onSceneInit() {
    this.artwork=await createPuzzleArtwork(this.store.config.image,this.store.config.signal);
    this.store.config.signal?.throwIfAborted();
    this.buildPieces(this.artwork);
    this.resize();this.updateLayout();
  }
  private addBox(w: number, h: number, d: number, color: number, x: number, y: number, z: number) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, roughness: .87 }));
    mesh.position.set(x, y, z); mesh.receiveShadow = true; mesh.castShadow = true;
    this.scene.add(mesh); this.objects.push(mesh); return mesh;
  }
  private buildBoard() {
    this.addBox(6.3, .32, 6.3, 0xad7651, 0, -.20, 0);
    this.addBox(6.08, .02, 6.08, 0xf7eaca, 0, -.025, 0);
    const n = this.store.config.size;
    for (let i = 1; i < n; i++) {
      const t = -3 + i * (6 / n);
      this.addBox(.012, .007, 6, 0xd4c5a7, t, 0, 0);
      this.addBox(6, .007, .012, 0xd4c5a7, 0, 0, t);
    }
    for (const [x, z, w, d] of [[-3.10, 0, .10, 6.3], [3.10, 0, .10, 6.3], [0, -3.10, 6.3, .10], [0, 3.10, 6.3, .10]] as const)
      this.addBox(w, .24, d, 0xc58c65, x, .03, z);
  }
  private buildPieces(artwork: THREE.CanvasTexture) {
    this.store.pieces = this.store.session.pieces.map(def => {
      const mesh = createPieceMesh(def, artwork);
      const home = new THREE.Vector3(0, RESTING_Y, 0);
      const target = new THREE.Vector3(def.target.x - 3, LOCKED_Y, def.target.y - 3);
      mesh.position.copy(home); this.scene.add(mesh); this.objects.push(mesh);
      return { definition: def, mesh, home, target };
    });
  }
  private resize() {
    const w = Math.max(1, this.container.clientWidth), h = Math.max(1, this.container.clientHeight);
    this.renderer.setSize(w,h);
    this.aspect = w / h;
    this.dirty = true;
  }
  private rebuildTrays(layout: PlayroomLayout) {
    for (const mesh of this.trayMeshes) {
      this.scene.remove(mesh); mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
      this.objects.splice(this.objects.indexOf(mesh),1);
    }
    this.trayMeshes = layout.trays.map(t => this.addBox(t.width,TRAY_DEPTH_Y,t.depth,0xe0cdb1,t.x,TRAY_CENTER_Y,t.z));
    this.trayMeshes.push(this.addBox(layout.width,.25,layout.depth,0xf7eee3,0,-.46,layout.centerZ));
  }
  /** Update the loose piece's home only for a valid tray drop. */
  relocateHome(piece: import('../state/puzzle-store').PieceRuntime) {
    if(!this.layout)return;
    const supports=this.store.pieces.filter(p=>p!==piece&&['resting','dropping'].includes(this.store.session.getState(p.definition.id))).map(p=>p.home);
    const slot=dropOnTray(this.layout,piece.mesh.position,pieceRadius(this.store.config.size),supports);
    if(slot)piece.home.set(slot.x,slot.y,slot.z);
    this.settlePending=true;
  }
  private isIdle() {
    return this.store.pieces.every(p => ['resting','locked'].includes(this.store.session.getState(p.definition.id)));
  }
  /** Run after input and animations, never relocate a piece in flight. */
  updateLayout() {
    if (!this.isIdle()) return;
    if (this.dirty) {
      const next = createPlayroomLayout(this.store.config.size,Math.max(.01,this.aspect));
      if (!this.layout || Math.abs(this.appliedAspect-this.aspect)>0.0001) {
        this.layout=next; this.appliedAspect=this.aspect; this.rebuildTrays(next); this.scatterPending=true;
      }
      const frame = frameLayout(this.layout,Math.max(.01,this.aspect));
      this.camera.position.set(0,30,frame.centerZ); this.camera.lookAt(0,0,frame.centerZ);
      this.camera.left = -frame.width/2; this.camera.right = frame.width/2;
      this.camera.top = frame.height/2; this.camera.bottom = -frame.height/2;
      this.camera.updateProjectionMatrix(); this.camera.updateMatrixWorld();
      this.dirty = false;
    }
    if (!this.layout) return;
    const remaining=this.store.pieces.filter(p=>this.store.session.getState(p.definition.id)==='resting');
    if(this.scatterPending){
      const slots=scatterPieces(this.layout,this.store.config.size,remaining.map(p=>p.definition.id),2026);
      for(const piece of remaining){
        const slot=slots.get(piece.definition.id)!;
        piece.home.set(slot.x,slot.y,slot.z);
        piece.mesh.visible=true;piece.mesh.position.copy(piece.home);piece.mesh.updateMatrixWorld(true);
      }
      this.scatterPending=false;
      this.settledCount=remaining.length;
    } else if(this.settlePending||this.settledCount!==remaining.length) {
      // Preserve XZ homes and the existing relative stacking order after a piece is placed.
      const ordered=[...remaining].sort((a,b)=>a.home.y-b.home.y||a.definition.id-b.definition.id);
      const slots=settleStack(ordered.map(p=>p.home),pieceRadius(this.store.config.size));
      ordered.forEach((piece,i)=>{piece.home.y=slots[i].y;piece.mesh.position.copy(piece.home);piece.mesh.updateMatrixWorld(true);});
      this.settledCount=remaining.length;
    }
    this.settlePending=false;
  }
  onSceneDestroy() {
    this.resizeObserver.disconnect();
    for (const obj of this.objects) {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        for (const m of Array.isArray(obj.material) ? obj.material : [obj.material]) m.dispose();
      }
      this.scene.remove(obj);
    }
    this.artwork?.dispose(); this.renderer.dispose(); this.renderer.domElement.remove();
  }
}
