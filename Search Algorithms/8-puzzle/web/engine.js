/* 8-puzzle search engine, independent of the DOM. */
const Puzzle = (function puzzleEngine(){
 const goal="123456780", dirs=[[-1,0,"Up","↑"],[1,0,"Down","↓"],[0,-1,"Left","←"],[0,1,"Right","→"]];
 const valid=s=>typeof s==="string"&&s.length===9&&[...s].sort().join("")==="012345678";
 function inversions(s){if(!valid(s))throw Error("Invalid board");let a=[...s].filter(x=>x!=="0"),n=0;for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++)if(a[i]>a[j])n++;return n}
 function moves(s){let b=s.indexOf("0"),r=Math.floor(b/3),c=b%3;return dirs.flatMap(([dr,dc,dir,arrow])=>{let y=r+dr,x=c+dc;if(y<0||y>2||x<0||x>2)return [];let j=y*3+x,a=[...s],tile=+a[j];[a[b],a[j]]=[a[j],a[b]];return [{state:a.join(""),dir,arrow,tile,from:j,to:b}]})}
 function heuristic(s,kind="manhattan"){let h=0;for(let i=0;i<9;i++){let t=+s[i];if(!t)continue;let j=t-1;h+=kind==="misplaced"?+(i!==j):Math.abs(Math.floor(i/3)-Math.floor(j/3))+Math.abs(i%3-j%3)}return h}
 function scramble(steps=12,rng=Math.random){let s=goal,prev=null;for(let i=0;i<steps;i++){let a=moves(s).filter(m=>m.state!==prev),m=a[Math.floor(rng()*a.length)];prev=s;s=m.state}return s}
 class Heap{constructor(compare){this.a=[];this.c=compare}get size(){return this.a.length}push(x){let a=this.a,i=a.length;a.push(x);while(i){let p=(i-1)>>1;if(this.c(a[p],x)<=0)break;a[i]=a[p];i=p}a[i]=x}pop(){let a=this.a,root=a[0],x=a.pop();if(a.length){let i=0;while(2*i+1<a.length){let j=2*i+1;if(j+1<a.length&&this.c(a[j+1],a[j])<0)j++;if(this.c(x,a[j])<=0)break;a[i]=a[j];i=j}a[i]=x}return root}}
 function route(node){let a=[];while(node){a.push(node);node=node.parent}return a.reverse()}
 function* search(start,algorithm="astar",kind="manhattan",budget=200000){
 if(!valid(start))throw Error("Invalid board");
 if(inversions(start)%2){yield {status:"unsolvable",expansions:0,frontier:0,generated:0};return}
 let id=0,expansions=0,generated=0,iterations=algorithm==="ids"?32:1;
 const root=()=>({id:id++,state:start,g:0,h:heuristic(start,kind),parent:null,move:null});
 for(let limit=0;limit<iterations;limit++){
 let first=root(),stack=[first],head=0,heap=new Heap((a,b)=>score(a)-score(b)||a.h-b.h||a.id-b.id),best=new Map([[start,0]]);
 const priority=["astar","greedy","ucs"].includes(algorithm),dfs=algorithm==="dfs"||algorithm==="ids";
 function score(n){return algorithm==="greedy"?n.h:algorithm==="astar"?n.g+n.h:n.g}
 if(priority)heap.push(first);generated++;
 const size=()=>priority?heap.size:stack.length-(dfs?0:head);
 yield {status:"start",node:first,children:[],expansions,generated,frontier:size(),limit:algorithm==="ids"?limit:null};
 while(size()){
 let n=priority?heap.pop():dfs?stack.pop():stack[head++];
 if(priority&&best.get(n.state)!==n.g)continue;
 if(n.state===goal){yield {status:"solved",node:n,children:[],path:route(n),expansions,generated,frontier:size(),limit:algorithm==="ids"?limit:null};return}
 if(expansions>=budget){yield {status:"budget",node:n,children:[],expansions,generated,frontier:size(),limit:algorithm==="ids"?limit:null};return}
 expansions++;let children=[],eligible=[];
 if(algorithm!=="ids"||n.g<limit){
 for(const m of moves(n.state)){
 let g=n.g+1,duplicate=algorithm==="ids"?route(n).some(p=>p.state===m.state):best.has(m.state)&&(!priority||best.get(m.state)<=g);
 let child={id:id++,state:m.state,g,h:heuristic(m.state,kind),parent:n,move:m,duplicate};children.push(child);
 if(!duplicate){if(algorithm!=="ids")best.set(m.state,g);eligible.push(child);generated++}
 }
 if(priority)for(const c of eligible)heap.push(c);
 else if(dfs)stack.push(...eligible.reverse());else stack.push(...eligible);
 }
 yield {status:"expand",node:n,children,expansions,generated,frontier:size(),limit:algorithm==="ids"?limit:null};
 }
 }
 yield {status:"exhausted",expansions,generated,frontier:0};
 }
 return {goal,valid,inversions,moves,heuristic,scramble,search,route};
})();
if(typeof module!=='undefined')module.exports=Puzzle;
