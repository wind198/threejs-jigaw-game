import { Module } from '@three-shell/core';
import { JigsawScene } from './jigsaw.scene';
import { PuzzleStore, type PuzzleConfig } from './state/puzzle-store';
import { SceneResources } from './resources/scene-resources';
import { DragOperator } from './operators/drag.operator';
import { CelebrationOperator } from './operators/celebration.operator';
import { AnimationOperator } from './operators/animation.operator';
export const JIGSAW_CONTAINER = Symbol('JIGSAW_CONTAINER');
export const JIGSAW_PROGRESS = Symbol('JIGSAW_PROGRESS');
export const JIGSAW_COMPLETE = Symbol('JIGSAW_COMPLETE');
export const JIGSAW_CONFIG = Symbol('JIGSAW_CONFIG');
@Module({
  providers: [
    { provide: PuzzleStore, useFactory: (config: PuzzleConfig, onProgress: (n: number) => void, onComplete: () => void) => {
      const store = new PuzzleStore(config); store.callbacks = { onProgress, onComplete }; return store;
    }, inject: [JIGSAW_CONFIG, JIGSAW_PROGRESS, JIGSAW_COMPLETE] },
    { provide: AnimationOperator, useFactory: (store: PuzzleStore) => new AnimationOperator(store), inject: [PuzzleStore] },
    { provide: SceneResources, useFactory: (container: HTMLElement, store: PuzzleStore, animation: AnimationOperator) =>
      new SceneResources(container, store, animation), inject: [JIGSAW_CONTAINER, PuzzleStore, AnimationOperator] },
    { provide: DragOperator, useFactory: (res: SceneResources, store: PuzzleStore, animation: AnimationOperator) =>
      new DragOperator(res, store, animation), inject: [SceneResources, PuzzleStore, AnimationOperator] },
    { provide: CelebrationOperator, useFactory: (res: SceneResources, store: PuzzleStore) => new CelebrationOperator(res, store), inject: [SceneResources, PuzzleStore] },
    JigsawScene,
  ],
  exports: [JigsawScene, PuzzleStore],
})
export class JigsawSceneModule {}
