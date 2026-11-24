import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import { indexablePages } from '../src/seo/catalog.ts';
const site=new URL(process.env.NEXT_PUBLIC_SITE_URL);
const sitemap=readFileSync('out/sitemap.xml','utf8');
const catalog=readFileSync('out/puzzles/index.html','utf8');
const titles=new Set();
for(const page of indexablePages()){
 const html=readFileSync('out'+page.path+'index.html','utf8');
 const canonical=new URL(page.path,site).href;
 assert.ok(html.includes('rel="canonical" href="'+canonical+'"')||html.includes('href="'+canonical+'" rel="canonical"'),canonical);
 assert.ok(sitemap.includes('<loc>'+canonical+'</loc>'),canonical);
 const title=html.match(/<title>(.*?)<\/title>/)?.[1];assert.ok(title&&!titles.has(title),canonical);titles.add(title);
 assert.ok(!/<meta name="robots" content="[^"]*noindex/.test(html),canonical);
 if(page.image){assert.ok(html.includes('src="'+page.image+'"'),page.path);assert.ok(catalog.includes('href="'+page.path+'"'),page.path);assert.ok(existsSync('out'+page.image),page.image);}
}
assert.ok(!sitemap.includes('/parents/'));
assert.ok(readFileSync('out/parents/index.html','utf8').includes('noindex'));
assert.ok(readFileSync('out/robots.txt','utf8').includes(new URL('/sitemap.xml',site).href));
assert.ok(existsSync('out/favicon.png'));
console.log('SEO export verified:',titles.size,'pages');
