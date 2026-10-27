
// =================== PILOTE 3 : se craquer les doigts ===================
const STD=(c,r=.55,m=0,o)=>{const x=new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});if(o!==undefined){x.transparent=true;x.opacity=o}return x};
const PLASTER=new THREE.Color(0xf3efe7);
const plasterMats=[];const PMk=(c,r=.55,m=0)=>{const x=new THREE.MeshStandardMaterial({color:0xf3efe7,roughness:.95});plasterMats.push([x,new THREE.Color(c),r,m]);return x};
const COLk=(c,r=.55,m=0)=>STD(c,r,m);
const SKINC=0xffb08f,NAILC=0xff8fb1;

// ---------- une main articulée (doigts pliables)
function hand(mk,skin=SKINC,flip=1){const g=new THREE.Group();const sk=mk(skin,.6),nl=mk(NAILC,.3);
  const palm=new THREE.Mesh(new RoundedBoxGeometry(1.25,.42,1.3,6,.2),sk);palm.position.set(0,.21,0);g.add(palm);
  const fingers=[];const FX=[-.45,-.15,.15,.45],FL=[.5,.6,.56,.42];
  FX.forEach((x,k)=>{let parent=g;let z=-.62;const joints=[];const L=FL[k];
    for(let s=0;s<3;s++){const j=new THREE.Group();j.position.set(s?0:x*flip,s?0:.24,s?-(L*(1-.18*s)):z);parent.add(j);
      const len=L*(1-.18*s);const seg=new THREE.Mesh(new THREE.CapsuleGeometry(.12-.012*s,len,6,14),sk);seg.rotation.x=Math.PI/2;seg.position.z=-len/2;j.add(seg);
      const kn=new THREE.Mesh(new THREE.SphereGeometry(.135-.012*s,16,12),sk);j.add(kn);
      if(s==2){const n=new THREE.Mesh(new THREE.SphereGeometry(.085,14,10),nl);n.scale.set(1,.35,1.3);n.position.set(0,.09,-len*.75);j.add(n)}
      joints.push(j);parent=j}
    fingers.push(joints)});
  // pouce
  const tj=new THREE.Group();tj.position.set(-.66*flip,.2,.05);tj.rotation.y=.9*flip;g.add(tj);const t1=new THREE.Mesh(new THREE.CapsuleGeometry(.14,.42,6,14),sk);t1.rotation.x=Math.PI/2;t1.position.z=-.26;tj.add(t1);
  const tj2=new THREE.Group();tj2.position.z=-.5;tj.add(tj2);const t2=new THREE.Mesh(new THREE.CapsuleGeometry(.125,.3,6,14),sk);t2.rotation.x=Math.PI/2;t2.position.z=-.18;tj2.add(t2);
  const tn=new THREE.Mesh(new THREE.SphereGeometry(.09,14,10),nl);tn.scale.set(1,.35,1.3);tn.position.set(0,.1,-.28);tj2.add(tn);
  g.userData={fingers,thumb:[tj,tj2]};return castAll(g)}
const bend=(h,k,a)=>{h.userData.fingers[k].forEach((j,s)=>j.rotation.x=-a*(s==0?.55:s==1?1:.7))};

// ---------- 1. la main en plâtre (accroche) -> couleurs au FAUX
const HAND=new THREE.Group();scene.add(HAND);
{const tiles=[];for(let i=-4;i<4;i++)for(let j=-4;j<4;j++){const m=new THREE.Mesh(new RoundedBoxGeometry(.97,.1,.97,3,.03),PMk((i+j)&1?0x7b2cbf:0xb68cff,.4));m.position.set(i+.5,-.05,j+.5);m.receiveShadow=true;HAND.add(m)}}
const hMain=hand(PMk);hMain.scale.setScalar(1.6);hMain.position.set(0,0,1.2);HAND.add(hMain);
const sparks=[...Array(5)].map((_,k)=>{const g=new THREE.Group();const m=STD(0xffd60a,.3);for(let r=0;r<6;r++){const s=new THREE.Mesh(new THREE.BoxGeometry(.035,.035,.22),m);s.rotation.y=r/6*Math.PI*2;s.position.set(Math.sin(r/6*Math.PI*2)*.18,0,Math.cos(r/6*Math.PI*2)*.18);g.add(s)}g.visible=false;scene.add(g);return g});
const shards=[];{const sm=PLM();for(let k=0;k<80;k++){const m=new THREE.Mesh(new THREE.BoxGeometry(.06+rnd()*.12,.04+rnd()*.08,.03+rnd()*.06),sm.clone());m.material.transparent=true;
  m.userData={p0:new THREE.Vector3((rnd()-.5)*2.4,.2+rnd()*.8,-.2+(rnd()-.5)*2.4),v:new THREE.Vector3((rnd()-.5)*5,2+rnd()*4,(rnd()-.2)*4),r:new THREE.Vector3(rnd()*10,rnd()*10,rnd()*10)};m.visible=false;m.castShadow=true;HAND.add(m);shards.push(m)}}
const DN=260,dg=new THREE.BufferGeometry(),dp=new Float32Array(DN*3),dv=[];for(let i=0;i<DN;i++)dv.push(new THREE.Vector3((rnd()-.5)*3,rnd()*2.2,(rnd()-.3)*2.4));dg.setAttribute('position',new THREE.BufferAttribute(dp,3));
const dtex=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)})();
const dust=new THREE.Points(dg,new THREE.PointsMaterial({size:.14,map:dtex,transparent:true,depthWrite:false,color:0xf6f2ea,opacity:0}));dust.position.set(0,.4,0);HAND.add(dust);

// ---------- 2. l'expérience : deux mains, gauche craquée / droite jamais
const EXP=new THREE.Group();scene.add(EXP);
const expFloor=new THREE.Mesh(new THREE.CircleGeometry(12,64),STD(0xffffff,1));expFloor.rotation.x=-Math.PI/2;expFloor.receiveShadow=true;EXP.add(expFloor);
const hL=hand(COLk);hL.scale.setScalar(1.2);hL.position.set(-1.15,0,.9);EXP.add(hL);
const hR=hand(COLk,SKINC,-1);hR.scale.setScalar(1.2);hR.position.set(1.15,0,.9);EXP.add(hR);
const divider=new THREE.Mesh(new RoundedBoxGeometry(.08,1.2,3,3,.03),STD(0xffffff,.4));divider.position.set(0,.6,-.6);
const trophy=(()=>{const g=new THREE.Group();const m=STD(0xffc21a,.22,.75);const cup=new THREE.Mesh(new THREE.CylinderGeometry(.45,.22,.6,32,1,true),m);cup.position.y=1.0;g.add(cup);
  const in_=new THREE.Mesh(new THREE.CircleGeometry(.44,32),STD(0xb88a10,.4,.6));in_.rotation.x=-Math.PI/2;in_.position.y=1.29;g.add(in_);
  for(const s of[1,-1]){const h=new THREE.Mesh(new THREE.TorusGeometry(.2,.05,10,24,Math.PI),m);h.position.set(s*.5,1.05,0);h.rotation.z=s>0?-Math.PI/2:Math.PI/2;g.add(h)}
  const st=new THREE.Mesh(new THREE.CylinderGeometry(.06,.08,.35,16),m);st.position.y=.55;g.add(st);const b=new THREE.Mesh(new RoundedBoxGeometry(.7,.25,.5,3,.05),STD(0x3a2a6a,.5));b.position.y=.25;g.add(b);
  g.position.set(0,0,-1.3);EXP.add(g);return castAll(g)})();
const checks=[-1.15,1.15].map(x=>{const g=new THREE.Group();const m=STD(0x22c55e,.35);const a=new THREE.Mesh(new RoundedBoxGeometry(.16,.5,.16,3,.06),m);a.position.set(-.12,-.05,0);a.rotation.z=.75;g.add(a);
  const b=new THREE.Mesh(new RoundedBoxGeometry(.16,.95,.16,3,.06),m);b.position.set(.18,.12,0);b.rotation.z=-.6;g.add(b);g.position.set(x,1.7,-.4);EXP.add(g);return castAll(g)});

// ---------- 3. l'IRM : l'anneau, le doigt, le câble
const MRI=new THREE.Group();scene.add(MRI);
const mriFloor=new THREE.Mesh(new THREE.CircleGeometry(12,64),STD(0xffffff,1));mriFloor.rotation.x=-Math.PI/2;mriFloor.receiveShadow=true;MRI.add(mriFloor);
const ring=new THREE.Group();{const body=new THREE.Mesh(new THREE.TorusGeometry(1.5,.62,32,64),STD(0xf4f6fb,.35));ring.add(body);
  const band=new THREE.Mesh(new THREE.TorusGeometry(1.5,.64,8,64,Math.PI*2),STD(0x2ee6d6,.3));band.scale.set(1,1,.25);ring.add(band);
  const base=new THREE.Mesh(new RoundedBoxGeometry(3.6,.5,1.6,4,.15),STD(0xdfe4ee,.5));base.position.y=-1.95;ring.add(base)}
ring.position.set(0,2.2,0);MRI.add(castAll(ring));
const mHand=hand(COLk);mHand.scale.setScalar(1.1);mHand.rotation.set(0,-Math.PI/2,0);mHand.position.set(2.6,1.5,0);MRI.add(mHand);
const cable=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,1,8),STD(0x1b1030,.5));cable.rotation.z=Math.PI/2;MRI.add(cable);
const tube=new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.5,20,1,true),STD(0x9ff0ff,.1,0,.5));tube.rotation.z=Math.PI/2;MRI.add(tube);

// ---------- 4. dans l'articulation : deux os, le liquide, la bulle
const JNT=new THREE.Group();scene.add(JNT);
const boneM=STD(0xfff4dc,.55);
const bone=(dir)=>{const g=new THREE.Group();const sh=new THREE.Mesh(new THREE.CylinderGeometry(.55,.65,3,40),boneM);sh.position.y=dir*1.7;g.add(sh);const hd=new THREE.Mesh(new THREE.SphereGeometry(.8,40,28),boneM);hd.scale.set(1,.55,1);hd.position.y=dir*.25;g.add(hd);return castAll(g)};
const boneA=bone(1),boneB=bone(-1);JNT.add(boneA);JNT.add(boneB);JNT.scale.setScalar(.6);
const capsule=new THREE.Mesh(new THREE.SphereGeometry(1.15,48,32),new THREE.MeshStandardMaterial({color:0x6fd8ff,roughness:.1,transparent:true,opacity:.28,depthWrite:false}));capsule.scale.set(1,.7,1);JNT.add(capsule);
const bubble=new THREE.Mesh(new THREE.SphereGeometry(.55,40,28),new THREE.MeshPhysicalMaterial({color:0xc8fbff,emissive:0x2ee6d6,emissiveIntensity:.35,roughness:.02,transparent:true,opacity:.9,clearcoat:1}));bubble.renderOrder=3;JNT.add(bubble);
const shock=new THREE.Mesh(new THREE.TorusGeometry(1,.04,10,64),STD(0xffffff,.2,0,.8));shock.rotation.x=Math.PI/2;JNT.add(shock);
const jntBg=new THREE.Mesh(new THREE.CircleGeometry(14,64),STD(0x2b1a5a,1));jntBg.position.z=-7;jntBg.scale.setScalar(2);JNT.add(jntBg);

// ---------- 5. la bombe : des mains qui gonflent + la force qui baisse
const SWL=new THREE.Group();scene.add(SWL);
const swFloor=new THREE.Mesh(new THREE.CircleGeometry(12,64),STD(0xffffff,1));swFloor.rotation.x=-Math.PI/2;swFloor.receiveShadow=true;SWL.add(swFloor);
const crowd=[];for(let i=0;i<5;i++)for(let j=0;j<3;j++){const h=hand(COLk,[0xffb08f,0xe8a07a,0xc98a62,0xffc4a6,0x9c6a4c][(i+j)%5]);h.scale.setScalar(.55);h.rotation.y=(rnd()-.5)*.3;h.position.set((i-2)*1.25,0,(j-1)*1.3+.3);SWL.add(h);crowd.push(h)}
const gauge=(()=>{const g=new THREE.Group();const face=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,.18,48),STD(0xffffff,.4));face.rotation.x=Math.PI/2;g.add(face);
  const rim=new THREE.Mesh(new THREE.TorusGeometry(.9,.08,12,48),STD(0xe3172b,.4));g.add(rim);
  const arcs=[[0x22c55e,0,1],[0xffd60a,1,2],[0xe3172b,2,3]];arcs.forEach(([c,a,b])=>{const t=new THREE.Mesh(new THREE.TorusGeometry(.68,.07,8,32,Math.PI/3),STD(c,.4));t.rotation.z=Math.PI-(b)*Math.PI/3;t.position.z=.1;g.add(t)});
  const nd=new THREE.Group();nd.position.z=.12;g.add(nd);const n=new THREE.Mesh(new THREE.BoxGeometry(.05,.62,.03),STD(0x1b1030,.4));n.position.y=.3;nd.add(n);
  const hub=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.06,16),STD(0x1b1030,.4));hub.rotation.x=Math.PI/2;hub.position.z=.13;g.add(hub);
  g.userData.needle=nd;g.position.set(0,2.6,-1.9);SWL.add(g);return castAll(g)})();

// ---------- 6. la fin : deux camps
const END=new THREE.Group();scene.add(END);
const endFloor=new THREE.Mesh(new THREE.CircleGeometry(12,64),STD(0xffffff,1));endFloor.rotation.x=-Math.PI/2;END.add(endFloor);
const eL=hand(COLk);eL.scale.setScalar(1.1);eL.position.set(-1.5,0,.8);END.add(eL);
const eR=hand(COLk,0xe8a07a,-1);eR.scale.setScalar(1.1);eR.position.set(1.5,0,.8);END.add(eR);

function lightFor(w){hemi.intensity=w==='jnt'?1.4:1.2;key.color.set(0xfff2e4)}
// ---------- caméras des écrans divisés + mur de plâtre
scene.add(cam);
const camTop=new THREE.PerspectiveCamera(30,W/(H/2),.05,80), camBot=new THREE.PerspectiveCamera(30,W/(H/2),.05,80);
const WALL=new THREE.Group();cam.add(WALL);
const wallTiles=[];{const d=1.0,vh=2*d*Math.tan(18*Math.PI/180)*1.08,vw=vh*W/H;const nx=7,ny=12,tw=vw/nx,th=vh/ny;
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const g=new THREE.BoxGeometry(tw*.985,th*.985,.012);
    const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:0xf6f2ea,roughness:.92,transparent:true}));
    const x=-vw/2+tw*(i+.5)+(rnd()-.5)*tw*.08,y=-vh/2+th*(j+.5)+(rnd()-.5)*th*.08;m.position.set(x,y,-d);m.rotation.z=(rnd()-.5)*.04;
    m.userData={p0:m.position.clone(),r0:m.rotation.z,v:new THREE.Vector3(x*2.6+(rnd()-.5)*.25,y*2.2+.2+rnd()*.35,-(.25+rnd()*.6)),r:new THREE.Vector3(rnd()*8-4,rnd()*8-4,rnd()*6-3),del:Math.hypot(x/vw,y/vh)*.12};
    WALL.add(m);wallTiles.push(m)}}
const wallLight=new THREE.PointLight(0xfff4e6,1.6,4);wallLight.position.set(.3,.4,-.2);cam.add(wallLight);
