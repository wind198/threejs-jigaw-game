export type Stage<T> = (ctx: T) => void;
/** Resolves the sequence once. Stages run synchronously, in declared order. */
export function pipe<T>(...stages: readonly Stage<T>[]): Stage<T> {
  return (ctx: T) => { for (const stage of stages) stage(ctx); };
}
