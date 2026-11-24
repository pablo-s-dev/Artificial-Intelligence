const assert=require('node:assert/strict');
const P=require('./engine.js');
const last=(...args)=>{let f;for(const x of P.search(...args))f=x;return f};
assert.equal(P.moves('123405678').length,4);
assert.equal(P.moves(P.goal).length,2);
assert.equal(P.heuristic('123456708'),1);
assert.equal(P.heuristic('123456708','misplaced'),1);
assert.equal(last('213456780').status,'unsolvable');
for(const a of ['astar','bfs','ucs','ids','greedy']){
 const r=last('123406758',a);
 assert.equal(r.status,'solved');assert.equal(r.node.g,2);
 for(let i=1;i<r.path.length;i++)assert.ok(P.moves(r.path[i-1].state).some(m=>m.state===r.path[i].state));
}
assert.equal(last('867254301','astar').node.g,31);
assert.equal(last(P.goal).node.g,0);
console.log('8-puzzle regression tests passed');
