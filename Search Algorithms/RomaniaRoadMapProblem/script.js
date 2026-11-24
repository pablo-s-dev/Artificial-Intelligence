const romania_map_nodes = {
    'Arad': [91, 492],
    'Bucharest': [400, 327],
    'Craiova': [253, 288],
    'Drobeta': [165, 299],
    'Eforie': [562, 293],
    'Fagaras': [305, 449],
    'Giurgiu': [375, 270],
    'Hirsova': [534, 351],
    'Iasi': [473, 506],
    'Lugoj': [165, 379],
    'Mehadia': [168, 339],
    'Neamt': [406, 537],
    'Oradea': [131, 571],
    'Pitesti': [320, 368],
    'Rimnicu': [233, 410],
    'Sibiu': [207, 457],
    'Timisoara': [94, 410],
    'Urziceni': [456, 350],
    'Vaslui': [509, 444],
    'Zerind': [108, 531]
}

const romania_graph = {
    'Arad': {
        'Zerind': 75,
        'Sibiu': 140,
        'Timisoara': 118
    },
    'Bucharest': {
        'Urziceni': 85,
        'Pitesti': 101,
        'Giurgiu': 90,
        'Fagaras': 211
    },
    'Craiova': {
        'Drobeta': 120,
        'Rimnicu': 146,
        'Pitesti': 138
    },
    'Drobeta': {
        'Mehadia': 75,
        'Craiova': 120
    },
    'Eforie': {
        'Hirsova': 86
    },
    'Fagaras': {
        'Sibiu': 99,
        'Bucharest': 211
    },
    'Hirsova': {
        'Urziceni': 98,
        'Eforie': 86
    },
    'Iasi': {
        'Vaslui': 92,
        'Neamt': 87
    },
    'Lugoj': {
        'Timisoara': 111,
        'Mehadia': 70
    },
    'Oradea': {
        'Zerind': 71,
        'Sibiu': 151
    },
    'Pitesti': {
        'Rimnicu': 97,
        'Bucharest': 101,
        'Craiova': 138
    },
    'Rimnicu': {
        'Sibiu': 80,
        'Craiova': 146,
        'Pitesti': 97
    },
    'Urziceni': {
        'Vaslui': 142,
        'Bucharest': 85,
        'Hirsova': 98
    },
    'Zerind': {
        'Arad': 75,
        'Oradea': 71
    },
    'Sibiu': {
        'Arad': 140,
        'Fagaras': 99,
        'Oradea': 151,
        'Rimnicu': 80
    },
    'Timisoara': {
        'Arad': 118,
        'Lugoj': 111
    },
    'Giurgiu': {
        'Bucharest': 90
    },
    'Mehadia': {
        'Drobeta': 75,
        'Lugoj': 70
    },
    'Vaslui': {
        'Iasi': 92,
        'Urziceni': 142
    },
    'Neamt': {
        'Iasi': 87
    }
}

let options = {
    physics: {
        enabled: false
    },
    nodes: {
        physics: false,

        shape: 'circle',
        color: {
            border: '#848484',

            background: '#c4c4c4ff',
            highlight: {
                border: '#ffffff',
                background: '#ffffff',

            }
        },
        size: 8,
        font: {
            size: 6,
            color: '#000000',
            align: 'left'
        },
        shadow: true
    },
    edges: {
        font: {
            size: 8,
            align: 'top',
            strokeColor: 'transparent'
        },
        shadow: false,
        color: {
            color: '#e9e9e9',
            highlight: '#ffffff',
            hover: '#848484',
            opacity: 1
        },
    },
    clickToUse: true
}



const $=id=>document.getElementById(id);
const start=$('start_select'),target=$('target_select'),algorithm=$('algorithm_select'),graphSelect=$('graph_select'),step=$('step_by_step_checkbox'),go=$('find_path_btn'),reverse=$('reverse_edges');
const search=new Set(['bfs','dfs','ids','ucs','astar','greedy']);
const dag={s:{a:2,b:6},a:{b:3,c:7},b:{c:1},c:{}};
const negative={s:{a:4,b:5},a:{b:-3,c:6},b:{c:2},c:{a:4},x:{}};
const cycle={s:{a:1},a:{b:-3},b:{a:1,c:2},c:{},x:{}};
const graphs={romania:romania_graph,dag,negative,cycle};
const labels={romania:'Romania Roadmap Problem',dag:'Seminar DAG',negative:'Graph with negative edges',cycle:'Graph with a negative cycle'};
const format=v=>v===Infinity?'∞':v===-Infinity?'−∞':v==null?'—':String(v);
let g,vs,iterator=null,last=null,inspect=null,network=null;
const nodes=new vis.DataSet(),edges=new vis.DataSet();
function rebuild(){
 g=graphs[graphSelect.value];vs=Object.keys(g);
 nodes.clear();edges.clear();
 for(const [i,v] of vs.entries()){
 const pos=graphSelect.value==='romania'?romania_map_nodes[v]:[i===0?0:i===vs.length-1&&v==='x'?120:i===3?300:150,i===1?100:i===2?-100:v==='x'?-240:0];
 nodes.add({id:v,label:v,x:pos[0],y:-pos[1]});
 }
 const undirected=graphSelect.value==='romania';
 for(const u of vs)for(const [v,w] of Object.entries(g[u])){
 if(undirected&&u.localeCompare(v)>0)continue;
 edges.add({id:u+'|'+v,from:u,to:v,label:String(w),arrows:undirected?'':'to'});
 }
 for(const el of [start,target])el.replaceChildren(...vs.map(v=>new Option(v,v)));
 start.value=graphSelect.value==='romania'?'Arad':'s';
 target.value=graphSelect.value==='romania'?'Bucharest':'c';
 $('title').textContent=labels[graphSelect.value]+': Graph Algorithms';
 if(!network){network=new vis.Network($('mynetwork'),{nodes,edges},options);network.on('click',({nodes:ids})=>{if(ids.length&&last){inspect=ids[0];render(last)}})}
 network.fit({animation:false});
 configure();
}
function stat(id,value){const el=$(id);let span=el.querySelector('span');if(!span){span=document.createElement('span');span.className='result-span';el.append(span)}span.textContent=value==null?'':'\n'+value}
function controls(){
 const a=algorithm.value,heuristic=a==='astar'||a==='greedy';
 if(heuristic&&graphSelect.value==='romania')target.value='Bucharest';
 target.disabled=heuristic||!search.has(a);
 start.disabled=a==='floyd'||a==='topo';
 $('reverse_label').hidden=!a.startsWith('bellman');
 go.textContent=step.checked?'Next Step':search.has(a)?'Find Path':'Run';
}
function reset(){
 iterator=null;last=null;inspect=null;matrixSource=null;
 for(const n of nodes.get())nodes.update({id:n.id,label:n.id,color:{background:'#c4c4c4ff',border:'#848484'},font:{color:'#000000'}});
 for(const e of edges.get())edges.update({id:e.id,color:{color:'#e9e9e9'},width:1});
 for(const el of document.querySelectorAll('.result-span'))el.remove();
 $('dp_tables').replaceChildren();$('table_hint').textContent='';$('dp_panel').hidden=true;
 go.disabled=false;
}
function configure(){controls();reset()}
function table(title,headers,rows,active=null,onCell=null){
 const wrap=document.createElement('div'),heading=document.createElement('h3');heading.textContent=title;wrap.append(heading);
 const t=document.createElement('table'),head=t.createTHead().insertRow();
 for(const v of headers){const th=document.createElement('th');th.textContent=v;head.append(th)}
 const body=t.createTBody();
 rows.forEach((r,i)=>{const tr=body.insertRow();r.forEach((v,j)=>{const td=tr.insertCell();td.textContent=format(v);if(j===0)td.className='row-label';if(active&&active[0]===i&&active[1]===j-1)td.classList.add('active-cell');if(onCell&&j>0){const b=document.createElement('button');b.type='button';b.textContent=format(v);b.onclick=()=>onCell(i,j-1);td.replaceChildren(b)}})});
 wrap.append(t);$('dp_tables').append(wrap);
}
function render(r){
 last=r;const a=algorithm.value,isSearch=search.has(a),dest=inspect||target.value;
 let route=r.path||[],cost=r.cost;
 if(!isSearch&&a!=='topo'&&a!=='dag-count'&&r.d&&r.done&&!r.error){cost=r.d[dest];route=Number.isFinite(cost)?GraphAlgorithms.path(r.p,start.value,dest):[]}
 if(r.D&&r.done){const i=vs.indexOf(matrixSource||vs[0]),j=vs.indexOf(inspect||vs.at(-1));cost=r.D[i][j];route=Number.isFinite(cost)?GraphAlgorithms.path(Object.fromEntries(vs.map((v,k)=>[v,r.P[i][k]])),vs[i],vs[j]):[]}
 stat('path',route.join(' → '));stat('cost',cost===undefined?'':format(cost));stat('depth',route.length?route.length-1:r.depth);
 stat('frontier',r.frontier?.join(', '));stat('explored',r.explored?.join(', '));stat('expansions',r.expansions);stat('state',r.state|| (r.done?'Done':''));stat('action',r.action);stat('order',r.order?.join(' → '));
 for(const n of nodes.get()){
 const v=n.id,active=r.active?.includes(v),inPath=route.includes(v),bad=r.affected?.includes(v);
 let value=r.indeg?r.indeg[v]:!isSearch&&a!=='topo'&&!r.D?r.d?.[v]:undefined;
 if(r.D&&r.done)value=r.D[vs.indexOf(matrixSource||vs[0])][vs.indexOf(v)];
 nodes.update({id:v,label:value===undefined?v:v+'\n'+format(value),color:{background:bad?'#ee9393':inPath?'#b9e6bb':active?'#f8dfa2':'#c4c4c4ff',border:active?'#665000':'#848484'},font:{color:'#000000'}});
 }
 for(const e of edges.get()){
 const match=(u,v)=>e.from===u&&e.to===v||graphSelect.value==='romania'&&e.from===v&&e.to===u;
 const active=r.edge&&match(...r.edge),onPath=route.some((v,i)=>i>0&&match(route[i-1],v));
 edges.update({id:e.id,width:active||onPath?3:1,color:{color:active?'#8a5700':onPath?'#17161a':'#e9e9e9'}});
 }
 $('dp_panel').hidden=isSearch;$('dp_tables').replaceChildren();
 if(isSearch)return;
 $('table_hint').textContent=r.D?'Click a distance cell after completion to reconstruct its path.':r.done?'Click a vertex to inspect its result.':'Current intermediate state';
 if(r.D){
 const selected=r.k===undefined?null:[r.i,r.j];
 table('Distance matrix D',['from / to',...vs],r.D.map((row,i)=>[vs[i],...row]),selected,(i,j)=>{if(r.done){matrixSource=vs[i];inspect=vs[j];render(r)}});
 table('Predecessor matrix P',['from / to',...vs],r.P.map((row,i)=>[vs[i],...row]),selected);
 }else if(r.indeg){table('Kahn indegree',['Vertex','Indegree'],vs.map(v=>[v,r.indeg[v]]))}
 else if(a==='topo'){table('Topological order',['Position','Vertex'],(r.order||[]).map((v,i)=>[i+1,v]))}
 else if(r.d){table(a==='dag-count'?'Path counts':'Distances and predecessors',['Vertex','Value','Pred'],vs.map(v=>[v,r.d[v],r.p[v]]));if(r.rows)table('Completed passes',['k',...vs],r.rows.map((row,i)=>[i,...vs.map(v=>row[v])]))}
}
let matrixSource=null;
go.onclick=()=>{
 if(!iterator){matrixSource=null;iterator=GraphAlgorithms.run(g,algorithm.value,start.value,target.value,reverse.checked)}
 let result=iterator.next(),frame=result.value;
 if(!step.checked){while(!result.done&&!frame?.done){result=iterator.next();if(result.value)frame=result.value}}
 if(frame)render(frame);
 if(result.done||frame?.done){iterator=null;go.disabled=true}
};
$('reset_btn').onclick=reset;
graphSelect.onchange=rebuild;
for(const el of [start,target,algorithm,reverse])el.onchange=configure;
step.onchange=controls;
rebuild();
