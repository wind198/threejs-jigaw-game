import * as THREE from 'three';
import type {PieceRuntime,PuzzleStore} from '../state/puzzle-store';
import type {FrameContext} from '@three-shell/core';
type Motion={piece:PieceRuntime;start:THREE.Vector3;end:THREE.Vector3;elapsed:number;duration:number;lock:boolean};
export class AnimationOperator{
  private motions:Motion[]=[];
  constructor(private readonly store:PuzzleStore){}
  begin(piece:PieceRuntime,lock:boolean){const start=piece.mesh.position.clone();const end=(lock?piece.target:piece.home).clone();
    this.motions.push({piece,start,end,elapsed:0,duration:lock?.28:.36,lock});
  }
  advance(ctx:FrameContext){for(let i=this.motions.length-1;i>=0;i--){const m=this.motions[i];m.elapsed+=ctx.dt;
    const t=Math.min(1,m.elapsed/m.duration);const ease=1-Math.pow(1-t,3);
    m.piece.mesh.position.lerpVectors(m.start,m.end,ease);
    m.piece.mesh.position.y+=Math.sin(Math.PI*t)*(m.lock?.13:.07);
    if(t>=1){m.piece.mesh.position.copy(m.end);this.store.session.transition(m.piece.definition.id,m.lock?'locked':'resting');
      if(m.lock){this.store.callbacks.onProgress(this.store.session.placedCount);if(this.store.session.complete)this.store.callbacks.onComplete()}
      this.motions.splice(i,1);
    }
  }}
  clear(){this.motions=[]}
}
