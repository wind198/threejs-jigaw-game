import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPuzzle,puzzles } from '../../../src/content/puzzles';
import { PlayEntry } from '../../../src/ui/features/play/PlayEntry';
import { pageMetadata } from '../../../src/seo/metadata';
import { puzzleTitle,puzzleDescription,puzzlePath } from '../../../src/seo/catalog';
export const dynamicParams=false;
export function generateStaticParams(){return puzzles.map(p=>({puzzleId:p.id}));}
export async function generateMetadata({params}:{params:Promise<{puzzleId:string}>}):Promise<Metadata>{
 const puzzle=getPuzzle((await params).puzzleId);
 return puzzle?pageMetadata({title:puzzleTitle(puzzle),description:puzzleDescription(puzzle),path:puzzlePath(puzzle.id),image:puzzle.image}):{title:'Puzzle not found',robots:{index:false}};
}
export default async function Page({params}:{params:Promise<{puzzleId:string}>}){
 const puzzle=getPuzzle((await params).puzzleId);
 if(!puzzle)notFound();
 return <PlayEntry key={puzzle.id} puzzle={puzzle}/>;
}
