import {useEffect,useRef,useState} from 'react';
import {ThreeApplication} from '@three-shell/core';
import {JigsawScene} from '../scene/jigsaw.scene';
import {JigsawSceneModule,JIGSAW_CONTAINER,JIGSAW_PROGRESS,JIGSAW_COMPLETE} from '../scene/jigsaw.module';
import './style.css';
export function JigsawGame(){
  const host=useRef<HTMLDivElement>(null);const app=useRef<ThreeApplication<any>|null>(null);
  const [count,setCount]=useState(0);const [complete,setComplete]=useState(false);const [game,setGame]=useState(0);
  useEffect(()=>{const element=host.current;if(!element)return;
    let cancelled=false;
    let runtime:ThreeApplication|null=null;
    void (async()=>{
      try {
        const created=await ThreeApplication.create(JigsawSceneModule,JigsawScene,[
          {provide:JIGSAW_CONTAINER,useValue:element},
          {provide:JIGSAW_PROGRESS,useValue:setCount},
          {provide:JIGSAW_COMPLETE,useValue:()=>setComplete(true)},
        ]);
        if(cancelled){await created.dispose();return;}
        runtime=created;app.current=created;created.start();
      } catch(error) { if(!cancelled) console.error('Jigsaw bootstrap failed:',error); }
    })();
    return()=>{cancelled=true;app.current=null;if(runtime)void runtime.dispose()};
  },[game]);
  function restart(){setComplete(false);setCount(0);setGame(n=>n+1)}
  return <div className="game-shell">
    <header className="topbar"><div className="brand"><span className="brand-icon">✿</span><div><span className="brand-overline">little moments</span><h1>Little Jigsaw <span>3D</span></h1></div></div>
      <div className="header-actions"><span className="difficulty">✦ Easy · 3 × 3</span><button className="restart" onClick={restart}>↻ <span>New game</span></button></div></header>
    <main className="stage"><div className="scene" ref={host}/>
      <div className="stage-label">THE SUNNY VALLEY COLLECTION <span>✦</span> 001</div>
      <div className="progress"><span className="progress-title">Your puzzle</span><strong>{count} <small>/ 9 pieces</small></strong><div className="progress-track"><div style={{width:`${count/9*100}%`}}/></div></div>
      {complete&&<div className="modal-backdrop"><section className="complete-card"><div className="complete-star">★</div><h2>Beautifully done!</h2><p>You put the sunny valley back together.</p><button onClick={restart}>Play again ↻</button></section></div>}
    </main>
    <footer><span>✦ Pick up a piece and find its happy place.</span><span>Made with Three.js + ThreeShell</span></footer>
  </div>
}
