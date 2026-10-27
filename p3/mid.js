const T_REV=wordT('faux','faux')-.03;const T_MIC=SEG.a.t0-.1;const T_CTA=SEG.j.t0-.1;
const CD=[M.cd0,M.cd0+.433,M.cd0+.866];const T_SPG=M.rup1-.25;
const WALLS=[[T_MIC-.28,T_MIC+.04]];
const RT=['r1','r2','r3'].map(k=>SEG[k].t0-.08);
const KF=(t,p,l,d)=>({t,p,l,d});
const keyed=(KK,t)=>{const at=(i,t)=>{const k0=KK[i];if(i<=0)return[k0.p,k0.l];const st=at(i-1,k0.t);const d=k0.d===undefined?.75:k0.d;const k=d<=0?1:eio(pr(t,k0.t,d));return[V(st[0],k0.p,k),V(st[1],k0.l,k)]};let i=0;for(let k=0;k<KK.length;k++)if(t>=KK[k].t)i=k;return at(i,t)};
const wT=wordT;
const T_IRM=wT('e','glissé')-.12, T_JNT=SEG.g.t0-.06, T_POP=wT('g','forme'), T_SHAKE=wT('i2','pas')-.1;
const CAMS={
 HAND:[KF(0,[0,6.4,5.6],[0,.2,-.8]),KF(.15,[0,5.6,4.6],[0,.2,-.9],3.8),KF(CD[0],[1.0,4.8,3.8],[0,.2,-1.0],0),KF(CD[1],[-1.0,4.4,3.4],[0,.2,-1.0],0),KF(CD[2],[0,4.0,3.0],[0,.2,-1.1],0),
   KF(T_REV,[0,6.0,5.2],[0,.2,-.9],0),KF(SEG.pire.t0+.2,[.3,5.2,4.4],[0,.2,-.9],1.6)],
 EXP_A:[KF(T_MIC,[0,7.4,6.4],[0,.2,-.6],0),KF(wT('a','pendant')-.1,[-1.6,5.0,4.6],[-.8,.2,-.6],0),KF(wT('a','seule')-.15,[0,5.6,4.8],[0,.2,-.6],1.0)],
 EXP_B:[KF(SEG.b.t0-.06,[-2.4,4.2,3.8],[-1.15,.2,-.8],0),KF(wT('b','droite')-.12,[2.4,4.2,3.8],[1.15,.2,-.8],0),KF(wT('b','comparer')-.12,[0,6.4,5.4],[0,.2,-.6],0)],
 EXP_R1:[KF(RT[0],[0,5.6,4.6],[0,.2,-.7],0),KF(RT[0]+.1,[0,4.8,3.8],[0,.2,-.7],1.4)],
 EXP_C:[KF(SEG.c.t0-.06,[0,7.8,7.6],[0,-.2,-.4],0),KF(wT('c','prix')-.3,[0,3.2,3.2],[0,1.0,-1.3],0),KF(wT('c','prix')-.2,[0,2.8,2.6],[0,1.0,-1.3],1.2)],
 MRI_R2:[KF(RT[1],[3.6,3.6,6.2],[0,2.0,0],0),KF(RT[1]+.1,[2.4,3.0,5.4],[0,2.0,0],1.2)],
 MRI:[KF(SEG.e.t0-.06,[4.4,3.4,7.6],[0,2.0,0],0),KF(T_IRM,[5.2,2.6,4.0],[1.2,1.8,0],0),KF(wT('e','tiré')-.1,[3.6,3.0,5.2],[1.2,1.8,0],0)],
 JNT_R3:[KF(RT[2],[0,0,11],[0,0,0],0),KF(RT[2]+.1,[0,0,9.5],[0,0,0],3.6)],
 JNT:[KF(T_JNT,[3.5,.6,9.5],[0,0,0],0),KF(T_POP-.2,[0,0,7.6],[0,0,0],0),KF(wT('g','moins')-.1,[0,0,6.0],[0,0,0],1.2)],
 HAND_R4:[KF(SEG.r4.t0-.1,[0,6.0,5.2],[0,.2,-.9],0),KF(SEG.r4.t0,[0,3.6,2.4],[0,.3,-1.2],2.0),KF(M.rup0-.05,[0,2.0,.6],[0,.3,-1.4],.8)],
 SWL:[KF(T_SPG,[0,1.4,2.2],[0,.3,-.4],0),KF(T_SPG+.02,[0,7.4,6.8],[0,.3,-.6],1.8),KF(wT('i','gonflées')-.2,[0,4.6,4.4],[0,.3,-.4],0),KF(wT('i','force')-.2,[0,3.4,4.0],[0,2.4,-1.9],0)],
 END:[KF(T_CTA,[0,7.4,7.0],[0,.4,-.4],0)]};
const SHOTS=[
 {t:0,type:'full',w:'hand',cams:'HAND',bg:t=>t<T_REV?'2b3fae':mixc('2b3fae','ff3355',eo(pr(t,T_REV,.3)))},
 {t:T_MIC,type:'full',w:'exp',cams:'EXP_A',bg:'ffb000'},
 {t:SEG.b.t0-.06,type:'full',w:'exp',cams:'EXP_B',bg:'13c2c2'},
 {t:wT('b','comparer')-.12,type:'split',top:{w:'exp',p:[-1.15,3.6,2.8],l:[-1.15,.2,-.8],bg:'ff3d7f'},bot:{w:'exp',p:[1.15,3.6,2.8],l:[1.15,.2,-.8],bg:'2ee6d6'}},
 {t:RT[0],type:'full',w:'exp',cams:'EXP_R1',bg:'7b2cbf'},
 {t:SEG.c.t0-.06,type:'full',w:'exp',cams:'EXP_C',bg:'22c55e'},
 {t:RT[1],type:'full',w:'mri',cams:'MRI_R2',bg:'ff7a1a'},
 {t:SEG.e.t0-.06,type:'full',w:'mri',cams:'MRI',bg:'3d6cff'},
 {t:RT[2],type:'full',w:'jnt',cams:'JNT_R3',bg:'e23b3b'},
 {t:T_JNT,type:'full',w:'jnt',cams:'JNT',bg:'7b2cbf'},
 {t:SEG.r4.t0-.1,type:'full',w:'hand',cams:'HAND_R4',bg:t=>mixc('2a1440','0c0612',eo(pr(t,SEG.r4.t0,2.5)))},
 {t:T_SPG,type:'full',w:'swl',cams:'SWL',bg:'ff7a1a'},
 {t:SEG.i2.t0-.08,type:'split',top:{w:'hand',p:[0,4.6,3.6],l:[0,.2,-.9],bg:'22c55e'},bot:{w:'swl',p:[0,2.4,4.2],l:[0,2.2,-1.9],bg:'ff3b30'}},
 {t:T_CTA,type:'full',w:'end',cams:'END',bg:'7b2cbf'}];
const shotAt=t=>{let s=SHOTS[0];for(const x of SHOTS)if(t>=x.t)s=x;return s};
const CHIPS=[[wT('a','médecin')-.1,wT('a','pendant')-.15,'UN VRAI MÉDECIN'],[wT('b','gauche')-.1,wT('b','droite')-.15,'GAUCHE : CRAC CRAC'],[wT('b','droite')-.1,wT('b','comparer')-.2,'DROITE : JAMAIS'],
  [wT('e','canadiens')-.1,wT('e','tiré')-.1,'IRM EN DIRECT'],[wT('g','liquide')-.1,wT('g','moins')-.1,'LIQUIDE ARTICULAIRE'],[wT('i2','mal')-.1,SEG.i2.t1+.1,'DOULEUR = MÉDECIN']];
const POPS=[[wT('a','60')-.05,1.3,'60 ANS','ffd60a','1b1030',-4],[wT('c','aucune')-.05,1.2,'0 ARTHROSE','22c55e','ffffff',3],[wT('c','nobel')-.15,1.3,'IG NOBEL','ffc21a','1b1030',-3],
  [wT('g','tiers')-.05,1.3,'< 1/3 SEC','2ee6d6','1b1030',3],[wT('i','300')-.05,1.25,'300 PERSONNES','ffd60a','1b1030',-3]];
const T_HEART=1e9;const HEARTS=[];
const crackT=[...CD,wT('a','craqué'),wT('b','craquait'),wT('b','craquait')+.35,wT('b','arrêt'),wT('e','craque')];
function updateWorlds(t){
  const bt=t-T_REV;
  // main en plâtre : un doigt craque à chaque tic du 3-2-1
  [0,1,2,3].forEach(k=>{const tk=CD[Math.min(k,2)]+(k==3?.2:0);const ph=t-tk;bend(hMain,k,ph>0&&ph<.4?Math.sin(clamp(ph/.4)*Math.PI)*.9:0)});
  const ck=eo(pr(t,T_REV+.08,.6));plasterMats.forEach(([m,c,r,mt])=>{m.color.copy(PLASTER).lerp(c,ck);m.roughness=lerp(.95,r,ck);m.metalness=lerp(0,mt,ck)});
  hMain.position.y=bt>0&&bt<.6?Math.sin(bt/.6*Math.PI)*.3:0;
  // pendant le chuchotement : la main se referme lentement
  {const w=pr(t,SEG.r4.t0,M.rup0-SEG.r4.t0);if(w>0&&t<T_SPG)[0,1,2,3].forEach(k=>bend(hMain,k,eio(w)*.8))}
  shards.forEach(m=>{const u=m.userData;if(bt<0){m.visible=false;return}const tt=Math.min(bt,1.6);m.visible=bt<1.5;m.position.set(u.p0.x+u.v.x*tt,Math.max(.02,u.p0.y+u.v.y*tt-6*tt*tt),u.p0.z+u.v.z*tt);m.rotation.set(u.r.x*tt,u.r.y*tt,u.r.z*tt);m.material.opacity=1-clamp((bt-.9)/.6)});
  if(bt>0){for(let i=0;i<DN;i++){const v=dv[i];dp[i*3]=v.x*bt*1.6;dp[i*3+1]=v.y*bt*1.4-.6*bt*bt;dp[i*3+2]=v.z*bt*1.6}dg.attributes.position.needsUpdate=true;dust.material.opacity=.95*(1-clamp(bt/1.7))}else dust.material.opacity=0;
  // expérience : main gauche craque en rythme, droite immobile
  {const on=t>wT('a','craqué')-.2;const beat=(t*2.2)%1;[0,1,2,3].forEach(k=>{const ph=((t*2.2+k*.25)%1);bend(hL,k,on?Math.max(0,Math.sin(ph*Math.PI*2))*.85:0);bend(hR,k,0)});
   const tr=wT('c','nobel')-.3;trophy.visible=t>tr-.1;trophy.scale.setScalar(Math.max(.001,back(pr(t,tr,.45))));trophy.rotation.y=(t-tr)*1.2;
   checks.forEach((c,k)=>{const tc=wT('c',k?'droite':'gauche')-.05;const s=back(pr(t,tc,.35));c.visible=s>.01&&t<SEG.r2.t0;c.scale.setScalar(Math.max(.001,s))})}
  // IRM : le doigt entre, le câble tire, crac
  {const ti=pr(t,T_IRM,1.0),tp=wT('e','tiré'),tc=wT('e','craque');mHand.position.x=2.6-eio(ti)*1.3;const pull=t>tp?eio(pr(t,tp,tc-tp))*.25:0;
   bend(mHand,1,0);[0,2,3].forEach(k=>bend(mHand,k,1.2));
   const f=mHand.userData.fingers[1];f[0].position.z=-.62-pull;const tip=new THREE.Vector3();f[2].getWorldPosition(tip);
   cable.position.set((tip.x-1.6)/2-.3,tip.y,tip.z);cable.scale.y=Math.max(.1,Math.abs(tip.x+1.6)+.3);tube.position.set(tip.x-.35,tip.y,tip.z);
   ring.scale.setScalar(1+(t>tc&&t<tc+.3?Math.sin((t-tc)/.3*Math.PI)*.04:0))}
  // articulation : les os s'écartent, la bulle apparaît d'un coup
  {const sep=eio(pr(t,T_POP-.5,.5))*.75;boneA.position.y=.05+sep;boneB.position.y=-.05-sep;capsule.scale.set(1,.7+sep*.55,1);
   const bs=t>T_POP?back(pr(t,T_POP,.12)):0;bubble.scale.setScalar(Math.max(.001,bs));bubble.visible=bs>.01;
   const sh=pr(t,T_POP,.5);shock.visible=t>T_POP&&sh<1;shock.scale.setScalar(.6+sh*2.4);shock.material.opacity=.8*(1-sh);
   JNT.rotation.y=Math.sin(t*.4)*.25}
  // la bombe : les mains gonflent, l'aiguille de force chute
  {const tg=wT('i','gonflées')-.1;crowd.forEach((h,k)=>{const sw=k%3!=1?eio(pr(t,tg+k*.03,.6)):0;h.scale.set(.55*(1+sw*.35),.55*(1+sw*.5),.55*(1+sw*.25));h.traverse(o=>{if(o.isMesh&&o.material.color&&o.material.roughness===.6&&!o.userData.c0){o.userData.c0=o.material.color.clone()}if(o.userData.c0)o.material.color.copy(o.userData.c0).lerp(new THREE.Color(0xff5a5a),sw*.45)})});
   const tf=wT('i','force')-.1;gauge.userData.needle.rotation.z=lerp(-1.0,1.25,eio(pr(t,tf,.9)))+Math.sin(t*20)*.03*(t>tf+.9?1:0)}
  // fin : main gauche craque, main droite secoue « non »
  [0,1,2,3].forEach(k=>bend(eL,k,Math.max(0,Math.sin((t*2.2+k*.25)*Math.PI*2))*.8));eR.rotation.z=Math.sin(t*6)*.15;
  // étincelles « crac »
  sparks.forEach((s,k)=>{const tk=crackT.filter(c=>t>=c).pop();const ph=tk!==undefined?t-tk:9;s.visible=ph<.35&&k<3;if(s.visible){s.scale.setScalar(.4+ph*3);s.position.set([-.5,0,.5][k],.8,-1.4);s.rotation.y=k}});
  // mur de plâtre
  let wv=false;for(const [a,b] of WALLS){if(t>=a&&t<b+.9){wv=true;wallTiles.forEach(m=>{const u=m.userData;const tt=t-b-u.del;
      if(tt<0){const pre=eo(pr(t,a,b-a));m.position.copy(u.p0);m.position.x+=(Math.sin(u.r.x*9)*.002)*pre;m.position.y+=(Math.cos(u.r.y*7)*.002)*pre;m.rotation.set(0,0,u.r0+u.r.z*.004*pre);m.material.opacity=1;m.visible=true}
      else{m.position.set(u.p0.x+u.v.x*tt,u.p0.y+u.v.y*tt-1.6*tt*tt,u.p0.z+u.v.z*tt);m.rotation.set(u.r.x*tt,u.r.y*tt,u.r0+u.r.z*tt);m.material.opacity=1-clamp((tt-.35)/.4);m.visible=tt<.8}})}}
  WALL.visible=wv;
}
function setWorld(w){HAND.visible=w==='hand';EXP.visible=w==='exp';MRI.visible=w==='mri';JNT.visible=w==='jnt';SWL.visible=w==='swl';END.visible=w==='end';sparks.forEach(s=>{if(w!=='hand'&&w!=='exp')s.visible=false});lightFor(w)}
const tint=c=>{[expFloor,mriFloor,swFloor,endFloor].forEach(f=>f.material.color.set('#'+mixc(c,'ffffff',.5)));jntBg.material.color.set('#'+mixc(c,'ffffff',.12))};
