
// =================== PILOTE 2 : la règle des 5 secondes ===================
const STD=(c,r=.55,m=0,o)=>{const x=new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});if(o!==undefined){x.transparent=true;x.opacity=o}return x};
const PLASTER=new THREE.Color(0xf3efe7);
// matériaux « plâtre » qui prennent leur couleur au FAUX
const plasterMats=[];const PMk=(c,r=.55,m=0)=>{const x=new THREE.MeshStandardMaterial({color:0xf3efe7,roughness:.95,metalness:0});plasterMats.push([x,new THREE.Color(c),r,m]);return x};
const COLk=(c,r=.55,m=0)=>STD(c,r,m);

// ---------- objets
function melon(mk){const g=new THREE.Group();const R0=1.0,T=.34;
  const mk3=(r,th,c)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,th,56,1,false,-Math.PI/2,Math.PI),mk(c));m.rotation.x=-Math.PI/2;g.add(m);return m};
  const flesh=mk3(R0*.84,T,0xff3d57);mk3(R0*.92,T*.95,0xeaffd8);mk3(R0,T*.9,0x2b9a46);
  const stripe=mk(0x1f7a35);for(let k=0;k<7;k++){const a=(k+.5)/7*Math.PI;const s=new THREE.Mesh(new THREE.BoxGeometry(.05,.3,T*.92+.01),stripe);s.position.set(Math.cos(a)*(R0-.01),Math.sin(a)*(R0-.01),0);s.rotation.z=a-Math.PI/2;s.scale.y=.2;g.add(s)}
  const sm=mk(0x1b1416);for(let k=0;k<10;k++){const a=.35+k/9*(Math.PI-.7),rr=.42+(k%3)*.13;for(const sg of[1,-1]){const sd=new THREE.Mesh(new THREE.SphereGeometry(.034,10,8),sm);sd.scale.set(1,1.7,.45);sd.position.set(Math.cos(a)*rr,Math.sin(a)*rr,sg*(T/2+.004));sd.rotation.z=a-Math.PI/2;g.add(sd)}}
  g.userData.T=T;g.userData.R=R0;return castAll(g)}
function chrono(mk){const g=new THREE.Group();
  const body=new THREE.Mesh(new THREE.CylinderGeometry(.7,.7,.26,56),mk(0xffc21a));body.rotation.x=Math.PI/2;g.add(body);
  const face=new THREE.Mesh(new THREE.CircleGeometry(.57,56),mk(0xfffdf6));face.position.z=.132;g.add(face);
  const rim=new THREE.Mesh(new THREE.TorusGeometry(.64,.07,14,56),mk(0xff6a1a));rim.position.z=.11;g.add(rim);
  const btn=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,.2,18),mk(0xff6a1a));btn.position.y=.8;g.add(btn);
  const crown=new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.09,24),mk(0xff6a1a));crown.position.y=.93;g.add(crown);
  const tk=mk(0x1b1030);for(let k=0;k<12;k++){const a=k/12*Math.PI*2;const m=new THREE.Mesh(new THREE.BoxGeometry(.03,k%3?.06:.12,.01),tk);m.position.set(Math.sin(a)*.48,Math.cos(a)*.48,.14);m.rotation.z=-a;g.add(m)}
  const hand=new THREE.Group();hand.position.z=.145;g.add(hand);const hm=new THREE.Mesh(new THREE.BoxGeometry(.035,.46,.012),mk(0xe3172b));hm.position.y=.2;hand.add(hm);
  const hub=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,.03,16),mk(0xe3172b));hub.rotation.x=Math.PI/2;hub.position.z=.15;g.add(hub);
  g.userData.hand=hand;return castAll(g)}
function bread(mk,butter){const g=new THREE.Group();const cr=new THREE.Mesh(new RoundedBoxGeometry(1.0,.16,1.0,5,.07),mk(0xb8642a));cr.position.y=.08;g.add(cr);
  const mie=new THREE.Mesh(new RoundedBoxGeometry(.88,.1,.88,5,.05),mk(0xf6d9a0));mie.position.y=.13;g.add(mie);
  if(butter){const b=new THREE.Mesh(new RoundedBoxGeometry(.45,.07,.36,4,.03),mk(0xffe55c));b.position.set(.05,.2,-.02);b.rotation.y=.4;g.add(b)}return castAll(g)}
function gummy(mk,c=0xff3d7f){const g=new THREE.Group();const m=mk(c);
  const add=(geo,p,s)=>{const x=new THREE.Mesh(geo,m);x.position.set(...p);if(s)x.scale.set(...s);g.add(x);return x};
  add(new THREE.SphereGeometry(.3,24,18),[0,.38,0],[1,1.15,.85]);add(new THREE.SphereGeometry(.24,24,18),[0,.82,0],[1,.92,.9]);
  for(const s of[1,-1]){add(new THREE.SphereGeometry(.09,14,10),[s*.17,1.0,0]);add(new THREE.SphereGeometry(.11,14,10),[s*.29,.5,.04],[1,1.3,1]);add(new THREE.SphereGeometry(.12,14,10),[s*.16,.1,.05],[1.1,.9,1.2])}
  const ey=STD(0x1b1030,.4);for(const s of[1,-1]){const e=new THREE.Mesh(new THREE.SphereGeometry(.035,10,8),ey);e.position.set(s*.08,.86,.2);g.add(e)}
  const sn=new THREE.Mesh(new THREE.SphereGeometry(.06,12,10),STD(0xffffff,.3,0,.5));sn.position.set(0,.78,.21);sn.scale.set(1.3,.8,.6);g.add(sn);
  return castAll(g)}
// bactéries mignonnes
const BGEO=new THREE.CapsuleGeometry(.1,.2,6,14),EYE=new THREE.SphereGeometry(.04,10,8),PUP=new THREE.SphereGeometry(.021,8,6);
const BMAT=[0x7cf04a,0xb45cff,0x2ee6d6,0xffd60a,0xff5ca8].map(c=>STD(c,.35));const WM=STD(0xffffff,.3),KM=STD(0x1b1030,.5);
function bact(i){const g=new THREE.Group();const b=new THREE.Mesh(BGEO,BMAT[i%5]);b.rotation.z=Math.PI/2;b.castShadow=true;g.add(b);
  for(const s of[1,-1]){const e=new THREE.Mesh(EYE,WM);e.position.set(s*.06,.06,.08);g.add(e);const p=new THREE.Mesh(PUP,KM);p.position.set(s*.06,.06,.115);g.add(p)}
  g.userData.ph=rnd()*6.28;return g}
function swarm(parent,n,i0=0){return [...Array(n)].map((_,k)=>{const b=bact(k+i0);parent.add(b);return b})}
const wig=(b,t,a=1)=>{const u=b.userData;b.rotation.z=Math.sin(t*7+u.ph)*.25*a;b.rotation.y=(u.ry||0)+Math.sin(t*3+u.ph)*.3*a;b.position.y+=Math.abs(Math.sin(t*9+u.ph))*.03*a};

// ---------- 1. la cuisine en plâtre (accroche) -> couleurs au FAUX
const KIT=new THREE.Group();scene.add(KIT);
const tiles=[];for(let i=-4;i<4;i++)for(let j=-4;j<4;j++){const c=(i+j)&1?0x46c7cf:0xfaf7f0;const m=new THREE.Mesh(new RoundedBoxGeometry(.97,.1,.97,3,.03),PMk(c,.35));m.position.set(i+.5,-.05,j+.5);m.receiveShadow=true;KIT.add(m);tiles.push(m)}
const kMelon=melon(PMk);kMelon.position.set(-.3,0,.2);kMelon.rotation.y=.12;KIT.add(kMelon);
const kChrono=chrono(PMk);kChrono.position.set(.95,1.35,.9);kChrono.rotation.y=-.3;kChrono.scale.setScalar(.5);KIT.add(kChrono);
const kBread=bread(PMk,true);kBread.position.set(-2.6,0,-1.2);kBread.rotation.y=.5;KIT.add(kBread);
const kGum=gummy(PMk,0xff3d7f);kGum.position.set(2.5,0,1.5);kGum.rotation.y=-.6;kGum.scale.setScalar(.8);KIT.add(kGum);
// éclats de plâtre + poussière
const shards=[];{const sm=PLM();for(let k=0;k<80;k++){const m=new THREE.Mesh(new THREE.BoxGeometry(.06+rnd()*.12,.04+rnd()*.08,.03+rnd()*.06),sm.clone());m.material.transparent=true;
  const src=k<44?[kMelon.position.x+(rnd()-.5)*1.8,.15+rnd()*.95,kMelon.position.z+(rnd()-.5)*.5]:k<64?[kChrono.position.x+(rnd()-.5)*1.2,.2+rnd()*1.3,kChrono.position.z+(rnd()-.5)*.4]:[(rnd()<.5?kBread:kGum).position.x+(rnd()-.5)*.8,.1+rnd()*.6,(rnd()<.5?kBread:kGum).position.z+(rnd()-.5)*.8];
  m.userData={p0:new THREE.Vector3(...src),v:new THREE.Vector3((rnd()-.5)*5,2+rnd()*4,(rnd()-.2)*4),r:new THREE.Vector3(rnd()*10,rnd()*10,rnd()*10)};m.visible=false;m.castShadow=true;KIT.add(m);shards.push(m)}}
const DN=260,dg=new THREE.BufferGeometry(),dp=new Float32Array(DN*3),dv=[];for(let i=0;i<DN;i++)dv.push(new THREE.Vector3((rnd()-.5)*3,rnd()*2.2,(rnd()-.3)*2.4));dg.setAttribute('position',new THREE.BufferAttribute(dp,3));
const dtex=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)})();
const dust=new THREE.Points(dg,new THREE.PointsMaterial({size:.14,map:dtex,transparent:true,depthWrite:false,color:0xf6f2ea,opacity:0}));dust.position.set(0,.4,.2);KIT.add(dust);

// ---------- 2. le monde microscopique : la pastèque sur le carrelage
const MIC=new THREE.Group();scene.add(MIC);
const floor=new THREE.Mesh(new THREE.CircleGeometry(12,72),STD(0xf2e9dc,1));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;MIC.add(floor);
{const gm=STD(0xffffff,1,0,.35);for(let k=-6;k<=6;k++){for(const rot of[0,1]){const l=new THREE.Mesh(new THREE.PlaneGeometry(.06,24),gm);l.rotation.x=-Math.PI/2;if(rot)l.rotation.z=Math.PI/2;l.position.set(rot?0:k*1.9,.002,rot?k*1.9:0);MIC.add(l)}}}
const mMelon=melon(COLk);mMelon.scale.setScalar(2.1);mMelon.position.set(0,0,0);MIC.add(mMelon);
const MT=mMelon.userData.T*2.1/2;
const mb=swarm(MIC,48);
const mbHome=mb.map((b,k)=>{const a=k/48*Math.PI*2+rnd()*.3,r=2.4+rnd()*2.6;return new THREE.Vector3(Math.cos(a)*r,.1,Math.sin(a)*r*.8+.6)});
const mbOn=mb.map((b,k)=>{const a=.25+rnd()*(Math.PI-.5),r=.35+rnd()*1.35;const s=k%3?1:-1;return new THREE.Vector3(Math.cos(a)*r,Math.sin(a)*r,s*(MT+.08))});
mb.forEach((b,k)=>{b.userData.ry=(rnd()-.5)*1.2;b.userData.del=rnd()*.9;b.scale.setScalar(1.25)});
const drops=[...Array(26)].map(()=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.05,12,10),STD(0xcfefff,.05,0,.75));const a=.3+rnd()*(Math.PI-.6),r=.4+rnd()*1.3;m.position.set(Math.cos(a)*r,Math.sin(a)*r,MT+.03);m.scale.set(1,1,.5);MIC.add(m);return m});
const crown=(()=>{const g=new THREE.Group();const m=STD(0xffc21a,.25,.6);const base=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.22,32,1,true),m);g.add(base);
  for(let k=0;k<5;k++){const a=k/5*Math.PI*2;const sp=new THREE.Mesh(new THREE.ConeGeometry(.1,.3,12),m);sp.position.set(Math.sin(a)*.4,.24,Math.cos(a)*.4);g.add(sp);const jw=new THREE.Mesh(new THREE.SphereGeometry(.05,10,8),STD(0xff3d7f,.2));jw.position.set(Math.sin(a)*.43,.0,Math.cos(a)*.43);g.add(jw)}
  g.position.set(0,2.35,0);g.rotation.z=-.2;MIC.add(g);return castAll(g)})();

// ---------- 3. le labo : 4 surfaces, 4 aliments
const LAB=new THREE.Group();scene.add(LAB);
const labFloor=new THREE.Mesh(new THREE.CircleGeometry(12,64),STD(0xffffff,1));labFloor.rotation.x=-Math.PI/2;labFloor.receiveShadow=true;LAB.add(labFloor);
function fur(w,d,n,c1,c2){const g=new THREE.Group();const base=new THREE.Mesh(new RoundedBoxGeometry(w,.1,d,3,.04),STD(c1,1));base.position.y=.05;base.receiveShadow=true;g.add(base);
  const geo=new THREE.CylinderGeometry(.022,.03,.22,5);const im=new THREE.InstancedMesh(geo,STD(c2,.95),n);const M4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler();
  for(let k=0;k<n;k++){e.set((rnd()-.5)*.5,0,(rnd()-.5)*.5);q.setFromEuler(e);M4.compose(new THREE.Vector3((rnd()-.5)*(w-.06),.2,(rnd()-.5)*(d-.06)),q,new THREE.Vector3(1,.7+rnd()*.6,1));im.setMatrixAt(k,M4)}
  im.castShadow=true;im.receiveShadow=true;g.add(im);return g}
const PATCH=[];{const P=[[-1,-1],[1,-1],[-1,1],[1,1]];
  const steel=new THREE.Mesh(new RoundedBoxGeometry(1.8,.12,1.8,3,.05),STD(0xd7dee6,.18,.95));steel.position.y=.06;
  const tile=new THREE.Group();for(let i=0;i<3;i++)for(let j=0;j<3;j++){const m=new THREE.Mesh(new RoundedBoxGeometry(.58,.12,.58,3,.03),STD((i+j)&1?0x46c7cf:0xfaf7f0,.35));m.position.set((i-1)*.6,.06,(j-1)*.6);tile.add(m)}
  const wood=new THREE.Group();for(let i=0;i<5;i++){const m=new THREE.Mesh(new RoundedBoxGeometry(1.8,.12,.34,3,.03),STD([0xc98a52,0xb87742,0xd29a60][i%3],.7));m.position.set(0,.06,(i-2)*.36);wood.add(m)}
  const carpet=fur(1.8,1.8,1400,0x7b3fe4,0x9d6bff);
  [steel,tile,wood,carpet].forEach((s,k)=>{const g=new THREE.Group();g.add(s);g.position.set(P[k][0]*1.05,0,P[k][1]*1.05);castAll(s);LAB.add(g);PATCH.push(g)})}
const FOODS=[bread(COLk,false),bread(COLk,true),gummy(COLk,0xff3d7f),melon(COLk)];FOODS[3].scale.setScalar(.6);FOODS[2].scale.setScalar(.7);
FOODS.forEach((f,k)=>{LAB.add(f)});

// ---------- 4. la moquette géante + l'ourson
const CARP=new THREE.Group();scene.add(CARP);
const bigCarpet=fur(9,9,5200,0x6a2fd0,0x9d6bff);CARP.add(bigCarpet);
const cGum=gummy(COLk,0xff8a1a);cGum.scale.setScalar(2.2);cGum.position.set(0,.28,0);CARP.add(cGum);
const cb=swarm(CARP,4,1);cb.forEach((b,k)=>{b.scale.setScalar(1.3);b.position.set([-1.3,1.5,-.9,1.0][k],.45,[1.2,.6,-1.4,-1.6][k])});

// ---------- 5. l'évier et l'éponge
const SINK=new THREE.Group();scene.add(SINK);
const counter=new THREE.Mesh(new RoundedBoxGeometry(9,.4,5,4,.08),STD(0xf4f1ea,.5));counter.position.set(0,-.2,0);counter.receiveShadow=true;SINK.add(counter);
const basin=new THREE.Mesh(new RoundedBoxGeometry(3.2,.06,2.2,4,.3),STD(0xc9d3dc,.15,.9));basin.position.set(-2.2,.01,-.6);SINK.add(basin);
const tap=new THREE.Group();{const m=STD(0xd7dee6,.15,1);const p1=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,1.4,16),m);p1.position.set(-2.2,.7,-1.9);tap.add(p1);
  const p2=new THREE.Mesh(new THREE.TorusGeometry(.45,.09,12,24,Math.PI),m);p2.position.set(-2.2,1.4,-1.45);p2.rotation.y=Math.PI/2;tap.add(p2)}SINK.add(castAll(tap));
const spTex=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#ffd23f';x.fillRect(0,0,256,256);
  for(let k=0;k<420;k++){const r=2+rnd()*7;x.fillStyle=`rgba(${150+rnd()*40|0},${100+rnd()*30|0},0,${.35+rnd()*.4})`;x.beginPath();x.ellipse(rnd()*256,rnd()*256,r,r*(.6+rnd()*.5),rnd()*3,0,7);x.fill()}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t})();
const sponge=new THREE.Group();{const body=new THREE.Mesh(new RoundedBoxGeometry(1.6,.55,1.0,5,.12),new THREE.MeshStandardMaterial({map:spTex,roughness:1}));body.position.y=.28;sponge.add(body);
  const scr=new THREE.Mesh(new RoundedBoxGeometry(1.6,.18,1.0,5,.07),STD(0x22b35e,.9));scr.position.y=.64;sponge.add(scr)}
sponge.position.set(.9,0,.4);sponge.rotation.y=-.35;SINK.add(castAll(sponge));
const bubbles=[...Array(22)].map(()=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.07+rnd()*.12,16,12),STD(0xe8fbff,.05,0,.55));m.userData={x:(rnd()-.5)*1.8,z:(rnd()-.5)*1.1,s:rnd()};SINK.add(m);return m});

// ---------- 6. dans l'éponge (microscopique)
const SPG=new THREE.Group();scene.add(SPG);
const HOLES=[[0,0],[-1.7,-.9],[1.6,-1.2],[-1.0,1.4],[1.3,1.3],[2.7,.2],[-2.8,.3],[.2,-2.4],[-.4,2.7],[2.5,-2.6],[-2.4,-2.5],[3.4,2.6],[-3.3,2.4],[.9,3.6]];
const sgeo=new THREE.PlaneGeometry(18,18,180,180);{const p=sgeo.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);let z=Math.sin(x*1.3)*.08+Math.cos(y*1.1)*.08+Math.sin(x*3.1+y*2.3)*.04;
  for(const [hx,hz] of HOLES){const d=Math.hypot(x-hx,y+hz);if(d<.95)z-=(1-d/.95)**2*1.4;else if(d<1.25)z+=Math.sin((d-.95)/.3*Math.PI)*.12}p.setZ(i,z)}sgeo.computeVertexNormals()}
const sTex=(()=>{const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');x.fillStyle='#ffd23f';x.fillRect(0,0,512,512);for(let k=0;k<900;k++){x.fillStyle=`rgba(${200+rnd()*55|0},${150+rnd()*60|0},${20+rnd()*40|0},.5)`;x.beginPath();x.arc(rnd()*512,rnd()*512,1+rnd()*5,0,7);x.fill()}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,3);t.colorSpace=THREE.SRGBColorSpace;return t})();
const sSurf=new THREE.Mesh(sgeo,new THREE.MeshStandardMaterial({map:sTex,roughness:.85}));sSurf.rotation.x=-Math.PI/2;sSurf.receiveShadow=true;SPG.add(sSurf);
for(const [hx,hz] of HOLES){const d=new THREE.Mesh(new THREE.CircleGeometry(.62,32),STD(0x5a3a08,1));d.rotation.x=-Math.PI/2;d.position.set(hx,-1.0,hz);SPG.add(d)}
const sb=swarm(SPG,130);sb.forEach((b,k)=>{const h=HOLES[k%HOLES.length];const a=rnd()*6.28,r=.9+rnd()*.8;b.userData.home=new THREE.Vector3(h[0]+Math.cos(a)*r,.12,h[1]+Math.sin(a)*r);b.userData.ry=rnd()*6.28;b.userData.ord=k;b.scale.setScalar(.9+rnd()*.5)});

// ---------- éclairage par monde
function lightFor(w){if(w==='kit'){hemi.intensity=1.15;key.color.set(0xfff2e4)}else{hemi.intensity=1.25;key.color.set(0xfff2e4)}}
// ---------- caméras des écrans divisés + mur de plâtre (repris du pilote 1)
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
