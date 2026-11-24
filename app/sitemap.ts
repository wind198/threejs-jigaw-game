import type { MetadataRoute } from 'next';
import { indexablePages } from '../src/seo/catalog';
import { absoluteUrl, siteUrl } from '../src/seo/site';
export const dynamic='force-static';
export default function sitemap():MetadataRoute.Sitemap {
 if(!siteUrl)return [];
 return indexablePages().map(page=>({url:absoluteUrl(page.path)!,...(page.image?{images:[absoluteUrl(page.image)!]}:{})}));
}
