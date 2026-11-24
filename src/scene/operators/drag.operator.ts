import * as THREE from 'three';
import { shouldSnap } from '../../domain/puzzle';
import type { PuzzleStore, PieceRuntime } from '../state/puzzle-store';
import type { SceneResources } from '../resources/scene-resources';
type Command = { type:'start'; id:number } | { type:'move'; position:THREE.Vector3 } | { type:'end'; cancel?:boolean };
/** Pointer capture supports drag and tap-to-place. Raycasting selects the nearest (topmost) resting piece. */
export class DragOperator {
  private readonly ray = new THREE.Raycaster();
  private readonly cursor = new THREE.Vector2();
  private readonly plane = new THREE.Plane(new THREE.Vector3(0,1,0),-6);
  private readonly commands: Command[] = [];
  private readonly offset = new THREE.Vector3();
  private readonly canvas: HTMLCanvasElement;
  private pointerId: number | null = null;
  private selected: number | null = null;
  private origin = {x:0,y:0};
  private moved = false;
  private placing = false;
  private readonly down = (e:PointerEvent) => this.pointerDown(e);
  private readonly move = (e:PointerEvent) => this.pointerMove(e);
  private readonly up = (e:PointerEvent) => this.pointerUp(e,false);
  private readonly cancel = (e:PointerEvent) => this.pointerUp(e,true);
  constructor(private readonly res:SceneResources,private readonly store:PuzzleStore,private readonly animate:(piece:PieceRuntime,lock:boolean)=>void) {
    this.canvas=res.renderer.domElement;
    this.canvas.addEventListener('pointerdown',this.down);
    this.canvas.addEventListener('pointermove',this.move);
    this.canvas.addEventListener('pointerup',this.up);
    this.canvas.addEventListener('pointercancel',this.cancel);
    this.canvas.addEventListener('lostpointercapture',this.cancel);
  }
  private rayFrom(e:PointerEvent) {
    const r=this.canvas.getBoundingClientRect();
    this.cursor.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);
    this.ray.setFromCamera(this.cursor,this.res.camera);
  }
  private onPlane(e:PointerEvent) { this.rayFrom(e); return this.ray.ray.intersectPlane(this.plane,new THREE.Vector3()); }
  private pointerDown(e:PointerEvent) {
    if(this.pointerId!==null || e.button!==0) return;
    const pos=this.onPlane(e); if(!pos)return;
    this.placing=this.selected!==null;
    if(!this.placing){
      const hits=this.ray.intersectObjects(this.store.pieces.filter(p=>p.mesh.visible && this.store.session.getState(p.definition.id)==='resting').map(p=>p.mesh),false);
      if(!hits.length)return;
      const id=hits[0].object.userData.pieceId as number;
      this.selected=id;
      this.offset.copy(this.store.pieces[id].mesh.position).sub(pos); this.offset.y=0;
      this.commands.push({type:'start',id});
    } else { this.offset.set(0,0,0); }
    this.pointerId=e.pointerId; this.origin={x:e.clientX,y:e.clientY}; this.moved=false;
    this.canvas.setPointerCapture(e.pointerId); e.preventDefault();
  }
  private pointerMove(e:PointerEvent) {
    if(this.pointerId!==e.pointerId)return;
    if(Math.hypot(e.clientX-this.origin.x,e.clientY-this.origin.y)>6)this.moved=true;
    if(!this.moved && !this.placing)return;
    const pos=this.onPlane(e); if(!pos)return;
    pos.add(this.offset); pos.y=6; this.commands.push({type:'move',position:pos});
  }
  private pointerUp(e:PointerEvent,cancel:boolean) {
    if(this.pointerId!==e.pointerId)return;
    this.pointerId=null;
    if(this.canvas.hasPointerCapture(e.pointerId))this.canvas.releasePointerCapture(e.pointerId);
    if(!cancel && !this.moved && !this.placing && Math.hypot(e.clientX-this.origin.x,e.clientY-this.origin.y)<=6)return;
    if(!cancel){const pos=this.onPlane(e);if(pos){pos.add(this.offset);pos.y=6;this.commands.push({type:'move',position:pos});}}
    this.selected=null;this.commands.push({type:'end',cancel});
  }
  clearSelection() {
    if(this.pointerId!==null || this.selected===null)return false;
    this.selected=null; this.commands.push({type:'end',cancel:true}); return true;
  }
  process() {
    for(const cmd of this.commands.splice(0)){
      if(cmd.type==='start'){
        if(this.store.active!==null || this.store.session.getState(cmd.id)!=='resting')continue;
        this.store.active=cmd.id;this.store.session.transition(cmd.id,'dragging');
        this.store.pieces[cmd.id].mesh.position.y=6;
      }
      if(cmd.type==='move' && this.store.active!==null)this.store.pieces[this.store.active].mesh.position.copy(cmd.position);
      if(cmd.type==='end' && this.store.active!==null){
        const id=this.store.active;this.store.active=null;const piece=this.store.pieces[id];
        const lock=!cmd.cancel && shouldSnap({x:piece.mesh.position.x,y:piece.mesh.position.z},{x:piece.target.x,y:piece.target.z},6/this.store.config.size);
        this.store.session.transition(id,lock?'snapping':'dropping');this.animate(piece,lock);
      }
    }
  }
  onSceneDestroy(){
    this.canvas.removeEventListener('pointerdown',this.down);this.canvas.removeEventListener('pointermove',this.move);
    this.canvas.removeEventListener('pointerup',this.up);this.canvas.removeEventListener('pointercancel',this.cancel);this.canvas.removeEventListener('lostpointercapture',this.cancel);
  }
}
