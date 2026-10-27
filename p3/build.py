# Pilote 2 « règle des 5 secondes » : voix Lucie eleven_v4 -> p3/voice.wav + timeline_p3.json
import json, re, wave, subprocess, sys, numpy as np
SR = 44100; TEMPO = 1.08
FAST = {'a','b','c','e','g','i','i2'}
S4 = {s['id']: s for s in json.load(open('sessions.json'))['segments']}; P4 = json.load(open('picks.json')); TR4 = json.load(open('tr.json'))['transcripts']
T6 = json.load(open('tr6.json')); TP = json.load(open('p3/tr.json'))
PICK = {'hook':'b','a':'b','b':'a','c':'a','e':'a','g':'a','i':'a','i2':'b','j':'a'}
SRC = {**{k: (f'p3/wav/{k}_{v}.wav', TP[k]) for k, v in PICK.items()}, 'pire': ('wav/pire6_a.wav', T6['pire']), 'r4': ('wav/r46_b.wav', T6['r4'])}
LEAD, COUNTDOWN, RUPTURE, OUTRO = .12, 1.35, .75, 3.0
GAP = {'hook':0,'faux':.30,'pire':.30,'a':.16,'b':.18,'r1':.14,'c':.18,'r2':.14,'e':.2,'r3':.24,'g':.26,'r4':0,'i':.22,'i2':.30,'j':0}
DISP = {('a','soixante'):'60', ('c','soixante'):'60'}
ORDER = ['hook','faux','pire','a','b','r1','c','r2','e','r3','g','r4','i','i2','j']
def rd(p):
    w = wave.open(p); return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32)/32768
def voiced(a):
    win = 441; n = len(a)//win; e = np.array([np.sqrt(np.mean(a[i*win:(i+1)*win]**2)) for i in range(n)])
    v = np.where(e > max(e.max()*0.03, 0.003))[0]; return v[0]*.01, (v[-1]+1)*.01
out = []; marks = {}; audio = [np.zeros(int(SR*LEAD), np.float32)]; t = LEAD
def pad(d):
    global t; audio.append(np.zeros(int(SR*d), np.float32)); t += d
for sid in ORDER:
    if sid in SRC: path, ws = SRC[sid]
    else:
        take = P4[sid]['take']; path = f"wav/{sid}_{take}.wav"; sess = S4[sid]['sessions'][0 if take=='a' else 1]
        tr = [x for x in TR4 if f'/{sess}/' in x['source']['url']][0]; ws = tr['words'] if isinstance(tr['words'], list) else eval(tr['words'])
    a = rd(path); v0, v1 = voiced(a); c0 = max(0, v0-.04); c1 = min(len(a)/SR, v1+.10); a = a[int(c0*SR):int(c1*SR)].copy()
    f = TEMPO if sid in FAST else 1.0
    if f != 1.0:
        w = wave.open('/tmp/s_in.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((a*32767).astype(np.int16).tobytes()); w.close()
        subprocess.run(['ffmpeg','-v','error','-y','-i','/tmp/s_in.wav','-af',f'atempo={f}','/tmp/s_out.wav'], check=True); a = rd('/tmp/s_out.wav')
    k = int(.006*SR); a[:k] *= np.linspace(0,1,k); a[-k:] *= np.linspace(1,0,k); d = len(a)/SR
    real = [w for w in ws if w.get('type','word') != 'spacing' and w['text'].strip() and not re.match(r'^\[|^\w*\]$', w['text'].strip())]
    off = v0 - real[0]['start'] if real[0]['start'] < v0 else 0
    words = []
    for w in real:
        txt = w['text'].strip()
        if txt == '«': continue
        if txt.startswith('»'):
            if words and len(txt)>1: words[-1]['w'] += txt[1:]
            continue
        if txt == ':':
            if words: words[-1]['w'] += ' :'
            continue
        if txt in ('?','!'):
            if words: words[-1]['w'] += ' '+txt; words[-1]['t1'] = round(t+(w['end']+off-c0)/f,3)
            continue
        txt = DISP.get((sid, txt), txt)
        words.append({'w': txt, 't0': round(t+max(0,(w['start']+off-c0))/f,3), 't1': round(min(t+d, t+max(0,(w['end']+off-c0))/f),3)})
    # « trois cent soixante-deux » -> « 362 »
    for i in range(len(words)-1):
        if [x['w'].lower() for x in words[i:i+2]] == ['trois','cents']:
            words[i:i+2] = [{'w':'300','t0':words[i]['t0'],'t1':words[i+1]['t1']}]; break
    out.append({'id': sid, 't0': round(t,3), 't1': round(t+d,3), 'words': words}); audio.append(a); t += d
    if sid == 'hook': marks['cd0'] = round(t+.08,3); pad(COUNTDOWN); marks['cd1'] = round(t,3)
    if sid == 'r4': marks['rup0'] = round(t,3); pad(RUPTURE); marks['rup1'] = round(t,3)
    pad(GAP[sid])
marks['end0'] = round(t,3); pad(OUTRO)
A = np.concatenate(audio)
w = wave.open('p3/voice.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(A,-1,1)*32767).astype(np.int16).tobytes()); w.close()
json.dump({'duration': round(t,3), 'marks': marks, 'segments': out}, open('timeline_p3.json','w'), ensure_ascii=False, indent=1)
for o in out: print(f"{o['id']:5s} {o['t0']:6.2f} {o['t1']:6.2f}  " + ' '.join(x['w'] for x in o['words'])[:110])
print('MARQUES', marks, 'DUREE', round(t,2))
