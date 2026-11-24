/* Pure JS generators; no DOM dependencies. */
const GraphAlgorithms = (function engine(){
const inf=Infinity;
// Indexed binary min-heap: one entry per vertex, O(log V) insert/decrease/pop.
class MinHeap {
 constructor(priority){this.a=[];this.pos=new Map();this.priority=priority}
 get length(){return this.a.length}
 swap(i,j){[this.a[i],this.a[j]]=[this.a[j],this.a[i]];this.pos.set(this.a[i],i);this.pos.set(this.a[j],j)}
 up(i){while(i>0){const p=(i-1)>>1;if(this.priority(this.a[p])<=this.priority(this.a[i]))break;this.swap(p,i);i=p}}
 set(v){if(!this.pos.has(v)){this.pos.set(v,this.a.length);this.a.push(v)}this.up(this.pos.get(v))}
 pop(){const root=this.a[0],last=this.a.pop();this.pos.delete(root);if(this.a.length){this.a[0]=last;this.pos.set(last,0);let i=0;while(true){let m=i,l=2*i+1,r=l+1;if(l<this.a.length&&this.priority(this.a[l])<this.priority(this.a[m]))m=l;if(r<this.a.length&&this.priority(this.a[r])<this.priority(this.a[m]))m=r;if(m===i)break;this.swap(i,m);i=m}}return root}
}

function path(p,s,t){let a=[],seen=new Set();for(let v=t;v!=null&&!seen.has(v);v=p[v]){a.push(v);if(v===s)return a.reverse();seen.add(v)}return []}
function* run(g,algo,s,t,reverse=false){
const vs=Object.keys(g),n=vs.length,es=vs.flatMap(u=>Object.entries(g[u]).map(([v,w])=>[u,v,w]));if(reverse)es.reverse();
const d=Object.fromEntries(vs.map(v=>[v,inf])),p=Object.fromEntries(vs.map(v=>[v,null]));d[s]=0;
const out=(action,extra={})=>({action,d:{...d},p:{...p},...extra});
if(algo==="floyd"){
 const D=vs.map((u,i)=>vs.map((v,j)=>i===j?0:inf)),P=vs.map(()=>vs.map(()=>null));
 for(const [u,v,w] of es){let i=vs.indexOf(u),j=vs.indexOf(v);if(w<D[i][j]){D[i][j]=w;P[i][j]=u}}
 const snap=(action,extra={})=>({action,vs,D:D.map(r=>r.slice()),P:P.map(r=>r.slice()),...extra});
 yield snap("Initial matrix: direct edges and zero diagonal");
 for(let k=0;k<n;k++)for(let i=0;i<n;i++)for(let j=0;j<n;j++){
 const old=D[i][j],a=D[i][k],b=D[k][j],c=a+b,changed=c<old;
 if(changed){D[i][j]=c;P[i][j]=P[k][j]}
 yield snap(`k=${vs[k]}: min(${old}, ${a} + ${b}) = ${D[i][j]}`,{k,i,j,changed,active:[vs[i],vs[k],vs[j]]});
 }
 const bad=vs.map((_,k)=>k).filter(k=>D[k][k]<0);
 const affected=D.map((r,i)=>r.map((_,j)=>bad.some(k=>D[i][k]!==inf&&D[k][j]!==inf)));
 for(let i=0;i<n;i++)for(let j=0;j<n;j++)if(affected[i][j]){D[i][j]=-inf;P[i][j]=null}
 yield snap(bad.length?"Negative cycles: affected pairs marked −∞":"All pairs solved",{done:true});return;
}
if(algo.startsWith("dag")||algo==="topo"){
 const indeg=Object.fromEntries(vs.map(v=>[v,0]));for(const [,v] of es)indeg[v]++;
 const q=vs.filter(v=>!indeg[v]),order=[];
 yield out("Kahn: enqueue vertices with indegree zero",{indeg:{...indeg},frontier:q.slice(),order:[]});
 for(let h=0;h<q.length;h++){const u=q[h];order.push(u);for(const v of Object.keys(g[u]))if(--indeg[v]===0)q.push(v);yield out(`Remove ${u}; decrement outgoing neighbors`,{indeg:{...indeg},frontier:q.slice(h+1),order:order.slice(),active:[u]})}
 if(order.length!==n){yield out("Cycle detected: topological order does not exist",{done:true,error:true});return}
 if(algo==="topo"){yield out("Topological order complete",{order,done:true});return}
 const count=algo==="dag-count",max=algo==="dag-max",unreachable=count?0:max?-inf:inf;
 for(const v of vs)d[v]=unreachable;d[s]=count?1:0;
 yield out("Initialize DP",{order,mode:count?"count":"distance"});
 for(const u of order){for(const [v,w] of Object.entries(g[u])){const old=d[v],c=count?old+d[u]:d[u]+w,changed=count?d[u]!==0:max?c>old:c<old;if(changed){d[v]=c;if(!count)p[v]=u}yield out(`${u} → ${v}: ${old} ${count?"+ "+d[u]:`vs ${d[u]} + ${w}`} = ${d[v]}`,{order,edge:[u,v],active:[u,v],changed,mode:count?"count":"distance"})}}
 yield out("DP complete",{order,done:true,mode:count?"count":"distance"});return;
}
if(algo==="bellman"||algo==="bellman-sync"){
 const sync=algo==="bellman-sync",rows=[{...d}];
 yield out("k=0: source only",{rows:rows.slice(),round:0});
 for(let k=1;k<n;k++){const prev={...d};let changed=false;for(const [u,v,w] of es){const a=sync?prev[u]:d[u],old=d[v],c=a+w,better=c<old;if(better){d[v]=c;p[v]=u;changed=true}yield out(`Pass ${k}: ${u} → ${v}; min(${old}, ${a} + ${w}) = ${d[v]}`,{rows:rows.slice(),round:k,edge:[u,v],active:[u,v],changed:better})}rows.push({...d});yield out(`Pass ${k} complete`,{rows:rows.slice(),round:k});if(!changed)break}
 const bad=new Set();for(const [u,v,w] of es)if(d[u]+w<d[v])bad.add(v);
 const q=[...bad];for(let i=0;i<q.length;i++)for(const v of Object.keys(g[q[i]]))if(!bad.has(v)){bad.add(v);q.push(v)}
 for(const v of bad){d[v]=-inf;p[v]=null}
 yield out(bad.size?"Reachable negative cycle: affected vertices marked −∞":"Extra pass: no improvement",{rows,done:true,affected:[...bad]});return;
}
const heuristic={Arad:366,Zerind:374,Timisoara:329,Sibiu:253,Oradea:380,Lugoj:244,Fagaras:176,Rimnicu:193,Mehadia:241,Drobeta:242,Craiova:160,Pitesti:98,Bucharest:0,Giurgiu:77,Eforie:161,Hirsova:151,Iasi:226,Neamt:234,Urziceni:80,Vaslui:199};
if(["ucs","dijkstra","astar","greedy"].includes(algo)&&es.some(e=>e[2]<0)){yield out("This algorithm requires nonnegative weights",{done:true,error:true});return}
if(["astar","greedy"].includes(algo)&&(t!=="Bucharest"||!vs.every(v=>v in heuristic))){yield out("Heuristic available only for Romania → Bucharest",{done:true,error:true});return}
if(algo==="ids"){
 let expansions=0;
 for(let limit=0;limit<n;limit++){const stack=[{route:[s],cost:0}];while(stack.length){const {route,cost}=stack.pop(),u=route.at(-1);expansions++;const found=u===t;if(!found&&route.length-1<limit)for(const [v,w] of Object.entries(g[u]).reverse())if(!route.includes(v))stack.push({route:[...route,v],cost:cost+w});yield out(`Depth limit ${limit}: visit ${u}`,{path:route,cost,frontier:stack.map(x=>x.route.at(-1)),state:u,expansions,depth:route.length-1,done:found});if(found)return}}
 yield out("No path",{done:true,path:[]});return;
}
const seen=new Set([s]),closed=new Set();let expansions=0;
const priority=v=>algo==="greedy"?heuristic[v]:d[v]+(algo==="astar"?heuristic[v]:0);
const heapMode=["ucs","dijkstra","astar","greedy"].includes(algo),heap=new MinHeap(priority),frontier=[s];
if(heapMode)heap.set(s);
while(heapMode?heap.length:frontier.length){
 const u=heapMode?heap.pop():algo==="dfs"?frontier.pop():frontier.shift();closed.add(u);const route=path(p,s,u),found=algo!=="dijkstra"&&u===t;
 if(!found){expansions++;for(const [v,w] of Object.entries(g[u])){let c=d[u]+w;const weighted=["ucs","dijkstra","astar"].includes(algo);if(weighted?c<d[v]:!seen.has(v)){d[v]=c;p[v]=u;seen.add(v);closed.delete(v);if(heapMode)heap.set(v);else frontier.push(v)}}}
 yield out(`Visit ${u}`,{path:route,cost:d[u],state:u,depth:route.length-1,frontier:heapMode?heap.a.slice():frontier.slice(),explored:[...closed],expansions,done:found,active:[u]});if(found)return;
}
yield out(algo==="dijkstra"?"All reachable vertices settled":"No path",{done:true,path:[],explored:[...closed],expansions});
}
return {run,path};
})();
if(typeof module !== 'undefined') module.exports = GraphAlgorithms;
