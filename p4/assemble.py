p2=open('p2/main.js').read()
a=p2.index("const T_REV=");b=p2.index("const shade=")
head=p2[:a];tail=p2[b:]
tail=tail.replace(tail[tail.index("{const EMO="):tail.index("};",tail.index("{const EMO="))+2],"""{const EMO={'moustiques':'🦟','moustique':'🦟','piquent':'🦟','piqûre':'🦟','dévorer':'😫','rockefeller':'🔬','chercheurs':'🧑‍🔬','soixante-quatre':'🙋','64':'🙋','nylon':'🧦','manche':'🧦','manches':'🧦','acides':'🧪','carboxyliques':'🧪','peau':'🖐️','sang':'🩸','femelle':'♀️','mâle':'♂️','œufs':'🥚','pondre':'🥚','an':'📅','stables':'⏳','aimant':'🧲','privilégiés':'😎','avouez':'😏','couvre-toi':'🧥','jamais':'🚫','six':'⏱️'};""")
tail=tail.replace("CD.findIndex((c,i)=>t>=c&&t<c+.433)","CD.findIndex((c,i)=>t>=c&&t<(i<2?CD[i+1]:M.cd1end))").replace("CD[ci]+.33,.1","(ci<2?CD[ci+1]:M.cd1end)-.12,.1")
open('p4/main.js','w').write(head+open('p4/mid.js').read()+'\n'+tail)
L=open('pire_v10.html').read().split('\n')
idx=[i for i,l in enumerate(L) if l.startswith('const RB=')][0]
h='\n'.join(L[:idx+1])
def R(x,y):
    global h;assert h.count(x)==1,x;h=h.replace(x,y)
R("fetch('timeline.json')","fetch('timeline_p4.json')")
R("<s>Tu avales <b>8&nbsp;araignées</b> par an en&nbsp;dormant&nbsp;?</s>","<s>Les moustiques piquent <b>tout le monde pareil</b>&nbsp;?</s>")
R('<div class="dog">🐶</div><div class="k">LE VRAI DÉBAT</div>\n   <div class="q">Ton chien dans le&nbsp;lit&nbsp;?</div>\n   <div class="vs"><span class="g">PROPRE</span><em>OU</em><span class="r">DÉGUEU</span></div>',
  '<div class="dog">🦟</div><div class="k">LE VRAI DÉBAT</div>\n   <div class="q">Moustiques&nbsp;?</div>\n   <div class="vs"><span class="g">AIMANT</span><em>OU</em><span class="r">JAMAIS PIQUÉ</span></div>')
css=open('p2/extra.css').read()+"""
#cap{font-size:calc(80px * var(--fs,1))!important;bottom:440px!important}
#cap.rel{font-size:calc(72px * var(--fs,1))!important;bottom:420px!important}
.hd{font-size:82px!important}.hd .x{width:108px!important;height:108px!important;font-size:58px!important}.hd em{font-size:52px!important}
#chip .c{font-size:50px!important}
"""
h=h.replace('</style>',css+'</style>',1)
open('pilote4.html','w').write(h+'\n'+open('p4/scene.js').read()+'\n'+open('p4/main.js').read())
