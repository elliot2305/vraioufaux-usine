# Contrôle automatique de chaque image + planches de contrôle visuel
import glob, json, sys, numpy as np
FR, TLF, QC = sys.argv[1], sys.argv[2], sys.argv[3]   # dossier images, timeline, préfixe des planches
from PIL import Image, ImageDraw
fs = sorted(glob.glob(FR+'/*.jpg'))
TL = json.load(open(TLF)); N = int(np.ceil(TL['duration']*30))
assert len(fs) == N, f'{len(fs)} images au lieu de {N}'
small = []; issues = []
for i, f in enumerate(fs):
    im = Image.open(f)
    if im.size != (1080, 1920): issues.append((i, 'taille', im.size))
    a = np.asarray(im.convert('L').resize((108, 192)), dtype=np.float32)
    small.append(a)
    if a.mean() < 8: issues.append((i, 'image noire', round(float(a.mean()), 1)))
    if a.std() < 3: issues.append((i, 'image uniforme', round(float(a.std()), 1)))
S = np.stack(small); d = np.abs(np.diff(S, axis=0)).mean(axis=(1, 2))
for i in range(1, len(S)-1):
    pn = np.abs(S[i+1]-S[i-1]).mean()
    if d[i-1] > 12 and d[i] > 12 and pn < .5*min(d[i-1], d[i]): issues.append((i, 'flash 1 image', round(float(d[i-1]), 1)))
big = [(round(i/30, 2), round(float(x), 1)) for i, x in enumerate(d) if x > 25]
print('images :', len(fs), '| sauts > 25 (coupes attendues aux changements de monde) :', big)
print('problèmes :', issues if issues else 'aucun')
# planches : 1 image toutes les 0,5 s, 24 par planche, avec repères de zones sûres
picks = list(range(0, N, 15))
for p in range(0, len(picks), 24):
    W, H = 270, 480; sheet = Image.new('RGB', (8*W, 3*(H+22)), 'white')
    for k, i in enumerate(picks[p:p+24]):
        im = Image.open(fs[i]).resize((W, H)); dr = ImageDraw.Draw(im); s = W/1080
        for y in (200, 1590): dr.line([(0, y*s), (W, y*s)], fill=(255, 0, 255))
        dr.line([(W-140*s, 0), (W-140*s, H)], fill=(255, 0, 255))
        x, y = (k % 8)*W, (k//8)*(H+22); sheet.paste(im, (x, y)); ImageDraw.Draw(sheet).text((x+4, y+H+5), f'{i/30:.1f}s', fill='black')
    sheet.save(f'{QC}_{p//24+1}.jpg', quality=82)
print('planches :', (len(picks)+23)//24)
