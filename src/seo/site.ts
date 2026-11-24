export const SITE_NAME='Little Jigsaw 3D';
export const SITE_DESCRIPTION='Play free online jigsaw puzzles for kids with 4, 9 or 25 pieces. No ads, accounts or downloads.';
export function parseSiteUrl(value:string|undefined):URL|undefined {
  if(!value)return undefined;
  const url=new URL(value);
  if(url.protocol!=='https:'||url.username||url.password||url.pathname!=='/'||url.search||url.hash||url.hostname==='localhost'||url.hostname.endsWith('.example')||url.hostname==='example.com'||url.hostname==='example.org'||url.hostname==='example.net')throw new Error('NEXT_PUBLIC_SITE_URL must be the canonical HTTPS production origin');
  return url;
}
export const siteUrl=parseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
export function absoluteUrl(path:string){return siteUrl?new URL(path,siteUrl).href:undefined;}
