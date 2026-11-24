'use strict';
const $=id=>document.getElementById(id);
const game=$('game_view'),graph=$('graph_view'),algo=$('algorithm'),heur=$('heuristic_select'),step=$('step_by_step'),speed=$('speed');
let initial=Puzzle.scramble(12),manualMove=null,iterator=null,frame=null,selected=null,solution=null,solutionIndex=0,timer=null,running=false,finished=false;
let graphNodes,graphEdges,network,visible=new Map(),recent=[];
const opposite={Up:'↓',Down:'↑',Left:'→',Right:'←'};
function setStat(id,value){$(id).querySelector('span').textContent=value??'—'}
function active(){return selected||(solution&&solution[solutionIndex])||frame?.node||null}
function makeBoard(el,state,move,interactive=false){
 el.replaceChildren();const legal=new Map(Puzzle.moves(state).map(m=>[m.from,m]));
 for(let i=0;i<9;i++){const tile=+state[i],b=document.createElement('button');b.type='button';b.className='tile'+(tile?'':' empty')+(move&&(i===move.to||i===move.from)?' changed':'');b.textContent=tile||'';b.setAttribute('aria-label',tile?'Tile '+tile:'Empty space');b.disabled=!interactive||!legal.has(i);
 if(!b.disabled){b.classList.add('legal');b.onclick=()=>{const m=legal.get(i);reset();initial=m.state;manualMove=m;render()}}
 if(move&&i===move.to&&tile){const a=document.createElement('span');a.className='direction';a.textContent=opposite[move.dir];a.setAttribute('aria-hidden','true');b.append(a)}el.append(b)}
}
function renderGame(){
 const n=active(),state=n?.state||initial,m=n?.move||(!frame?manualMove:null);
 makeBoard($('board'),state,m,!iterator&&!running&&!finished);
 $('move_caption').textContent=m?'Tile '+m.tile+' moved '+opposite[m.dir]+' · empty cell moved '+m.arrow:state===Puzzle.goal?'Goal state reached.':'Click a tile next to the empty space.';
 $('solution_controls').hidden=!solution;
 if(solution){$('solution_index').textContent='Move '+solutionIndex+' / '+(solution.length-1);$('solution_prev').disabled=solutionIndex===0;$('solution_next').disabled=solutionIndex===solution.length-1}
}
function image(n,focus,sol){
 let bg=n.duplicate?'#b2b2b2':focus?'#f1db9c':sol?'#b9dfc5':'#c4c4c4';
 let s='<svg xmlns="http://www.w3.org/2000/svg" width="118" height="132"><rect x="2" y="2" width="114" height="128" rx="6" fill="'+bg+'" stroke="#848484" stroke-width="2"/>';
 for(let i=0;i<9;i++){let x=8+i%3*34,y=8+Math.floor(i/3)*34,t=+n.state[i],changed=n.move&&(i===n.move.from||i===n.move.to);s+='<rect x="'+x+'" y="'+y+'" width="31" height="31" rx="3" fill="'+(t?(changed?'#b9dfc5':'#e8e8e8'):'#a5a5a5')+'" stroke="'+(changed?'#6b9b7a':'#929292')+'"'+(!t?' stroke-dasharray="3 2"':'')+'/>';if(t)s+='<text x="'+(x+15.5)+'" y="'+(y+21)+'" text-anchor="middle" font-family="Helvetica,Arial" font-size="16" font-weight="600" fill="#292929">'+t+'</text>'}
 s+='<text x="59" y="122" text-anchor="middle" font-family="Helvetica,Arial" font-size="10" fill="#292929">'+(n.duplicate?'duplicate':'g='+n.g+'  h='+n.h)+'</text></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);
}
function ensureNetwork(){
 if(network)return true;
 if(typeof vis==='undefined'){$('graph_note').textContent='Graph library unavailable. Game view still works.';return false}
 graphNodes=new vis.DataSet();graphEdges=new vis.DataSet();
 network=new vis.Network($('mynetwork'),{nodes:graphNodes,edges:graphEdges},{physics:false,layout:{hierarchical:{enabled:true,direction:'UD',sortMethod:'directed',levelSeparation:178,nodeSpacing:145,treeSpacing:170}},nodes:{shape:'image',size:55,chosen:false},edges:{arrows:{to:{enabled:true,scaleFactor:.6}},color:{color:'#ededed',highlight:'#333'},font:{size:12,color:'#444',strokeWidth:0,background:'#b8b8b8'},smooth:false},interaction:{hover:true,dragNodes:false}});
 network.on('click',e=>{if(e.nodes.length&&visible.has(e.nodes[0])){selected=visible.get(e.nodes[0]);renderGame();renderStats();renderGraph(false)}});
 return true;
}
function renderGraph(fit=true){
 if(graph.hidden||!ensureNetwork())return;
 const focus=active()||{id:-1,state:initial,g:0,h:Puzzle.heuristic(initial,heur.value),parent:null,move:null};
 const keep=new Map(),limit=70,add=n=>{if(n&&!keep.has(n.id)&&keep.size<limit)keep.set(n.id,n)};
 const lineage=n=>{let a=[];while(n&&a.length<33){a.push(n);n=n.parent}a.reverse().forEach(add)};
 lineage(focus);if(frame?.node){lineage(frame.node);for(const c of frame.children||[])add(c)}
 for(const rec of [...recent].reverse()){if(keep.size>limit-5)break;if(keep.has(rec.node.id)||keep.has(rec.node.parent?.id)){add(rec.node);rec.children.forEach(add)}}
 const solIds=new Set((solution||[]).map(n=>n.id));visible=keep;
 const ns=[...keep.values()].map(n=>({id:n.id,image:image(n,n.id===focus.id,solIds.has(n.id)),level:n.g,title:'Depth '+n.g+' · h='+n.h}));
 const es=[...keep.values()].filter(n=>n.parent&&keep.has(n.parent.id)).map(n=>({id:n.id,from:n.parent.id,to:n.id,label:n.move.arrow+' '+n.move.dir,color:{color:solIds.has(n.id)?'#466b50':n.duplicate?'#999':'#ededed'},dashes:!!n.duplicate}));
 // Update existing datasets rather than recreate the network.
 graphEdges.remove(graphEdges.getIds().filter(id=>!es.some(e=>e.id===id)));graphNodes.remove(graphNodes.getIds().filter(id=>!keep.has(id)));graphNodes.update(ns);graphEdges.update(es);
 $('graph_note').textContent='Search tree · '+keep.size+' visible states (max 70) · arrows = empty-cell moves · dashed = duplicate';
 if(fit)network.fit({animation:false});
}
function renderStats(){
 const n=active(),g=n?.g??0,h=n?.h??Puzzle.heuristic(initial,heur.value);
 setStat('state',frame?.status||'Ready');setStat('depth',g);setStat('heuristic',h);setStat('score',algo.value==='astar'?g+h:algo.value==='greedy'?h:algo.value==='ucs'?g:'—');
 setStat('frontier',frame?.frontier??0);setStat('expansions',frame?.expansions??0);setStat('generated',frame?.generated??0);
 setStat('action',frame?.status==='budget'?'Expansion limit reached (200,000).':frame?.status==='unsolvable'?'Odd inversion count: unsolvable.':frame?.status==='solved'?'Solved in '+(solution.length-1)+' moves.':frame?.limit!=null?'Depth limit '+frame.limit:frame?.node?.move?'Empty cell '+frame.node.move.dir:'—');
}
function controls(){
 $('run').disabled=running||finished;$('run').textContent=step.checked?'Next Step':'Solve';$('pause').hidden=!running;
 $('speed').disabled=step.checked;heur.disabled=!['astar','greedy'].includes(algo.value);
}
function render(){renderGame();renderStats();renderGraph();controls()}
function stop(){running=false;clearTimeout(timer);timer=null}
function reset(){stop();iterator=null;frame=null;selected=null;solution=null;solutionIndex=0;finished=false;manualMove=null;recent=[];render()}
function accept(f){frame=f;selected=null;if(f.node){recent.push({node:f.node,children:f.children||[]});if(recent.length>70)recent.shift()}
 if(f.status==='solved'){solution=f.path;solutionIndex=solution.length-1;finished=true;iterator=null;stop()}
 else if(['unsolvable','budget','exhausted'].includes(f.status)){finished=true;iterator=null;stop()}
}
function advance(){if(!iterator)iterator=Puzzle.search(initial,algo.value,heur.value);const r=iterator.next();if(r.done){finished=true;stop();iterator=null;return}accept(r.value)}
function tick(){if(!running)return;let count=Number(speed.value);for(let i=0;i<count&&!finished;i++)advance();render();if(running)timer=setTimeout(tick,Math.max(12,220/count))}
$('run').onclick=()=>{if(step.checked){advance();render()}else{running=true;tick()}};
$('pause').onclick=()=>{stop();render()};
$('reset').onclick=reset;
$('shuffle').onclick=()=>{initial=Puzzle.scramble(Number($('scramble_depth').value));reset()};
$('custom').onclick=()=>{$('board_input').value=initial;$('input_error').textContent='';$('custom_dialog').showModal()};
$('apply_board').onclick=e=>{e.preventDefault();const s=$('board_input').value.replace(/\s/g,'');if(!Puzzle.valid(s)){$('input_error').textContent='Use each digit 0–8 exactly once.';return}initial=s;$('custom_dialog').close();reset()};
algo.onchange=reset;heur.onchange=reset;step.onchange=()=>{stop();controls()};
function tab(isGraph){graph.hidden=!isGraph;game.hidden=isGraph;$('graph_tab').setAttribute('aria-selected',String(isGraph));$('game_tab').setAttribute('aria-selected',String(!isGraph));if(isGraph){renderGraph();network?.redraw();network?.fit({animation:false})}else renderGame()}
$('graph_tab').onclick=()=>tab(true);$('game_tab').onclick=()=>tab(false);
$('solution_prev').onclick=()=>{selected=null;if(solutionIndex>0)solutionIndex--;render()};
$('solution_next').onclick=()=>{selected=null;if(solutionIndex<solution.length-1)solutionIndex++;render()};
makeBoard($('goal'),Puzzle.goal,null);render();
