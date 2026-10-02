const SEED_PRODUCTS = [
  // Glossier
  {brand:'Glossier',name:'Generation G — Fuzz',category:'Lips',shade:'#a96e6e',goal:30,active:true,notes:'Closer to your natural lip color; useful MLBB.'},
  {brand:'Glossier',name:'Generation G — Leo',category:'Lips',shade:'#9b654e',goal:30,active:true,notes:'Pulls orange; mix with Fuzz or Jam.'},
  {brand:'Glossier',name:'Generation G — Jam',category:'Lips',shade:'#7e3d5d',goal:20,active:false,notes:'Berry; useful for cooling warmer shades.'},
  {brand:'Glossier',name:'Generation G — Cake',category:'Lips',shade:'#b87568',goal:30,active:false,notes:'Potentially warm/peachy; mix with Fuzz or Jam.'},
  {brand:'Glossier',name:'Generation G — Punch',category:'Lips',shade:'#c94e65',goal:30,active:false,notes:'Sheer or mix if it feels too bright.'},
  {brand:'Glossier',name:'Ultralip — Fête',category:'Lips',shade:'#c44958',goal:20,active:false,notes:'Bolder red option.'},
  {brand:'Glossier',name:'Ultralip — Villa',category:'Lips',shade:'#b97978',goal:30,active:false,notes:'Rosy-beige test shade.'},
  {brand:'Glossier',name:'Ultralip — Trench',category:'Lips',shade:'#a76f55',goal:30,active:true,notes:'Potentially warm brown; layer over Fuzz/Jam.'},
  {brand:'Glossier',name:'Cloud Paint — Rise',category:'Blush',shade:'#c67573',goal:30,active:false,notes:'Test whether it reads rosy or warm.'},
  {brand:'Glossier',name:'Cloud Paint — Storm',category:'Blush',shade:'#9d5362',goal:30,active:true,notes:'Berry/rose; mix into warmer blushes.'},
  {brand:'Glossier',name:'Cloud Paint — Beam',category:'Blush',shade:'#e59a7e',goal:30,active:true,notes:'Mix with Storm or Dusk if too peachy.'},
  {brand:'Glossier',name:'Cloud Paint — Dusk',category:'Blush',shade:'#b88775',goal:30,active:true,notes:'Everyday neutral.'},
  {brand:'Glossier',name:'Cloud Paint — Puff',category:'Blush',shade:'#e9a3ad',goal:30,active:false,notes:'Mix with Storm for a dustier rose.'},
  {brand:'Glossier',name:'Cloud Paint — Eve',category:'Blush',shade:'#784654',goal:20,active:false,notes:'Deep berry; use lightly.'},

  // Violette_FR
  {brand:'Violette_FR',name:'Guimauve',category:'Lips',shade:'#d98991',goal:30},
  {brand:'Violette_FR',name:'Bonbon Coquelicot',category:'Lips',shade:'#d34f43',goal:30},
  {brand:'Violette_FR',name:'Bêtise',category:'Lips',shade:'#9f5d64',goal:30},
  {brand:'Violette_FR',name:'Rose Latte',category:'Lips',shade:'#a76566',goal:30},
  {brand:'Basie Beauty',name:"It's October 3rd Jelly Blush",category:'Blush',shade:'#c98991',goal:30},
  {brand:'Ciaté',name:'Matchmaker Blush',category:'Blush',shade:'#c98284',goal:30},
  {brand:'Lovecraft Beauty',name:'Unnamed pale orange-pink blush',category:'Blush',shade:'#e5a48e',goal:30},
  {brand:'Saie',name:'Dew Blush — Lady',category:'Blush',shade:'#a9515f',goal:30},
  {brand:'OFRA',name:'Ollie Need Is Love Blush',category:'Blush',shade:'#c77b75',goal:30},
  {brand:'OFRA',name:'Smiley for Ryleigh',category:'Blush',shade:'#cc8b83',goal:30},
  {brand:'Kaleidos',name:'Skin Luminate Palette — Blush',category:'Blush',shade:'#bb7679',goal:30},
  {brand:'Coloured Raine',name:'Glamour Highlighter / Eyeshadow',category:'Eyes',shade:'#c6a77b',goal:30},
  {brand:'ENTROPY',name:'Spinel Charm Gloss',category:'Lips',shade:'#8c5968',goal:30},
  {brand:'SUNGBOON EDITOR',name:'Honey Blossom Lip Care Balm',category:'Lips',shade:'#d7a66d',goal:30},

  // Fwee
  {brand:'fwee',name:'Oat Cinnamon Tinted Lip Balm',category:'Lips',shade:'#a97562',goal:30},
  {brand:'fwee',name:'Cherry Cola 30%',category:'Lips',shade:'#8f4650',goal:30},
  {brand:'fwee',name:'Vanilla 30%',category:'Lips',shade:'#b97c72',goal:30},
  {brand:'fwee',name:'Dirty Cola 30%',category:'Lips',shade:'#77514c',goal:30},
  {brand:'fwee',name:'Scotch 70%',category:'Lips',shade:'#875b49',goal:30},
  {brand:'fwee',name:'Currant 70%',category:'Lips',shade:'#714356',goal:30},
  {brand:'fwee',name:'Lip Contour — Camelia',category:'Lips',shade:'#a56e70',goal:30},
  {brand:'REFY',name:'Matte Lip — Bloom',category:'Lips',shade:'#a96970',goal:30,active:true,notes:'Confirmed perfect MLBB.'},

  // Judydoll / Marie Dalgar
  {brand:'Judydoll',name:'Shade 12',category:'Lips',shade:'#a95f68',goal:30},
  {brand:'Judydoll',name:'Shade 02',category:'Lips',shade:'#b7776e',goal:30},
  {brand:'Judydoll',name:'Shade 14',category:'Lips',shade:'#8e4e5c',goal:30},
  {brand:'Judydoll',name:'Shade N05',category:'Lips',shade:'#9b6867',goal:30},
  {brand:'Judydoll',name:'Shade P02 — Matte',category:'Lips',shade:'#c17b82',goal:30},
  {brand:'Judydoll',name:'Shade 04 — Matte',category:'Lips',shade:'#a45e5d',goal:30},
  {brand:'Judydoll',name:'Fine Curling Mascara 01 Black',category:'Eyes',shade:'#262421',goal:50},
  {brand:'Marie Dalgar',name:'Product — shade/name to confirm',category:'Other',shade:'#9a7770',goal:30},

  // NYX / e.l.f.
  {brand:'NYX',name:'Fat Oil — Kiwi Freezie',category:'Lips',shade:'#9c6972',goal:30},
  {brand:'NYX',name:'Vivid Rich Liner — Smokin Topaz',category:'Eyes',shade:'#624b42',goal:50},
  {brand:'e.l.f.',name:'Blush Tint — Plums Up',category:'Blush',shade:'#94576c',goal:30},
  {brand:'e.l.f.',name:'Coffee — pot product',category:'Eyes',shade:'#665047',goal:30},
  {brand:'e.l.f.',name:'Praline',category:'Lips',shade:'#95685c',goal:30},

  // 3CE
  {brand:'3CE',name:'Chasing Rose',category:'Lips',shade:'#a55e6b',goal:30},
  {brand:'3CE',name:'Ladydown',category:'Lips',shade:'#87575d',goal:30},
  {brand:'3CE',name:'Plumping Lips — Rosy',category:'Lips',shade:'#b86c78',goal:30},
  {brand:'3CE',name:'Super Slim Waterproof Mascara',category:'Eyes',shade:'#2b2926',goal:50},
  {brand:'3CE',name:'Milky Shadow — creamy lip product',category:'Lips',shade:'#b98980',goal:30},
  {brand:'KATE',name:'Lip Monster Super Glossy G03',category:'Lips',shade:'#9e5862',goal:30},

  // Dasique / Rom&nd / K-beauty
  {brand:'Dasique',name:'Shade 10',category:'Lips',shade:'#a66b6c',goal:30},
  {brand:'Dasique',name:'Shade 14',category:'Lips',shade:'#8f5963',goal:30},
  {brand:'rom&nd',name:'Juicy Lasting Tint Mini — Summer Fig',category:'Lips',shade:'#995a69',goal:30},
  {brand:'rom&nd',name:'Nudy Peanut',category:'Lips',shade:'#b87358',goal:30},
  {brand:'Holika Holika',name:'Water Drop — Fig Water',category:'Lips',shade:'#a35e66',goal:30},
  {brand:'Pink Bear',name:'Butterbear K02',category:'Lips',shade:'#a76e69',goal:30},
  {brand:'Colorgram',name:'Shy Guava',category:'Lips',shade:'#ce7f7b',goal:30},
  {brand:'Etude',name:'Fixing Tint — Dusty Beige',category:'Lips',shade:'#a97070',goal:30},
  {brand:'Tower 28',name:'Iced Dulce de Leche',category:'Lips',shade:'#8e5d54',goal:30},
  {brand:'The Crème Shop',name:'Peach',category:'Lips',shade:'#db8e78',goal:30},
  {brand:'Polished Wine',name:'Lip Tint 03 — Merlot Moment',category:'Lips',shade:'#7c3f50',goal:30},
  {brand:'ColourPop',name:'Crème Gel Liner — Brew Haha',category:'Eyes',shade:'#5c473d',goal:50},

  // Canmake / base / eye
  {brand:'CANMAKE',name:'Slim Liquid Liner 02',category:'Eyes',shade:'#4b3d37',goal:50},
  {brand:'CANMAKE',name:'Poreless Airy Base 01',category:'Base',shade:'#e6c5ae',goal:30},
  {brand:'CANMAKE',name:'Marshmallow Finish Powder — W Mini MO',category:'Base',shade:'#d7b59e',goal:30},
  {brand:'CANMAKE',name:'Plumpuku Coordinate Eyes 03',category:'Eyes',shade:'#a9837d',goal:30},
  {brand:'CANMAKE',name:'Creamy Touch Liner 03',category:'Eyes',shade:'#66504a',goal:50},
  {brand:'Betty Boop x Ipsy',name:'Drawn To You Eyeliner',category:'Eyes',shade:'#282421',goal:50},
  {brand:'CEZANNE',name:'Super Slim Eyebrow 03',category:'Eyes',shade:'#655149',goal:50},
  {brand:'NARS',name:'Radiant Creamy Concealer — Crème Brûlée Light 2.5',category:'Base',shade:'#d6a98d',goal:40,active:true,notes:'Confirmed strong skin match.'},
  {brand:'Rare Beauty',name:'Liquid Contour — Gentle',category:'Base',shade:'#9c6e5b',goal:30},
  {brand:'Vasanti',name:'VO1 Corrector',category:'Base',shade:'#d58d6c',goal:30,active:true,notes:'Use under NARS; slightly orange as a standalone.'}
].map((p,i)=>({id:'seed-'+i,uses:0,active:false,plant:['green','pink','yellow','blue','white','purple','sage'][i%7],notes:'',...p}));
