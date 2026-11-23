/** Standalone composition descriptor. When integrated into the original monorepo,
 * register JigsawScene, PuzzleStore, SceneResources and operators using @Module. */
import {JigsawScene} from './jigsaw.scene';
export const JigsawSceneModule={scene:JigsawScene,providers:['PuzzleStore','SceneResources','DragOperator','AnimationOperator']} as const;
