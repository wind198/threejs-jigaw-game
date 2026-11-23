import * as THREE from 'three';
/** Offline-friendly illustrated image; one texture shared by all piece meshes. */
export function createPuzzleArtwork():THREE.CanvasTexture{
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=1024;
  const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas 2D unavailable');
  const sky=ctx.createLinearGradient(0,0,0,1024);sky.addColorStop(0,'#bcebf2');sky.addColorStop(.67,'#ffe9bd');sky.addColorStop(1,'#f5c6ad');
  ctx.fillStyle=sky;ctx.fillRect(0,0,1024,1024);
  ctx.fillStyle='#fff2bb';ctx.beginPath();ctx.arc(740,265,125,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#f4ab9b';ctx.beginPath();ctx.moveTo(0,720);ctx.bezierCurveTo(185,410,330,490,495,735);ctx.bezierCurveTo(620,535,810,550,1024,680);ctx.lineTo(1024,1024);ctx.lineTo(0,1024);ctx.fill();
  ctx.fillStyle='#a8cbaa';ctx.beginPath();ctx.moveTo(0,760);ctx.bezierCurveTo(180,625,300,600,465,840);ctx.bezierCurveTo(730,615,910,720,1024,790);ctx.lineTo(1024,1024);ctx.lineTo(0,1024);ctx.fill();
  ctx.fillStyle='#5a958c';ctx.beginPath();ctx.moveTo(0,900);ctx.bezierCurveTo(260,810,400,890,635,845);ctx.bezierCurveTo(800,805,920,920,1024,855);ctx.lineTo(1024,1024);ctx.lineTo(0,1024);ctx.fill();
  for(const [x,y,r] of [[135,175,18],[325,200,10],[420,95,13],[880,115,13],[592,365,8]]){
    ctx.fillStyle='#fffdf5';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
  }
  // Tiny pink cabin and trees, drawn inside the same continuous board image.
  ctx.fillStyle='#fff6de';ctx.fillRect(365,615,135,115);
  ctx.fillStyle='#dc7b74';ctx.beginPath();ctx.moveTo(340,620);ctx.lineTo(430,545);ctx.lineTo(525,620);ctx.closePath();ctx.fill();
  ctx.fillStyle='#7b9d98';ctx.fillRect(408,660,38,70);
  for(const [x,y,s] of [[150,635,1],[215,715,.8],[735,710,1.1],[890,635,.9]]){
    ctx.fillStyle='#8b7054';ctx.fillRect(x-8*s,y,16*s,115*s);
    ctx.fillStyle='#4d8e7c';ctx.beginPath();ctx.arc(x,y,52*s,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#6db39a';ctx.beginPath();ctx.arc(x-14*s,y-16*s,32*s,0,Math.PI*2);ctx.fill();
  }
  const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=8;return tex;
}
