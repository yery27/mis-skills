# mis-skills

Mis skills de Claude Code, empaquetadas como plugin + marketplace.

## Instalar

En Claude Code:

```
/plugin marketplace add yery27/mis-skills
/plugin install mis-skills@mis-skills
```

El repo es privado: hace falta ser colaborador y tener Git autenticado en GitHub.

## Skills incluidas

Todas son de terceros (licencias MIT / Apache-2.0, copiadas dentro de cada carpeta
junto a un `ORIGEN.md` con la URL y el commit de origen).

| Skill | Para qué sirve | Origen |
|-------|----------------|--------|
| `frontend-design` | Obliga a Claude a elegir una dirección visual concreta (8 "anclas" estéticas) y a mantener paleta, tipografía y texturas bloqueadas en variables CSS, sin inventar un gris nuevo a mitad de proyecto. Además prohíbe datos inventados y textos de relleno. | [Ilm-Alan/frontend-design](https://github.com/Ilm-Alan/frontend-design) |
| `tailwind-theme-builder` | Monta Tailwind v4 + shadcn/ui con tema y modo oscuro: variables CSS con `@theme inline`, theme provider y verificación. Útil también para migrar de v3 a v4 y arreglar colores que no cargan. | [jezweb/claude-skills](https://github.com/jezweb/claude-skills) |
| `design-review` | Auditoría visual de una web o página: layout, tipografía, espaciado, color, jerarquía y responsive. Genera informe con capturas. No es una auditoría de usabilidad. | [jezweb/claude-skills](https://github.com/jezweb/claude-skills) |
| `color-palette` | Genera una paleta completa y accesible a partir de un único color de marca: escala 50-950, tokens semánticos, variantes dark, CSS de Tailwind v4 y comprobación de contraste WCAG. | [jezweb/claude-skills](https://github.com/jezweb/claude-skills) |
| `shadcn-ui` | Guía experta de shadcn/ui: instalar y personalizar componentes, variables CSS del tema, variantes con `cva`, mezcla de clases con `twMerge` y `clsx`. Incluye ejemplos, guías y un script de verificación. | [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills) |
| `make-interfaces-feel-better` | Principios de ingeniería de diseño para pulir interfaces: animaciones de entrada/salida, hovers, sombras, bordes, tipografía, iconos y micro-interacciones. Úsala cuando algo "se siente raro" en la UI. | [jakubkrehel/make-interfaces-feel-better](https://github.com/jakubkrehel/make-interfaces-feel-better) |
| `ponytail` | Modo "senior perezoso": fuerza la solución más simple y corta que funciona (YAGNI, librería estándar antes que dependencias, nada de abstracciones no pedidas). | [dietrichgebert/ponytail](https://github.com/dietrichgebert/ponytail) |
| `ponytail-review` | Revisión de código centrada solo en sobreingeniería: qué borrar o sustituir, una línea por hallazgo. | [dietrichgebert/ponytail](https://github.com/dietrichgebert/ponytail) |
| `ponytail-audit` | Auditoría de todo el repo en busca de sobreingeniería: lista priorizada de qué borrar o simplificar. | [dietrichgebert/ponytail](https://github.com/dietrichgebert/ponytail) |
| `ponytail-debt` | Recoge los comentarios `ponytail:` del código en un registro de deuda, para no dejar atajos olvidados. | [dietrichgebert/ponytail](https://github.com/dietrichgebert/ponytail) |
| `ponytail-gain` | Muestra el impacto medido de ponytail: menos código, menos coste, más velocidad. | [dietrichgebert/ponytail](https://github.com/dietrichgebert/ponytail) |
| `ponytail-help` | Tarjeta de referencia con los modos y comandos de ponytail. | [dietrichgebert/ponytail](https://github.com/dietrichgebert/ponytail) |

Nota: de ponytail solo están las skills, sin los hooks ni comandos del plugin original (no se activa solo al abrir sesión; se dispara por frase o por nombre).

## Para buscar más skills

Listas curadas por la comunidad (no son skills, solo catálogos):

- [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills)
- [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills)

## Actualizar

```
/plugin marketplace update mis-skills
```

## Añadir una skill nueva

1. `cp -r plantilla skills/<nombre>` y editar `skills/<nombre>/SKILL.md`
   (el `name` del frontmatter debe coincidir con el nombre de la carpeta).
2. `git add -A && git commit -m "Añadir skill <nombre>" && git push`
3. Quien la quiera ejecuta el comando de actualizar.

No hay versión en `plugin.json` a propósito: cada commit nuevo cuenta como
actualización, sin tener que subir números de versión a mano.

## Estructura

```
.claude-plugin/   plugin.json y marketplace.json
skills/           una carpeta por skill (lo que se instala)
plantilla/        plantilla para skills nuevas (no se instala)
```

## Skills de terceros

Cada skill copiada lleva su `LICENSE` y un `ORIGEN.md`. Para actualizar una:
volver a descargar su repo de origen y reemplazar la carpeta. Si añades una
de terceros, repite ese patrón y suma una fila a la tabla de arriba.
