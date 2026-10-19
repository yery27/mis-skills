"""Fa fulls de revisió (6 pàgines per imatge) d'un PDF per comprovar la maquetació.

Ús: python -P fulls.py document.pdf carpeta_sortida
Escriu full1.png, full2.png... i imprimeix el nombre de pàgines.
"""
import sys

import pymupdf as fitz

d = fitz.open(sys.argv[1])
out = sys.argv[2]
n, per, pw, ph = d.page_count, 6, 298, 421
for s in range(0, n, per):
    full = fitz.open()
    pg = full.new_page(width=pw * 3, height=ph * 2)
    for k, i in enumerate(range(s, min(s + per, n))):
        r = fitz.Rect((k % 3) * pw, (k // 3) * ph, (k % 3 + 1) * pw, (k // 3 + 1) * ph)
        pg.show_pdf_page(r, d, i)
        pg.draw_rect(r, color=(0.6, 0.6, 0.6), width=0.5)
    pg.get_pixmap(dpi=110).save(f"{out}/full{s // per + 1}.png")
print("pagines", n)
