
// ---------- helpers
const BG=document.getElementById('bg');
const mixc=(a,b,k)=>{const pa=a.match(/\w\w/g).map(h=>parseInt(h,16)),pb=b.match(/\w\w/g).map(h=>parseInt(h,16));return pa.map((v,i)=>Math.round(v+(pb[i]-v)*k).toString(16).padStart(2,'0')).join('')};
const M=TL.marks;const REL=new Set(['r1','r2','r3','r4']);
// sous-titres : morceaux courts (2 lignes max)
const chunksC=[];TL.segments.forEach(s=>{if(REL.has(s.id)){chunksC.push({words:s.words,t0:s.words[0].t0,t1:s.words[s.words.length-1].t1,rel:true,seg:s.id});return}
  let cur=[],n=0;s.words.forEach((w,i)=>{cur.push(w);n+=w.w.length+1;const nx=s.words[i+1];if(/[\.\?\!,:…]$/.test(w.w)||cur.length>=3||n>=13||(nx&&n+nx.w.length>17)||i===s.words.length-1){chunksC.push({words:cur,t0:cur[0].t0,t1:cur[cur.length-1].t1,seg:s.id});cur=[];n=0}})});
chunksC[0].t0=0;chunksC.forEach((c,i)=>{c.end=i<chunksC.length-1?Math.min(chunksC[i+1].t0,c.t1+.45):c.t1+.6});
const $=id=>document.getElementById(id);
const lerp=(a,b,k)=>a+(b-a)*k;const V=(a,b,k)=>[0,1,2].map(i=>lerp(a[i],b[i],k));
const T_REV=wordT('faux','faux')-.03;const T_MIC=SEG.a.t0-.1;const T_CTA=SEG.j.t0-.1;
const CD=[M.cd0,M.cd0+.433,M.cd0+.866];const T_SPG=M.rup1-.25;
const WALLS=[[T_MIC-.28,T_MIC+.04]];
const RT=['r1','r2','r3'].map(k=>SEG[k].t0-.08);
const KF=(t,p,l,d)=>({t,p,l,d});
const keyed=(KK,t)=>{const at=(i,t)=>{const k0=KK[i];if(i<=0)return[k0.p,k0.l];const st=at(i-1,k0.t);const d=k0.d===undefined?.75:k0.d;const k=d<=0?1:eio(pr(t,k0.t,d));return[V(st[0],k0.p,k),V(st[1],k0.l,k)]};let i=0;for(let k=0;k<KK.length;k++)if(t>=KK[k].t)i=k;return at(i,t)};
const wT=wordT;
const CAMS={
 KIT:[KF(0,[.2,1.6,7.2],[.2,1.35,0]),KF(.15,[.2,1.45,6.2],[.2,1.3,0],3.8),KF(CD[0],[.6,1.3,5.6],[.1,1.2,0],0),KF(CD[1],[-.4,1.2,5.0],[0,1.15,0],0),KF(CD[2],[.2,1.1,4.4],[0,1.05,0],0),
   KF(T_REV,[.3,1.7,6.6],[.1,1.2,0],0),KF(SEG.pire.t0+.2,[.2,1.5,5.6],[.1,1.15,0],1.6)],
 MIC_A:[KF(T_MIC,[0,3.4,10.5],[0,1.6,0],0),KF(wT('a','tomber')-.1,[0,2.6,8.6],[0,1.3,0],1.2),KF(wT('a','bactéries')-.15,[4.2,1.5,6.8],[1.6,.4,2.2],0),KF(wT('a','sautent')-.12,[.4,2.3,6.6],[0,1.4,0],0),KF(wT('a','seconde'),[.2,2.0,5.4],[0,1.4,0],1.0)],
 LAB:[KF(SEG.b.t0-.1,[0,11.5,9.0],[0,.6,0],0),KF(wT('b','inox')-.1,[.8,10.6,8.2],[0,.4,0],2.0),KF(wT('b','moquette')+.2,[0,10.0,7.6],[0,.3,0],1.0)],
 MIC_R1:[KF(RT[0],[-1.2,2.6,6.4],[0,1.4,0],0),KF(RT[0]+.1,[-.6,2.2,5.0],[0,1.4,0],1.4)],
 MIC_C:[KF(SEG.c.t0-.06,[-.8,2.9,6.8],[0,1.7,0],0),KF(wT('c','humide')-.15,[.9,1.9,3.4],[.4,1.4,0],0),KF(wT('c','presque')-.1,[0,2.5,5.6],[0,1.5,0],1.2)],
 MIC_R2:[KF(RT[1],[3.6,2.2,6.0],[0,1.3,0],0),KF(RT[1]+.1,[2.6,1.9,4.8],[0,1.3,0],1.2)],
 CARP:[KF(SEG.e.t0-.06,[0,4.2,7.6],[0,1.0,0],0),KF(SEG.e.t0+.2,[0,3.0,6.0],[0,1.1,0],2.6)],
 KIT_R3:[KF(RT[2],[-3.6,3.0,8.0],[0,1.2,0],0),KF(RT[2]+.1,[-1.6,2.4,7.4],[0,1.2,0],3.6)],
 LAB_G:[KF(SEG.g.t0-.06,[0,11.0,8.6],[0,.3,0],0),KF(SEG.g.t0+.2,[-.8,10.0,7.8],[0,.2,0],3.0)],
 SINK:[KF(SEG.r4.t0-.1,[2.8,3.6,5.2],[.6,.3,.2],0),KF(SEG.r4.t0,[1.4,1.7,2.4],[.85,.4,.35],2.0),KF(M.rup0-.05,[1.0,.95,1.15],[.88,.5,.4],.8)],
 SPG:[KF(T_SPG,[0,1.0,1.4],[0,-.4,0],0),KF(T_SPG+.02,[0,4.0,6.2],[0,.2,0],1.8),KF(wT('i','362')-.1,[2.2,2.6,4.4],[.8,0,.4],0),KF(wT('i','milliards')-.3,[0,7.5,5.5],[0,0,0],2.2)],
 END:[KF(T_CTA,[0,7.5,7.0],[0,.6,0],0)]};
const SHOTS=[
 {t:0,type:'full',w:'kit',cams:'KIT',bg:t=>t<T_REV?'2b3fae':mixc('2b3fae','ff3355',eo(pr(t,T_REV,.3)))},
 {t:T_MIC,type:'full',w:'mic',cams:'MIC_A',bg:'ffb000'},
 {t:SEG.b.t0-.1,type:'full',w:'lab',cams:'LAB',bg:'13c2c2'},
 {t:RT[0],type:'full',w:'mic',cams:'MIC_R1',bg:'7b2cbf'},
 {t:SEG.c.t0-.06,type:'full',w:'mic',cams:'MIC_C',bg:'ff3d7f'},
 {t:RT[1],type:'full',w:'mic',cams:'MIC_R2',bg:'ff7a1a'},
 {t:SEG.e.t0-.06,type:'full',w:'carp',cams:'CARP',bg:'ffd60a'},
 {t:wT('e','moquette')-.12,type:'split',top:{w:'mic',p:[.4,2.4,6.2],l:[0,1.4,0],bg:'ff3b30'},bot:{w:'carp',p:[0,3.6,6.4],l:[0,1.1,0],bg:'ffd60a'}},
 {t:RT[2],type:'full',w:'kit',cams:'KIT_R3',bg:'e23b3b'},
 {t:SEG.g.t0-.06,type:'full',w:'lab',cams:'LAB_G',bg:'13c2c2'},
 {t:wT('g','bonbon')-.12,type:'split',top:{w:'carp',p:[0,3.4,6.0],l:[0,1.1,0],bg:'22c55e'},bot:{w:'mic',p:[.6,2.3,6.0],l:[0,1.3,0],bg:'ff3b30'}},
 {t:SEG.r4.t0-.1,type:'full',w:'sink',cams:'SINK',bg:t=>mixc('2a1440','0c0612',eo(pr(t,SEG.r4.t0,2.5)))},
 {t:T_SPG,type:'full',w:'spg',cams:'SPG',bg:'ffb000'},
 {t:SEG.i2.t0-.08,type:'split',top:{w:'sink',p:[2.6,2.6,3.6],l:[.8,.4,.3],bg:'2ee6d6'},bot:{w:'spg',p:[1.0,3.4,4.6],l:[.3,0,0],bg:'ffb000'}},
 {t:T_CTA,type:'full',w:'kit',cams:'END',bg:'7b2cbf'}];
const shotAt=t=>{let s=SHOTS[0];for(const x of SHOTS)if(t>=x.t)s=x;return s};
const CHIPS=[[wT('a','bactéries')-.1,wT('a','elles')-.1,'SOL CONTAMINÉ'],[wT('e','oui')-.1,SEG.e.t1+.1,'LA MOQUETTE GAGNE'],[wT('g','ce qui')-.05,wT('g','bonbon')-.2,'QUOI ? ET OÙ ?'],
  [wT('i','éponge')-.1,wT('i','362')-.15,'TON ÉPONGE'],[wT('i2','régulièrement')-.1,wT('i2','conseillent')-.15,'MÊME LAVÉE']];
const POPS=[[wT('a','seconde')-.05,1.25,'< 1 SECONDE','ffd60a','1b1030',-4],[wT('c','championne')-.05,1.2,'CHAMPIONNE','ff3d7f','ffffff',3],[wT('g','poubelle')-.05,1.3,'POUBELLE','e23b3b','ffffff',-3],
  [wT('i','362')-.05,1.3,'362 ESPÈCES','2ee6d6','1b1030',3],[wT('i2','toutes')-.05,1.4,'1 À 2 SEMAINES','ffd60a','1b1030',-3]];
const T_HEART=1e9;
const HEARTS=[];
// ---------- mise à jour des mondes
function updateWorlds(t){
  const bt=t-T_REV;
  // chrono : 5 s pendant l'accroche, 3-2-1 au compte à rebours, s'affole au FAUX
  let sec=5*eo(pr(t,.5,3.2));const ci=CD.findIndex((c,i)=>t>=c&&t<c+.433);if(t>=CD[0])sec=3-Math.max(0,Math.min(2,CD.filter(c=>t>=c).length-1));
  kChrono.userData.hand.rotation.z=bt>0?-sec/60*Math.PI*2-bt*9:-sec/60*Math.PI*2;
  const tick=Math.max(...CD.map(c=>t>=c&&t<c+.25?1-(t-c)/.25:0));
  KIT.position.x=Math.sin(t*70)*.02*tick;
  // plâtre -> couleurs
  const ck=eo(pr(t,T_REV+.08,.6));plasterMats.forEach(([m,c,r,mt])=>{m.color.copy(PLASTER).lerp(c,ck);m.roughness=lerp(.95,r,ck);m.metalness=lerp(0,mt,ck)});
  const hop=bt>0&&bt<.6?Math.sin(bt/.6*Math.PI)*.35:0;kMelon.position.y=hop;kGum.position.y=hop*.7;kBread.position.y=hop*.5;
  shards.forEach(m=>{const u=m.userData;if(bt<0){m.visible=false;return}const tt=Math.min(bt,1.6);m.visible=bt<1.5;m.position.set(u.p0.x+u.v.x*tt,Math.max(.02,u.p0.y+u.v.y*tt-6*tt*tt),u.p0.z+u.v.z*tt);m.rotation.set(u.r.x*tt,u.r.y*tt,u.r.z*tt);m.material.opacity=1-clamp((bt-.9)/.6)});
  if(bt>0){for(let i=0;i<DN;i++){const v=dv[i];dp[i*3]=v.x*bt*1.6;dp[i*3+1]=v.y*bt*1.4-.6*bt*bt;dp[i*3+2]=v.z*bt*1.6}dg.attributes.position.needsUpdate=true;dust.material.opacity=.95*(1-clamp(bt/1.7))}else dust.material.opacity=0;
  // la pastèque tombe, les bactéries apparaissent puis sautent
  {const tf=wT('a','tomber');const k=pr(t,tf-.05,.5);const y=k<1?4.5*(1-k*k):0;const bo=t>tf+.45&&t<tf+.85?Math.sin((t-tf-.45)/.4*Math.PI)*.25:0;mMelon.position.y=y+bo;mMelon.rotation.z=k<1?(1-k)*.4:0;
   const tb=wT('a','bactéries'),ts=wT('a','sautent');
   mb.forEach((b,k)=>{const u=b.userData;const s=back(pr(t,tb-.1+k*.012,.3));b.visible=s>.01;b.scale.setScalar(Math.max(.001,s)*1.25);
     const tj=t-(ts+u.del*.75);const j=clamp(tj/.42);const H=mbHome[k],O=mbOn[k];
     if(tj<=0){b.position.copy(H);b.rotation.set(0,u.ry,0);wig(b,t)}
     else{const e=eio(j);b.position.set(lerp(H.x,O.x,e),lerp(H.y,O.y,e)+Math.sin(j*Math.PI)*1.6,lerp(H.z,O.z,e));b.rotation.set(0,O.z<0?Math.PI:0,j<1?j*6:0);if(j>=1)wig(b,t,.6)}});
   const th=wT('c','humide');drops.forEach((d,k)=>{const s=back(pr(t,th+k*.02,.3));d.visible=s>.01;d.scale.set(s,s,s*.5)});
   const tc=wT('c','championne');const cs=back(pr(t,tc,.4));crown.visible=t>tc&&t<SEG.e.t0;crown.scale.setScalar(Math.max(.001,cs));crown.rotation.y=t*1.5;crown.position.y=2.35+Math.sin(t*3)*.05}
  // le labo : aliments puis surfaces, puis tout tombe
  {const fw=['pain','beurré','bonbons','pastèque'],sw=['inox','carrelage','bois','moquette'];const drop=wT('b','moquette')+.45;
   PATCH.forEach((p,k)=>{const s=back(pr(t,wT('b',sw[k])-.05,.35));p.scale.setScalar(t>SEG.g.t0-1?1:Math.max(.001,s))});
   FOODS.forEach((f,k)=>{const P=PATCH[k].position;let s=back(pr(t,wT('b',fw[k])-.05,.35));if(t>SEG.g.t0-1)s=1;f.scale.setScalar(Math.max(.001,s)*(k==3?.6:k==2?.7:1));
     const dk=pr(t,drop+k*.08,.38);const y=dk<1?1.9-1.78*dk*dk+(dk<=0?Math.sin(t*3+k)*.08:0):.12;f.position.set(P.x,t>SEG.g.t0-1?.12:y,P.z);f.rotation.y=k*.7+.3;
     if(k==3)f.rotation.set(0,.3,0)})}
  // moquette : l'ourson rebondit doucement
  cGum.position.y=.28+Math.abs(Math.sin(t*2.2))*.12;cGum.rotation.y=Math.sin(t*.8)*.4;cb.forEach(b=>{b.position.y=.45;wig(b,t)});
  // éponge : bulles pendant le lavage
  bubbles.forEach(b=>{const u=b.userData;const ph=(t*.35+u.s)%1;b.position.set(sponge.position.x+u.x,.7+ph*1.6,sponge.position.z+u.z);b.scale.setScalar(.6+ph*.8);b.material.opacity=.55*Math.sin(ph*Math.PI);b.visible=t>SEG.i2.t0-.2});
  // dans l'éponge : la colonie grossit
  {const n1=wT('i','362'),n2=wT('i','milliards');sb.forEach(b=>{const u=b.userData;const st=u.ord<40?T_SPG+u.ord*.01:u.ord<90?n1+(u.ord-40)*.012:n2+(u.ord-90)*.01;const s=back(pr(t,st,.3));b.visible=s>.01;
    b.scale.setScalar(Math.max(.001,s)*(.9+(u.ord%5)*.1));b.position.copy(u.home);b.position.x+=Math.sin(t*.7+u.ph)*.12;b.position.z+=Math.cos(t*.6+u.ph)*.1;b.rotation.set(0,u.ry+t*.2,0);wig(b,t)})}
  // mur de plâtre
  let wv=false;for(const [a,b] of WALLS){if(t>=a&&t<b+.9){wv=true;wallTiles.forEach(m=>{const u=m.userData;const tt=t-b-u.del;
      if(tt<0){const pre=eo(pr(t,a,b-a));m.position.copy(u.p0);m.position.x+=(Math.sin(u.r.x*9)*.002)*pre;m.position.y+=(Math.cos(u.r.y*7)*.002)*pre;m.rotation.set(0,0,u.r0+u.r.z*.004*pre);m.material.opacity=1;m.visible=true}
      else{m.position.set(u.p0.x+u.v.x*tt,u.p0.y+u.v.y*tt-1.6*tt*tt,u.p0.z+u.v.z*tt);m.rotation.set(u.r.x*tt,u.r.y*tt,u.r0+u.r.z*tt);m.material.opacity=1-clamp((tt-.35)/.4);m.visible=tt<.8}})}}
  WALL.visible=wv;
}
function setWorld(w){KIT.visible=w==='kit';MIC.visible=w==='mic';LAB.visible=w==='lab';CARP.visible=w==='carp';SINK.visible=w==='sink';SPG.visible=w==='spg';lightFor(w)}
const tint=c=>{floor.material.color.set('#'+mixc(c,'ffffff',.45));labFloor.material.color.set('#'+mixc(c,'ffffff',.55))};
const shade=(c,k)=>'#'+mixc(c,k>0?'ffffff':'000000',Math.abs(k));
const drift=(p,t,a=1)=>[p[0]+Math.sin(t*.37)*.12*a,p[1]+Math.sin(t*.29)*.07*a,p[2]];
window.render=t=>{
  updateWorlds(t);
  const sh=shotAt(t);const bt=t-T_REV;
  R.setScissorTest(false);R.setViewport(0,0,W,H);R.clear();
  if(sh.type==='full'){
    const [P,L]=keyed(CAMS[sh.cams],t);let p=drift(P,t);
    if(bt>0&&bt<.35){p[0]+=Math.sin(t*90)*.08*(1-bt/.35);p[1]+=Math.cos(t*80)*.06*(1-bt/.35)}
    for(const [a,b] of WALLS){const tt=t-b;if(tt>0&&tt<.3){p[0]+=Math.sin(t*85)*.06*(1-tt/.3);p[1]+=Math.cos(t*77)*.05*(1-tt/.3)}}
    const c=typeof sh.bg==='function'?sh.bg(t):sh.bg;
    cam.position.set(...p);cam.lookAt(...L);setWorld(sh.w);tint(c);R.render(scene,cam);
    BG.style.background=`radial-gradient(circle at 50% 44%, ${shade(c,.18)} 0, #${c} 52%, ${shade(c,-.4)} 100%)`;
  }else if(sh.type==='split'){
    WALL.visible=false;R.setScissorTest(true);
    const halves=[[sh.top,camTop,H/2],[sh.bot,camBot,0]];
    for(const [h,c,y0] of halves){c.position.set(...drift(h.p,t+(y0?0:1.7),.8));c.lookAt(...h.l);tint(h.bg);R.setViewport(0,y0,W,H/2);R.setScissor(0,y0,W,H/2);setWorld(h.w);R.render(scene,c)}
    R.setScissorTest(false);
    BG.style.background=`linear-gradient(180deg, ${shade(sh.top.bg,.12)} 0%, #${sh.top.bg} 30%, ${shade(sh.top.bg,-.3)} 50%, ${shade(sh.bot.bg,.12)} 50%, #${sh.bot.bg} 80%, ${shade(sh.bot.bg,-.3)} 100%)`;
  }
  // ---------- habillage
  const op=(el,v,sc=1)=>{el.style.opacity=(+v).toFixed(3);el.style.transform=`scale(${(+sc).toFixed(4)})`};
  const ctaOn=eo(pr(t,T_CTA,.35));
  op($('pill'),1-eo(pr(t,T_REV,.15)),1);
  op($('brand'),eo(pr(t,T_REV+.05,.25))*(1-ctaOn),.85+.15*back(pr(t,T_REV+.05,.35)));
  const cl=$('claim');const big=1-eo(pr(t,T_MIC-.1,.45));cl.className='e'+(big<.12?' sm':'');cl.style.fontSize=(34+42*big).toFixed(2)+'px';cl.style.top=(352-12*(1-big)).toFixed(1)+'px';
  cl.style.opacity=((1-ctaOn)*(1-eo(pr(t,SEG.pire.t0-.15,.2))*(1-eo(pr(t,T_MIC+.35,.3))))).toFixed(3);
  const sEl=cl.querySelector('s');sEl.style.setProperty('--w',(eo(pr(t,T_REV+.02,.3))*100).toFixed(2)+'%');sEl.style.setProperty('--h',(5+5*big).toFixed(2)+'px');
  op($('faux'),eo(pr(t,T_REV,.08))*(1-eo(pr(t,SEG.pire.t0-.12,.18))),.6+.4*back(pr(t,T_REV,.28)));
  const relSeg=['r1','r2','r3','r4'].map(k=>SEG[k]).find(g=>t>=g.t0-.25&&t<g.t1+.35);
  op($('scrim'),Math.max(eo(pr(t,SEG.pire.t0-.05,.2))*(1-eo(pr(t,T_MIC-.25,.2))),relSeg?.75*eo(pr(t,relSeg.t0-.25,.2))*(1-eo(pr(t,relSeg.t1+.15,.2))):0,.38));
  op($('pire'),eo(pr(t,SEG.pire.t0,.15))*(1-eo(pr(t,T_MIC-.3,.15))),.85+.15*back(pr(t,SEG.pire.t0,.3)));
  const ci=CD.findIndex((c,i)=>t>=c&&t<c+.433);
  if(ci>=0){$('cd').textContent=String(3-ci);op($('cd'),1-eo(pr(t,CD[ci]+.33,.1)),1.35-.35*back(pr(t,CD[ci],.2)))}else op($('cd'),0);
  op($('card'),0);
  $('black').style.opacity=(t>=M.rup0-.1&&t<T_SPG?.94*eo(pr(t,M.rup0-.1,.4)):(t>=T_SPG&&t<T_SPG+.7?.94*(1-eo(pr(t,T_SPG,.7))):0)).toFixed(3);
  op($('divider'),sh.type==='split'?1:0);
  const vk=eo(pr(t,SEG.r4.t0,2.5))*(t<T_SPG?1:0);$('vig').style.background=`radial-gradient(circle at 50% 42%, rgba(0,0,0,0) ${(60-34*vk).toFixed(1)}%, rgba(0,0,0,${(.85*vk).toFixed(3)}) ${(100-30*vk).toFixed(1)}%)`;
  const chp=CHIPS.find(c=>t>=c[0]&&t<c[1]);
  if(chp){const el=$('chip').querySelector('.c');if(el.textContent!==chp[2])el.textContent=chp[2];op($('chip'),eo(pr(t,chp[0],.15))*(1-eo(pr(t,chp[1]-.15,.15))),.8+.2*back(pr(t,chp[0],.3)))}else op($('chip'),0);
  const pp=POPS.find(p=>t>=p[0]&&t<p[0]+p[1]);
  if(pp){const el=$('pop').querySelector('.p');if(el.textContent!==pp[2]){el.textContent=pp[2];el.style.fontSize='170px';const w=el.offsetWidth;if(w>860)el.style.fontSize=(170*(860-108)/(w-108)).toFixed(1)+'px'}el.style.background='#'+pp[3];el.style.color='#'+pp[4];el.style.rotate=pp[5]+'deg';
    op($('pop'),1-eo(pr(t,pp[0]+pp[1]-.15,.15)),1.3-.3*back(pr(t,pp[0],.25)))}else op($('pop'),0);
  op($('cta'),ctaOn,1);const cin=$('cta').querySelector('.in');cin.style.transform=`scale(${(.96+.04*eo(pr(t,T_CTA,.5))+.03*eio(pr(t,T_CTA+.5,TL.duration-T_CTA-.5))).toFixed(4)})`;
  $('cta').querySelector('.a').style.transform=`translateY(${(Math.abs(Math.sin((t-T_CTA)*3.1))*-10).toFixed(2)}px)`;
  const fl=Math.max(0,1-Math.min(...WALLS.map(w=>Math.abs(t-w[1]-.02)))/.16)*.35;$('flash').style.opacity=fl.toFixed(3);
  // sous-titres
  const ch=chunksC.find(c=>t>=c.t0-.05&&t<c.end);const hide=(t>T_REV-.05&&t<SEG.a.t0-.05)||t>=T_CTA||(ch&&(ch.seg==='faux'||ch.seg==='pire'))||(t<T_REV);const cap=$('cap');
  if(ch&&!hide){cap.style.setProperty('--fs',ch.rel?1:Math.min(1,11/Math.max(...ch.words.map(w=>w.w.length))).toFixed(3));cap.className='e'+(ch.rel?' rel':'');cap.innerHTML=ch.words.map(w=>`<i class="${!ch.rel&&t>=w.t0&&t<w.t1+.05?'on':(/^\d/.test(w.w)?'k':'')}">${w.w}</i>`).join(' ');op(cap,eo(pr(t,ch.t0-.05,.12)),.92+.08*back(pr(t,ch.t0-.05,.18)))}else op(cap,0);
  {const EMO={'nourriture':'🍽️','bactéries':'🦠','sautent':'🦘','pain':'🍞','beurré':'🧈','bonbons':'🍬','pastèque':'🍉','inox':'🥄','carrelage':'🔲','bois':'🪵','moquette':'🧶','humide':'💧','instantanément':'⚡','poubelle':'🗑️','bonbon':'🍬','éponge':'🧽','allemands':'🇩🇪','milliards':'🤯','microbiologistes':'🔬','soufflent':'💨','vois':'👀','championne':'🏆'};
   const nk=x=>x.toLowerCase().replace(/[.,!?…:]/g,'').replace(/^l'|^d'/,'');let hit=null;
   if(ch&&!hide&&!ch.rel)for(const w of ch.words){const e=EMO[nk(w.w)];if(e&&t>=w.t0-.05&&t<w.t0+1.1)hit=[e,w.t0]}
   const popOn=POPS.some(p=>t>=p[0]-.1&&t<p[0]+p[1]+.1);if(popOn)hit=null;const em=$('emo');if(hit){em.style.bottom=(470+cap.offsetHeight+10)+'px';if(em.textContent!==hit[0])em.textContent=hit[0];const k=t-hit[1];em.style.opacity=(1-clamp((k-.9)/.2)).toFixed(3);em.style.transform=`scale(${(.3+.7*back(clamp((k+.05)/.25))).toFixed(3)}) rotate(${(Math.sin(k*9)*8*(1-clamp(k/.8))).toFixed(1)}deg)`}else em.style.opacity='0';}
};
for(const f of['900 80px MO','400 80px Noto Color Emoji','400 80px LI','900 80px RU','800 80px RU','900 80px FR','italic 900 80px FR','800 40px IN','600 40px IN'])await document.fonts.load(f);
window.READY=true;
</script></body></html>
