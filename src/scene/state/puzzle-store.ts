import * as THREE from 'three';
import {generatePieces,PuzzleSession,type PieceDefinition} from '../../domain/puzzle';
export type PieceRuntime={definition:PieceDefinition;mesh:THREE.Mesh;home:THREE.Vector3;target:THREE.Vector3};
export class PuzzleStore{
  session=new PuzzleSession(generatePieces());
  pieces:PieceRuntime[]=[];
  active:number|null=null;
  callbacks:{onProgress:(count:number)=>void;onComplete:()=>void}={onProgress:()=>{},onComplete:()=>{}};
  reset(){this.session=new PuzzleSession(generatePieces());this.pieces=[];this.active=null;this.callbacks.onProgress(0)}
}
