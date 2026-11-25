import * as THREE from 'three';
import type {PieceRuntime,PuzzleStore} from '../state/puzzle-store';
import type {FrameContext} from '@three-shell/core';
type Motion={piece:PieceRuntime;start:THREE.Vector3;end:THREE.Vector3;elapsed:number;duration:number;lock:boolean;intro?:boolean};
const INTRO_LIFT=.55;
const INTRO_DURATION=.4;
export class AnimationOperator{
  private motions:Motion[]=[];
  constructor(private readonly store:PuzzleStore){}
  get busy(){return this.motions.length>0;}
  private finish(piece:PieceRuntime,lock:boolean){
    piece.mesh.position.copy(lock?piece.target:piece.home);
    this.store.session.transition(piece.definition.id,lock?'locked':'resting');
    if(lock){
      this.store.callbacks.onProgress(this.store.session.placedCount);
      if(this.store.session.complete)this.store.callbacks.onComplete();
    }
  }
  begin(piece:PieceRuntime,lock:boolean){
    if(this.store.config.animationsEnabled?.()===false){this.finish(piece,lock);return;}
    this.motions.push({piece,start:piece.mesh.position.clone(),end:(lock?piece.target:piece.home).clone(),elapsed:0,duration:lock?.28:.36,lock});
  }
  /** Soft tray drop-in after artwork arrives; all pieces reveal together in stack order. */
  introDrop(pieces:readonly PieceRuntime[]){
    const ordered=[...pieces].sort((a,b)=>a.home.y-b.home.y||a.definition.id-b.definition.id);
    ordered.forEach((piece,i)=>{piece.mesh.renderOrder=i;});
    const animate=this.store.config.animationsEnabled?.()!==false;
    for(const piece of ordered){
      const end=piece.home.clone();
      if(!animate){piece.mesh.position.copy(end);continue;}
      const start=end.clone();start.y+=INTRO_LIFT;
      piece.mesh.position.copy(start);
      this.motions.push({piece,start,end,elapsed:0,duration:INTRO_DURATION,lock:false,intro:true});
    }
    // Reveal only after every mesh is posed — one simultaneous appearance.
    for(const piece of ordered)piece.mesh.visible=true;
  }
  advance(ctx:FrameContext){
    for(let i=this.motions.length-1;i>=0;i--){
      const m=this.motions[i];m.elapsed+=ctx.dt;
      if(m.elapsed<0)continue;
      const t=this.store.config.animationsEnabled?.()===false?1:Math.min(1,m.elapsed/m.duration);
      m.piece.mesh.position.lerpVectors(m.start,m.end,1-Math.pow(1-t,3));
      if(!m.intro)m.piece.mesh.position.y+=Math.sin(Math.PI*t)*(m.lock?.035:.02);
      if(t>=1){
        this.motions.splice(i,1);
        if(m.intro)m.piece.mesh.position.copy(m.end);
        else this.finish(m.piece,m.lock);
      }
    }
  }
  onSceneDestroy(){this.motions=[];}
}
