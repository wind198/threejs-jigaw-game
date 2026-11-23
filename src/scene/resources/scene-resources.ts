import * as THREE from 'three';
import {createPuzzleArtwork} from './puzzle-art';
import {createPieceMesh} from '../geometry/piece-mesh';
import {PuzzleStore} from '../state/puzzle-store';
export class SceneResources{
  readonly scene=new THREE.Scene();
  readonly camera=new THREE.OrthographicCamera(-8,8,5,-5,.1,100);
  readonly renderer:THREE.WebGLRenderer;
  readonly artwork=createPuzzleArtwork();
  readonly objects:THREE.Object3D[]=[];
  private resizeObserver:ResizeObserver;
  constructor(readonly container:HTMLElement,readonly store:PuzzleStore){
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,2));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.28;
    this.scene.background=new THREE.Color('#eaf5ef');
    this.camera.position.set(0,18,0);this.camera.up.set(0,0,-1);this.camera.lookAt(0,0,0);
    container.appendChild(this.renderer.domElement);this.renderer.domElement.style.touchAction='none';
    this.scene.add(new THREE.HemisphereLight(0xffffff,0x9d9f8f,2.4));
    const light=new THREE.DirectionalLight(0xfff5db,3.4);light.position.set(-3,12,-5);light.castShadow=true;light.shadow.mapSize.set(2048,2048);
    Object.assign(light.shadow.camera,{left:-13,right:13,top:13,bottom:-13,near:1,far:35});light.shadow.bias=-.00015;light.shadow.normalBias=.025;
    this.scene.add(light);this.objects.push(light);
    this.buildBoard();this.buildPieces();
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(container);this.resize();
  }
  private addBox(w:number,h:number,d:number,color:number,x:number,y:number,z:number,radius=0){
    void radius;const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color,roughness:.87}));mesh.position.set(x,y,z);mesh.receiveShadow=true;mesh.castShadow=true;this.scene.add(mesh);this.objects.push(mesh);return mesh;
  }
  private buildBoard(){
    this.addBox(18,.25,11.7,0xf7eee3,0,-.46,0);
    this.addBox(6.7,.32,6.7,0xad7651,0,-.20,0);
    this.addBox(6.23,.02,6.23,0xf7eaca,0,-.025,0);
    // Subtle guide lines, same board-local coordinates as the generated puzzle.
    for(let i=-1;i<=1;i+=2){this.addBox(.012,.007,6,0xd4c5a7,i,0,0);this.addBox(6,.007,.012,0xd4c5a7,0,0,i)}
    for(const [x,z,w,d] of [[-3.24,0,.19,6.6],[3.24,0,.19,6.6],[0,-3.24,6.6,.19],[0,3.24,6.6,.19]] as const)
      this.addBox(w,.24,d,0xc58c65,x,.03,z);
    // Broad side-trays provide clear places for loose pieces.
    this.addBox(3.2,.09,9.2,0xe9dbc8,-5.35,-.22,0);
    this.addBox(3.2,.09,9.2,0xe9dbc8,5.35,-.22,0);
  }
  private buildPieces(){
    this.store.pieces=this.store.session.pieces.map(def=>{
      const mesh=createPieceMesh(def,this.artwork);
      const side=def.id%2===0?-1:1;const ordinal=Math.floor(def.id/2);
      const home=new THREE.Vector3(side*5.35,.09,-3.55+ordinal*1.72);
      const target=new THREE.Vector3(def.target.x-3,.045,def.target.y-3);
      mesh.position.copy(home);this.scene.add(mesh);this.objects.push(mesh);
      return {definition:def,mesh,home,target};
    });
  }
  private resize(){const w=Math.max(1,this.container.clientWidth),h=Math.max(1,this.container.clientHeight);const aspect=w/h;
    const worldHeight=Math.max(11.9,18/aspect);this.camera.left=-worldHeight*aspect/2;this.camera.right=worldHeight*aspect/2;
    this.camera.top=worldHeight/2;this.camera.bottom=-worldHeight/2;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h)
  }
  onSceneDestroy(){this.resizeObserver.disconnect();for(const obj of this.objects){if(obj instanceof THREE.Mesh){obj.geometry.dispose();
    for(const m of Array.isArray(obj.material)?obj.material:[obj.material])m.dispose();}this.scene.remove(obj)}
    this.artwork.dispose();this.renderer.dispose();this.renderer.domElement.remove();}
}
