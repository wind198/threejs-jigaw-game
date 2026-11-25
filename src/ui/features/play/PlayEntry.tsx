'use client';
import dynamic from 'next/dynamic';
import type { Puzzle } from '../../../content/puzzles';
import { PlayroomShell } from '../../components/PlayroomShell';
const GamePage=dynamic(()=>import('../../pages/GamePage').then(m=>m.GamePage),{ssr:false,loading:()=>null});
/** The canonical puzzle route opens gameplay without a second Play action. */
export function PlayEntry({puzzle}:{puzzle:Puzzle}){
 return <PlayroomShell puzzle={puzzle}><GamePage puzzle={puzzle}/></PlayroomShell>;
}
