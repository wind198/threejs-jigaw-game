/** Renderer-agnostic jigsaw domain. Screen-oriented points: x right, y down. */
export type Point={x:number;y:number};
export type Segment={kind:'line';p0:Point;p1:Point}|{kind:'cubic';p0:Point;p1:Point;p2:Point;p3:Point};
export type PieceDefinition={id:number;row:number;col:number;outline:Segment[];target:{x:number;y:number}};
export type PieceStatus='resting'|'dragging'|'dropping'|'snapping'|'locked';
const line=(p0:Point,p1:Point):Segment=>({kind:'line',p0,p1});
const lerp=(a:Point,b:Point,t:number):Point=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
function reverse(segments:Segment[]):Segment[]{return [...segments].reverse().map(s=>s.kind==='line'?line(s.p1,s.p0):{kind:'cubic',p0:s.p3,p1:s.p2,p2:s.p1,p3:s.p0})}
function hash(seed:number){return (seed>>>0)||1}
function seeded(seed:number){let s=hash(seed);return ()=>{s=(s+0x6d2b79f5)>>>0;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296}}
/** A shared, symmetric Bezier profile is reversed for adjacent pieces. */
export function edgeProfile(start:Point,end:Point,polarity:-1|1):Segment[]{
  const dx=end.x-start.x,dy=end.y-start.y,length=Math.hypot(dx,dy),nx=-dy/length*polarity,ny=dx/length*polarity;
  const at=(t:number,d=0):Point=>{const p=lerp(start,end,t);return{x:p.x+nx*d,y:p.y+ny*d}};
  const depth=length*.26;
  const pts=[at(0),at(.31),at(.35,depth*.12),at(.30,depth*.80),at(.42,depth),at(.5,depth),at(.58,depth),at(.70,depth*.80),at(.65,depth*.12),at(.69),at(1)];
  return [line(pts[0],pts[1]),
   {kind:'cubic',p0:pts[1],p1:pts[2],p2:pts[3],p3:pts[4]},
   {kind:'cubic',p0:pts[4],p1:pts[4],p2:pts[5],p3:pts[5]},
   {kind:'cubic',p0:pts[5],p1:pts[5],p2:pts[6],p3:pts[6]},
   {kind:'cubic',p0:pts[6],p1:pts[7],p2:pts[8],p3:pts[9]},line(pts[9],pts[10])];
}
export function generatePieces(rows=3,cols=3,size=6,seed=2026):PieceDefinition[]{
  if(!Number.isInteger(rows)||rows<1||!Number.isInteger(cols)||cols<1||size<=0)throw Error('Invalid puzzle dimensions');
  const random=seeded(seed),cw=size/cols,ch=size/rows;
  const h=Array.from({length:Math.max(0,rows-1)},(_,r)=>Array.from({length:cols},(_,c)=>edgeProfile({x:c*cw,y:(r+1)*ch},{x:(c+1)*cw,y:(r+1)*ch},random()<.5?-1:1)));
  const v=Array.from({length:rows},(_,r)=>Array.from({length:Math.max(0,cols-1)},(_,c)=>edgeProfile({x:(c+1)*cw,y:r*ch},{x:(c+1)*cw,y:(r+1)*ch},random()<.5?-1:1)));
  const pieces:PieceDefinition[]=[];
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    const tl={x:c*cw,y:r*ch},tr={x:(c+1)*cw,y:r*ch},br={x:(c+1)*cw,y:(r+1)*ch},bl={x:c*cw,y:(r+1)*ch};
    const top=r===0?[line(tl,tr)]:h[r-1][c];
    const right=c===cols-1?[line(tr,br)]:v[r][c];
    const bottom=r===rows-1?[line(bl,br)]:h[r][c];
    const left=c===0?[line(tl,bl)]:v[r][c-1];
    pieces.push({id:pieces.length,row:r,col:c,outline:[...top,...right,...reverse(bottom),...reverse(left)],target:{x:(c+.5)*cw,y:(r+.5)*ch}})
  }
  return pieces;
}
export class PuzzleSession{
  private readonly states:PieceStatus[];
  readonly pieces:readonly PieceDefinition[];
  constructor(pieces:readonly PieceDefinition[]){this.pieces=pieces;this.states=pieces.map(()=>'resting')}
  getState(id:number){if(id<0||id>=this.states.length)throw Error('Unknown piece');return this.states[id]}
  transition(id:number,to:PieceStatus){const from=this.getState(id);
    const allowed:Record<PieceStatus,PieceStatus[]>={resting:['dragging'],dragging:['dropping','snapping'],dropping:['resting'],snapping:['locked'],locked:[]};
    if(!allowed[from].includes(to))throw Error(`Invalid transition ${from} -> ${to}`);this.states[id]=to;
  }
  get placedCount(){return this.states.filter(s=>s==='locked').length}
  get complete(){return this.states.length>0&&this.placedCount===this.states.length}
}
export function shouldSnap(position:Point,target:Point,cellSize:number){return Math.hypot(position.x-target.x,position.y-target.y)<=cellSize*.34}
