export const MIN_LOADING_MS=500;
export const LOADING_FADE_MS=280;
export function remainingLoadingTime(elapsedMs:number){return Math.max(0,MIN_LOADING_MS-elapsedMs);}
