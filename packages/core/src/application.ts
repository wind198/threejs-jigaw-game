import { Container } from './container';
import type { Class, Provider, Token } from './di';
import type { FrameContext, PipelineSpec } from './scheduler';
import { SimulationRuntime } from './scheduler';

export interface AnimationHost { setAnimationLoop(fn: ((timestamp: number) => void) | null): void }
export interface SceneDefinition<T extends FrameContext = FrameContext> {
  getFrameContext(): T;
  getAnimationHost(): AnimationHost;
  createPipelines(): PipelineSpec<T>;
  onFrameError?(error: unknown): void;
}

/** Host-neutral application bootstrap. No Three.js, React, or Rapier imports. */
export class ThreeApplication<T extends FrameContext = FrameContext> {
  private readonly runtime: SimulationRuntime<T>;
  private readonly host: AnimationHost;
  private disposed = false;
  private constructor(private readonly container: Container, private readonly scene: SceneDefinition<T>) {
    this.host = scene.getAnimationHost();
    this.runtime = new SimulationRuntime(scene.getFrameContext(), scene.createPipelines());
  }
  static async create<T extends FrameContext, S extends SceneDefinition<T>>(
    rootModule: Class, sceneToken: Token<S>, providers: readonly Provider[] = [],
  ): Promise<ThreeApplication<T>> {
    const container = new Container(rootModule, providers);
    try {
      await container.initialize();
      return new ThreeApplication<T>(container, container.resolve(sceneToken));
    } catch (error) {
      try { await container.destroy(); } catch { /* preserve bootstrap failure */ }
      throw error;
    }
  }
  start(): void {
    if (this.disposed) throw new Error('Application already disposed');
    this.runtime.start();
    this.host.setAnimationLoop((timestamp) => {
      try { this.runtime.tick(timestamp); }
      catch (error) {
        this.host.setAnimationLoop(null);
        this.scene.onFrameError?.(error);
      }
    });
  }
  pause(): void { this.runtime.pause(); }
  resume(): void { this.runtime.resume(); }
  get isPaused(): boolean { return this.runtime.isPaused; }
  resolve<P>(token: Token<P>): P { return this.container.resolve(token); }
  async dispose(): Promise<void> {
    if (this.disposed) return;
    this.disposed = true;
    this.runtime.stop();
    this.host.setAnimationLoop(null);
    await this.container.destroy();
  }
}
