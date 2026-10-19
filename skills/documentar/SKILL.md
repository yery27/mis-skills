---
name: "documentar"
description: "Documenta una pràctica del cicle a partir del .docx de l'alumne: neteja enunciats, documenta captura per captura en català, afegeix portada i índex enllaçat, i lliura .docx i PDF."
---

# /documentar: documentació de pràctiques del cicle (Ferran Fabra)

Ferran fa servir aquesta skill per documentar les pràctiques del grau superior (ASIX, ciberseguretat). Normalment adjunta fins a tres fitxers:

1. **El .docx editable de la pràctica.** És l'únic document que s'edita.
2. **L'enunciat o la teoria de la pràctica** (.txt, .pdf o .docx). Serveix per entendre què es demana i treure idees. No es copia.
3. **Un PDF seu qualsevol**, que serveix de referència d'estil: clar i concís, i només s'estén quan cal explicar alguna cosa.

Si falta algun fitxer o hi ha algun dubte real (per exemple, no queda clar quin fitxer és cada cosa o falta el .docx), pregunta-ho abans de començar. Si no, comença directament.

## 1. Llegir abans d'editar

- Carrega les skills `docx` i `humanizer`. Tot el text nou ha de passar pel filtre del humanizer: sense guions llargs (—), sense vocabulari típic d'IA, sense grups de tres forçats i amb frases simples.
- Llegeix l'enunciat sencer i unes quantes pàgines del PDF d'estil. L'estil de Ferran és la primera persona del plural i frases curtes abans de cada captura ("Configurem una IP estàtica a cada màquina:", "Instal·lem Apache...").
- Descomprimeix el .docx en una còpia de treball. No editis mai l'original pujat. Llista els elements de primer nivell de `word/document.xml` (paràgrafs, taules, imatges amb el seu `r:embed`) amb el seu índex, el text i l'estil.
- **Mira totes les captures** (`word/media/*.png`) en l'ordre en què surten al document, perquè el text ha de descriure el que es veu de debò: xifres, URL, resultats, errors. Revisa també les captures o dades que Ferran hagi passat abans al xat. Respecta les respostes que ja hagi escrit al .docx, però verifica-les amb les captures.

## 2. Netejar el .docx

- **Esborra** tots els enunciats que expliquen com es fa la pràctica: passos, notes, advertències, antecedents, recursos, paràgrafs introductoris i línies de guions buides (`____`).
- **Conserva** els títols (el títol principal, Parts, Passos, Objectius), les taules i les preguntes. Si una pregunta ve enganxada a una instrucció ("Escriu cisco i prem Enter. Quants resultats...?"), deixa només la pregunta. Si un apartat no té cap pregunta explícita però té captura, deixa una etiqueta curta (per exemple `11. "default password"` o `a. Minecraft`).
- **No toquis les captures.** No les retallis ni les reemplacis. Només es pot moure una captura de lloc si queda just després del seu text.
- Respecta els estils, les taules i la mida de les imatges del .docx. Edita el XML sense reformatar-lo. Els paràgrafs nous copien el format dels paràgrafs normals del document.

## 3. Documentar i respondre

- **Captura per captura i en ordre:** abans de cada captura posa un text breu, normalment una o dues frases, amb el que hem fet i el resultat que es veu (xifres concretes). Només t'estens quan alguna cosa necessita explicació.
- **Respon totes les preguntes.** Les respostes curtes poden anar a la mateixa línia que la pregunta.
- **Preguntes de teoria sense captura:** es responen només amb una justificació en text. Si cal, busca la informació a Internet i verifica-la.
- Omple les cel·les buides de les taules i corregeix les dades que no coincideixin amb les captures (per exemple, ISP i organització).
- **Format del text:** les preguntes i els títols queden en negre. Les respostes i el text de documentació van en **blau `4a86e8`**, que és el color que Ferran fa servir per a les respostes. Els títols de secció (Part, Pas, Objectius, el títol del laboratori) van en negreta.
- Tot en **català**, clar i concís, amb el humanizer aplicat.
- Ètica: mai documentis ni suggereixis entrar a dispositius o sistemes de tercers.

## 4. Portada

- Primera pàgina, amb l'estil de les pràctiques de Ferran: el títol de la pràctica a dalt (el Heading del document), el **logo de l'eina o del tema de la pràctica** centrat al mig de la pàgina i **"Ferran Fabra"** a baix a l'esquerra en petit (10 pt).
- El logo: primer prova de descarregar-lo. Si la xarxa no ho permet, retalla'l d'una de les captures (amb Pillow: crop, escalat LANCZOS i un UnsharpMask suau) i avisa'n. Si no hi ha cap logo possible, demana'l a Ferran. No dibuixis mai el logo amb codi.
- Afegeix el logo com a `media/imageN.png` amb la seva Relationship (`rId100` o un altre id lliure) i un `docPr id` únic.
- Fes servir `pageBreakBefore` al paràgraf següent en lloc de salts de pàgina buits, per no crear pàgines en blanc.

## 5. Índex interactiu

- A la segona pàgina, un títol **"Índex"** en negreta, a 16 pt.
- Les entrades són els títols (Objectius, Parts) en negreta, els Passos amb sagnat i cada pregunta o apartat amb doble sagnat i una etiqueta curta ("8. Entrada interessant", "b. Dispositius Moxa amb Telnet al Brasil"). Cada entrada ha de cabre en una línia.
- Cada entrada és un `w:hyperlink w:anchor` cap a un **bookmark** (`_TocNomPractica#`) posat al paràgraf de destinació. Al final hi ha una tabulació dreta (pos ≈ amplada del text) i un camp `PAGEREF <bookmark> \h` amb el número de pàgina en memòria cau.
- Afegeix un `w:outlineLvl` (0, 1 o 2) als paràgrafs de destinació, just abans del `<w:rPr>` del `pPr`. Així surten al panell de navegació del Word i als marcadors del PDF, sense canviar l'estil.
- **Números de pàgina reals:** fes una primera passada, converteix a PDF, busca amb `pdftotext` per pàgina on surt cada títol (comptant que la portada és la pàgina 1 i saltant l'índex) i torna a generar el document amb aquests números.
- El contingut comença a la pàgina 3 amb `pageBreakBefore`.

## 6. Maquetació i verificació

- Posa `keepNext` a les preguntes, als títols, al text que va just abans d'una captura i als paràgrafs de les taules, perquè no quedin preguntes soles a final de pàgina ni taules partides.
- Torna a empaquetar, passa `validate.py --original`, converteix a PDF amb `soffice.py` i **mira les pàgines renderitzades** (un full de contactes amb `pdftoppm` i PIL). Revisa que no hi hagi pàgines en blanc, títols orfes ni entrades de l'índex en dues línies.
- Comprova amb `pypdf` que la pàgina d'índex del PDF té els enllaços interns.

## 7. Lliurament

- Desa el .docx i el PDF a `/mnt/user-data/outputs/` amb el nom `<PTx>._<Tema>_Fabra_Ferran.docx/.pdf` (o el nom que tingui el .docx original amb `_Fabra_Ferran`) i envia'ls tots dos amb SendUserFile.
- Al missatge final, en català i curt:
  - Una línia sobre què s'ha fet.
  - **Preguntes de teoria** contestades només amb text, en format `[Q…]`.
  - **Coses a revisar:** captures que no coincideixen amb el que demana l'enunciat o la pregunta, cerques amb 0 resultats o resultats estranys, dades corregides, captures que falten o errors de l'enunciat (per exemple, lletres repetides). Si s'hi pot fer alguna cosa, proposa una solució concreta.
  - Si el logo s'ha retallat d'una captura, digues-ho i ofereix canviar-lo per un PNG millor.