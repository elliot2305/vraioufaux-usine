import sys,glob,os
from PIL import Image,ImageDraw,ImageFont
d=sys.argv[1];out=sys.argv[2];cols=int(sys.argv[3]) if len(sys.argv)>3 else 6
fs=sorted(glob.glob(d+'/*.jpg'));W,H=360,640
sheet=Image.new('RGB',(cols*W,((len(fs)+cols-1)//cols)*(H+30)),'white')
for i,f in enumerate(fs):
    im=Image.open(f).resize((W,H));dr=ImageDraw.Draw(im)
    s=W/1080
    dr.line([(0,200*s),(W,200*s)],fill=(255,0,255),width=1);dr.line([(0,1590*s),(W,1590*s)],fill=(255,0,255),width=1)
    dr.line([(W-140*s,0),(W-140*s,H)],fill=(255,0,255),width=1);dr.line([(140*s,0),(140*s,H)],fill=(0,255,255),width=1);dr.line([(W/2,0),(W/2,H)],fill=(0,255,0),width=1)
    x,y=(i%cols)*W,(i//cols)*(H+30);sheet.paste(im,(x,y))
    ImageDraw.Draw(sheet).text((x+6,y+H+6),os.path.basename(f),fill='black')
sheet.save(out,quality=85)
