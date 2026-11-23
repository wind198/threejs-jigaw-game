import {ThreeShell,pipe,type FrameContext,type PipelineSpec,type AnimationHost} from '@three-shell/core';
import {PuzzleStore} from './state/puzzle-store';
import {SceneResources} from './resources/scene-resources';
import {AnimationOperator} from './operators/animation.operator';
import {DragOperator} from './operators/drag.operator';
/** Scene composes the behavior pipeline; operators never start their own frame loops. */
export class JigsawScene extends ThreeShell<FrameContext>{
  readonly store=new PuzzleStore();readonly resources:SceneResources;
  readonly animation:AnimationOperator;readonly drag:DragOperator;
  constructor(element:HTMLElement,onProgress:(n:number)=>void,onComplete:()=>void){super();
    this.store.callbacks={onProgress,onComplete};this.resources=new SceneResources(element,this.store);
    this.animation=new AnimationOperator(this.store);
    this.drag=new DragOperator(this.resources,this.store,(piece,lock)=>this.animation.begin(piece,lock));
  }
  getAnimationHost():AnimationHost{return this.resources.renderer}
  createPipelines():PipelineSpec<FrameContext>{return {
    fixedDelta:1/60,maxFrameDelta:.1,maxStepsPerFrame:5,
    simulation:pipe<FrameContext>(()=>this.drag.process(),ctx=>this.animation.advance(ctx)),
    presentation:pipe<FrameContext>(()=>this.resources.renderer.render(this.resources.scene,this.resources.camera)),
  }}
  onFrameError(error:unknown){console.error('ThreeShell frame error:',error)}
  dispose(){this.drag.dispose();this.animation.clear();this.resources.dispose()}
}
