import { HomePage } from '../src/ui/pages/HomePage';
import { pageMetadata } from '../src/seo/metadata';
import { SITE_DESCRIPTION } from '../src/seo/site';
import { heroPuzzle } from '../src/content/collections';
export const metadata=pageMetadata({title:'Free Online Jigsaw Puzzles for Kids',description:SITE_DESCRIPTION,path:'/',image:heroPuzzle.image});
export default function Page(){return <HomePage/>;}
