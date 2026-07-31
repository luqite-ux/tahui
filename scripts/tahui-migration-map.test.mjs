import test from'node:test';import assert from'node:assert/strict';import{TAHUI_TENANT_ID,category,product,article}from'./tahui-migration-map.mjs';const m=new Map([['x','https://r2/x.jpg']]);
test('maps multilingual product',()=>{const r=product({_id:'p',slug:'p',name:'EN',nameZh:'中',nameFr:'FR',categoryId:'c',description:'D',images:[{url:'x'}]},TAHUI_TENANT_ID,m,1);assert.equal(r.name_i18n.zh,'中');assert.equal(r.image_url,'https://r2/x.jpg')});
test('maps portable article',()=>{const r=article({slug:'a',title:'A',body:[{_type:'block',style:'h2',children:[{text:'Head',marks:['strong']}]}],coverImageUrl:'x',publishedAt:'2026-01-01'},TAHUI_TENANT_ID,m);assert.match(r.content,/<h2><strong>Head/)});
test('guards tenant',()=>assert.throws(()=>category({id:'c'},'bad',m,1),/foreign/));
