const T_REV=wordT('faux','faux')-.03;const T_MIC=SEG.a.t0-.1;const T_CTA=SEG.j.t0-.1;
const CD=[M.cd3,M.cd2,M.cd1];const T_SPG=M.rup1-.25;
const WALLS=[[T_MIC-.28,T_MIC+.04]];
const RT=['r1','r2','r3'].map(k=>SEG[k].t0-.08);
const KF=(t,p,l,d)=>({t,p,l,d});
const keyed=(KK,t)=>{const at=(i,t)=>{const k0=KK[i];if(i<=0)return[k0.p,k0.l];const st=at(i-1,k0.t);const d=k0.d===undefined?.75:k0.d;const k=d<=0?1:eio(pr(t,k0.t,d));return[V(st[0],k0.p,k),V(st[1],k0.l,k)]};let i=0;for(let k=0;k<KK.length;k++)if(t>=KK[k].t)i=k;return at(i,t)};
const wT=wordT;
const T_SLV=wT('b','manche')-.2, T_ATT=wT('c','moustiques')-.1, T_ACI=wT('e','acides'), T_DAV=wT('e','davantage')-.2, T_CLK=wT('g','stables')-.2, T_SANG=wT('i','sang'), T_PON=wT('i','pondre'), T_MAL=wT('i','mâle');
const CAMS={
 HAND:[KF(0,[0,6.2,5.8],[0,1.0,-.4]),KF(.15,[0,5.0,4.6],[0,1.2,-.4],3.8),KF(CD[0],[1.4,4.2,4.0],[0,1.3,-.4],0),KF(CD[1],[-1.4,3.8,3.6],[0,1.3,-.4],0),KF(CD[2],[0,3.4,3.2],[0,1.3,-.5],0),
   KF(T_REV,[0,6.2,5.6],[0,1.0,-.4],0),KF(SEG.pire.t0+.2,[.3,5.0,4.6],[0,1.2,-.4],1.6)],
 EXP_A:[KF(T_MIC,[0,7.4,6.4],[0,.2,-.4],0),KF(wT('a','toujours')-.1,[-2.6,3.8,3.8],[-1.25,.6,-.3],1.0),KF(wT('a','dévorer')+.3,[-2.0,4.6,3.8],[-1.25,.6,-.3],.8)],
 SLV_B:[KF(SEG.b.t0-.06,[0,3.4,9.5],[0,1.2,0],0),KF(wT('b','chercheurs')-.1,[-1.2,2.8,7.0],[-.8,1.2,0],1.0),KF(T_SLV,[0,2.6,6.4],[0,1.2,0],.9)],
 SLV_R1:[KF(RT[0],[0,3.0,8.6],[0,1.2,0],0),KF(RT[0]+.1,[-1.6,2.4,6.0],[-1.6,1.2,0],1.4)],
 SLV_C:[KF(SEG.c.t0-.06,[0,3.6,9.8],[0,1.4,0],0),KF(T_ATT,[-.6,2.6,6.8],[-.8,1.4,0],1.2),KF(wT('c','certaines')-.1,[-.8,2.0,5.4],[-.8,1.6,0],1.0)],
 ACID_R2:[KF(RT[1],[0,2.4,8.5],[0,1.0,0],0),KF(RT[1]+.1,[0,1.2,5.8],[0,.8,0],1.3)],
 ACID_E:[KF(SEG.e.t0-.06,[-2.0,2.6,8.0],[-.5,1.2,0],0),KF(T_ACI,[2.0,2.2,6.4],[0,1.2,0],1.6),KF(T_DAV,[0,3.2,7.6],[0,1.2,0],1.0)],
 ACID_R3:[KF(RT[2],[0,.8,9.0],[0,1.0,0],0),KF(RT[2]+.1,[0,1.6,6.0],[0,1.1,0],3.6)],
 ACID_G:[KF(SEG.g.t0-.06,[0,3.0,8.4],[0,1.4,0],0),KF(T_CLK,[0,2.8,6.6],[0,2.0,-1],1.0)],
 HAND_R4:[KF(SEG.r4.t0-.1,[0,6.0,5.4],[0,1.2,-.4],0),KF(SEG.r4.t0,[0,3.4,3.0],[0,1.4,-.5],2.0),KF(M.rup0-.05,[0,2.2,1.4],[0,1.5,-.6],.8)],
 SWL:[KF(T_SPG,[0,1.6,3.2],[0,1.6,0],0),KF(T_SPG+.02,[0,3.0,9.8],[0,1.8,0],1.8),KF(T_SANG-.2,[1.6,2.4,6.2],[.6,1.7,0],0),KF(T_PON-.2,[0,2.4,8.8],[0,1.2,0],1.0),KF(T_MAL-.2,[-1.6,2.8,7.4],[-1.6,2.6,-.8],.9)],
 END:[KF(T_CTA,[0,7.4,7.0],[0,.4,-.4],0)]};
const SHOTS=[
 {t:0,type:'full',w:'hand',cams:'HAND',bg:t=>t<T_REV?'2b3fae':mixc('2b3fae','ff3355',eo(pr(t,T_REV,.3)))},
 {t:T_MIC,type:'full',w:'exp',cams:'EXP_A',bg:'ffb000'},
 {t:wT('a','pendant')-.1,type:'split',top:{w:'exp',p:[-2.4,3.4,3.2],l:[-1.25,.6,-.3],bg:'ff3d7f'},bot:{w:'exp',p:[2.4,3.4,3.2],l:[1.25,.6,-.3],bg:'2ee6d6'}},
 {t:SEG.b.t0-.06,type:'full',w:'slv',cams:'SLV_B',bg:'13c2c2'},
 {t:RT[0],type:'full',w:'slv',cams:'SLV_R1',bg:'7b2cbf'},
 {t:SEG.c.t0-.06,type:'full',w:'slv',cams:'SLV_C',bg:'22c55e'},
 {t:RT[1],type:'full',w:'acid',cams:'ACID_R2',bg:'ff7a1a'},
 {t:SEG.e.t0-.06,type:'full',w:'acid',cams:'ACID_E',bg:'3d6cff'},
 {t:RT[2],type:'full',w:'acid',cams:'ACID_R3',bg:'e23b3b'},
 {t:SEG.g.t0-.06,type:'full',w:'acid',cams:'ACID_G',bg:'7b2cbf'},
 {t:SEG.r4.t0-.1,type:'full',w:'hand',cams:'HAND_R4',bg:t=>mixc('2a1440','0c0612',eo(pr(t,SEG.r4.t0,2.5)))},
 {t:T_SPG,type:'full',w:'swl',cams:'SWL',bg:'ff7a1a'},
 {t:SEG.i2.t0-.08,type:'split',top:{w:'hand',p:[0,3.6,3.6],l:[0,1.3,-.4],bg:'22c55e'},bot:{w:'swl',p:[0,2.4,7.4],l:[0,1.8,0],bg:'ff3b30'}},
 {t:T_CTA,type:'full',w:'end',cams:'END',bg:'7b2cbf'}];
const shotAt=t=>{let s=SHOTS[0];for(const x of SHOTS)if(t>=x.t)s=x;return s};
const CHIPS=[[wT('a','dévorer')-.1,wT('a','pendant')-.15,'TOUJOURS TOI ?'],[wT('b','rockefeller')-.1,wT('b','ont')+.2,'UNIV. ROCKEFELLER'],[wT('b','manche')-.1,SEG.b.t1+.05,'MANCHE EN NYLON'],
  [wT('c','moustiques')-.1,wT('c','résultat')-.1,'LE TEST'],[wT('e','acides')-.05,SEG.e.t1-1.3,'ACIDES CARBOXYLIQUES'],[wT('i','femelle')-.1,wT('i','elle')-.05,'ELLE PIQUE'],[wT('i','mâle')-.1,SEG.i.t1+.1,'LE MÂLE : JAMAIS'],[wT('i2','preuve')-.1,wT('i2','cause')+.3,'LIEN ≠ PREUVE']];
const POPS=[[wT('b','64')-.05,1.3,'64 VOLONTAIRES','ffd60a','1b1030',-4],[wT('b','six')-.05,1.1,'6 HEURES','2ee6d6','1b1030',3],[wT('g','an.')-.3,1.4,'+ D\'UN AN','ffd60a','1b1030',-3],[wT('i','sang')-.05,1.2,'TON SANG','e3172b','ffffff',3]];
const T_HEART=1e9;const HEARTS=[];
const crackT=[...CD];
const heading=(p0,p1)=>Math.atan2(-(p1[1]-p0[1]),p1[0]-p0[0]);
const orbit=(m,cx,cy,cz,rx,rz,a,wob=.3)=>{const p=[cx+Math.cos(a)*rx,cy+Math.sin(a*2.3)*wob,cz+Math.sin(a)*rz];const q=[cx+Math.cos(a+.05)*rx,cz+Math.sin(a+.05)*rz];m.position.set(p[0],p[1],p[2]);m.rotation.y=Math.atan2(-(q[1]-p[2]),q[0]-p[0]);m.rotation.z=Math.sin(a*3)*.15};
function updateWorlds(t){
  const bt=t-T_REV;
  // moustique en plâtre : bat des ailes, un sursaut à chaque chiffre dit
  {const pulse=Math.max(0,...CD.map(c=>t>=c&&t<c+.3?1-(t-c)/.3:0));hMain.scale.setScalar(2.6*(1+.1*pulse));hMain.position.y=1.5+Math.sin(t*3)*.12+(bt>0&&bt<.6?Math.sin(bt/.6*Math.PI)*.3:0);hMain.rotation.z=Math.sin(t*2)*.08;flap(hMain,t,t>M.rup0-.2&&t<T_SPG?.15:1)}
  const ck=eo(pr(t,T_REV+.08,.6));plasterMats.forEach(([m,c,r,mt])=>{m.color.copy(PLASTER).lerp(c,ck);m.roughness=lerp(.95,r,ck);m.metalness=lerp(0,mt,ck)});
  shards.forEach(m=>{const u=m.userData;if(bt<0){m.visible=false;return}const tt=Math.min(bt,1.6);m.visible=bt<1.5;m.position.set(u.p0.x+u.v.x*tt,Math.max(.02,u.p0.y+u.v.y*tt-6*tt*tt),u.p0.z+u.v.z*tt);m.rotation.set(u.r.x*tt,u.r.y*tt,u.r.z*tt);m.material.opacity=1-clamp((bt-.9)/.6)});
  if(bt>0){for(let i=0;i<DN;i++){const v=dv[i];dp[i*3]=v.x*bt*1.6;dp[i*3+1]=v.y*bt*1.4-.6*bt*bt;dp[i*3+2]=v.z*bt*1.6}dg.attributes.position.needsUpdate=true;dust.material.opacity=.95*(1-clamp(bt/1.7))}else dust.material.opacity=0;
  // expérience : l'essaim autour du bras gauche, un seul moustique côté droit
  {const na=Math.round(lerp(3,9,pr(t,T_MIC,wT('a','dévorer')-T_MIC)));swarmE.forEach((m,k)=>{m.visible=k<na;orbit(m,-1.25,1.0,-.2,1.0+.2*(k%3),1.5,t*2.6+m.userData.ph);flap(m,t+k)});
   const fl=pr(t,wT('a','rien')-.2,1.2);loneE.position.set(lerp(3.8,1.6,1-fl*.0),1.6+Math.sin(t*2)*.1,-1+Math.sin(t*1.3)*.3);loneE.rotation.y=Math.PI*.9;loneE.position.x=3.6+Math.sin(t*1.6)*.3;flap(loneE,t);
   bites.forEach((d,k)=>{d.visible=t>wT('a','toujours')+k*.08})}
  // manches : elles arrivent, puis les moustiques choisissent
  {sleeves.forEach((s,k)=>{const sc=Math.max(.001,back(pr(t,T_SLV+k*.15,.4)));s.scale.setScalar(sc);s.visible=t>T_SLV-.05});
   swarmS.forEach((m,k)=>{m.visible=t>T_ATT;const fav=k<8;const a=t*2.8+k*.9;if(fav)orbit(m,-.8,1.5,0,.95+.15*(k%3),.8,a,.35);else orbit(m,2.4,1.5+(k-8)*.6,.2,.9,.5,a*.6,.2);flap(m,t+k)});
   const cs=wT('c','plus');crown.visible=t>cs;crown.position.y=2.6+Math.sin(t*3)*.08;crown.scale.setScalar(Math.max(.001,back(pr(t,cs,.4))));crown.rotation.y=t*2}
  // acides : des molécules apparaissent sur la peau, l'horloge tourne
  {mols.forEach((g,k)=>{const u=g.userData;const n=t<T_ACI?0:t<T_DAV?14:36;g.visible=k<n;const ap=back(pr(t,k<14?T_ACI+k*.07:T_DAV+(k-14)*.03,.35));g.scale.setScalar(.55*Math.max(.001,ap));g.position.set(u.x+Math.sin(t*u.s+u.ph)*.3,.35+Math.abs(Math.sin(t*u.s*.8+u.ph))*1.8,u.z);g.rotation.set(t*u.s,t*u.s*.7,0)});
   clock.visible=t>T_CLK;clock.scale.setScalar(Math.max(.001,back(pr(t,T_CLK,.4))));{const ph=Math.max(0,t-T_CLK);clock.userData.h1.rotation.z=-ph*7;clock.userData.h2.rotation.z=-ph*7/12}}
  // la bombe : la femelle, son sang, ses œufs
  {flap(fem,t,1);flap(mal,t,1);fem.position.y=1.6+Math.sin(t*3)*.1;mal.position.y=2.6+Math.sin(t*3+1)*.1;const ab=fem.children[1];const sw=eio(pr(t,T_SANG,.8));ab.scale.set(2.8*(1+sw*.25),1+sw*.9,1+sw*.9);
   drop.visible=t>T_SANG-.1&&t<T_SANG+1.0;const dd=pr(t,T_SANG-.1,1.0);drop.position.set(2.0-dd*.9,1.6+(1-dd)*1.1,.4);drop.scale.setScalar(.5+dd*.9);
   eggs.forEach((e,k)=>{const u=e.userData;const te=T_PON+.1+k*.09;e.visible=t>te;const ph=t-te;e.position.set(-.9+Math.cos(u.a)*u.r*.5+ph*.3,1.3-Math.min(ph,1.6)*.5-u.r*.1,Math.sin(u.a)*u.r*.7);e.scale.set(Math.max(.001,back(pr(t,te,.2))),Math.max(.001,1.4*back(pr(t,te,.2))),Math.max(.001,back(pr(t,te,.2))))});
   noSign.visible=t>T_MAL;noSign.scale.setScalar(Math.max(.001,back(pr(t,T_MAL,.35))))}
  // fin : l'essaim contre le soleil
  swarmN.forEach((m,k)=>{orbit(m,-1.4,1.1,-.2,1.0+.2*(k%3),1.5,t*2.6+k*1.05);flap(m,t+k)});sun.rotation.y=t;
  // mur de plâtre
  let wv=false;for(const [a,b] of WALLS){if(t>=a&&t<b+.9){wv=true;wallTiles.forEach(m=>{const u=m.userData;const tt=t-b-u.del;
      if(tt<0){const pre=eo(pr(t,a,b-a));m.position.copy(u.p0);m.position.x+=(Math.sin(u.r.x*9)*.002)*pre;m.position.y+=(Math.cos(u.r.y*7)*.002)*pre;m.rotation.set(0,0,u.r0+u.r.z*.004*pre);m.material.opacity=1;m.visible=true}
      else{m.position.set(u.p0.x+u.v.x*tt,u.p0.y+u.v.y*tt-1.6*tt*tt,u.p0.z+u.v.z*tt);m.rotation.set(u.r.x*tt,u.r.y*tt,u.r0+u.r.z*tt);m.material.opacity=1-clamp((tt-.35)/.4);m.visible=tt<.8}})}}
  WALL.visible=wv;
}
function setWorld(w){HAND.visible=w==='hand';EXP.visible=w==='exp';SLV.visible=w==='slv';ACID.visible=w==='acid';SWL.visible=w==='swl';END.visible=w==='end';lightFor(w)}
const tint=c=>{[expFloor,slvFloor,swFloor,endFloor].forEach(f=>f.material.color.set('#'+mixc(c,'ffffff',.5)));acidBg.material.color.set('#'+mixc(c,'ffffff',.12))};
