import type { Stage } from './pipeline';
export interface FrameContext {
  dt: number; frameDelta: number; simulationTick: number; frameId: number; alpha: number;
}
export interface PipelineSpec<T extends FrameContext> {
  simulation: Stage<T>;
  presentation: Stage<T>;
  fixedDelta?: number;
  maxFrameDelta?: number;
  maxStepsPerFrame?: number;
}

export class SimulationRuntime<T extends FrameContext> {
  private previousTimestamp: number | null = null;
  private accumulator = 0;
  private running = false;
  private paused = false;
  private ticking = false;
  private readonly fixedDelta: number;
  private readonly maxFrameDelta: number;
  private readonly maxSteps: number;
  constructor(private readonly context: T, private readonly spec: PipelineSpec<T>) {
    this.fixedDelta = spec.fixedDelta ?? 1 / 60;
    this.maxFrameDelta = spec.maxFrameDelta ?? 0.1;
    this.maxSteps = spec.maxStepsPerFrame ?? 5;
    if (!Number.isFinite(this.fixedDelta) || this.fixedDelta <= 0 ||
        !Number.isFinite(this.maxFrameDelta) || this.maxFrameDelta <= 0 ||
        !Number.isInteger(this.maxSteps) || this.maxSteps <= 0) throw new Error('Invalid timing configuration');
  }
  start(): void { if (this.running) return; this.running = true; this.paused = false; this.previousTimestamp = null; this.accumulator = 0; }
  stop(): void { this.running = false; this.previousTimestamp = null; this.accumulator = 0; }
  pause(): void { this.paused = true; this.previousTimestamp = null; this.accumulator = 0; }
  resume(): void { this.paused = false; this.previousTimestamp = null; }
  get isRunning(): boolean { return this.running; }
  get isPaused(): boolean { return this.paused; }
  tick(timestampMs: number): void {
    if (!this.running) return;
    if (this.ticking) throw new Error('Reentrant simulation frame');
    if (!Number.isFinite(timestampMs)) throw new Error('Invalid frame timestamp');
    this.ticking = true;
    try {
      const elapsed = this.previousTimestamp === null ? 0 : Math.max(0, (timestampMs - this.previousTimestamp) / 1000);
      this.previousTimestamp = timestampMs;
      const ctx = this.context;
      ctx.frameId++;
      ctx.frameDelta = Math.min(elapsed, this.maxFrameDelta);
      if (!this.paused) {
        this.accumulator += ctx.frameDelta;
        let steps = 0;
        while (this.accumulator + 1e-10 >= this.fixedDelta && steps < this.maxSteps) {
          ctx.dt = this.fixedDelta;
          ctx.simulationTick++;
          this.spec.simulation(ctx);
          this.accumulator = Math.max(0, this.accumulator - this.fixedDelta);
          steps++;
        }
        if (steps === this.maxSteps && this.accumulator >= this.fixedDelta) this.accumulator %= this.fixedDelta;
      }
      ctx.alpha = this.paused ? 1 : Math.min(1, this.accumulator / this.fixedDelta);
      this.spec.presentation(ctx);
    } catch (error) { this.stop(); throw error; }
    finally { this.ticking = false; }
  }
}
