import json,subprocess,sys,os
# dlgen.py status.json map.json outdir
d=json.load(open(sys.argv[1]));M=json.load(open(sys.argv[2]));out=sys.argv[3]
G={g['id']:g for g in d['generations']};pend=[]
for sid,(ga,gb) in M.items():
  for tk,g in (('a',ga),('b',gb)):
    f=f'{out}/{sid}_{tk}.wav'
    if os.path.exists(f):continue
    x=G.get(g)
    if not x or x['status']!='completed': pend.append(f'{sid}_{tk}');continue
    subprocess.run(['curl','-sS','-o','/tmp/_d.mp3',x['content_url']],check=True)
    subprocess.run(['ffmpeg','-v','error','-y','-i','/tmp/_d.mp3','-ac','1','-ar','44100',f],check=True)
print('pending',pend)
