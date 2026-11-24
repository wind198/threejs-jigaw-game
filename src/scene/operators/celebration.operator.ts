import * as THREE from 'three';
import type { SceneResources } from '../resources/scene-resources';
import type { PuzzleStore } from '../state/puzzle-store';
import type { FrameContext } from '@three-shell/core';
import { LOCKED_Y, PIECE_DEPTH, PIECE_BEVEL } from '../geometry/piece-dimensions';
/** One soft diagonal glass-like highlight, clipped to the completed six-unit picture. */
export class CelebrationOperator {
 private elapsed=0;
 private readonly mesh:THREE.Mesh<THREE.PlaneGeometry,THREE.ShaderMaterial>;
 constructor(private readonly resources:SceneResources,private readonly store:PuzzleStore){
   const material=new THREE.ShaderMaterial({
     transparent:true,depthWrite:false,depthTest:true,uniforms:{progress:{value:0}},
     vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
     fragmentShader:'varying vec2 vUv; uniform float progress; void main(){float d=abs(vUv.x+vUv.y*0.42-mix(-0.35,1.77,progress));float glow=1.0-smoothstep(0.02,0.24,d);gl_FragColor=vec4(1.0,0.98,0.86,glow*0.48);}'
   });
   this.mesh=new THREE.Mesh(new THREE.PlaneGeometry(6,6),material);
   this.mesh.rotation.x=-Math.PI/2;this.mesh.position.y=LOCKED_Y+PIECE_DEPTH+PIECE_BEVEL+.006;this.mesh.visible=false;this.mesh.renderOrder=10;resources.scene.add(this.mesh);
 }
 advance(ctx:FrameContext){
   if(!this.store.session.complete||this.store.config.animationsEnabled?.()===false){this.mesh.visible=false;return;}
   this.elapsed+=ctx.dt;
   this.mesh.visible=this.elapsed>=.30&&this.elapsed<1.95;
   this.mesh.material.uniforms.progress.value=Math.max(0,Math.min(1,(this.elapsed-.30)/1.65));
 }
 onSceneDestroy(){this.resources.scene.remove(this.mesh);this.mesh.geometry.dispose();this.mesh.material.dispose();}
}
