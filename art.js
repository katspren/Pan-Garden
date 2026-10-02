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

  const PALETTE={
    pink :{l:'#f4bec3',b:'#e69ba3',d:'#cf7a85',nub:'#dd8e97',petal:'#f09cae',petal2:'#e97f96',center:'#f6d36b'},
    green:{l:'#b1c998',b:'#92ae79',d:'#72915c',nub:'#819c6a',petal:'#f0afb8',petal2:'#e78fa0',center:'#f6d36b'},
    gold :{l:'#eedcab',b:'#ddc47f',d:'#c4a85b',nub:'#d3b567',petal:'#f1b24f',petal2:'#e78f3f',center:'#e07a3b'},
    slate:{l:'#c6d1dd',b:'#a0b1c2',d:'#7f93a7',nub:'#8fa1b4',petal:'#b7a9e6',petal2:'#9d8ede',center:'#f3d774'}
  };
  const LEAF='#6f9b5f', LEAFL='#8bb678', STEM='#6a9458';

  function leaf(x,y,rot,sc){
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})">`
      +`<path d="M0 0 C 1 -13 11 -22 21 -25 C 17 -11 8 -2 0 0 Z" fill="${LEAF}"/>`
      +`<path d="M3 -3 C 9 -11 15 -17 19 -21" stroke="${LEAFL}" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`;
  }
  function stem(x2,y2,bend){
    return `<path d="M50 68 Q ${50+(bend||0)} ${(68+y2)/2} ${x2} ${y2}" stroke="${STEM}" stroke-width="4.6" fill="none" stroke-linecap="round"/>`;
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

  window.plantSVG=function(color,stage,size){
    size=size||70; stage=Math.max(0,Math.min(4,stage|0));
    const P=PALETTE[color]||PALETTE.pink;
    const g=uid('pg');
    let fol='';
    if(stage<=0){ fol=leaf(50,64,-24,0.68)+leaf(50,64,24,0.68); }
    else if(stage===1){ fol=stem(47,47,-3)+leaf(47,53,-42,0.82)+leaf(49,50,38,0.8); }
    else if(stage===2){ fol=stem(43,41,-6)+stem(58,45,6)+leaf(43,47,-46,1)+leaf(45,42,26,0.9)+leaf(58,51,48,0.95)+leaf(58,46,70,0.7); }
    else if(stage===3){ fol=stem(44,40,-6)+stem(58,43,6)+leaf(44,51,-46,1)+leaf(58,53,48,0.9)+bud(44,37,P)+bud(58,40,P); }
    else { fol=stem(43,37,-7)+stem(58,41,7)+stem(51,31,0)+leaf(44,53,-47,1)+leaf(59,55,49,0.95)+leaf(42,47,-74,0.68)+bloom(43,34,1.05,P)+bloom(58,37,0.92,P)+bloom(51,29,1.18,P); }
    return `<svg class="plantArt" viewBox="0 0 100 122" width="${size}" height="${Math.round(size*1.22)}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">`
      +`<defs>`
      +`<linearGradient id="${g}b" x1="0" y1="0" x2="0.85" y2="1"><stop offset="0" stop-color="${P.l}"/><stop offset="1" stop-color="${P.d}"/></linearGradient>`
      +`<radialGradient id="${g}h" cx="0.34" cy="0.28" r="0.85"><stop offset="0" stop-color="#ffffff66"/><stop offset="0.55" stop-color="#ffffff00"/></radialGradient>`
      +`</defs>`
      +`<ellipse cx="50" cy="116" rx="29" ry="5.5" fill="#00000012"/>`
      +fol
      +`<circle cx="77" cy="92" r="8.5" fill="${P.nub}"/><circle cx="77" cy="92" r="8.5" fill="url(#${g}h)"/>`
      +`<rect x="24" y="62" width="52" height="52" rx="16" fill="url(#${g}b)"/>`
      +`<rect x="24" y="62" width="52" height="52" rx="16" fill="url(#${g}h)"/>`
      +`<ellipse cx="41.5" cy="90" rx="3.1" ry="4.1" fill="#3f2e2a"/><ellipse cx="58.5" cy="90" rx="3.1" ry="4.1" fill="#3f2e2a"/>`
      +`<circle cx="42.7" cy="88.4" r="1.05" fill="#fff"/><circle cx="59.7" cy="88.4" r="1.05" fill="#fff"/>`
      +`<path d="M44 98 Q50 103.5 56 98" stroke="#3f2e2a" stroke-width="2.3" fill="none" stroke-linecap="round"/>`
      +`<ellipse cx="36.5" cy="97" rx="3.1" ry="1.9" fill="#ffffff33"/><ellipse cx="63.5" cy="97" rx="3.1" ry="1.9" fill="#ffffff33"/>`
      +`</svg>`;
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
})();
