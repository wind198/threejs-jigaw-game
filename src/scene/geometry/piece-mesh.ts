import * as THREE from 'three';
import type {PieceDefinition} from '../../domain/puzzle';
/** Converts 2D board coordinates to extruded XZ meshes, normal facing +Y. */
export function createPieceMesh(piece:PieceDefinition,texture:THREE.Texture):THREE.Mesh{
  const outline=piece.outline;const first=outline[0].p0;
  const shape=new THREE.Shape();shape.moveTo(first.x-3,3-first.y);
  for(const seg of outline){if(seg.kind==='line')shape.lineTo(seg.p1.x-3,3-seg.p1.y);
    else shape.bezierCurveTo(seg.p1.x-3,3-seg.p1.y,seg.p2.x-3,3-seg.p2.y,seg.p3.x-3,3-seg.p3.y);
  }shape.closePath();
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:.16,bevelEnabled:true,bevelThickness:.018,bevelSize:.014,bevelSegments:2,curveSegments:12,steps:1});
  // ExtrudeGeometry's generated UVs reference shape coordinates. Normalize across shared board image.
  const pos=geometry.attributes.position;const uv=geometry.attributes.uv;
  for(let i=0;i<pos.count;i++){
    const x=pos.getX(i),y=pos.getY(i);
    uv.setXY(i,(x+3)/6,(y+3)/6);
  }uv.needsUpdate=true;
  const face=new THREE.MeshStandardMaterial({map:texture,color:0xffffff,roughness:.73,metalness:0,side:THREE.DoubleSide});
  const edge=new THREE.MeshStandardMaterial({color:0xedd8ae,roughness:.86,side:THREE.DoubleSide});
  const mesh=new THREE.Mesh(geometry,[face,edge]);
  geometry.translate(-(piece.target.x-3),-(3-piece.target.y),0);
  mesh.rotation.x=-Math.PI/2;
  mesh.position.set(piece.target.x-3,.14,piece.target.y-3);
  mesh.castShadow=true;mesh.receiveShadow=true;mesh.userData.pieceId=piece.id;
  return mesh;
}
