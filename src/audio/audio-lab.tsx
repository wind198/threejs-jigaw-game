'use client';
import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import { AUDIO_CANDIDATES, BUNDLED_AUDIO } from './audio-candidates';
type Role = 'browsing'|'gameplay'|'snap'|'success';
const roles:Role[]=['browsing','gameplay','snap','success'];
type Track={sound:Howl;url?:string};
export function AudioLab(){
  const tracks=useRef<Partial<Record<Role,Track>>>({});
  const [names,setNames]=useState<Partial<Record<Role,string>>>({});
  const [status,setStatus]=useState('');
  const [music,setMusic]=useState(.25);
  const [effects,setEffects]=useState(.25);
  const [reward,setReward]=useState(.5);
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const active=useRef<Role|null>(null);
  function stop(){
    if(timer.current!==null){clearTimeout(timer.current);timer.current=null;}
    Object.values(tracks.current).forEach(t=>t?.sound.stop());active.current=null;
  }
  useEffect(()=>{
    const visibility=()=>{if(document.hidden)stop();};
    document.addEventListener('visibilitychange',visibility);
    return ()=>{document.removeEventListener('visibilitychange',visibility);stop();Object.values(tracks.current).forEach(t=>{t?.sound.unload();if(t?.url)URL.revokeObjectURL(t.url);});tracks.current={};};
  },[]);
  function loadBundled(role:Role, url:string, title:string){
    stop();
    const previous=tracks.current[role];previous?.sound.unload();if(previous?.url)URL.revokeObjectURL(previous.url);
    const sound=new Howl({src:[url],loop:role==='browsing'||role==='gameplay',volume:0,onload:()=>setStatus(title+' loaded'),onloaderror:()=>setStatus(title+' could not be decoded'),onplayerror:()=>setStatus('Playback blocked; try again.')});
    tracks.current[role]={sound};setNames(old=>({...old,[role]:title}));
  }
  function load(role:Role,file:File){
    if(!file.size||file.size>30*1024*1024){setStatus('Choose a nonempty audio file under 30 MB.');return;}
    stop();
    const previous=tracks.current[role];previous?.sound.unload();if(previous?.url)URL.revokeObjectURL(previous.url);
    const url=URL.createObjectURL(file);const format=file.name.split('.').pop()?.toLowerCase();
    const sound=new Howl({src:[url],format:format?[format]:undefined,loop:role==='browsing'||role==='gameplay',volume:0, onload:()=>setStatus(role+' loaded'),onloaderror:()=>setStatus(role+' could not be decoded'),onplayerror:()=>setStatus('Playback blocked or unavailable; try again.')});
    tracks.current[role]={sound,url};setNames(old=>({...old,[role]:file.name}));
  }
  useEffect(()=>{for(const role of roles){tracks.current[role]?.sound.volume(role==='snap'?effects:role==='success'?reward:music);}},[music,effects,reward,names]);
  function play(role:Role){
    const track=tracks.current[role]?.sound;if(!track){setStatus('Load a '+role+' file first.');return;}
    if(role==='browsing'||role==='gameplay'){stop();active.current=role;}
    track.volume(role==='snap'?effects:role==='success'?reward:music);track.stop();track.play();
  }
  function celebrate(){
    const bg=active.current?tracks.current[active.current]?.sound:undefined;
    if(timer.current!==null)clearTimeout(timer.current);
    if(bg)bg.volume(music*.2);
    play('snap');
    timer.current=setTimeout(()=>{timer.current=null;play('success');},250);
  }
  return <main className="site-page" style={{maxWidth:760,margin:'auto',padding:24}}>
    <h1>Audio audition lab</h1><p>Audition bundled CC0 candidates or select your own local files. Nothing is uploaded or saved. Production audio remains unchanged.</p>
    <h2>Candidate sources</h2><ul>{AUDIO_CANDIDATES.map(c=><li key={c.id}><a href={c.source} target="_blank" rel="noreferrer">{c.role} — {c.author}</a> ({c.license})</li>)}</ul>
    <h2>Bundled candidates</h2><p>Choose a candidate, then press Play in its corresponding slot below.</p>{BUNDLED_AUDIO.map(c=><section key={c.id} style={{padding:8}}><button type="button" onClick={()=>loadBundled(c.role,c.local,c.title)}>Load {c.title}</button> <small>{c.role} · {c.author} · <a href={c.source}>CC0 source</a></small></section>)}<h2>Load and listen</h2>{roles.map(role=><section key={role} style={{padding:12,borderBottom:'1px solid #ddd'}}><label>{role}<input type="file" accept="audio/*,.ogg,.mp3,.wav" onChange={e=>{const f=e.target.files?.[0];if(f)load(role,f);}}/></label><button type="button" disabled={!names[role]} onClick={()=>play(role)}>Play {role}</button><small>{names[role]}</small></section>)}
    <h2>Mixer</h2>{([{label:'Music',value:music,set:setMusic},{label:'Effects',value:effects,set:setEffects},{label:'Reward',value:reward,set:setReward}]).map(c=><label key={c.label} style={{display:'block'}}>{c.label} {Math.round(c.value*100)}% <input type="range" min={0} max={.8} step={.05} value={c.value} onChange={e=>c.set(Number(e.target.value))}/></label>)}
    <button type="button" onClick={celebrate} disabled={!names.snap||!names.success}>Test final snap and celebration</button> <button type="button" onClick={stop}>Stop all</button><p role="status">{status}</p>
  </main>;
}
