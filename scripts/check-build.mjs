import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
const pages=['rent','listings','alerts','guide','guide/true-monthly-cost','guide/viewing-checklist','guide/moving-in','guide/choosing-an-area','guide/first-rental','guide/living-and-moving-again','tools','help','tenants','_not-found'];
const root=resolve('.next/server/app');
let checkedLinks=0;
for(const page of pages){
  const html=readFileSync(resolve(root,`${page}.html`),'utf8');
  assert.match(html,/id="main"/,`${page} needs a main-content target`);
  assert.match(html,/<title>[^<]*Prospera Rent/,`${page} needs brand metadata`);
  assert.doesNotMatch(html,/Create Next App|Under construction\./,`${page} contains starter copy`);
  for(const [,href] of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)){
    if(!href.startsWith('/')||href.startsWith('//'))continue;
    const pathname=href.split(/[?#]/)[0];
    assert.ok(pathname==='/'||existsSync(resolve(root,`${pathname.slice(1)}.html`))||pathname.startsWith('/listings/'),`${page} has an unresolved local link: ${href}`);
    checkedLinks++;
  }
}
const homepage=readFileSync(resolve(root,'rent.html'),'utf8');
assert.match(homepage,/Find my next home/);
assert.match(homepage,/prefers-reduced-motion|stylesheet/);
console.log(`Checked ${pages.length} generated pages and ${checkedLinks} internal links.`);
