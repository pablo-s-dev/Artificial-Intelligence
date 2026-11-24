const assert = require('node:assert/strict');
const {run,path}=require('./algorithms.js');
const dag={s:{a:2,b:6},a:{b:3,c:7},b:{c:1},c:{}};
const negative={s:{a:1},a:{b:-3},b:{a:1,c:2},c:{},x:{}};
const heapGraph={s:{a:10,b:1},a:{c:1},b:{a:1,c:8},c:{}};
const last=(...args)=>Array.from(run(...args)).at(-1);
for(const a of ['dag-min','bellman','bellman-sync','dijkstra','ucs']){
  const r=last(dag,a,'s','c');
  assert.equal(r.d.c,6,a);
  assert.deepEqual(path(r.p,'s','c'),['s','a','b','c']);
}
assert.equal(last(dag,'dag-max','s','c').d.c,9);
assert.equal(last(dag,'dag-count','s','c').d.c,3);
assert.equal(last(dag,'ids','s','c').depth,2);
assert.equal(last(dag,'bfs','s','c').depth,2);
assert.equal(last(negative,'bellman-sync','s','c').d.c,-Infinity);
assert.equal(last(negative,'bellman','x','c').d.c,Infinity);
assert.equal(last(negative,'floyd','s','c').D[0][3],-Infinity);
assert.equal(last(negative,'floyd','s','c').D[4][3],Infinity);
assert.equal(last(negative,'topo','s','c').error,true);
assert.equal(last(negative,'dijkstra','s','c').error,true);
const f=last(dag,'floyd','s','c');
assert.equal(f.D[0][3],6);
assert.deepEqual(path(Object.fromEntries(f.vs.map((v,i)=>[v,f.P[0][i]])),'s','c'),['s','a','b','c']);
for(const a of ['ucs','dijkstra','bellman','bellman-sync'])assert.equal(last(heapGraph,a,'s','c').d.c,3,a);
const forward=Array.from(run(dag,'bellman-sync','s','c'));
const reversed=Array.from(run(dag,'bellman-sync','s','c',true));
assert.deepEqual(forward.at(-1).rows,reversed.at(-1).rows);
console.log('Graph algorithm regression tests passed.');
