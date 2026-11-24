import { puzzles, type Puzzle } from '../content/puzzles';
import { collections } from '../content/collections';
export function puzzlePath(id:string){return '/play/'+id+'/';}
export function collectionPath(slug:string){return '/puzzles/'+slug+'/';}
export function puzzleTitle(puzzle:Puzzle){return puzzle.title+' Jigsaw Puzzle for Kids';}
export function puzzleDescription(puzzle:Puzzle){return 'Play '+puzzle.title+', a free online '+puzzle.category.toLowerCase()+' jigsaw puzzle for kids. Choose 4, 9 or 25 pieces. No ads or accounts.';}
export function relatedPuzzles(puzzle:Puzzle){return puzzles.filter(p=>p.category===puzzle.category&&p.id!==puzzle.id).slice(0,6);}
export function indexablePages(){return [{path:'/'},{path:'/puzzles/'},...collections.map(c=>({path:collectionPath(c.slug)})),...puzzles.map(p=>({path:puzzlePath(p.id),image:p.image}))] as {path:string;image?:string}[];}
