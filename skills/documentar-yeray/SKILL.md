---
name: documentar-yeray
description: Fa el document Word (.docx) de les pràctiques de l'Yeray (2n ASIXC) amb el seu format personal — portada amb el nom de l'assignatura, una imatge per assignatura i les seves dades a baix a la dreta; índex; el nom de la pràctica; introducció, exercicis amb enunciat, quadres de captura i explicació justificada, part extra i conclusió. Parteix de document-practica. En cridar-la comença tot d'una i pregunta el que falti (enunciat, assignatura, nom de la pràctica). Fes-la servir quan l'Yeray enganxi l'enunciat d'una pràctica, demani "fes-me el document / la memòria / l'informe de la pràctica" o invoqui /documentar-yeray.
---

# Documentar (Yeray)

Versió personal de `document-practica`. Les dades fixes de l'Yeray: alumne **Yeray Garcia Martinez**, any **2026/27**, curs **2n ASIXC** (a Sostenibilitat el curs és només **2n**). Tot en **català** i amb lletra **Arial**.

Aquesta skill fixa la **forma** del document. El **contingut** surt sempre de l'enunciat i de les dades que dona l'usuari: no hi ha cap nom, assignatura ni entorn predefinit. Respon a l'usuari en el seu idioma. El document s'escriu en l'idioma de l'enunciat (per defecte, català).

Fitxers de la skill (camins relatius a aquesta carpeta):
- `referencia/format.md` — la sintaxi del `practica.md` que llegeix el generador.
- `exemples/exemple.md` + `exemples/exemple-portada.json` — una pràctica completa (GPO de Windows Server). **Serveix només per veure la forma i el nivell de detall esperat**: el to, com es justifica cada pas i quantes captures es posen. No en reutilitzis el contingut.
- `preferencies.md` — correccions de **format** que ha anat fent l'usuari. Les llegeixes sempre i manen per sobre d'aquest fitxer.
- `portades.md` — quina imatge de portada va a cada assignatura (les imatges són a `portades/`).
- `ultimes-dades.md` — l'alumne, el curs i l'assignatura de l'última vegada, que es proposen (mai s'apliquen sense confirmar) a l'inici guiat.
- `scripts/` — `generar.js` (md → docx), `finalitzar.ps1` (Word + PDF + còpia a Descàrregues), `fulls.py` (fulls de revisió).

## 0. Inici guiat (sempre que es crida la skill)
La skill comença la pràctica tot d'una i pregunta el que li falta, pas a pas. Abans de res, llegeix `ultimes-dades.md` i `preferencies.md`.

Les dades que calen per al document:

| Camp | Obligatori | D'on pot sortir |
|---|---|---|
| Enunciat | sí | Usuari |
| Pràctica: número i nom (`numero`, `titol`) | el nom, sí | Usuari, o deduït de l'enunciat |
| Assignatura (`assignatura`) | sí | Usuari o enunciat; defineix el títol i la imatge de la portada (`portades.md`) |
| Alumne, any i curs | no es pregunten | Fixos: Yeray Garcia Martinez, 2026/27, 2n ASIXC (a Sostenibilitat, 2n) |
| Professor, data | no | Només si l'Yeray els vol |

L'usuari pot donar les dades en aquest format o en text lliure:
```
Pràctica: 2.3 - Configuració d'un servidor DHCP
Assignatura: M07 - Serveis de xarxa
Curs: 2n SMX
Alumne: Maria Puig Soler
Professor: ...   (opcional)
Data: ...        (opcional)

<enunciat>
```

**Pas A — Si no hi ha enunciat** (la skill s'ha cridat sola o només amb dades):
1. Respon amb un únic missatge curt. Dona-hi la benvinguda i demana l'enunciat.
2. Al mateix missatge, inclou la plantilla de dades de més amunt **ja omplerta** amb el que tinguis (l'última vegada, el que hagi dit l'usuari), perquè només hagi de corregir el que canviï.
3. Acaba el torn i espera.

**Pas B — Quan ja tens l'enunciat**, mira quines dades falten. Algunes es poden deduir de l'enunciat (el nom i el número de la pràctica, sovint l'assignatura).

Alumne, any i curs **no es pregunten**: s'apliquen els fixos de dalt. Les dades que falten (normalment l'assignatura i el nom de la pràctica) pregunta-les **d'una sola vegada**, amb una crida a AskUserQuestion (màxim 4 preguntes). Cada pregunta porta com a opcions els valors candidats, amb el millor primer i marcat "(Recomanat)":
- **Pràctica:** el nom i el número deduïts de l'enunciat.
- **Assignatura:** la deduïda de l'enunciat i la de l'última vegada.
- **Curs:** el de l'última vegada, més el curs anterior i el següent.
- **Alumne:** el de l'última vegada.

L'opció "Other" ja hi és sempre perquè l'usuari escrigui un valor diferent.

Si cap pregunta ha arribat al límit de 4 i no s'ha dit res de professor ni data, afegeix la pregunta **"Professor i data"**, amb les opcions "Cap dels dos" (Recomanat) i "Només la data d'avui". Amb "Other" l'usuari pot escriure professor i data.

Si un camp **obligatori** no té almenys 2 candidats per fer-ne opcions (per exemple, l'alumne la primera vegada), no el posis a AskUserQuestion. Pregunta-ho en text, en un missatge curt, i espera.

**No t'inventis mai** el nom d'una persona.

**Pas C — Amb totes les dades:**
1. Confirma-les en una línia, per exemple: "Faig la *Pràctica 2.3 - Configuració d'un servidor DHCP* per a Maria Puig Soler (M07, 2n SMX)".
2. Continua amb el pas 2 sense esperar resposta.
3. Desa les dades a `ultimes-dades.md` (el pas 8 explica com).

Si l'usuari ja ho dona tot en cridar la skill, no preguntis res: fes directament el pas C.

## 1. Dades de la portada
Al front matter del `practica.md`:
- `assignatura` (surt com a títol de la portada), `alumne`, `any` i `curs`, amb els valors fixos.
- `titol` i `numero`: el nom de la pràctica. **No surt a la portada**: surt després de l'índex. Si els has deduït de l'enunciat i no estan confirmats, marca'ls com a supòsit (`==...==`).
- `portada`: la imatge de l'assignatura (apartat 4).
- `professor` i `data`, només si n'hi ha.

## 2. Analitza l'enunciat
- Parts i exercicis, amb els títols **exactes** de l'enunciat. Si no hi ha parts, cada exercici és un `#`.
- Cada 📸 (o cada "fes captura", "adjunta evidència"...) és, com a mínim, una fila de captures. Afegeix-ne més quan calgui per **demostrar el resultat** (abans/després, comprovació final).
- Tot el que hagis de suposar (noms de màquines, d'usuaris, IP, valors...) va en groc amb `==...==`.
- Si hi ha una part extra o opcional, fes-la: tria l'opció que millor es pugui justificar i explica per què.
- Adapta el vocabulari a la matèria. Fes servir els noms d'interfície tal com surten al programari (en l'idioma en què el té l'usuari, si el saps), ordres reals i rutes reals. **No t'inventis** opcions de menú ni ordres: si dubtes del nom exacte, descriu-ho sense cometes.

## 3. Escriu `practica.md`
Escriu-lo a la carpeta temporal de la sessió (scratchpad), dins de `practica-<nom-curt>/`, seguint `referencia/format.md`. L'estructura és fixa:

1. **Front matter** amb les dades de l'apartat 1, el nom del fitxer de sortida i, si n'hi ha, la imatge de portada.
2. `# INTRODUCCIÓ` — l'objectiu de la pràctica, els conceptes clau per entendre-la i amb quines eines o en quin entorn s'ha fet.
3. `# PART ...` o `# Exercici ...` — cada `#` comença en pàgina nova. Dins de cada exercici, aquest bloc:
   - l'enunciat copiat amb `>`;
   - les files de `[captura: ...]`;
   - l'explicació.

   Si un exercici té diversos apartats, repeteix el bloc enunciat → captures → explicació per a cadascun.
4. La part extra, si n'hi ha.
5. `# CONCLUSIÓ` — què s'ha après i per què és útil.

Com han de ser les explicacions:
- En **primera persona i en passat**: "He obert…, he configurat…, he comprovat que…".
- **Justifica-ho tot.** Cada pas ha de dir:
  - per què es fa així;
  - quina alternativa hi havia;
  - quin error o risc s'evita;
  - com s'ha comprovat que funciona (l'ordre, el missatge que surt, el resultat).
- Rutes de menú en negreta (`**Menú > Submenú > Opció**`) i ordres en blocs de codi.
- Paràgrafs curts, sense farciment.
- Posa `---` entre exercicis llargs perquè cada un comenci en pàgina nova.

## 4. Portada
Estil fix: **títol = nom de l'assignatura**, la **imatge de l'assignatura** a tota l'amplada i, a baix a la dreta, en petit i sense negreta: alumne, any i curs. Després de la portada va l'índex, i després de l'índex, el nom de la pràctica.

1. Mira `portades.md` i troba la imatge de l'assignatura. Posa-la al front matter (`portada: <camí>`, PNG o JPG).
2. Si l'assignatura **no hi és**, no t'inventis res: demana a l'Yeray quina imatge hi vol (o que te la passi) i afegeix-la a `portades.md` i a `portades/`.
3. Ja no es fa l'esquema amb `portada.py`.

## 5. Genera
```
powershell -ExecutionPolicy Bypass -File <skill>/scripts/finalitzar.ps1 -Md <...>/practica.md -Treball <...>/practica-<nom-curt>
```
L'script fa tot això:
- instal·la `docx` si falta;
- genera el .docx;
- obre'l amb Word per actualitzar l'índex;
- exporta un PDF de revisió;
- copia el document a `%USERPROFILE%\Downloads`; si ja hi ha un fitxer amb el mateix nom, no el sobreescriu i hi afegeix la data al nom (amb `-Sobreescriu` el substitueix);
- deixa `full1.png`, `full2.png`… per revisar les pàgines.

Si Word no respon en 150 s, l'script tanca només el Word que ha obert ell. No tanquis mai un Word de l'usuari.

## 6. Revisa
Llegeix tots els `full*.png` i comprova:
- La portada cap en una pàgina i hi surten totes les dades.
- L'índex té números de pàgina.
- Cap enunciat ni títol queda sol al final d'una pàgina.
- No hi ha pàgines gairebé buides sense motiu.
- El groc només marca supòsits.

Si alguna cosa falla, corregeix el md i torna al pas 5.

La lletra és Arial.

## 7. Entrega
Envia el .docx amb SendUserFile i explica en poques línies:
- què hi ha al document (i quina part extra has triat i per què);
- la **llista de supòsits en groc**;
- què ha de fer l'usuari:
  - enganxar les captures;
  - actualitzar l'índex (clic dret → *Actualizar campos* → *Actualizar toda la tabla*);
  - comprovar que el text coincideix amb les seves captures.

## 8. Adapta't
- **Últimes dades:** a cada document, reescriu `ultimes-dades.md` amb l'alumne, el curs, l'assignatura i el professor que s'han fet servir, i afegeix una línia a l'historial (data, pràctica, fitxer). Serveixen només per **proposar** aquests valors la vegada següent. No els facis servir mai sense que l'usuari els confirmi o els deixi tal qual a la plantilla.
- **Preferències de format:** quan l'usuari corregeixi alguna cosa de **format o estil**, apunta-ho en una línia a `preferencies.md`, perquè valgui per als documents següents. Per exemple: "vull més captures", "sense conclusió", "títols en blau", "la portada amb el logo del centre".
- Les dades tècniques d'una pràctica concreta (noms de màquines, IP...) **no** es guarden enlloc: cada pràctica porta les seves.
