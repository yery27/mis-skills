"""Dibuixa l'esquema de portada a partir d'un JSON i el desa com a PNG (300 ppp).

Ús: python -P portada.py portada.json portada.png

Format del JSON (coordenades en punts; el llenç per defecte fa 520 x 400):
{
  "amplada": 520, "alcada": 400,
  "nodes": [
    {"id": "dom", "x": 170, "y": 20, "w": 180, "titol": "empresa.local",
     "sub": "Domini (SRV01)", "etiqueta": "Default Domain Policy"},
    {"id": "of", "x": 320, "y": 160, "titol": "UO Oficines", "sub": "ofi1, ofi2...",
     "etiqueta": "GPO Oficines"}
  ],
  "connexions": [["dom", "of"]]
}
- "w" (170) i "h" (52) són opcionals. "sub" i "etiqueta" també.
- "etiqueta" és la pastilla groga que surt a sota del node (GPO, servei, rol...).
- Les connexions van del peu del primer node (o de la seva etiqueta) al cap del segon.
  Si els dos nodes estan a la mateixa alçada, la línia va de costat a costat.
"""
import json
import sys

import pymupdf as fitz

spec = json.load(open(sys.argv[1], encoding="utf-8"))
W, H = spec.get("amplada", 520), spec.get("alcada", 400)
doc = fitz.open()
pg = doc.new_page(width=W, height=H)

BLAU = (0.16, 0.42, 0.75)
BLAU_CLAR = (0.88, 0.94, 1.0)
GRIS = (0.62, 0.62, 0.62)
TEXT = (0.13, 0.13, 0.13)
GROC = (0.98, 0.93, 0.80)
GROC_VORA = (0.80, 0.55, 0.10)
GROC_TEXT = (0.45, 0.30, 0.02)


def centrat(cx, base, text, font, size, color):
    tw = fitz.get_text_length(text, fontname=font, fontsize=size)
    pg.insert_text((cx - tw / 2, base), text, fontname=font, fontsize=size, color=color)


caixes = {}
for n in spec["nodes"]:
    x, y = n["x"], n["y"]
    w, h = n.get("w", 170), n.get("h", 52)
    pg.draw_rect(fitz.Rect(x, y, x + w, y + h), color=BLAU, fill=BLAU_CLAR, width=1.6, radius=0.18)
    cx = x + w / 2
    if n.get("sub"):
        centrat(cx, y + 23, n["titol"], "hebo", 12.5, TEXT)
        centrat(cx, y + 40, n["sub"], "helv", 9, (0.35, 0.35, 0.35))
    else:
        centrat(cx, y + h / 2 + 4.5, n["titol"], "hebo", 12.5, TEXT)
    peu = y + h
    if n.get("etiqueta"):
        tw = fitz.get_text_length(n["etiqueta"], fontname="hebo", fontsize=9.5) + 24
        ty = y + h + 8
        pg.draw_rect(fitz.Rect(cx - tw / 2, ty, cx + tw / 2, ty + 24), color=GROC_VORA, fill=GROC, width=1.2, radius=0.35)
        centrat(cx, ty + 16, n["etiqueta"], "hebo", 9.5, GROC_TEXT)
        peu = ty + 24
    caixes[n["id"]] = {"x": x, "y": y, "w": w, "h": h, "cx": cx, "peu": peu}

for a, b in spec.get("connexions", []):
    A, B = caixes[a], caixes[b]
    if abs(A["y"] - B["y"]) < A["h"]:  # mateixa fila: de costat a costat
        if A["x"] < B["x"]:
            p1, p2 = (A["x"] + A["w"], A["y"] + A["h"] / 2), (B["x"], B["y"] + B["h"] / 2)
        else:
            p1, p2 = (A["x"], A["y"] + A["h"] / 2), (B["x"] + B["w"], B["y"] + B["h"] / 2)
    else:
        p1, p2 = (A["cx"], A["peu"] + 2), (B["cx"], B["y"] - 2)
    pg.draw_line(p1, p2, color=GRIS, width=3, dashes="[7 5] 0")

pg.get_pixmap(dpi=300).save(sys.argv[2])
print("portada", sys.argv[2])
