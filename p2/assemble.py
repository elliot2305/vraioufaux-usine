L=open('pire_v10.html').read().split('\n')
idx=[i for i,l in enumerate(L) if l.startswith('const RB=')][0]
head='\n'.join(L[:idx+1])
def R(a,b):
    global head;assert head.count(a)==1,a;head=head.replace(a,b)
R("fetch('timeline.json')","fetch('timeline_p2.json')")
R("<s>Tu avales <b>8&nbsp;araignées</b> par an en&nbsp;dormant&nbsp;?</s>","<s><b>Règle des 5&nbsp;secondes</b>&nbsp;: ramassé vite = encore propre&nbsp;?</s>")
R('<div class="dog">🐶</div><div class="k">LE VRAI DÉBAT</div>\n   <div class="q">Ton chien dans le&nbsp;lit&nbsp;?</div>\n   <div class="vs"><span class="g">PROPRE</span><em>OU</em><span class="r">DÉGUEU</span></div>',
  '<div class="dog">🍉</div><div class="k">LE VRAI DÉBAT</div>\n   <div class="q">Tombé par terre&nbsp;: tu le manges&nbsp;?</div>\n   <div class="vs"><span class="g">JE MANGE</span><em>OU</em><span class="r">POUBELLE</span></div>')
css=open('p2/extra.css').read()
head=head.replace('</style>',css+'</style>',1)
open('pilote2.html','w').write(head+'\n'+open('p2/scene.js').read()+'\n'+open('p2/main.js').read())
