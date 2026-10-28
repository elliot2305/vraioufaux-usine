// =================== ÉPISODE 04 : les moustiques ===================

// =================== PILOTE 3 : se craquer les doigts ===================
const STD=(c,r=.55,m=0,o)=>{const x=new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});if(o!==undefined){x.transparent=true;x.opacity=o}return x};
const PLASTER=new THREE.Color(0xf3efe7);
const plasterMats=[];const PMk=(c,r=.55,m=0)=>{const x=new THREE.MeshStandardMaterial({color:0xf3efe7,roughness:.95});plasterMats.push([x,new THREE.Color(c),r,m]);return x};
const COLk=(c,r=.55,m=0)=>STD(c,r,m);
const SKINC=0xffb08f,NAILC=0xff8fb1;


// ---------- un moustique (tête vers +x)
function mosq(mk,bc=0x3a2c3c,ac=0x6a4560){const g=new THREE.Group();const b=mk(bc,.5),ab=mk(ac,.5),wm=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.2,transparent:true,opacity:.5,side:THREE.DoubleSide});
  const th=new THREE.Mesh(new THREE.SphereGeometry(.17,20,16),b);g.add(th);
  const abd=new THREE.Mesh(new THREE.SphereGeometry(.14,20,16),ab);abd.scale.set(2.8,1,1);abd.position.set(-.5,-.03,0);abd.rotation.z=.12;g.add(abd);
  for(let i=0;i<4;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(.135,.018,6,18),b);r.rotation.y=Math.PI/2;r.position.set(-.3-i*.13,-.04-i*.012,0);r.scale.set(1,1-i*.05,1-i*.05);g.add(r)}
  const hd=new THREE.Mesh(new THREE.SphereGeometry(.115,18,14),b);hd.position.set(.24,-.02,0);g.add(hd);
  const eyeM=mk(0xff3b30,.3);for(const s of[1,-1]){const e=new THREE.Mesh(new THREE.SphereGeometry(.05,10,8),eyeM);e.position.set(.28,.03,s*.08);g.add(e)}
  const pb=new THREE.Mesh(new THREE.CylinderGeometry(.008,.02,.42,8),b);pb.rotation.z=-Math.PI/2-.35;pb.position.set(.48,-.12,0);g.add(pb);
  for(let k=0;k<6;k++){const s=k%2?1:-1,x=(Math.floor(k/2)-1)*.12;const l=new THREE.Group();l.position.set(x,-.1,s*.08);l.rotation.x=s*(.9+Math.floor(k/2)*.15);
    const l1=new THREE.Mesh(new THREE.CylinderGeometry(.01,.01,.34,6),b);l1.position.y=-.17;l.add(l1);const l2=new THREE.Mesh(new THREE.CylinderGeometry(.008,.008,.34,6),b);l2.position.set(x*.5,-.5,0);l2.rotation.z=.5;l.add(l2);g.add(l)}
  const wings=[1,-1].map(s=>{const w=new THREE.Group();w.position.set(-.02,.14,s*.08);const m=new THREE.Mesh(new THREE.CircleGeometry(.3,20),wm);m.scale.set(1.5,1,1);m.rotation.x=-Math.PI/2;m.position.set(-.2,0,s*.22);w.add(m);g.add(w);return[w,s]});
  g.userData={wings};return castAll(g)}
const flap=(m,t,k=1)=>m.userData.wings.forEach(([w,s])=>w.rotation.x=s*(.15+Math.sin(t*70+s)*.55*k));

// ---------- un bras posé sur le sol (le long de z)
function arm(mk,skin=SKINC){const g=new THREE.Group();const sk=mk(skin,.6);
  const a=new THREE.Mesh(new THREE.CapsuleGeometry(.3,2.6,8,20),sk);a.rotation.x=Math.PI/2;a.position.set(0,.3,-.4);g.add(a);
  const h=new THREE.Mesh(new RoundedBoxGeometry(.7,.3,.75,5,.14),sk);h.position.set(0,.2,1.3);g.add(h);
  for(let k=0;k<4;k++){const f=new THREE.Mesh(new THREE.CapsuleGeometry(.07,.32,5,10),sk);f.rotation.x=Math.PI/2;f.position.set(-.24+k*.16,.17,1.8);g.add(f)}
  return castAll(g)}
const dot=(mk,c)=>new THREE.Mesh(new THREE.SphereGeometry(.07,10,8),mk(c,.5));

// ---------- 1. le moustique en plâtre (accroche) -> couleurs au FAUX
const HAND=new THREE.Group();scene.add(HAND);
{for(let i=-4;i<4;i++)for(let j=-4;j<4;j++){const m=new THREE.Mesh(new RoundedBoxGeometry(.97,.1,.97,3,.03),PMk((i+j)&1?0x7b2cbf:0xb68cff,.4));m.position.set(i+.5,-.05,j+.5);m.receiveShadow=true;HAND.add(m)}}
const hMain=mosq(PMk);hMain.scale.setScalar(2.6);hMain.position.set(0,1.5,.4);hMain.rotation.y=-.55;HAND.add(hMain);
const sparks=[];
const shards=[];{const sm=PLM();for(let k=0;k<80;k++){const m=new THREE.Mesh(new THREE.BoxGeometry(.06+rnd()*.12,.04+rnd()*.08,.03+rnd()*.06),sm.clone());m.material.transparent=true;
  m.userData={p0:new THREE.Vector3((rnd()-.5)*2.4,.2+rnd()*.8,-.2+(rnd()-.5)*2.4),v:new THREE.Vector3((rnd()-.5)*5,2+rnd()*4,(rnd()-.2)*4),r:new THREE.Vector3(rnd()*10,rnd()*10,rnd()*10)};m.visible=false;m.castShadow=true;HAND.add(m);shards.push(m)}}
const DN=260,dg=new THREE.BufferGeometry(),dp=new Float32Array(DN*3),dv=[];for(let i=0;i<DN;i++)dv.push(new THREE.Vector3((rnd()-.5)*3,rnd()*2.2,(rnd()-.3)*2.4));dg.setAttribute('position',new THREE.BufferAttribute(dp,3));
const dtex=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)})();
const dust=new THREE.Points(dg,new THREE.PointsMaterial({size:.14,map:dtex,transparent:true,depthWrite:false,color:0xf6f2ea,opacity:0}));dust.position.set(0,.4,0);HAND.add(dust);


// ---------- 2. l'expérience : deux bras, l'un dévoré, l'autre ignoré
const EXP=new THREE.Group();scene.add(EXP);
const expFloor=new THREE.Mesh(new THREE.CircleGeometry(12,64),STD(0xffffff,1));expFloor.rotation.x=-Math.PI/2;expFloor.receiveShadow=true;EXP.add(expFloor);
const armL=arm(COLk);armL.position.set(-1.25,0,0);EXP.add(armL);const armR=arm(COLk,0xe8a07a);armR.position.set(1.25,0,0);EXP.add(armR);
const bites=[...Array(14)].map((_,k)=>{const d=dot(COLk,0xe3172b);d.position.set(-1.25+(rnd()-.5)*.5,.55+rnd()*.05,-1.4+rnd()*2.2);d.scale.setScalar(.6+rnd()*.5);d.visible=false;EXP.add(d);return d});
const swarmE=[...Array(9)].map((_,k)=>{const m=mosq(COLk);m.scale.setScalar(.55);EXP.add(m);m.userData.ph=k/9*Math.PI*2;return m});
const loneE=mosq(COLk);loneE.scale.setScalar(.55);EXP.add(loneE);
const shield=new THREE.Mesh(new THREE.TorusGeometry(.25,.05,10,24),STD(0x22c55e,.4));shield.position.set(1.25,2.2,-.4);shield.visible=false;EXP.add(shield);

// ---------- 3. les manches en nylon + les moustiques qui choisissent
const SLV=new THREE.Group();scene.add(SLV);
const slvFloor=new THREE.Mesh(new THREE.CircleGeometry(12,64),STD(0xffffff,1));slvFloor.rotation.x=-Math.PI/2;slvFloor.receiveShadow=true;SLV.add(slvFloor);
const sleeveM=new THREE.MeshStandardMaterial({color:0xf4f6fb,roughness:.5,transparent:true,opacity:.75});
const sleeves=[-2.4,-.8,.8,2.4].map((x,i)=>{const g=new THREE.Group();const c=new THREE.Mesh(new THREE.CylinderGeometry(.42,.34,1.9,28,1,true),sleeveM);c.material.side=THREE.DoubleSide;c.position.y=1.05;g.add(c);
  for(let r=0;r<5;r++){const t=new THREE.Mesh(new THREE.TorusGeometry(.4-r*.015,.02,6,24),STD(0x2ee6d6,.4));t.rotation.x=Math.PI/2;t.position.y=.4+r*.35;g.add(t)}
  const base=new THREE.Mesh(new THREE.CylinderGeometry(.55,.6,.12,28),STD([0xff3d7f,0xffd60a,0x3d6cff,0x22c55e][i],.5));base.position.y=.06;g.add(base);g.position.set(x,0,0);SLV.add(g);return castAll(g)});
const swarmS=[...Array(10)].map(()=>{const m=mosq(COLk);m.scale.setScalar(.5);SLV.add(m);return m});
const crown=new THREE.Mesh(new THREE.ConeGeometry(.3,.4,5),STD(0xffc21a,.25,.7));crown.position.set(-.8,2.6,0);crown.visible=false;SLV.add(crown);

// ---------- 4. la peau : des molécules (acides) + l'horloge qui ne bouge pas
const ACID=new THREE.Group();scene.add(ACID);
const skinSlab=new THREE.Mesh(new RoundedBoxGeometry(9,1.2,5,5,.3),STD(0xffb08f,.7));skinSlab.position.set(0,-.7,0);skinSlab.receiveShadow=true;ACID.add(skinSlab);
const acidBg=new THREE.Mesh(new THREE.CircleGeometry(14,64),STD(0x2b1a5a,1));acidBg.position.z=-7;acidBg.scale.setScalar(2);ACID.add(acidBg);
const mols=[...Array(36)].map((_,k)=>{const g=new THREE.Group();const c=STD(0x3a2c3c,.4),o=STD(0xff3b30,.3);
  [[0,0,0,.2,c],[.3,.15,0,.2,c],[.6,0,0,.2,c],[.85,.2,.1,.17,o],[.7,-.1,.3,.15,o]].forEach(([x,y,z,r,m])=>{const s=new THREE.Mesh(new THREE.SphereGeometry(r,14,10),m);s.position.set(x,y,z);g.add(s)});
  g.userData={x:(rnd()-.5)*7,z:(rnd()-.5)*3.6,s:.5+rnd()*.6,ph:rnd()*6.28,v:k/36};g.scale.setScalar(.55);ACID.add(g);return castAll(g)});
const clock=(()=>{const g=new THREE.Group();const f=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.1,.2,48),STD(0xffffff,.4));f.rotation.x=Math.PI/2;g.add(f);
  const r=new THREE.Mesh(new THREE.TorusGeometry(1.1,.1,12,48),STD(0xffd60a,.4));g.add(r);
  const h1=new THREE.Group();const n1=new THREE.Mesh(new THREE.BoxGeometry(.09,.8,.05),STD(0x1b1030,.4));n1.position.y=.4;h1.add(n1);h1.position.z=.14;g.add(h1);
  const h2=new THREE.Group();const n2=new THREE.Mesh(new THREE.BoxGeometry(.07,.55,.05),STD(0xe3172b,.4));n2.position.y=.27;h2.add(n2);h2.position.z=.17;g.add(h2);
  g.userData={h1,h2};g.position.set(0,2.6,-1.2);ACID.add(g);return castAll(g)})();

// ---------- 5. la bombe : la femelle, son sang, ses œufs
const SWL=new THREE.Group();scene.add(SWL);
const swFloor=new THREE.Mesh(new THREE.CircleGeometry(12,64),STD(0xffffff,1));swFloor.rotation.x=-Math.PI/2;swFloor.receiveShadow=true;SWL.add(swFloor);
const fem=mosq(COLk,0x3a2c3c,0xe3172b);fem.scale.setScalar(3.2);fem.position.set(.4,1.6,0);fem.rotation.y=-.4;SWL.add(fem);
const mal=mosq(COLk,0x7a7a8a,0xa0a0b0);mal.scale.setScalar(1.5);mal.position.set(-2.4,2.6,-1.5);mal.rotation.y=.5;SWL.add(mal);
const noSign=new THREE.Group();{const r=new THREE.Mesh(new THREE.TorusGeometry(.5,.07,10,32),STD(0xe3172b,.4));noSign.add(r);const b=new THREE.Mesh(new THREE.BoxGeometry(1.0,.1,.08),STD(0xe3172b,.4));b.rotation.z=Math.PI/4;noSign.add(b);noSign.position.set(-2.4,2.6,-.6);noSign.visible=false;SWL.add(noSign)}
const eggs=[...Array(24)].map((_,k)=>{const e=new THREE.Mesh(new THREE.SphereGeometry(.13,12,10),STD(0xffffff,.35));e.scale.set(1,1.4,1);e.userData={a:rnd()*6.28,r:.4+rnd()*1.8,i:k};e.visible=false;e.castShadow=true;SWL.add(e);return e});
const drop=new THREE.Mesh(new THREE.SphereGeometry(.2,16,12),STD(0xe3172b,.2));drop.visible=false;SWL.add(drop);

// ---------- 6. la fin : deux camps
const END=new THREE.Group();scene.add(END);
const endFloor=new THREE.Mesh(new THREE.CircleGeometry(12,64),STD(0xffffff,1));endFloor.rotation.x=-Math.PI/2;END.add(endFloor);
const eL=arm(COLk);eL.position.set(-1.4,0,0);END.add(eL);const eR=arm(COLk,0xe8a07a);eR.position.set(1.4,0,0);END.add(eR);
const swarmN=[...Array(6)].map(()=>{const m=mosq(COLk);m.scale.setScalar(.5);END.add(m);return m});
const sun=new THREE.Mesh(new THREE.SphereGeometry(.35,16,12),STD(0xffd60a,.3));sun.position.set(1.4,2.4,-.4);END.add(sun);

function lightFor(w){hemi.intensity=w==='acid'?1.4:1.2;key.color.set(0xfff2e4)}
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
