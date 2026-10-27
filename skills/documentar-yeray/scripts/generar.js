// Genera el .docx d'una pràctica a partir d'un fitxer practica.md (format a referencia/format.md).
// Ús: node generar.js <practica.md> <sortida.docx>
// Escriu per stdout una línia "sortida=<nom de fitxer final>" amb el camp `sortida` del front matter.
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell,
  WidthType, BorderStyle, AlignmentType, HeadingLevel, TableOfContents,
  PageBreak, Footer, PageNumber, ShadingType, VerticalAlign, HeightRule, LevelFormat,
} = require("docx");

const [, , MD, OUT] = process.argv;
if (!MD || !OUT) { console.error("Ús: node generar.js <practica.md> <sortida.docx>"); process.exit(1); }

const FONT = "Arial";
const W = 9026; // amplada útil A4 amb marges de 2,54 cm

// ---------- lectura del markdown ----------
let src = fs.readFileSync(MD, "utf8").replace(/^﻿/, "").replace(/\r\n/g, "\n");
const meta = {};
const fm = src.match(/^---\n([\s\S]*?)\n---\n/);
if (fm) {
  for (const l of fm[1].split("\n")) {
    const m = l.match(/^(\w+):\s*(.*)$/);
    if (m) meta[m[1]] = m[2].replace(/\s+#\s.*$/, "").trim(); // admet comentaris "# ..." al final
  }
  src = src.slice(fm[0].length);
}
for (const k of ["titol", "alumne", "assignatura"]) if (!meta[k]) { console.error(`Falta '${k}' al front matter`); process.exit(1); }
const net = (s) => (s || "").replace(/==/g, "");
const titolComplet = meta.numero ? `Pràctica ${meta.numero} - ${meta.titol}` : meta.titol;

// ---------- helpers de format ----------
// **negreta**, ==ressaltat groc (supòsit)==, `codi`
function runs(text, base = {}) {
  return text.split(/(\*\*.+?\*\*|==.+?==|`.+?`)/g).filter(Boolean).map((t) => {
    if (t.startsWith("**") && t.length > 4) return new TextRun({ ...base, text: t.slice(2, -2), bold: true });
    if (t.startsWith("==") && t.length > 4) return new TextRun({ ...base, text: t.slice(2, -2), highlight: "yellow" });
    if (t.startsWith("`") && t.length > 2) return new TextRun({ ...base, text: t.slice(1, -1), font: "Consolas", size: 19 });
    return new TextRun({ ...base, text: t });
  });
}
const P = (text) => new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 160, line: 300 }, children: runs(text) });
const ENUNCIAT = (text) => new Paragraph({ keepNext: true, keepLines: true, alignment: AlignmentType.JUSTIFIED, spacing: { before: 200, after: 200, line: 300 }, children: runs(text, { bold: true }) });
const H1 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_1, keepNext: true, children: runs(text) });
const H2 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, children: runs(text) });
const SALT = () => new Paragraph({ children: [new PageBreak()] });
const BULLET = (text) => new Paragraph({ numbering: { reference: "vinyetes", level: 0 }, alignment: AlignmentType.JUSTIFIED, spacing: { after: 80, line: 300 }, children: runs(text) });
const CODI = (linies) => linies.map((l, i) => new Paragraph({
  shading: { type: ShadingType.CLEAR, color: "auto", fill: "F2F2F2" },
  spacing: { before: i === 0 ? 60 : 0, after: i === linies.length - 1 ? 200 : 0 },
  indent: { left: 200, right: 200 },
  children: runs(l || " ", { font: "Consolas", size: 19 }),
}));

// Quadre "PER FER": comandes i passos per copiar i enganxar. És una taula d'una cel·la blava, perquè
// es vegi diferent de la resta i es pugui esborrar sencer abans d'entregar.
const FER_BLAU = "1F4E9C";
const FER = (linies) => {
  const v = { style: BorderStyle.SINGLE, size: 12, color: FER_BLAU };
  return [
    new Table({
      width: { size: W, type: WidthType.DXA }, columnWidths: [W],
      rows: [new TableRow({ cantSplit: true, children: [new TableCell({
        width: { size: W, type: WidthType.DXA },
        borders: { top: v, bottom: v, left: v, right: v },
        shading: { type: ShadingType.CLEAR, color: "auto", fill: "DDEBF7" },
        margins: { top: 100, bottom: 100, left: 160, right: 160 },
        children: [
          new Paragraph({ keepNext: true, spacing: { after: 80 }, children: [new TextRun({ text: "PER FER (copia-ho i esborra aquest quadre)", bold: true, size: 16, color: FER_BLAU })] }),
          ...linies.map((l) => new Paragraph({ spacing: { after: 20 }, children: runs(l || " ", { font: "Consolas", size: 19 }) })),
        ],
      })] })],
    }),
    new Paragraph({ spacing: { after: 120 }, children: [] }),
  ];
};

const vora = { style: BorderStyle.SINGLE, size: 6, color: "7F7F7F" };
const vores = { top: vora, bottom: vora, left: vora, right: vora };
// Una fila de quadres de captura (1 o més columnes) amb vora, com a les pràctiques entregades.
function CAPTURES(fila) {
  const n = fila.length;
  const cw = Math.floor(W / n);
  const widths = Array(n).fill(cw);
  widths[n - 1] = W - cw * (n - 1);
  return [
    new Table({
      width: { size: W, type: WidthType.DXA },
      columnWidths: widths,
      rows: [new TableRow({
        cantSplit: true,
        height: { value: n === 1 ? 3600 : 3000, rule: HeightRule.ATLEAST },
        children: fila.map((txt, i) => new TableCell({
          borders: vores,
          width: { size: widths[i], type: WidthType.DXA },
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 100, bottom: 100, left: 140, right: 140 },
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: `[ Captura: ${txt} ]`, color: "8C8C8C", italics: true, size: 18 })],
          })],
        })),
      })],
    }),
    new Paragraph({ keepNext: true, spacing: { after: 120 }, children: [] }),
  ];
}

// ---------- cos: parseig línia a línia ----------
const cos = [];
let para = [];
let primerH1 = true;
const buidaPara = () => { if (para.length) { cos.push(P(para.join(" "))); para = []; } };
const linies = src.split("\n");
for (let i = 0; i < linies.length; i++) {
  const raw = linies[i];
  const l = raw.trim();
  if (l.startsWith("```")) {
    buidaPara();
    const fer = /^```fer/i.test(l);
    const bloc = [];
    for (i++; i < linies.length && !linies[i].trim().startsWith("```"); i++) bloc.push(linies[i].replace(/\s+$/, ""));
    cos.push(...(fer ? FER(bloc) : CODI(bloc)));
    continue;
  }
  if (!l) { buidaPara(); continue; }
  if (l.startsWith("<!--")) { // comentaris: s'ignoren
    while (i < linies.length && !linies[i].includes("-->")) i++;
    continue;
  }
  if (l === "---") { buidaPara(); const s = SALT(); s.__salt = true; cos.push(s); continue; }
  if (l.startsWith("# ")) {
    buidaPara();
    if (!primerH1 && !(cos.length && cos[cos.length - 1].__salt)) { const s = SALT(); s.__salt = true; cos.push(s); }
    primerH1 = false;
    cos.push(H1(l.slice(2)));
    continue;
  }
  if (l.startsWith("## ")) { buidaPara(); cos.push(H2(l.slice(3))); continue; }
  if (l.startsWith(">")) {
    buidaPara();
    const txt = [l.replace(/^>\s?/, "")];
    while (i + 1 < linies.length && linies[i + 1].trim().startsWith(">")) txt.push(linies[++i].trim().replace(/^>\s?/, ""));
    cos.push(ENUNCIAT(txt.join(" ")));
    continue;
  }
  const cap = l.match(/^\[captura:\s*(.+)\]$/i);
  if (cap) { buidaPara(); cos.push(...CAPTURES(cap[1].split("|").map((s) => s.trim()).filter(Boolean))); continue; }
  if (/^[-*] /.test(l)) { buidaPara(); cos.push(BULLET(l.slice(2))); continue; }
  para.push(l);
}
buidaPara();

// ---------- portada ----------
// Estil de l'Yeray: títol = assignatura, imatge de l'assignatura a tota l'amplada i dades a baix a la dreta.
function midaImatge(buf) {
  if (buf.readUInt32BE(0) === 0x89504e47) return { tipus: "png", w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  let p = 2; // JPEG: busca el marcador SOFn
  while (p < buf.length) {
    const m = buf[p + 1], len = buf.readUInt16BE(p + 2);
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { tipus: "jpg", h: buf.readUInt16BE(p + 5), w: buf.readUInt16BE(p + 7) };
    p += 2 + len;
  }
  throw new Error("Imatge de portada no vàlida (cal PNG o JPG)");
}
const portada = [new Paragraph({ spacing: { before: 600 }, children: [] })];
portada.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 480, line: 276 },
  children: runs(meta.assignatura, { bold: true, size: 56 }),
}));
if (meta.portada) {
  const img = path.resolve(path.dirname(MD), meta.portada);
  if (fs.existsSync(img)) {
    const buf = fs.readFileSync(img);
    const { tipus, w, h } = midaImatge(buf);
    let ww = 560, hh = Math.round(560 * h / w);
    if (hh > 400) { hh = 400; ww = Math.round(400 * w / h); }
    portada.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new ImageRun({ type: tipus, data: buf, transformation: { width: ww, height: hh },
        altText: { title: "Portada", description: `Imatge de portada de ${net(meta.assignatura)}`, name: "portada" } })],
    }));
  } else console.error(`AVÍS: no trobo la imatge de portada ${img}`);
}
// Dades a baix a la dreta, en petit i sense negreta: alumne, any i curs (i professor/data si hi són).
const peuPortada = [meta.alumne, meta.any, meta.curs, meta.professor, meta.data].filter(Boolean);
peuPortada.forEach((t, i) => portada.push(new Paragraph({
  alignment: AlignmentType.RIGHT,
  spacing: i === 0 ? { before: 900 } : {},
  children: runs(t, { size: 20 }),
})));
portada.push(SALT());

const index = [
  new Paragraph({ spacing: { after: 240 }, children: [new TextRun({ text: "ÍNDEX", bold: true })] }),
  new TableOfContents("Índex", { hyperlink: true, headingStyleRange: "1-2" }),
  SALT(),
  // Després de l'índex ve el nom de la pràctica.
  new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { after: 360 }, children: runs(titolComplet, { bold: true, size: 36 }) }),
];

const doc = new Document({
  creator: net(meta.alumne),
  title: net(titolComplet),
  styles: {
    default: { document: { run: { font: FONT, size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: FONT, size: 26, bold: true, color: "000000" },
        paragraph: { spacing: { before: 120, after: 360 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: FONT, size: 22, bold: true, color: "000000" },
        paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 1 } },
      { id: "TOC1", name: "toc 1", basedOn: "Normal", next: "Normal",
        run: { font: FONT, size: 22, bold: true }, paragraph: { spacing: { before: 160, after: 60 } } },
      { id: "TOC2", name: "toc 2", basedOn: "Normal", next: "Normal",
        run: { font: FONT, size: 22 }, paragraph: { spacing: { after: 60 } } },
    ],
  },
  numbering: {
    config: [{ reference: "vinyetes", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 540, hanging: 300 } } } }] }],
  },
  sections: [{
    properties: {
      titlePage: true,
      page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } },
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "7F7F7F" })] })] }),
      first: new Footer({ children: [] }),
    },
    children: [...portada, ...index, ...cos],
  }],
});

const senseAccents = (s) => net(s).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "");
const nomFinal = meta.sortida || `${senseAccents(meta.titol)}_${senseAccents(meta.alumne)}.docx`;
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(OUT, buf);
  console.log(`sortida=${nomFinal}`);
});
