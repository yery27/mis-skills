# Format de `practica.md`

`scripts/generar.js` llegeix aquest format. Cada línia es converteix en un element del document:

| Al markdown | Al document |
|---|---|
| Front matter `--- ... ---` al principi | Dades de portada i nom del fitxer |
| `# TÍTOL` | Títol 1, que surt a l'índex. Comença en pàgina nova (excepte el primer) |
| `## Exercici N. Títol` | Títol 2, que surt a l'índex |
| `> text` | Enunciat en negreta. No queda mai separat del que el segueix |
| `[captura: A]` | Un quadre de captura a amplada completa |
| `[captura: A \| B]` | Fila de dos quadres (màxim recomanat: 2) |
| `- text` | Vinyeta |
| ```` ``` ```` … ```` ``` ```` | Bloc d'ordres (Consolas, fons gris). Cada línia del bloc és una línia del document |
| `---` (fora del front matter) | Salt de pàgina |
| Línies de text seguides | Un paràgraf justificat. Una línia en blanc separa dos paràgrafs |
| `<!-- ... -->` | Comentari que no surt al document |

Dins de qualsevol text (també als enunciats, a les vinyetes i a les ordres):
- `**negreta**`
- `==ressaltat groc==` → **només per a supòsits** que l'usuari ha de revisar
- `` `codi` `` → una ordre curta dins d'un paràgraf

## Front matter

```
---
titol: Directives de grup (GPO)           # obligatori
alumne: Nom Cognom Cognom                 # obligatori
assignatura: M03 - Implantació de SO      # recomanat
curs: 2n ASIX                             # recomanat
numero: ==1.5==                           # opcional; amb número, el títol surt com a "Pràctica 1.5 - <titol>"
professor: ...                            # opcional
data: ...                                 # opcional
portada: portada.png                      # opcional, relatiu al .md
sortida: Directives_GPO_Nom_Cognom.docx   # opcional; per defecte, <titol>_<alumne>.docx sense accents
---
```

Els comentaris `# ...` al final d'una línia del front matter no es tenen en compte.

La portada es compon així:
- el títol, centrat i molt gran;
- la imatge, al mig;
- a baix a l'esquerra, en negreta i en aquest ordre: assignatura, curs, alumne, professor i data (només els que hi hagi).

## Regles de maquetació que ja aplica el generador
- A4, marges de 2,54 cm, lletra Lexend d'11 pt, text justificat.
- Portada sense número de pàgina. A la resta, el número surt a baix a la dreta.
- Pàgina "ÍNDEX" amb taula de continguts automàtica (nivells 1-2).
- Els enunciats i els títols no se separen de la fila de captures següent. Una fila de captures no es parteix mai entre dues pàgines.

## Detalls
- Les barres invertides s'escriuen tal qual (`C:\Carpeta`, `DOMINI\usuari`).
- Dins d'una línia `[captura: ...]`, el caràcter `|` separa columnes. No el facis servir dins del text de la captura.
- Vinyeta amb títol: `- **Títol:** text`.
