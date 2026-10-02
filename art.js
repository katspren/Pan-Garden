/* Pan Garden — custom illustrations
   plantSVG(color, stage, size) : claymation "head-pot" planter with a cute
       face, rendered in pink / green / gold / slate at 5 growth stages
       (0 potted · 1 sprout · 2 leafy · 3 budding · 4 flowering/panned).
   productSVG(type, shade)      : clean vector product render (squeeze tube,
       lipstick bullet, blush compact, eyeliner pen, base tube) tinted by
       the product's own shade. Used as a polished placeholder until a real
       photo is uploaded/linked. */
(function(){
  let _id=0;
  function uid(p){return (p||'a')+(_id++);}
  function lighten(hex,amt){
    amt=(amt==null)?0.4:amt; let h=String(hex||'#c98a86').replace('#','');
    if(h.length===3)h=h.split('').map(c=>c+c).join('');
    let r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);
    if(isNaN(r))return '#e7c7c3';
    r=Math.round(r+(255-r)*amt);g=Math.round(g+(255-g)*amt);b=Math.round(b+(255-b)*amt);
    return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
  }
  function darken(hex,amt){
    amt=(amt==null)?0.25:amt; let h=String(hex||'#c98a86').replace('#','');
    if(h.length===3)h=h.split('').map(c=>c+c).join('');
    let r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);
    if(isNaN(r))return '#a56a66';
    r=Math.round(r*(1-amt));g=Math.round(g*(1-amt));b=Math.round(b*(1-amt));
    return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
  }

  /* Colors matched to LEGO Botanicals Rocking Plants (11506: Bright Pink +
     Spring Yellowish-Green) and Happy Plants (10349: Yellow + Blue) pots.
     Green pot gets lavender blooms, echoing "Lumi" (purple buds) in the set. */
  const PALETTE={
    pink :{l:'#f1c9dc',b:'#e4adc8',d:'#ca8dab',nub:'#dd9fbd',petal:'#f09cae',petal2:'#e97f96',center:'#f6d36b'},
    green:{l:'#ddeca7',b:'#c6dd86',d:'#a4c05c',nub:'#b7d073',petal:'#b7a9e6',petal2:'#9d8ede',center:'#efd36a'},
    gold :{l:'#f8e488',b:'#f0d24e',d:'#d2b134',nub:'#e3c247',petal:'#f0a24f',petal2:'#e7843f',center:'#e07a3b'},
    slate:{l:'#a9dbe9',b:'#73c3d6',d:'#49a6bd',nub:'#62b7cb',petal:'#f0a7bb',petal2:'#e98aa0',center:'#f6d36b'}
  };
  const LEAF='#6f9b5f', LEAFL='#8bb678', STEM='#6a9458';

  function leaf(x,y,rot,sc){
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})">`
      +`<path d="M0 0 C 1 -13 11 -22 21 -25 C 17 -11 8 -2 0 0 Z" fill="${LEAF}"/>`
      +`<path d="M3 -3 C 9 -11 15 -17 19 -21" stroke="${LEAFL}" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`;
  }
  function stem(x2,y2,bend){
    return `<path d="M55 56 Q ${55+(bend||0)} ${(56+y2)/2} ${x2} ${y2}" stroke="${STEM}" stroke-width="4.4" fill="none" stroke-linecap="round"/>`;
  }
  function bud(x,y,P){
    return `<g transform="translate(${x} ${y})"><path d="M0 3 C -6 -2 -6 -13 0 -17 C 6 -13 6 -2 0 3 Z" fill="${P.petal}"/>`
      +`<path d="M0 3 C -5 -1 -5 -9 0 -12 C 5 -9 5 -1 0 3 Z" fill="${P.petal2}" opacity=".55"/>`
      +`<path d="M-4 3 Q0 8 4 3" fill="${LEAF}"/></g>`;
  }
  function bloom(x,y,sc,P){
    let pet='';
    for(let i=0;i<5;i++){
      pet+=`<ellipse cx="${x}" cy="${y-6.4*sc}" rx="${3.5*sc}" ry="${5.4*sc}" fill="${P.petal}" transform="rotate(${i*72} ${x} ${y})"/>`;
      pet+=`<ellipse cx="${x}" cy="${y-6.4*sc}" rx="${1.7*sc}" ry="${3*sc}" fill="${P.petal2}" opacity=".5" transform="rotate(${i*72} ${x} ${y})"/>`;
    }
    return `<g>${pet}<circle cx="${x}" cy="${y}" r="${3*sc}" fill="${P.center}"/><circle cx="${x-0.8*sc}" cy="${y-0.8*sc}" r="${1.1*sc}" fill="#fff6" /></g>`;
  }

  /* ---- Seven planter "buddies" (original artwork) ----
     Cube pot with a cute face, little arms and feet, in seven colors, each
     holding a different plant species that grows across 5 stages. Inspired by
     the LEGO Botanicals happy-plant look but drawn from scratch. */
  const POTS={
    green :{l:'#dceaa6',b:'#c6dd86',d:'#a4c05c',arm:'#b4cf72',foot:'#aec76a'},
    pink  :{l:'#f4c3da',b:'#e79cc0',d:'#cd7ea6',arm:'#dd8fb3',foot:'#d888ac'},
    blue  :{l:'#c6d8f4',b:'#9fbdea',d:'#7a9bd8',arm:'#8fb0e3',foot:'#88a9df'},
    yellow:{l:'#f8e488',b:'#f0d24e',d:'#d2b134',arm:'#e6c647',foot:'#e0bf40'},
    white :{l:'#ffffff',b:'#f3eee8',d:'#d8cdc0',arm:'#e7ddd1',foot:'#e3d8cb'},
    purple:{l:'#ddcaf0',b:'#c3a8e4',d:'#a588cf',arm:'#b79add',foot:'#b093d9'},
    sage  :{l:'#cdd9a8',b:'#b2c38c',d:'#93a76f',arm:'#a4b77e',foot:'#9fb279'}
  };
  const ALIAS={gold:'yellow',slate:'blue'};
  const Gdk='#4f7f44', Gmd='#689a56', Glt='#86b870', Gvv='#5aa34e';
  const n1=x=>(+x).toFixed(1);

  function blade(cx,cy,ang,len,w,fill,edge){
    const r=ang*Math.PI/180, tx=cx+Math.cos(r)*len, ty=cy+Math.sin(r)*len;
    const px=Math.cos(r+Math.PI/2), py=Math.sin(r+Math.PI/2);
    const b1x=cx+px*w,b1y=cy+py*w,b2x=cx-px*w,b2y=cy-py*w;
    const m1x=cx+Math.cos(r)*len*0.55+px*w*1.05,m1y=cy+Math.sin(r)*len*0.55+py*w*1.05;
    const m2x=cx+Math.cos(r)*len*0.55-px*w*1.05,m2y=cy+Math.sin(r)*len*0.55-py*w*1.05;
    return `<path d="M${n1(b1x)} ${n1(b1y)} Q ${n1(m1x)} ${n1(m1y)} ${n1(tx)} ${n1(ty)} Q ${n1(m2x)} ${n1(m2y)} ${n1(b2x)} ${n1(b2y)} Z" fill="${fill}"/>`
      +(edge?`<path d="M${n1(cx)} ${n1(cy)} L ${n1(tx)} ${n1(ty)}" stroke="${edge}" stroke-width="0.7" opacity="0.4" fill="none"/>`:'');
  }
  function stemTo(x1,y1,x2,y2,c,w){return `<path d="M${x1} ${y1} Q ${n1((x1+x2)/2)} ${n1((y1+y2)/2-6)} ${x2} ${y2}" stroke="${c||'#5f9150'}" stroke-width="${w||3.2}" fill="none" stroke-linecap="round"/>`;}
  function daisy(x,y,r,petal,ctr,n){n=n||8;let p='';for(let i=0;i<n;i++)p+=`<ellipse cx="${x}" cy="${n1(y-r)}" rx="${n1(r*0.38)}" ry="${n1(r)}" fill="${petal}" transform="rotate(${(i*360/n).toFixed(0)} ${x} ${y})"/>`;return `<g>${p}<circle cx="${x}" cy="${y}" r="${n1(r*0.4)}" fill="${ctr}"/></g>`;}
  function coin(x,y,r,c){return `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${n1(r*0.88)}" fill="${c}"/><ellipse cx="${n1(x-r*0.3)}" cy="${n1(y-r*0.3)}" rx="${n1(r*0.3)}" ry="${n1(r*0.2)}" fill="#ffffff33"/>`;}
  function bead(x,y,r){return `<circle cx="${n1(x)}" cy="${n1(y)}" r="${r}" fill="#7bb063"/><circle cx="${n1(x-r*0.3)}" cy="${n1(y-r*0.3)}" r="${n1(r*0.32)}" fill="#ffffff44"/>`;}
  function star(x,y,c,s){s=s||1;let p='';for(let i=0;i<5;i++){let a=(i*72-90)*Math.PI/180;p+=`${n1(x+Math.cos(a)*5*s)},${n1(y+Math.sin(a)*5*s)} `;let a2=(i*72-54)*Math.PI/180;p+=`${n1(x+Math.cos(a2)*2.1*s)},${n1(y+Math.sin(a2)*2.1*s)} `;}return `<polygon points="${p}" fill="${c}"/>`;}
  function bell(x,y,c){return `<path d="M${n1(x-3.5)} ${n1(y-7)} Q ${x} ${n1(y+4)} ${n1(x+3.5)} ${n1(y-7)} Q ${x} ${n1(y-10)} ${n1(x-3.5)} ${n1(y-7)} Z" fill="${c}"/>`;}
  function sprout(){return blade(56,55,-82,11,3.2,Glt,Gdk)+blade(56,55,-98,11,3.2,Gmd,Gdk);}
  function rosette(cx,cy,n,len){let s='';const cols=[Gmd,Glt,'#9ac77f',Gvv];for(let i=0;i<n;i++){let ang=-176+(i+0.5)*(172/n);s+=blade(cx,cy,ang,len*(0.82+0.18*(i%2)),len*0.3,cols[i%cols.length],Gdk);}return s+blade(cx,cy,-90,len*0.8,len*0.28,Glt,Gdk);}
  function coralStem(full){const tx=88,ty=full?16:34;let s=stemTo(56,52,tx,ty,'#6aa355',3.4);if(full){s+=bell(tx-5,ty+5,'#ef8a6e')+bell(tx+6,ty+5,'#ef8a6e')+bell(tx+1,ty-4,'#ef8a6e')+star(tx-9,ty,'#f3c431',1)+star(tx+11,ty,'#f3c431',1);}else{s+=bell(tx,ty+2,'#ef8a6e');}return s;}

  function pearlStrand(x,y,len,drift){let s='',cx=x,cy=y;for(let k=0;k<len&&cy<97;k++){s+=bead(cx,cy,2.7);cx=x+Math.sin(k*0.5)*1.8+(drift||0)*k*0.3;cy+=4.4;}return s;}

  const SPECIES={
    sage:function(st){if(st<=0)return{back:sprout()};const n=[0,3,5,7,9][st],len=[0,15,19,23,26][st];let b=rosette(56,54,n,len);if(st>=4)b+=daisy(56,32,4,'#eca6b4','#f2d36a',6);return{back:b};},
    pink:function(st){if(st<=0)return{back:sprout()};const n=[0,4,6,7,8][st],len=[0,15,19,22,24][st];let b=rosette(56,53,n,len);if(st>=3)b+=coralStem(st>=4);return{back:b};},
    green:function(st){if(st<=0)return{back:sprout()};let b='';const stems=[[],[[48,30,-20]],[[46,28,-22],[66,30,20]],[[45,26,-24],[66,28,22],[56,22,0]],[[43,24,-26],[68,27,24],[56,19,0],[51,27,-10],[62,29,12]]][st];for(const s of stems){b+=stemTo(56,54,s[0],s[1],'#5f9150',3)+blade((s[0]+56)/2,(s[1]+54)/2,s[2]-90,9,3,Gmd,Gdk);}const fl=[0,1,2,3,5][st];const sp=[[48,27],[66,27],[56,20],[50,29],[63,30],[42,33]];for(let i=0;i<fl;i++)b+=daisy(sp[i][0],sp[i][1],4.6,'#d14d93','#f2d36a',8);return{back:b};},
    blue:function(st){if(st<=0)return{back:sprout()};const c=[[],[[51,30]],[[47,30],[65,32]],[[45,28],[65,30],[56,22]],[[43,26],[67,29],[56,20],[51,30],[62,31]]][st];let b='';for(const p of c)b+=stemTo(56,54,p[0],p[1],'#6aa355',2.6)+coin(p[0],p[1]-2,6.5,'#5fa64e');return{back:b};},
    yellow:function(st){if(st<=0)return{back:sprout()};const n=[0,3,5,7,9][st],len=[0,20,28,34,40][st];let b='';const cols=['#2f6e34','#3d7e3f','#4f9150'];for(let i=0;i<n;i++){let ang=-150+(i+0.5)*(120/n);b+=blade(56,55,ang,len*(0.8+0.2*(i%2)),len*0.12,cols[i%3],'#245a29');}return b?{back:b+blade(56,55,-90,len,len*0.13,'#4f9150','#245a29')}:{back:b};},
    white:function(st){if(st<=0)return{back:sprout()};let b=blade(45,52,-150,16,4,Gmd,Gdk)+blade(67,52,-30,16,4,Gmd,Gdk)+blade(56,52,-90,18,4,Glt,Gdk);const sp=[[56,28,'#e9739a'],[46,32,'#f0914c'],[66,32,'#fbf4ec'],[51,24,'#c57fd8'],[63,25,'#f2c14e'],[41,38,'#ea6fa0'],[71,38,'#6ab0e0']];const fl=[0,2,3,5,7][st];for(let i=0;i<fl;i++)b+=daisy(sp[i][0],sp[i][1],4.4,sp[i][2],'#f6d06a',7);return{back:b};},
    purple:function(st){if(st<=0)return{back:sprout()};let back=blade(53,53,-95,8,2.8,Gmd,Gdk)+blade(60,53,-80,7,2.6,Glt,Gdk)+blade(56,52,-88,9,2.8,Gvv,Gdk);const L=[0,6,8,10,12][st];let front='';if(st>=1)front+=pearlStrand(36,56,L,-0.3);if(st>=2)front+=pearlStrand(78,58,L-1,0.3);if(st>=3)front+=pearlStrand(31,58,L+1,-0.4);if(st>=4)front+=pearlStrand(82,60,L,0.4);return{back:back,front:front};}
  };

  /* Plant art is now the user's own growth renders, sliced into 35 tiles
     (7 types x 5 stages) under plants/<type>_<stage>.png. Aspect ~202x231. */
  window.plantSVG=function(type,stage,size){
    type=ALIAS[type]||type; if(!POTS[type])type='green';
    size=size||70; stage=Math.max(0,Math.min(4,stage|0));
    const w=Math.round(size), h=Math.round(size*219/209);
    return `<img class="plantArt" src="plants/${type}_${stage}.png" alt="" width="${w}" height="${h}" loading="lazy">`;
  };

  window.productSVG=function(type,shade){
    shade=shade||'#c98a86';
    const id=uid('pr'), white='#fcf7f3', sl=lighten(shade,0.3), sd=darken(shade,0.22);
    const defs=`<defs>`
      +`<linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ddd0c8"/><stop offset="0.42" stop-color="${white}"/><stop offset="0.6" stop-color="#fffdfb"/><stop offset="1" stop-color="#d9cbc2"/></linearGradient>`
      +`<linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${sd}"/><stop offset="0.5" stop-color="${sl}"/><stop offset="1" stop-color="${sd}"/></linearGradient>`
      +`<radialGradient id="${id}h" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#ffffff77"/><stop offset="0.65" stop-color="#ffffff00"/></radialGradient>`
      +`</defs>`;
    const shadow=`<ellipse cx="60" cy="159" rx="28" ry="5.5" fill="#0000000f"/>`;
    let body;
    if(type==='tube'){ /* Cloud-Paint style squeeze tube, colored cap on top */
      body=`<path d="M41 150 Q41 82 47 66 L73 66 Q79 82 79 150 Q79 156 73 156 L47 156 Q41 156 41 150 Z" fill="url(#${id}b)"/>`
        +`<rect x="45" y="40" width="30" height="28" rx="9" fill="url(#${id}s)"/>`
        +`<rect x="45" y="40" width="30" height="28" rx="9" fill="url(#${id}h)"/>`
        +`<rect x="47" y="60" width="26" height="7" rx="3" fill="#00000010"/>`
        +`<rect x="50" y="86" width="20" height="34" rx="5" fill="${sl}" opacity="0.35"/>`;
    } else if(type==='lip'){ /* lipstick bullet */
      body=`<rect x="47" y="62" width="26" height="92" rx="10" fill="url(#${id}b)"/>`
        +`<rect x="47" y="62" width="26" height="92" rx="10" fill="url(#${id}h)"/>`
        +`<rect x="47" y="62" width="26" height="12" rx="6" fill="#00000010"/>`
        +`<path d="M51 62 L51 42 Q51 32 60 29 Q69 32 69 42 L69 62 Z" fill="url(#${id}s)"/>`
        +`<path d="M60 29 Q67 33 69 44 L60 46 Z" fill="#ffffff33"/>`;
    } else if(type==='blush'){ /* round compact pan */
      body=`<circle cx="60" cy="98" r="45" fill="url(#${id}b)"/>`
        +`<circle cx="60" cy="98" r="34" fill="url(#${id}s)"/>`
        +`<circle cx="60" cy="98" r="34" fill="url(#${id}h)"/>`
        +`<ellipse cx="48" cy="84" rx="12" ry="7" fill="#ffffff3a"/>`;
    } else if(type==='eye'){ /* slim liner / pencil */
      body=`<rect x="53" y="30" width="14" height="100" rx="7" fill="url(#${id}b)"/>`
        +`<rect x="53" y="30" width="14" height="100" rx="7" fill="url(#${id}h)"/>`
        +`<rect x="53" y="62" width="14" height="42" rx="7" fill="url(#${id}s)"/>`
        +`<path d="M53 130 L67 130 L62 158 Q60 164 58 158 Z" fill="${sd}"/>`;
    } else { /* base: foundation / concealer tube */
      body=`<path d="M45 150 Q45 74 51 60 L69 60 Q75 74 75 150 Q75 156 69 156 L51 156 Q45 156 45 150 Z" fill="url(#${id}b)"/>`
        +`<path d="M45 150 Q45 74 51 60 L69 60 Q75 74 75 150 Q75 156 69 156 L51 156 Q45 156 45 150 Z" fill="url(#${id}h)"/>`
        +`<rect x="51" y="36" width="18" height="24" rx="6" fill="#d7c9be"/>`
        +`<rect x="49" y="92" width="22" height="30" rx="5" fill="url(#${id}s)"/>`;
    }
    return `<svg class="prodArt" viewBox="0 0 120 170" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs}${shadow}${body}</svg>`;
  };

  /* -------- garden background scene --------
     A warm, sunlit illustration (soft light rays, blurred background foliage
     and flowers, bokeh, and a surface for the pots to sit on). variant
     'grass' gives a green lawn for the Panned Garden. */
  function sceneLeaf(x,y,c,s){s=s||1;return `<g transform="translate(${x} ${y}) scale(${s})">`
    +`<path d="M0 0 C -7 -34 -30 -48 -42 -53 C -35 -22 -16 -4 0 0 Z" fill="${c}"/>`
    +`<path d="M0 0 C 7 -36 31 -50 44 -55 C 35 -22 16 -4 0 0 Z" fill="${c}"/>`
    +`<path d="M0 2 C -2 -42 -4 -60 0 -70 C 4 -60 2 -42 0 2 Z" fill="${c}"/></g>`;}
  function sceneFlower(x,y,c,r,ctr){let p='';for(let i=0;i<5;i++)p+=`<ellipse cx="${x}" cy="${y-r}" rx="${r*0.58}" ry="${r}" fill="${c}" transform="rotate(${i*72} ${x} ${y})"/>`;return `<g>${p}<circle cx="${x}" cy="${y}" r="${r*0.44}" fill="${ctr||'#f6d36b'}"/></g>`;}

  window.sceneSVG=function(variant){
    const id=uid('sc'), grass=(variant==='grass');
    const g1=grass?'#f3ead3':'#fdf3e7', g2=grass?'#ecebcf':'#f7e7d5', g3=grass?'#cdd99f':'#e7e1c1';
    const shelfA=grass?'#aec486':'#ebe0cc', shelfB=grass?'#8ba869':'#d8c8ac';
    return `<svg class="sceneArt" viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">`
      +`<defs>`
      +`<linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${g1}"/><stop offset="0.55" stop-color="${g2}"/><stop offset="1" stop-color="${g3}"/></linearGradient>`
      +`<radialGradient id="${id}sun" cx="0.28" cy="0.1" r="0.7"><stop offset="0" stop-color="#fff8ea" stop-opacity="0.95"/><stop offset="1" stop-color="#fff8ea" stop-opacity="0"/></radialGradient>`
      +`<linearGradient id="${id}shelf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shelfA}"/><stop offset="1" stop-color="${shelfB}"/></linearGradient>`
      +`<filter id="${id}b1" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>`
      +`<filter id="${id}b2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4"/></filter>`
      +`</defs>`
      +`<rect width="400" height="300" fill="url(#${id}sky)"/>`
      +`<rect width="400" height="300" fill="url(#${id}sun)"/>`
      +`<g opacity="0.55" filter="url(#${id}b1)"><polygon points="55,-20 120,-20 78,230 44,230" fill="#fff6e6"/><polygon points="150,-20 188,-20 150,215 122,215" fill="#fff6e6" opacity="0.7"/><polygon points="235,-20 262,-20 238,200 214,200" fill="#fff6e6" opacity="0.5"/></g>`
      +`<g filter="url(#${id}b1)" opacity="0.85">`
        +sceneLeaf(44,246,'#8fae73',1.5)+sceneLeaf(16,250,'#7f9f65',1.2)
        +sceneLeaf(360,250,'#86a76c',1.6)+sceneLeaf(392,252,'#9abb7e',1.2)+sceneLeaf(324,242,'#9cbb80',1.05)
        +sceneFlower(66,176,'#f0a9b6',13,'#f6d36b')+sceneFlower(350,188,'#eeb0ba',12,'#f6d36b')+sceneFlower(300,156,'#f3c38f',10,'#e89a5a')
      +`</g>`
      +`<g filter="url(#${id}b1)"><circle cx="110" cy="92" r="13" fill="#ffffff" opacity="0.5"/><circle cx="262" cy="70" r="10" fill="#f7cdd2" opacity="0.5"/><circle cx="332" cy="112" r="15" fill="#ffffff" opacity="0.4"/><circle cx="182" cy="58" r="8" fill="#f3d9a7" opacity="0.55"/><circle cx="214" cy="120" r="7" fill="#ffffff" opacity="0.45"/></g>`
      +`<path d="M-10 250 Q200 230 410 250 L410 310 L-10 310 Z" fill="url(#${id}shelf)"/>`
      +`<ellipse cx="200" cy="251" rx="235" ry="11" fill="#ffffff26" filter="url(#${id}b2)"/>`
      +`<path d="M-10 250 Q200 230 410 250" stroke="#00000012" stroke-width="2" fill="none"/>`
      +(grass?`<g filter="url(#${id}b2)" opacity="0.8">${sceneFlower(70,262,'#f0a9b6',8,'#f6d36b')}${sceneFlower(150,270,'#f3c38f',7,'#e89a5a')}${sceneFlower(300,266,'#eeb0ba',8,'#f6d36b')}${sceneFlower(360,272,'#f0d24e',7,'#e07a3b')}</g>`:'')
      +`</svg>`;
  };
})();
