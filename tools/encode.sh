#!/bin/bash
# usage: tools/encode.sh framesNN pNN/mix.wav videos/NN_slug.mp4
set -e
J=$(ffmpeg -hide_banner -i "$2" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
II=$(echo "$J"|python3 -c "import json,sys;d=json.load(sys.stdin);print(f\"measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}\")")
ffmpeg -v error -y -framerate 30 -i "$1/%05d.jpg" -i "$2" -af "loudnorm=I=-14:TP=-1.5:LRA=11:$II:linear=true,alimiter=limit=0.84:level=false" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -movflags +faststart -shortest "$3"
ffmpeg -hide_banner -i "$3" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):"
