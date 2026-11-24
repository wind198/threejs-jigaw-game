'use client';
import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useGamePreferences } from '../state/preferences';
import { GameAudioEngine } from './audio.engine';

type AudioActions = { snap:()=>void; complete:()=>void; reset:()=>void };
const AudioContext=createContext<AudioActions>({snap:()=>{},complete:()=>{},reset:()=>{}});
export function useGameAudio(){return useContext(AudioContext);}
export function GameAudioProvider({children}:{children:ReactNode}){
  const engine=useRef<GameAudioEngine|null>(null);
  const path=usePathname();
  const {preferences}=useGamePreferences();
  useEffect(()=>{
    const instance=new GameAudioEngine(); engine.current=instance;
    const unlock=()=>instance.unlock();
    const visibility=()=>instance.setVisible(!document.hidden);
    document.addEventListener('pointerdown',unlock);
    document.addEventListener('keydown',unlock);
    document.addEventListener('visibilitychange',visibility);
    visibility();
    return ()=>{document.removeEventListener('pointerdown',unlock);document.removeEventListener('keydown',unlock);document.removeEventListener('visibilitychange',visibility);instance.dispose();engine.current=null;};
  },[]);
  useEffect(()=>{
    engine.current?.configure(preferences.soundEnabled,preferences.musicEnabled,preferences.effectsEnabled,preferences.musicVolume,preferences.effectsVolume);
  },[preferences.soundEnabled,preferences.musicEnabled,preferences.effectsEnabled,preferences.musicVolume,preferences.effectsVolume]);
  useEffect(()=>{engine.current?.setMode(path.startsWith('/play/')?'playing':'browsing');engine.current?.reset();},[path]);
  return <AudioContext.Provider value={{snap:()=>engine.current?.snap(),complete:()=>engine.current?.complete(),reset:()=>engine.current?.reset()}}>{children}</AudioContext.Provider>;
}
