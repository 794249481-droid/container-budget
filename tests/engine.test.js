const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../engine');
const c={l:10,w:10,h:10,maxWeight:100};
const g=(props={})=>({name:'box',l:5,w:5,h:5,weight:2,qty:8,price:3,...props});
const costs={freight:100,originFee:10,destFee:20,otherFee:5,insurance:2,goodsValue:null};
test('rejects invalid dimensions, quantities, weights, costs and excessive totals',()=>{
  for (const item of [g({qty:1.5}),g({qty:-1}),g({qty:5001}),g({l:0}),g({weight:-1}),g({price:Infinity})]) assert.throws(()=>E.validate(c,[item],costs));
  assert.throws(()=>E.validate({...c,l:0},[g()],costs));
  assert.throws(()=>E.validate(c,[g()],{...costs,freight:-1}));
});
test('packing respects bounds, non-overlap, weight and required rotation',()=>{
  const goods=[g({l:8,w:3,h:4,qty:12,weight:10}),g({l:11,w:1,qty:1}),g({l:2,w:2,h:2,qty:3})];
  const r=E.pack(c,goods); assert.ok(r.placed.length>0);assert.ok(r.totalW<=c.maxWeight);assert.equal(r.counts[1],0);
  for(const a of r.placed){assert.ok(a.x>=0&&a.x+a.a<=c.l&&a.z>=0&&a.z+a.b<=c.w&&a.y>=0&&a.y+a.h<=c.h)}
  for(let i=0;i<r.placed.length;i++)for(let j=i+1;j<r.placed.length;j++){const a=r.placed[i],b=r.placed[j];assert.ok(a.x+a.a<=b.x||b.x+b.a<=a.x||a.z+a.b<=b.z||b.z+b.b<=a.z||a.y+a.h<=b.y||b.y+b.h<=a.y)}
  const r2=E.pack({...c,l:4,w:10},[g({l:8,w:3,qty:1})]);assert.equal(r2.placed.length,1);assert.equal(r2.placed[0].a,3);
});
test('insurance uses loaded value only when declared value is blank; zero is explicit',()=>{
  const goods=[g()],r=E.pack(c,goods),b=E.calculateCosts(goods,r,costs);assert.equal(b.cargoValue,24);assert.equal(b.insurance,.48);assert.equal(b.total,135.48);
  assert.equal(E.calculateCosts(goods,r,{...costs,goodsValue:0}).insurance,0);
  assert.equal(E.calculateCosts([],E.pack(c,[]),costs).perPiece,null);
});
test('CSV escapes formulas, quotation marks and newlines',()=>{
  const out=E.csv([['=1+1',' \t@cmd','name "quoted"\nnext',42]]);assert.match(out,/"'=1\+1"/);assert.match(out,/"' \t@cmd"/);assert.match(out,/"name ""quoted""\nnext"/);assert.match(out,/"42"/);
});
