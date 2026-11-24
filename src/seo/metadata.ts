import type { Metadata } from 'next';
import { SITE_NAME, absoluteUrl } from './site';
export function pageMetadata({title,description,path,image}:{title:string;description:string;path:string;image?:string}):Metadata {
 const canonical=absoluteUrl(path),imageUrl=image?absoluteUrl(image):undefined;
 return {title,description,...(canonical?{alternates:{canonical}}:{}),openGraph:{type:'website',siteName:SITE_NAME,title,description,...(canonical?{url:canonical}:{}),...(imageUrl?{images:[{url:imageUrl,alt:title}]}:{})},twitter:{card:imageUrl?'summary_large_image':'summary',title,description,...(imageUrl?{images:[imageUrl]}:{})}};
}
