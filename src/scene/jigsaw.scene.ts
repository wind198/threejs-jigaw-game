import {Injectable, Inject, ThreeShell, pipe, type FrameContext, type PipelineSpec, type AnimationHost} from '@three-shell/core';
import {PuzzleStore} from './state/puzzle-store';
import {SceneResources} from './resources/scene-resources';
import {AnimationOperator} from './operators/animation.operator';
import {CelebrationOperator} from './operators/celebration.operator';
import {DragOperator} from './operators/drag.operator';

/** Scene owns orchestration only; state and effects are provided by the module. */
@Injectable()
export class JigsawScene extends ThreeShell<FrameContext> {
  constructor(
    @Inject(PuzzleStore) readonly store: PuzzleStore,
    @Inject(SceneResources) readonly resources: SceneResources,
    @Inject(AnimationOperator) readonly animation: AnimationOperator,
    @Inject(DragOperator) readonly drag: DragOperator,
    @Inject(CelebrationOperator) readonly celebration: CelebrationOperator,
  ) { super(); }

  getAnimationHost(): AnimationHost { return this.resources.renderer; }
  createPipelines(): PipelineSpec<FrameContext> { return {
    fixedDelta: 1/60, maxFrameDelta: .1, maxStepsPerFrame: 5,
    simulation: pipe<FrameContext>(() => this.drag.process(), ctx => this.animation.advance(ctx), () => this.resources.updateLayout(), ctx=>this.celebration.advance(ctx)),
    presentation: pipe<FrameContext>(() => this.resources.renderer.render(this.resources.scene,this.resources.camera)),
  }; }
  onFrameError(error: unknown) { console.error('ThreeShell frame error:',error); this.store.config.onError?.(error); }
}
