const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const state={view:'garden',filter:'active',cat:'All',query:'',selected:null,edit:null,month:new Date(),selectedDate:new Date().toISOString().slice(0,10),theme:'pink'};
const saved=JSON.parse(localStorage.getItem('panGardenV4')||'null');
let products=saved?.products||SEED_PRODUCTS; let history=saved?.history||[]; let settings=saved?.settings||{seasonal:true,celebrate:true,reminders:true,defaultGoal:30};
function save(){localStorage.setItem('panGardenV4',JSON.stringify({products,history,settings}))}
function pct(p){return Math.min(100,Math.round((p.uses||0)/Math.max(1,p.goal)*100))}
function plant(p){let x=pct(p); if(x>=100)return p.plant==='pink'?'🌺':'🌻'; if(x>=67)return p.plant==='pink'?'🌷':'🌿'; if(x>=34)return '🪴'; if(x>0)return '🌱'; return '🌱'}
function type(p){if(p.category==='Blush')return p.brand==='Glossier'?'tube':'blush';if(p.category==='Lips')return 'lip';if(p.category==='Eyes')return 'eye';if(p.category==='Base')return 'base';return 'tube'}
function productVisual(p,big=false){
  if(p && p.image){
    const safe=String(p.image).replace(/"/g,'&quot;');
    return `<div class="productPhoto ${big?'big':''}"><img src="${safe}" alt="${p.brand||''} ${p.name||''}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="photoFallback">💄</span></div>`;
  }
  let c=(p&&p.shade)||'#b97878', cls=p&&p.category==='Blush'?'tube':p&&p.category==='Eyes'?'liner':p&&p.category==='Base'?'base':'lipstick';
  return `<div class="cosmetic ${cls} ${big?'big':''}" style="--shade:${c}"><i></i><b>${(p&&p.brand)||''}</b></div>`;
}
function field(l,c){return `<div class="field"><label>${l}</label>${c}</div>`} function esc(s=''){return String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;')}
function saveForm(){
 let existing=state.edit?products.find(x=>x.id===state.edit):null;
 let p=existing||{id:'custom-'+Date.now(),uses:0};
 p.name=document.getElementById('name').value.trim()||'Untitled Product';
 p.brand=document.getElementById('brand').value.trim()||'Unknown';
 p.category=document.getElementById('category').value;
 p.goal=Math.max(1,+document.getElementById('goal').value||30);
 p.notes=document.getElementById('notes').value;
 p.active=document.getElementById('active').checked;
 p.plant=p.plant||'pink';
 let url=document.getElementById('imageUrl')?.value.trim();
 if(pendingImage!==null)p.image=pendingImage;
 else if(url)p.image=url;
 if(!existing)products.unshift(p);
 pendingImage=null; save(); state.selected=p.id; state.edit=null; nav('detail');
}
function settingsView(){return `<section class="screen"><div class="topbar"><button class="iconBtn back" onclick="nav('garden')">‹</button><b>Appearance</b><span></span></div><div class="themeGrid">${[['pink','🌸','Pink & Green','#efd0cf'],['sage','🌿','Sage','#dbe6d8'],['warm','🌼','Warm','#ecd6aa'],['slate','🪻','Slate','#cfd8df']].map(([id,ico,n,bg])=>`<button class="theme ${state.theme===id?'on':''}" onclick="setTheme('${id}')"><div class="themePlant" style="background:${bg}">${ico}</div>${n}</button>`).join('')}</div><div class="settings"><div class="setting"><span>Use Seasonal Icons</span><button class="toggle ${settings.seasonal?'on':''}" onclick="settings.seasonal=!settings.seasonal;save();render()"><i></i></button></div><div class="setting"><span>Default use goal</span><b>${settings.defaultGoal}</b></div><div class="setting"><span>Show celebrations</span><button class="toggle ${settings.celebrate?'on':''}" onclick="settings.celebrate=!settings.celebrate;save();render()"><i></i></button></div><div class="setting"><span>Gentle reminders</span><button class="toggle ${settings.reminders?'on':''}" onclick="settings.reminders=!settings.reminders;save();render()"><i></i></button></div></div><div class="sectionHead"><h2>Data</h2></div><div class="settings"><div class="setting" onclick="exportData()"><span>Export Data (JSON)</span><b>⇩</b></div><label class="setting"><span>Import Data</span><b>⇧</b><input type="file" accept="application/json" style="display:none" onchange="importData(this)"></label></div><p class="codeNote">Your collection and use history are stored locally in this browser. Export a backup occasionally.</p></section>`}
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
function ensureVersionBadge(){let b=document.getElementById('versionBadge');if(!b){b=document.createElement('div');b.id='versionBadge';b.textContent='Pan Garden v6';document.body.appendChild(b);}}
function render(){ensureVersionBadge();let html=state.view==='garden'?garden():state.view==='collection'?collection():state.view==='detail'?detailView():state.view==='edit'?formView():state.view==='stats'?stats():state.view==='panned'?panned():state.view==='calendar'?calendar():settingsView();$('#app').innerHTML=`<main class="shell">${html}</main>`}
render(); if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');
