import type { AnimationHost, SceneDefinition } from './application';
import type { FrameContext, PipelineSpec } from './scheduler';
/** Application-facing orchestration base; has no rendering or physics dependency. */
export abstract class ThreeShell<T extends FrameContext = FrameContext> implements SceneDefinition<T> {
  protected readonly frame: T;
  constructor(frame?: T) {
    this.frame = frame ?? ({ dt: 0, frameDelta: 0, frameId: 0, simulationTick: 0, alpha: 0 } as T);
  }
  getFrameContext(): T { return this.frame; }
  abstract getAnimationHost(): AnimationHost;
  abstract createPipelines(): PipelineSpec<T>;
  onFrameError?(error: unknown): void;
}
