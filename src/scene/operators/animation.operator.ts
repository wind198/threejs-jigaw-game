import * as THREE from 'three';
import type {PieceRuntime,PuzzleStore} from '../state/puzzle-store';
import type {FrameContext} from '@three-shell/core';
type Motion={piece:PieceRuntime;start:THREE.Vector3;end:THREE.Vector3;elapsed:number;duration:number;lock:boolean};
export class AnimationOperator{
  private motions:Motion[]=[];
  constructor(private readonly store:PuzzleStore){}
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
  advance(ctx:FrameContext){
    for(let i=this.motions.length-1;i>=0;i--){
      const m=this.motions[i];m.elapsed+=ctx.dt;
      const t=this.store.config.animationsEnabled?.()===false?1:Math.min(1,m.elapsed/m.duration);
      m.piece.mesh.position.lerpVectors(m.start,m.end,1-Math.pow(1-t,3));
      m.piece.mesh.position.y+=Math.sin(Math.PI*t)*(m.lock?.035:.02);
      if(t>=1){this.motions.splice(i,1);this.finish(m.piece,m.lock);}
    }
  }
  onSceneDestroy(){this.motions=[];}
}
