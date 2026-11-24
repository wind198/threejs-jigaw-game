import { pieceRadius, type PlayroomLayout, type Slot, type Tray } from './playroom-layout';
import { settleStack } from './stack-layout';
import { RESTING_Y } from '../geometry/piece-dimensions';
function random(seed:number) {
  let state=seed>>>0;
  return ()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
}
/** Choose grid dimensions maximizing minimum center spacing; overlap is permitted. */
function scatterTray(tray:Tray,count:number,r:number,rand:()=>number):Slot[] {
  if(!count)return [];
  const spanX=Math.max(0,tray.width-2*r),spanZ=Math.max(0,tray.depth-2*r);
  let columns=1,best=-Infinity;
  for(let c=1;c<=count;c++){
    const rows=Math.ceil(count/c);
    const dx=c>1?spanX/(c-1):Infinity,dz=rows>1?spanZ/(rows-1):Infinity;
    const score=Math.min(dx,dz);
    if(score>best){best=score;columns=c;}
  }
  const rows=Math.ceil(count/columns);
  return Array.from({length:count},(_,i)=>{
    const row=Math.floor(i/columns),col=i%columns,rowCount=Math.min(columns,count-row*columns);
    const dx=rowCount>1?spanX/(rowCount-1):0,dz=rows>1?spanZ/(rows-1):0;
    const jitter=(step:number)=>Math.min(r*.12,step*.10)*(rand()*2-1);
    const x=Math.max(-spanX/2,Math.min(spanX/2,(col-(rowCount-1)/2)*dx+jitter(dx)));
    const z=Math.max(-spanZ/2,Math.min(spanZ/2,(row-(rows-1)/2)*dz+jitter(dz)));
    return {x:tray.x+x,z:tray.z+z,y:RESTING_Y};
  });
}
export function scatterPieces(layout:PlayroomLayout,size:number,ids:readonly number[],seed:number):Map<number,Slot> {
  const rand=random(seed),order=[...ids];
  for(let i=order.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
  const result=new Map<number,Slot>(),r=pieceRadius(size);
  let offset=0;
  for(let i=0;i<layout.trays.length;i++){
    const count=Math.ceil((order.length-offset)/(layout.trays.length-i));
    const slots=scatterTray(layout.trays[i],count,r,rand);
    slots.forEach((slot,j)=>result.set(order[offset+j],{...slot,y:.09+(offset+j)*.20}));
    offset+=count;
  }
  return result;
}
