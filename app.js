const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const state={view:'garden',filter:'active',cat:'All',query:'',selected:null,edit:null,month:new Date(),selectedDate:new Date().toISOString().slice(0,10),theme:'pink'};
const saved=JSON.parse(localStorage.getItem('panGardenV4')||'null');
let products=saved?.products||SEED_PRODUCTS; let history=saved?.history||[]; let settings=saved?.settings||{seasonal:true,celebrate:true,reminders:true,defaultGoal:30};
function save(){localStorage.setItem('panGardenV4',JSON.stringify({products,history,settings}))}
function pct(p){return Math.min(100,Math.round((p.uses||0)/Math.max(1,p.goal)*100))}
function plant(p){let x=pct(p);const fl={pink:'🌺',green:'🌻',gold:'🌼',slate:'🪻'}[p&&p.plant]||'🌸';if(x>=100)return fl;if(x>=67)return '🌷';if(x>=34)return '🪴';return '🌱'}
function type(p){if(p.category==='Blush')return p.brand==='Glossier'?'tube':'blush';if(p.category==='Lips')return 'lip';if(p.category==='Eyes')return 'eye';if(p.category==='Base')return 'base';return 'tube'}
function stageOf(p){let x=pct(p);if(x>=100)return 4;if(x>=67)return 3;if(x>=34)return 2;if(x>0)return 1;return 0}
function cleanName(n){return String(n||'').replace(/\s*[—–-]\s*/g,' ').trim()}
function productVisual(p,big=false){
  if(p && p.image){
    const safe=esc(p.image);
    return `<div class="productPhoto ${big?'big':''}"><img src="${safe}" alt="${esc((p.brand||'')+' '+(p.name||''))}" onerror="this.closest('.productPhoto').classList.add('broken');this.remove()"><span class="photoFallback">${productSVG(type(p),p&&p.shade)}</span></div>`;
  }
  return `<div class="productArt ${big?'big':''}">${productSVG(type(p),p&&p.shade)}</div>`;
}
function field(l,c){return `<div class="field"><label>${l}</label>${c}</div>`} function esc(s=''){return String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;')}
function saveForm(){
 let existing=state.edit?products.find(x=>x.id===state.edit):null;
 let today=new Date().toISOString().slice(0,10);
 let p=existing||{id:'custom-'+Date.now(),uses:0};
 p.name=(document.getElementById('name').value||'').trim()||'Untitled Product';
 p.brand=(document.getElementById('brand').value||'').trim()||'Unknown';
 p.category=document.getElementById('category').value;
 p.goal=Math.max(1,+document.getElementById('goal').value||30);
 p.notes=document.getElementById('notes').value;
 p.dateAdded=document.getElementById('startDate').value||p.dateAdded||today;
 p.active=document.getElementById('activeToggle').checked;
 p.plant=state.plantPick||p.plant||'pink';
 if(!p.shade)p.shade='#d98791';
 let url=(document.getElementById('imageUrl')?.value||'').trim();
 if(pendingImage!==null)p.image=pendingImage;
 else if(url)p.image=url;
 if(!existing)products.unshift(p);
 pendingImage=null; save(); state.selected=p.id; state.edit=null; state.view='detail'; render();
}
function settingsView(){return `<section class="screen"><div class="topbar"><button class="iconBtn back" onclick="nav('garden')">‹</button><b>Appearance</b><span></span></div><div class="themeGrid">${[['pink','🌸','Pink & Green','#efd0cf'],['sage','🌿','Sage','#dbe6d8'],['warm','🌼','Warm','#ecd6aa'],['slate','🪻','Slate','#cfd8df']].map(([id,ico,n,bg])=>`<button class="theme ${state.theme===id?'on':''}" onclick="setTheme('${id}')"><div class="themePlant" style="background:${bg}">${ico}</div>${n}</button>`).join('')}</div><div class="settings"><div class="setting"><span>Use Seasonal Icons</span><button class="toggle ${settings.seasonal?'on':''}" onclick="settings.seasonal=!settings.seasonal;save();render()"><i></i></button></div><div class="setting"><span>Default use goal</span><div class="stepper" style="width:150px"><button onclick="settings.defaultGoal=Math.max(1,(settings.defaultGoal||30)-1);save();render()">−</button><input value="${settings.defaultGoal}" readonly style="text-align:center"><button onclick="settings.defaultGoal=(settings.defaultGoal||30)+1;save();render()">+</button></div></div><div class="setting"><span>Show celebrations</span><button class="toggle ${settings.celebrate?'on':''}" onclick="settings.celebrate=!settings.celebrate;save();render()"><i></i></button></div><div class="setting"><span>Gentle reminders</span><button class="toggle ${settings.reminders?'on':''}" onclick="settings.reminders=!settings.reminders;save();render()"><i></i></button></div></div><div class="sectionHead"><h2>Data</h2></div><div class="settings"><div class="setting" onclick="exportData()"><span>Export Data (JSON)</span><b>⇩</b></div><label class="setting"><span>Import Data</span><b>⇧</b><input type="file" accept="application/json" style="display:none" onchange="importData(this)"></label></div><p class="codeNote">Your collection and use history are stored locally in this browser. Export a backup occasionally.</p></section>`}
function setTheme(t){state.theme=t;let root=document.documentElement;if(t==='sage'){root.style.setProperty('--pink','#91a68d');root.style.setProperty('--bg','#eef2e9')}else if(t==='warm'){root.style.setProperty('--pink','#d69b69');root.style.setProperty('--bg','#f8efe0')}else if(t==='slate'){root.style.setProperty('--pink','#8297a5');root.style.setProperty('--bg','#edf0f2')}else{root.style.setProperty('--pink','#d98791');root.style.setProperty('--bg','#f8eee7')}render()}

let pendingImage=null;
function loadPhoto(input){
 const f=input.files&&input.files[0]; if(!f)return;
 if(f.size>4*1024*1024){alert('Please choose an image under 4 MB so Safari can save it reliably.');return}
 const r=new FileReader(); r.onload=()=>{pendingImage=r.result; render();}; r.readAsDataURL(f);
}
function applyImageUrl(){let v=document.getElementById('imageUrl')?.value.trim();if(!v)return;pendingImage=v;render()}
function removeImage(){pendingImage='';render()}
function findImage(){
 let b=document.getElementById('brand')?.value||'', n=document.getElementById('name')?.value||'';
 let q=encodeURIComponent((b+' '+n+' product').trim());
 window.open('https://www.google.com/search?tbm=isch&q='+q,'_blank');
}

function exportData(){let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({products,history,settings},null,2)],{type:'application/json'}));a.download='pan-garden-backup.json';a.click()}
function importData(inp){let r=new FileReader();r.onload=()=>{try{let d=JSON.parse(r.result);products=d.products||products;history=d.history||history;settings=d.settings||settings;save();render()}catch(e){alert('That backup file could not be read.')}};r.readAsText(inp.files[0])}
/* ---------- navigation, shared UI & interactions (v6 build-out) ---------- */
function nav(v){state.view=v;if(window.scrollTo)window.scrollTo(0,0);render();}
function openAdd(){state.edit=null;pendingImage=null;state.plantPick='pink';state.view='edit';render();}
function openEdit(id){let p=products.find(x=>x.id===id);state.edit=id;pendingImage=null;state.plantPick=(p&&p.plant)||'pink';state.view='edit';render();}
function openDetail(id){state.selected=id;state.view='detail';render();}
function setFilter(f){state.filter=f;render();}
function setCat(c){state.cat=c;render();}
function setStatMode(m){state.statMode=m;render();}
function setPlant(k){state.plantPick=k;render();}
function setQuery(v){state.query=v;render();}
function stepGoal(d){let el=document.getElementById('goal');if(el)el.value=Math.max(1,(+el.value||0)+d);}
function prevMonth(){let m=new Date(state.month);m.setMonth(m.getMonth()-1);state.month=m;render();}
function nextMonth(){let m=new Date(state.month);m.setMonth(m.getMonth()+1);state.month=m;render();}
function selectDate(ds){state.selectedDate=ds;render();}
function addUse(id){
 let p=products.find(x=>x.id===id); if(!p)return;
 let before=pct(p); p.uses=(p.uses||0)+1;
 let now=new Date();
 history.push({id:'h-'+now.getTime()+'-'+Math.random().toString(36).slice(2,6),productId:id,date:now.toISOString().slice(0,10),ts:now.getTime(),delta:1});
 if(before<100 && pct(p)>=100){p.dateFinished=now.toISOString().slice(0,10);}
 save(); render();
}
function emptyState(msg){return `<div class="empty">${msg}</div>`}
function filterChips(items,active,fn){return items.map(([v,l])=>`<button class="chip ${active===v?'on':''}" onclick="${fn}('${v}')">${l}</button>`).join('')}
function navBar(active){
 return `<nav class="bottomNav">
  <button class="navBtn ${active==='garden'?'on':''}" onclick="nav('garden')"><span>🌱</span>Garden</button>
  <button class="navBtn ${active==='collection'?'on':''}" onclick="nav('collection')"><span>🛍️</span>Collection</button>
  <button class="addFab" onclick="openAdd()">+</button>
  <button class="navBtn ${active==='stats'?'on':''}" onclick="nav('stats')"><span>📊</span>Stats</button>
  <button class="navBtn ${active==='panned'?'on':''}" onclick="nav('panned')"><span>💗</span>Panned</button>
 </nav>`;
}
function heroPlant(side,color,stage){return `<div class="heroPot ${side}">${plantSVG(color,stage,128)}</div>`}
function card(p){
 return `<div class="productCard" onclick="openDetail('${p.id}')">
   <div class="cardMain">
     <div class="cardImg">${productVisual(p)}</div>
     <div class="cardInfo">
       <div class="cardName"><b>${esc(p.brand)}</b>${esc(cleanName(p.name))}</div>
       <div class="cardPot">${plantSVG(p.plant,stageOf(p),56)}</div>
     </div>
   </div>
   <div class="cardProg"><div class="progress"><i style="width:${pct(p)}%"></i></div><span>${p.uses||0} / ${p.goal}</span></div>
 </div>`;
}
function grid(list){return `<div class="productGrid">${list.map(card).join('')}</div>`}

function garden(){
 let f=state.filter;
 let visible=products.filter(p=> f==='active'?(p.active&&pct(p)<100): f==='finished'?pct(p)>=100: true);
 let body;
 if(f==='category'){
  let cats=['Lips','Blush','Eyes','Base','Other'];
  body=cats.map(c=>{let l=products.filter(p=>p.category===c);return l.length?`<div class="sectionHead"><h2>${c}</h2><span class="muted">${l.length}</span></div>${grid(l)}`:''}).join('');
 } else {
  body=visible.length?grid(visible):emptyState(f==='finished'?'No panned products yet — keep going! 🌱':'No active pans yet. Tap + to add one.');
 }
 return `<section class="screen">
  <div class="gardenHero">${sceneSVG()}
   <div class="topbar"><div class="titleBlock"><h1>Project Pan</h1><p>small steps, happy pans ✨</p></div><div style="display:flex;gap:6px"><button class="iconBtn" onclick="nav('calendar')">📅</button><button class="iconBtn" onclick="nav('settings')">⚙️</button></div></div>
   <div class="heroPlants">${heroPlant('left','pink',4)}${heroPlant('right','green',2)}</div>
  </div>
  <div class="filters">${filterChips([['active','Active'],['all','All'],['finished','Finished'],['category','By Category']],f,'setFilter')}</div>
  ${body}
  ${navBar('garden')}
 </section>`;
}

function collection(){
 let q=(state.query||'').toLowerCase();
 let list=products.filter(p=>(state.cat==='All'||p.category===state.cat) && ((p.brand||'')+' '+(p.name||'')).toLowerCase().includes(q));
 let rows=list.map(p=>`<div class="collectionRow" onclick="openDetail('${p.id}')">
   <div class="thumb">${productVisual(p)}</div>
   <div>
    <div class="rowTitle">${esc(p.brand)} · ${esc(p.name)}</div>
    <div class="rowMeta">${p.uses||0} / ${p.goal} uses · ${p.active?'Active':'Reserve'}</div>
    <div class="progress"><i style="width:${pct(p)}%"></i></div>
   </div>
   <span class="rowPlant">${plantSVG(p.plant,stageOf(p),38)}</span>
   <span class="chev">›</span>
  </div>`).join('');
 return `<section class="screen">
  <div class="topbar"><div class="titleBlock"><h1>Collection</h1></div></div>
  <div class="searchWrap"><input id="search" class="search" placeholder="Search products, brands…" value="${esc(state.query)}" oninput="setQuery(this.value)"></div>
  <div class="filters">${filterChips([['All','All'],['Lips','Lips'],['Blush','Blush'],['Eyes','Eyes'],['Base','Base'],['Other','Other']],state.cat,'setCat')}</div>
  <div class="collectionList">${rows||emptyState('Nothing matches that search.')}</div>
  ${navBar('collection')}
 </section>`;
}

function detailView(){
 let p=products.find(x=>x.id===state.selected); if(!p)return garden();
 let g=p.goal||30;
 let defs=[[0,'0'],[Math.round(g/3),String(Math.round(g/3))],[Math.round(2*g/3),String(Math.round(2*g/3))],[g,String(g)],[g,'Panned']];
 let stages=defs.map(([thr,lab],i)=>{let reached=i===4?(p.uses||0)>=g:(p.uses||0)>=thr;return `<div class="stage" style="opacity:${reached?1:.4}">${plantSVG(p.plant,i,38)}<small>${lab}</small></div>`}).join('');
 return `<section class="screen">
  <div class="topbar"><button class="iconBtn back" onclick="nav('garden')">‹</button><span></span><button class="iconBtn" style="width:auto;padding:0 14px;background:none;color:var(--green);font-weight:700" onclick="openEdit('${p.id}')">Edit</button></div>
  <div class="detailHero">${productVisual(p,true)}<div class="detailPot">${plantSVG(p.plant,stageOf(p),124)}</div></div>
  <div class="detailCard">
   <h1 style="margin:0 0 8px;font-size:22px;line-height:1.2">${esc(p.brand)} ${esc(cleanName(p.name))}</h1>
   <div class="tags"><span class="tag">${esc(p.category)}</span><span class="tag">${esc(p.brand)}</span><span class="tag">${p.active?'Active Pan':'Reserve'}</span></div>
   <div class="bigCount">${p.uses||0} / ${g} uses</div>
   <div class="progress"><i style="width:${pct(p)}%"></i></div>
   <div class="stageRow">${stages}</div>
   <button class="bigUse" onclick="addUse('${p.id}')">+1 Use</button>
   <div class="notes"><div class="sectionHead" style="padding:0 0 8px"><h2 style="font-size:15px;margin:0">Notes</h2><button onclick="openEdit('${p.id}')">✎</button></div>${p.notes?esc(p.notes):'<span class="muted">No notes yet. Tap ✎ to add shade or pairing notes.</span>'}</div>
  </div>
  ${navBar('garden')}
 </section>`;
}

function formView(){
 let existing=state.edit?products.find(x=>x.id===state.edit):null;
 let today=new Date().toISOString().slice(0,10);
 let p=existing||{name:'',brand:'',category:'Blush',goal:settings.defaultGoal||30,notes:'',active:true,plant:'pink',shade:'#d98791',dateAdded:today};
 let img=pendingImage!==null?pendingImage:(p.image||'');
 let pick=state.plantPick||p.plant||'pink';
 let cats=['Lips','Blush','Eyes','Base','Other'];
 let urlVal=(p.image&&pendingImage===null&&!String(p.image).startsWith('data:'))?esc(p.image):'';
 return `<section class="screen">
  <div class="topbar"><button class="iconBtn back" onclick="nav('${existing?'detail':'garden'}')">‹</button><div class="titleBlock"><h1 style="font-size:20px">${existing?'Edit Product':'Add Product'}</h1></div><button class="saveBtn" onclick="saveForm()">Save</button></div>
  <div class="form">
   <div class="addTop">
    <div class="addThumb">
     ${img?`<img src="${esc(img)}" alt="">`:productVisual(p)}
     <label class="camBadge" title="Upload photo">📷<input type="file" accept="image/*" style="display:none" onchange="loadPhoto(this)"></label>
     ${img?`<button type="button" class="thumbRemove" onclick="removeImage()">×</button>`:''}
    </div>
    <div class="addTopFields">
     ${field('Name',`<input id="name" value="${esc(p.name)}" placeholder="e.g. Cloud Paint Dusk">`)}
     ${field('Brand',`<input id="brand" value="${esc(p.brand)}" placeholder="e.g. Glossier">`)}
    </div>
   </div>
   ${field('Category',`<select id="category">${cats.map(c=>`<option ${p.category===c?'selected':''}>${c}</option>`).join('')}</select>`)}
   ${field('Goal (uses)',`<div class="stepper"><button type="button" onclick="stepGoal(-1)">−</button><input id="goal" type="number" min="1" value="${p.goal}"><button type="button" onclick="stepGoal(1)">+</button></div>`)}
   ${field('Start Date',`<input id="startDate" type="date" value="${esc(p.dateAdded||today)}">`)}
   <div class="imageActions">
    <button type="button" class="imageBtn" onclick="findImage()">🔍 Find Image</button>
    <label class="imageBtn">📤 Upload Photo<input type="file" accept="image/*" style="display:none" onchange="loadPhoto(this)"></label>
   </div>
   ${field('Paste Image URL',`<input id="imageUrl" placeholder="https://…" value="${urlVal}"><button type="button" class="softBtn" style="margin-top:8px" onclick="applyImageUrl()">Use this URL</button>`)}
   <div class="field"><label>Choose a Plant</label><div class="plantChoices">${['pink','green','gold','slate'].map(k=>`<button type="button" class="plantChoice ${pick===k?'on':''}" onclick="setPlant('${k}')">${plantSVG(k,4,50)}</button>`).join('')}</div></div>
   <label class="field" style="display:flex;justify-content:space-between;align-items:center"><span>Active project pan</span><input type="checkbox" id="activeToggle" ${p.active?'checked':''} style="width:auto"></label>
   ${field('Notes',`<textarea id="notes" placeholder="Shade notes, pairing ideas…">${esc(p.notes)}</textarea>`)}
  </div>
 </section>`;
}

function stats(){
 let mode=state.statMode||'month';
 let now=new Date();
 let ev=mode==='month'?history.filter(h=>{let d=new Date(h.ts||h.date);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear()}):history;
 let totalUses=ev.length?ev.reduce((a,h)=>a+(h.delta||1),0):(mode==='month'?0:products.reduce((a,p)=>a+(p.uses||0),0));
 let inProgress=products.filter(p=>p.active&&pct(p)<100).length;
 let finished=products.filter(p=>pct(p)>=100).length;
 let days=new Set(ev.map(h=>h.date)).size;
 let cats=['Lips','Blush','Eyes','Base','Other'];
 let byCat={}; cats.forEach(c=>byCat[c]=0);
 if(ev.length){ev.forEach(h=>{let p=products.find(x=>x.id===h.productId);if(p&&byCat[p.category]!=null)byCat[p.category]+=(h.delta||1)})}
 else if(mode!=='month'){products.forEach(p=>{if(byCat[p.category]!=null)byCat[p.category]+=(p.uses||0)})}
 let maxC=Math.max(1,...cats.map(c=>byCat[c]));
 let ci={Lips:'💄',Blush:'🌸',Eyes:'👁️',Base:'✨',Other:'🧴'};
 let bars=cats.map(c=>`<div class="barRow"><span>${ci[c]} ${c}</span><div class="barTrack"><i style="width:${Math.round(byCat[c]/maxC*100)}%"></i></div><span>${byCat[c]}</span></div>`).join('');
 return `<section class="screen">
  <div class="topbar"><div class="titleBlock"><h1>Stats</h1></div></div>
  <div class="filters">${filterChips([['month','This Month'],['all','All Time'],['category','By Category']],mode,'setStatMode')}</div>
  <div class="statsGrid">
   <div class="statCard"><strong>🌿 ${totalUses}</strong><span>Total Uses</span></div>
   <div class="statCard"><strong>🌼 ${inProgress}</strong><span>Products In Progress</span></div>
   <div class="statCard"><strong>🌱 ${finished}</strong><span>Products Finished</span></div>
   <div class="statCard"><strong>⭐ ${days}</strong><span>Days Tracked</span></div>
  </div>
  <div class="sectionHead"><h2>Usage by Category</h2></div>
  <div class="barList">${bars}</div>
  ${navBar('stats')}
 </section>`;
}

function panned(){
 let done=products.filter(p=>pct(p)>=100);
 let plantsHtml=done.map(p=>`<div class="trophy"><div class="bigPlant">${plantSVG(p.plant,4,120)}</div><div class="plaque"><b>${esc(p.brand)} ${esc(cleanName(p.name))}</b><br>PANNED${p.dateFinished?' · '+p.dateFinished:''}</div></div>`).join('');
 return `<section class="screen">
  <div class="pannedScene">${sceneSVG('grass')}
   <div class="topbar"><button class="iconBtn back" onclick="nav('garden')">‹</button><div class="titleBlock" style="text-align:center;flex:1"><h1>Panned Garden</h1></div><span style="width:38px"></span></div>
   ${done.length?`<div class="pannedPlants">${plantsHtml}</div>`:emptyState('No panned products yet. Every use gets you closer! 🌱')}
   ${done.length?`<div class="celebrate">Look at you go! 🌸<br>Every pan is a win.</div>`:''}
  </div>
  ${navBar('panned')}
 </section>`;
}

function calendar(){
 let m=state.month instanceof Date?state.month:new Date();
 let y=m.getFullYear(),mo=m.getMonth();
 let first=new Date(y,mo,1).getDay(),dim=new Date(y,mo+1,0).getDate();
 let monthName=m.toLocaleString('en-US',{month:'long',year:'numeric'});
 let byDate={}; history.forEach(h=>{byDate[h.date]=(byDate[h.date]||0)+(h.delta||1)});
 let cells='';
 for(let i=0;i<first;i++)cells+=`<span class="day"></span>`;
 for(let d=1;d<=dim;d++){
  let ds=`${y}-${String(mo+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  let has=byDate[ds]>0,sel=state.selectedDate===ds;
  cells+=`<button class="day ${has?'has':''} ${sel?'sel':''}" onclick="selectDate('${ds}')">${d}</button>`;
 }
 let dayEvents=history.filter(h=>h.date===state.selectedDate);
 let agg={}; dayEvents.forEach(h=>{let p=products.find(x=>x.id===h.productId);let k=p?p.id:h.productId;agg[k]=agg[k]||{p:p,n:0};agg[k].n+=(h.delta||1)});
 let logRows=Object.keys(agg).map(k=>{let o=agg[k];return `<div class="logRow"><span class="logThumb">${o.p?productVisual(o.p):''}</span><span style="flex:1">${o.p?esc(o.p.brand)+' '+esc(cleanName(o.p.name)):'Unknown product'}</span><b>+${o.n} use${o.n>1?'s':''}</b></div>`}).join('');
 let selLabel=new Date(state.selectedDate+'T00:00:00').toLocaleString('en-US',{month:'short',day:'numeric',year:'numeric'});
 return `<section class="screen">
  <div class="topbar"><button class="iconBtn back" onclick="nav('garden')">‹</button><div class="titleBlock" style="text-align:center;flex:1"><h1 style="font-size:19px">Calendar</h1></div><span style="width:38px"></span></div>
  <div class="calendar">
   <div class="calHead"><button class="iconBtn" onclick="prevMonth()">‹</button><b>${monthName}</b><button class="iconBtn" onclick="nextMonth()">›</button></div>
   <div class="week"><span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span></div>
   <div class="days">${cells}</div>
  </div>
  <div class="dayLog"><div class="sectionHead" style="padding:0 0 6px"><h2 style="font-size:15px;margin:0">${selLabel}</h2></div>${logRows||emptyState('No uses logged this day.')}</div>
  ${navBar('garden')}
 </section>`;
}

function ensureVersionBadge(){let b=document.getElementById('versionBadge');if(!b){b=document.createElement('div');b.id='versionBadge';b.textContent='Pan Garden v6';document.body.appendChild(b);}}
function render(){ensureVersionBadge();let html=state.view==='garden'?garden():state.view==='collection'?collection():state.view==='detail'?detailView():state.view==='edit'?formView():state.view==='stats'?stats():state.view==='panned'?panned():state.view==='calendar'?calendar():settingsView();$('#app').innerHTML=`<main class="shell">${html}</main>`;if(state.view==='collection'){let s=document.getElementById('search');if(s){let v=s.value;s.focus();try{s.setSelectionRange(v.length,v.length)}catch(e){}}}}
render(); if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');
