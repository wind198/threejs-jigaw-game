'use client';
import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useGamePreferences } from '../state/preferences';
import { GameAudioEngine } from './audio.engine';
import { prefetchAllAudio } from './audio.prefetch';

type AudioActions = { snap:()=>void; complete:()=>void; reset:()=>void };
const AudioContext=createContext<AudioActions>({snap:()=>{},complete:()=>{},reset:()=>{}});
export function useGameAudio(){return useContext(AudioContext);}
export function GameAudioProvider({children}:{children:ReactNode}){
  const engine=useRef<GameAudioEngine|null>(null);
  const path=usePathname();
  const {preferences}=useGamePreferences();
  useEffect(()=>{
    prefetchAllAudio();
    const instance=new GameAudioEngine(); engine.current=instance;
    // Apply prefs immediately so the first user gesture can start music.
    instance.configure(preferences.soundEnabled,preferences.musicEnabled,preferences.effectsEnabled,preferences.musicVolume,preferences.effectsVolume);
    instance.setMode(path.startsWith('/play/')?'playing':'browsing');
    const unlock=()=>instance.unlock();
    const visibility=()=>instance.setVisible(!document.hidden);
    document.addEventListener('pointerdown',unlock,{passive:true});
    document.addEventListener('touchstart',unlock,{passive:true});
    document.addEventListener('keydown',unlock);
    document.addEventListener('visibilitychange',visibility);
    visibility();
    return ()=>{document.removeEventListener('pointerdown',unlock);document.removeEventListener('touchstart',unlock);document.removeEventListener('keydown',unlock);document.removeEventListener('visibilitychange',visibility);instance.dispose();engine.current=null;};
  // eslint-disable-next-line react-hooks/exhaustive-deps -- create once; prefs/path synced below
  },[]);
  useEffect(()=>{
    engine.current?.configure(preferences.soundEnabled,preferences.musicEnabled,preferences.effectsEnabled,preferences.musicVolume,preferences.effectsVolume);
  },[preferences.soundEnabled,preferences.musicEnabled,preferences.effectsEnabled,preferences.musicVolume,preferences.effectsVolume]);
  useEffect(()=>{engine.current?.setMode(path.startsWith('/play/')?'playing':'browsing');engine.current?.reset();},[path]);
  return <AudioContext.Provider value={{snap:()=>engine.current?.snap(),complete:()=>engine.current?.complete(),reset:()=>engine.current?.reset()}}>{children}</AudioContext.Provider>;
}
