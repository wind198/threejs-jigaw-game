'use client';
import { useState,type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { StatusScreen } from '../../components/StatusScreen';
import type { Puzzle } from '../../../content/puzzles';
const GamePage=dynamic(()=>import('../../pages/GamePage').then(m=>m.GamePage),{ssr:false,loading:()=> <StatusScreen kind="loading"/>});
export function PlayEntry({puzzle,children}:{puzzle:Puzzle;children:ReactNode}){
 const [playing,setPlaying]=useState(false);
 if(playing)return <GamePage puzzle={puzzle}/>;
 return <div onClick={event=>{if(event.target instanceof Element&&event.target.closest('[data-play-entry]'))setPlaying(true);}}>{children}</div>;
}
