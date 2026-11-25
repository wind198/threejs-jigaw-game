import * as THREE from 'three';
export const ARTWORK_TIMEOUT_MS=15000;
export async function loadPuzzleImage(path:string,signal?:AbortSignal):Promise<HTMLImageElement>{
 signal?.throwIfAborted();
 const image=new Image();
 let timer:ReturnType<typeof setTimeout>|undefined;
 let abort:(()=>void)|undefined;
 try{
  image.src=path;
  await Promise.race([image.decode(),new Promise<never>((_,reject)=>{
   timer=setTimeout(()=>reject(new Error('Artwork decode timed out')),ARTWORK_TIMEOUT_MS);
   abort=()=>reject(signal?.reason??new DOMException('Artwork loading aborted','AbortError'));
   signal?.addEventListener('abort',abort,{once:true});
   if(signal?.aborted)abort();
  })]);
  if(!image.naturalWidth||!image.naturalHeight)throw new Error('Artwork has no pixels');
  return image;
 }catch(error){image.removeAttribute('src');throw new Error('Puzzle artwork failed to load: '+path,{cause:error});}
 finally{clearTimeout(timer);if(abort)signal?.removeEventListener('abort',abort);}
}
/** Never expose procedural art for a configured path. */
export async function createPuzzleArtwork(imagePath?:string,signal?:AbortSignal):Promise<THREE.CanvasTexture>{
 signal?.throwIfAborted();
 const image=imagePath===undefined?undefined:await loadPuzzleImage(imagePath,signal);
 signal?.throwIfAborted();
 const canvas=document.createElement('canvas');
 canvas.width=image?.naturalWidth??1024;canvas.height=image?.naturalHeight??1024;
 const ctx=canvas.getContext('2d',{colorSpace:'srgb'});if(!ctx)throw new Error('Canvas 2D unavailable');
 if(image)ctx.drawImage(image,0,0);
 else{
  const gradient=ctx.createLinearGradient(0,0,1024,1024);
  gradient.addColorStop(0,'#bcebf2');gradient.addColorStop(1,'#f5c6ad');
  ctx.fillStyle=gradient;ctx.fillRect(0,0,1024,1024);
  ctx.fillStyle='#ffe6a0';ctx.beginPath();ctx.arc(720,300,160,0,Math.PI*2);ctx.fill();
 }
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;return texture;
}
