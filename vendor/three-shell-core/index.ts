/** Small source-compatible runtime shim for standalone distribution.
 * Replace vendor/ with packages/core from three-shell-monorepo when integrating.
 * Keeps exactly the fixed-step/DI/application interfaces used by this example. */
export interface FrameContext {dt:number;frameDelta:number;simulationTick:number;frameId:number;alpha:number}
export type Stage<T> = (ctx:T)=>void;
export function pipe<T>(...stages:readonly Stage<T>[]):Stage<T>{return (ctx)=>{for(const fn of stages)fn(ctx)}}
export interface PipelineSpec<T extends FrameContext>{simulation:Stage<T>;presentation:Stage<T>;fixedDelta?:number;maxFrameDelta?:number;maxStepsPerFrame?:number}
export interface AnimationHost{setAnimationLoop(fn:((timestamp:number)=>void)|null):void}
export abstract class ThreeShell<T extends FrameContext=FrameContext>{
  protected frame:T={dt:0,frameDelta:0,simulationTick:0,frameId:0,alpha:0} as T;
  getFrameContext(){return this.frame}
  abstract getAnimationHost():AnimationHost;
  abstract createPipelines():PipelineSpec<T>;
  onFrameError?(error:unknown):void;
}
export class SimulationRuntime<T extends FrameContext>{
  private prev:number|null=null;private accumulator=0;private running=false;private paused=false;
  constructor(private readonly ctx:T,private readonly spec:PipelineSpec<T>){}
  start(){this.running=true;this.prev=null;this.accumulator=0;this.paused=false}
  stop(){this.running=false;this.prev=null;this.accumulator=0}
  pause(){this.paused=true;this.prev=null;this.accumulator=0}
  resume(){this.paused=false;this.prev=null}
  get isPaused(){return this.paused}
  tick(time:number){if(!this.running)return;
    const delta=Math.min(Math.max(0,(this.prev===null?0:time-this.prev)/1000),this.spec.maxFrameDelta??.1);
    this.prev=time;this.ctx.frameDelta=delta;this.ctx.frameId++;
    const step=this.spec.fixedDelta??1/60;let count=0;
    if(!this.paused){this.accumulator+=delta;while(this.accumulator+1e-10>=step&&count<(this.spec.maxStepsPerFrame??5)){
      this.ctx.dt=step;this.ctx.simulationTick++;this.spec.simulation(this.ctx);this.accumulator=Math.max(0,this.accumulator-step);count++;
    }if(count===(this.spec.maxStepsPerFrame??5)&&this.accumulator>=step)this.accumulator%=step}
    this.ctx.alpha=this.paused?1:Math.min(1,this.accumulator/step);this.spec.presentation(this.ctx)
  }
}
export class ThreeApplication<T extends FrameContext>{
  private readonly runtime:SimulationRuntime<T>;private readonly host:AnimationHost;
  private disposed=false;
  constructor(private readonly scene:ThreeShell<T>,private readonly cleanup:()=>void|Promise<void>){
    this.runtime=new SimulationRuntime(scene.getFrameContext(),scene.createPipelines());this.host=scene.getAnimationHost();
  }
  start(){if(this.disposed)throw Error('Disposed');this.runtime.start();this.host.setAnimationLoop(t=>{try{this.runtime.tick(t)}catch(e){this.host.setAnimationLoop(null);this.scene.onFrameError?.(e)}})}
  pause(){this.runtime.pause()};resume(){this.runtime.resume()};get isPaused(){return this.runtime.isPaused}
  async dispose(){if(this.disposed)return;this.disposed=true;this.runtime.stop();this.host.setAnimationLoop(null);await this.cleanup()}
}
