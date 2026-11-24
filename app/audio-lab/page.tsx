import type { Metadata } from 'next';
import { AudioLab } from '../../src/audio/audio-lab';
export const metadata: Metadata = { title:'Audio audition lab', robots:{index:false,follow:false} };
export default function Page(){return <AudioLab/>;}
