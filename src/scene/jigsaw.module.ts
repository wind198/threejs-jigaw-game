import { Module } from '@three-shell/core';
import { JigsawScene } from './jigsaw.scene';
import { PuzzleStore } from './state/puzzle-store';
import { SceneResources } from './resources/scene-resources';
import { DragOperator } from './operators/drag.operator';
import { AnimationOperator } from './operators/animation.operator';

/** Bootstrap values come from the React host; module owns every scene provider. */
export const JIGSAW_CONTAINER = Symbol('JIGSAW_CONTAINER');
export const JIGSAW_PROGRESS = Symbol('JIGSAW_PROGRESS');
export const JIGSAW_COMPLETE = Symbol('JIGSAW_COMPLETE');

@Module({
  providers: [
    { provide: PuzzleStore, useFactory: (onProgress: (n:number)=>void, onComplete:()=>void) => {
      const store = new PuzzleStore();
      store.callbacks = {onProgress, onComplete};
      return store;
    }, inject: [JIGSAW_PROGRESS, JIGSAW_COMPLETE] },
    { provide: SceneResources, useFactory: (container: HTMLElement, store: PuzzleStore) =>
      new SceneResources(container,store), inject: [JIGSAW_CONTAINER,PuzzleStore] },
    { provide: AnimationOperator, useFactory: (store: PuzzleStore) => new AnimationOperator(store), inject: [PuzzleStore] },
    { provide: DragOperator, useFactory: (res: SceneResources, store: PuzzleStore, animation: AnimationOperator) =>
      new DragOperator(res,store,(piece,lock)=>animation.begin(piece,lock)),
      inject: [SceneResources,PuzzleStore,AnimationOperator] },
    JigsawScene,
  ],
  exports: [JigsawScene, PuzzleStore],
})
export class JigsawSceneModule {}
