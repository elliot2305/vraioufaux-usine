# V5 — musique ElevenLabs (niveau fixe, pas de pompage) + bruitages ElevenLabs + voix Lucie au naturel
import json, wave, subprocess, sys, numpy as np
from scipy.signal import butter, sosfilt
SR = 44100
TL = json.load(open('timeline_p2.json')); SEG = {s['id']: s for s in TL['segments']}; D = TL['duration']; M = TL['marks']
N = int((D + .05) * SR)
MUSIC = sys.argv[1] if len(sys.argv) > 1 else 'music/m3.wav'

def wt(sid, sub):
    for w in SEG[sid]['words']:
        if sub.lower() in w['w'].lower(): return w['t0']
    raise KeyError(sub)
def rd(p, stereo=False):
    w = wave.open(p); ch = w.getnchannels(); x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float)/32768
    x = x.reshape(-1, ch)
    if ch == 1: x = np.repeat(x, 2, 1)
    sr = w.getframerate()
    if sr != SR: x = np.stack([np.interp(np.arange(int(len(x)*SR/sr))*sr/SR, np.arange(len(x)), x[:, c]) for c in (0, 1)], 1)
    return x if stereo else x.mean(1)
def fade(x, a=.004, b=.03):
    x = x.copy(); na = max(1, int(a*SR)); nb = max(1, int(b*SR))
    x[:na] *= np.linspace(0, 1, na); x[-nb:] *= np.linspace(1, 0, nb); return x
def hp(x, fc, o=2): return sosfilt(butter(o, fc, 'high', fs=SR, output='sos'), x, axis=0)
def lp(x, fc, o=2): return sosfilt(butter(o, fc, 'low', fs=SR, output='sos'), x, axis=0)
def db(x): return 20*np.log10(np.sqrt(np.mean(x**2)) + 1e-9)
tt = np.arange(N)/SR
def win(t0, t1, r):   # 1 dans [t0,t1], rampes douces de r secondes
    return np.clip(np.minimum((tt-(t0-r))/r, ((t1+r)-tt)/r), 0, 1)

# ---------- voix : passe-haut léger, pas de compresseur (naturel), nivellement par réplique
subprocess.run(['ffmpeg','-v','error','-y','-i','p2/voice.wav','-af','highpass=f=75,acompressor=threshold=-22dB:ratio=2.2:attack=6:release=90:makeup=2','-ar',str(SR),'p2/voice_p.wav'], check=True)
v = rd('p2/voice_p.wav'); V = np.zeros(N); V[:min(N, len(v))] = v[:N]
TGT = {'r4': -23.0, 'faux': -18.5, 'r3': -22.5}
for sg in TL['segments']:
    a, b = int(sg['t0']*SR), int(sg['t1']*SR)
    g = 10**(np.clip(TGT.get(sg['id'], -21.0) - db(V[a:b]), -5, 6)/20)
    V[a:b] *= g      # le saut de gain tombe dans le blanc autour de chaque réplique

# ---------- musique : niveau fixe sous la voix (≈ -15 dB), seulement 3 automations lentes
mu = rd(MUSIC, stereo=True); MUS = np.zeros((N, 2))
# montage de la musique (72 s) sur 84 s : la partie tension démarre à la révélation, puis on la prolonge, et la fin tombe sur l'écran final
def place(src0, src1, dst, xf=1.2):
    seg = mu[int(src0*SR):int(src1*SR)].copy(); k = int(xf*SR); seg[:k] *= np.linspace(0,1,k)[:,None]**.5; seg[-k:] *= np.linspace(1,0,k)[:,None]**.5
    i = int(dst*SR); j = min(N, i+len(seg)); MUS[i:j] += seg[:j-i]; return dst + (src1-src0) - xf
REV = M['rup1']
e = place(0, REV + 1.2, 0)
e = place(55.5, 68.6, REV - .0)
e = place(57.72, 68.6, e)
place(62.5, 69.9, D - 7.6, xf=1.5)
MUS = hp(MUS, 45); MUS = lp(MUS, 12000)
speech = np.concatenate([V[int(s['t0']*SR):int(s['t1']*SR)] for s in TL['segments']])
MUS *= 10**((db(speech) - 13.0 - db(MUS[int(6*SR):int(50*SR)].mean(1)))/20)
g = np.ones(N)
g *= 1 - .45*win(M['cd0'], M['cd1'] - .05, .15)            # 3-2-1 : la musique se retient, les tics passent devant
g *= 1 - .5*win(SEG['r4']['t0'], M['rup0'] - .3, .6)       # chuchotement intime
g *= 1 - 1.0*win(M['rup0'] - .05, M['rup1'] - .02, .25)     # rupture : silence total
g *= 1 + .25*win(M['end0'] + .2, D, .4)                     # l'écran final respire
MUS *= g[:, None]

# ---------- bruitages ElevenLabs
SFX = np.zeros(N)
def add(x, t, gain):
    i = int(round(t*SR))
    if i < 0: x = x[-i:]; i = 0
    j = min(N, i + len(x))
    if j > i: SFX[i:j] += x[:j-i]*gain
S = lambda name: hp(rd(f'sfx/{name}.wav'), 40)
T_REV = wt('faux', 'faux') - .03; T_MITE = SEG['a']['t0'] - .1; T_IREV = SEG['i']['t0'] - .03
CD = [M['cd0'], M['cd0'] + .433, M['cd0'] + .866]
for k, name in enumerate(['crack_0', 'crack_3', 'crack_1']): add(fade(S(name)[:int(.42*SR)], .002, .08), CD[k], .5 + .1*k)
add(fade(S('impact_1'), .002, .1), T_REV, .55); add(fade(S('shatter_0'), .002, .1), SEG['faux']['t1'] - .08, .45)
for T in (T_MITE + .04,):
    add(fade(S('shatter_1'), .002, .1), T, .6); add(fade(S('impact_3'), .002, .1), T, .55)
add(fade(S('riser_0'), .05, .02), M['rup0'] - 1.7, .2)
add(fade(S('impact_0'), .002, .3), SEG['i']['t0'] - .05, .35)
for r in ('r1', 'r2', 'r3'):
    add(fade(S('whoosh_2'), .003, .05), SEG[r]['t0'] - .2, .3)
for T in (SEG['b']['t0'] - .1, wt('e', 'moquette') - .12, wt('g', 'bonbon') - .12, SEG['i2']['t0'] - .08):
    add(fade(S('whoosh_0'), .003, .08), T - .15, .28)
add(fade(S('impact_1'), .002, .1), wt('a', 'tomber') + .38, .45)          # la pastèque touche le sol
add(fade(S('skitter_1'), .02, .3), wt('a', 'bactéries') - .1, .4)
for k in range(5): add(fade(S('pops_0'), .003, .06)[:int(.25*SR)], wt('a', 'sautent') + k*.17, .28)   # les bactéries sautent
for w in ('pain', 'beurré', 'bonbons', 'pastèque', 'inox', 'carrelage', 'bois', 'moquette'):
    add(fade(S('pops_2'), .003, .06), wt('b', w) - .05, .25)
add(fade(S('impact_2'), .002, .1), wt('b', 'moquette') + .7, .3)          # les aliments tombent
add(fade(S('drops_0'), .01, .2), wt('c', 'humide') - .1, .4)
for T in (wt('a', 'seconde'), wt('c', 'championne'), wt('g', 'poubelle'), wt('i', '362'), wt('i2', 'toutes')):
    add(fade(S('pops_2'), .003, .08), T - .06, .4)
add(fade(S('skitter_0'), .02, .3), wt('i', 'milliards') - .1, .4)
add(fade(S('drops_1'), .01, .2), SEG['i2']['t0'], .25)
add(fade(S('impact_2'), .002, .1), SEG['j']['t0'] - .1, .3)

# ---------- somme (aucun ducking)
L = V + MUS[:, 0] + SFX; R = V + MUS[:, 1] + SFX
st = np.stack([L, R], 1); st /= np.max(np.abs(st))/.89
st[:int(.003*SR)] *= np.linspace(0, 1, int(.003*SR))[:, None]; st[-int(.4*SR):] *= np.linspace(1, 0, int(.4*SR))[:, None]
w = wave.open('p2/mix.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st*32767).astype(np.int16).tobytes()); w.close()
# contrôle des clics : saut d'échantillon anormal
d = np.abs(np.diff(st[:, 0])); print('max step', round(float(d.max()), 3), 'at', round(float(d.argmax()/SR), 2))
print('ok', round(D, 2), 'voice', round(db(speech), 1), 'music', round(db(MUS[int(6*SR):int(50*SR)].mean(1)), 1))
