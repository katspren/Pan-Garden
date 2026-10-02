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

  window.plantSVG=function(color,stage,size){
    size=size||70; stage=Math.max(0,Math.min(4,stage|0));
    const P=PALETTE[color]||PALETTE.pink;
    const g=uid('pg');
    let fol='';
    if(stage<=0){ fol=leaf(55,52,-24,0.6)+leaf(55,52,24,0.6); }
    else if(stage===1){ fol=stem(52,38,-3)+leaf(52,44,-42,0.78)+leaf(53,41,38,0.76); }
    else if(stage===2){ fol=stem(49,32,-6)+stem(64,36,6)+leaf(49,38,-46,0.95)+leaf(50,33,26,0.86)+leaf(64,42,48,0.9)+leaf(64,37,70,0.64); }
    else if(stage===3){ fol=stem(50,32,-6)+stem(63,34,6)+leaf(50,42,-46,0.95)+leaf(63,44,48,0.86)+bud(50,28,P)+bud(63,31,P); }
    else { fol=stem(49,28,-7)+stem(63,31,7)+stem(56,21,0)+leaf(50,44,-47,0.95)+leaf(64,46,49,0.9)+leaf(48,38,-74,0.62)+bloom(49,25,1,P)+bloom(63,28,0.88,P)+bloom(56,18,1.05,P); }
    return `<svg class="plantArt" viewBox="0 0 110 102" width="${size}" height="${Math.round(size*0.93)}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">`
      +`<defs>`
      +`<linearGradient id="${g}b" x1="0" y1="0" x2="0.85" y2="1"><stop offset="0" stop-color="${P.l}"/><stop offset="1" stop-color="${P.d}"/></linearGradient>`
      +`<radialGradient id="${g}h" cx="0.34" cy="0.26" r="0.85"><stop offset="0" stop-color="#ffffff66"/><stop offset="0.55" stop-color="#ffffff00"/></radialGradient>`
      +`</defs>`
      +`<ellipse cx="55" cy="97" rx="31" ry="5" fill="#00000012"/>`
      +fol
      +`<circle cx="84" cy="74" r="8.5" fill="${P.nub}"/><circle cx="84" cy="74" r="8.5" fill="url(#${g}h)"/>`
      +`<rect x="27" y="52" width="56" height="44" rx="15" fill="url(#${g}b)"/>`
      +`<rect x="27" y="52" width="56" height="44" rx="15" fill="url(#${g}h)"/>`
      +`<ellipse cx="46.5" cy="74" rx="3.1" ry="4" fill="#3f2e2a"/><ellipse cx="63.5" cy="74" rx="3.1" ry="4" fill="#3f2e2a"/>`
      +`<circle cx="47.7" cy="72.4" r="1.05" fill="#fff"/><circle cx="64.7" cy="72.4" r="1.05" fill="#fff"/>`
      +`<path d="M49 82 Q55 87.5 61 82" stroke="#3f2e2a" stroke-width="2.3" fill="none" stroke-linecap="round"/>`
      +`<ellipse cx="41" cy="81" rx="3.1" ry="1.9" fill="#ffffff33"/><ellipse cx="69" cy="81" rx="3.1" ry="1.9" fill="#ffffff33"/>`
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
