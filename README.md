# 🧰 mis-skills

Mi colección de skills para [Claude Code](https://claude.com/claude-code), empaquetada como **plugin + marketplace**.
Se instala con dos comandos y trae **32 skills** de diseño frontend, calidad de código, testing, ciberseguridad defensiva, escritura, automatización y más.

> Repo público: cualquiera puede añadirlo como marketplace. Las skills son de terceros con sus licencias (ver [Créditos y licencias](#-créditos-y-licencias)).

---

## 🚀 Instalación (2 minutos)

**Requisitos:** Claude Code y Git instalados, con tu cuenta de GitHub ya logueada en Git.

**1. Añade el marketplace** (solo una vez). Dentro de Claude Code:

```
/plugin marketplace add yery27/mis-skills
```

**2. Instala el plugin:**

```
/plugin install mis-skills@mis-skills
```

**3. Recarga y comprueba:**

```
/reload-plugins
```

Abre `/plugin` → pestaña **Installed** y debe aparecer `mis-skills`. Las skills quedan disponibles con el prefijo `mis-skills:` (por ejemplo `mis-skills:humanizer`).

> ⚠️ Si ya tienes ponytail u otra de estas skills instalada por otro lado, desinstálala antes (`/plugin` → Installed), o saldrán duplicadas.

### Cómo se usan

No hay que llamarlas a mano: Claude las activa solo cuando lo que pides encaja con su descripción.
Ejemplos: *"revisa el diseño de esta página"*, *"depura este fallo"*, *"humaniza este texto"*.
También puedes invocarlas por nombre: `/mis-skills:design-review`.

### Actualizar

Cuando se añadan skills nuevas o cambien las existentes:

```
/plugin marketplace update mis-skills
```

---

## 📚 Catálogo

### 🎨 Diseño frontend

| Skill | Para qué sirve |
|-------|----------------|
| `frontend-design` | Fija una dirección visual concreta (8 "anclas" estéticas) con paleta, tipografía y texturas bloqueadas en variables CSS. Prohíbe datos inventados y textos de relleno. |
| `design-taste-frontend` | La skill `taste-skill`: frontend "anti-slop" para landing pages, portfolios y rediseños. Lee el briefing, elige una dirección de diseño y evita interfaces con aspecto de plantilla. No es para dashboards ni tablas de datos. |
| `make-interfaces-feel-better` | Pule la interfaz: animaciones de entrada/salida, hovers, sombras, bordes, tipografía, iconos y micro-interacciones. Úsala cuando algo "se siente raro". |
| `tailwind-theme-builder` | Monta Tailwind v4 + shadcn/ui con tema y modo oscuro (`@theme inline`). Sirve también para migrar de v3 a v4 y arreglar colores que no cargan. |
| `shadcn-ui` | Guía de shadcn/ui: instalar y personalizar componentes, variables del tema, variantes con `cva`, `twMerge` y `clsx`. Incluye ejemplos y script de verificación. |
| `color-palette` | Paleta accesible completa a partir de un solo color de marca: escala 50-950, tokens semánticos, modo oscuro, CSS de Tailwind v4 y contraste WCAG. |
| `theme-factory` | 10 temas prediseñados (colores y fuentes) para aplicar a presentaciones, documentos o páginas, o para generar uno a medida. |
| `design-review` | Auditoría visual de una página: layout, tipografía, espaciado, color, jerarquía y responsive. Genera informe con capturas. |

### 🐛 Calidad de código y desarrollo

| Skill | Para qué sirve |
|-------|----------------|
| `systematic-debugging` | Depuración con método: encontrar la causa raíz antes de proponer arreglos, en vez de probar parches al azar. |
| `test-driven-development` | Flujo test primero: escribir el test que falla, implementar lo mínimo, refactorizar. |
| `verification-before-completion` | Antes de decir "listo" o "arreglado", obliga a ejecutar las comprobaciones y confirmar la salida. |
| `ponytail` | Modo "senior perezoso": la solución más simple y corta que funciona. **Se activa solo** al iniciar cada sesión (ver [nota](#-ponytail-se-activa-solo)). |
| `ponytail-review` | Revisión de código solo para sobreingeniería: qué borrar o sustituir, una línea por hallazgo. |
| `ponytail-audit` | Auditoría de todo el repo en busca de sobreingeniería, con lista priorizada. |
| `ponytail-debt` | Recoge los comentarios `ponytail:` en un registro de deuda técnica. |
| `ponytail-gain` | Muestra el impacto medido de ponytail (menos código, menos coste). |
| `ponytail-help` | Tarjeta de referencia de ponytail. |

### 🧪 Testing y herramientas

| Skill | Para qué sirve | Necesita |
|-------|----------------|----------|
| `webapp-testing` | Prueba apps web locales con Playwright: verificar la UI, depurar, sacar capturas y leer logs del navegador. | Python + `pip install playwright` |
| `mcp-builder` | Guía para crear servidores MCP de calidad (Python o Node/TypeScript), con evaluaciones. | Python o Node |
| `e2e-testing-patterns` | Guía para montar suites de tests end-to-end fiables y rápidas con Playwright o Cypress: page objects, fixtures, tests flaky, CI/CD, multi-navegador y accesibilidad. | Playwright o Cypress en tu proyecto |
| `find-skills` | Ayuda a descubrir e instalar skills del ecosistema abierto (`npx skills find` / `add`) cuando preguntas "¿hay una skill para X?". | Node (`npx`) |

### 🛡️ Ciberseguridad (defensiva)

Skills de análisis, detección, respuesta y cumplimiento. Los scripts son Python 3 y usan la librería estándar; `requests`, `dnspython` y `pyyaml` son opcionales. Úsalas solo sobre sistemas propios o con autorización (`recon-osint` incluye técnicas activas).

| Skill | Para qué sirve |
|-------|----------------|
| `recon-osint` | Reconocimiento pasivo y activo para evaluaciones autorizadas: enumeración de subdominios, análisis DNS, fingerprint de tecnologías y correlación OSINT. |
| `threat-hunting` | Caza de amenazas: extracción de IOCs, correlación con inteligencia, mapeo a MITRE ATT&CK, hipótesis de caza y reglas de detección. |
| `incident-response` | Respuesta a incidentes con NIST SP 800-61 y SANS PICERL: playbooks, recogida de evidencias, línea de tiempo forense e informe posterior. |
| `log-analysis` | Análisis de logs de seguridad: parseo, detección de anomalías, consultas SIEM y reglas Sigma para Splunk, Elastic, QRadar y Sentinel. |
| `blue-team-defense` | Defensa: hardening de sistemas, ingeniería de detección, líneas base, gestión de parches y arquitectura en profundidad. |
| `grc-compliance` | Gobierno, riesgo y cumplimiento: evaluación de riesgos, mapeo de controles NIST CSF / ISO 27001 / SOC 2 / CIS, análisis de brechas y políticas. |
| `supply-chain-security` | Cadena de suministro de software: SBOM, detección de typosquatting y dependency confusion, paquetes maliciosos, CI/CD y firmado (SLSA, Sigstore). |
| `threat-intelligence` | Inteligencia de amenazas (CTI): ciclo de inteligencia, normalización de IOCs, STIX/TAXII y MISP, modelos Diamond y Kill Chain, informes. |

### 🤖 Automatización

| Skill | Para qué sirve | Necesita |
|-------|----------------|----------|
| `auto-trello-task` | Skill propia y universal (vale para cualquier agente de IA). Ejecuta sola las tarjetas de la lista "🤖 Tareas Automatizadas 🤖" de tus tableros de Trello y deja el resultado en cada tarjeta. Funciona en cualquier tablero, también compartido: por defecto solo ejecuta lo que creaste tú (`incluir-equipo` añade lo de otros miembros) y las acciones irreversibles (enviar, gastar, borrar) las deja para tu OK. Al terminar cada tarjeta comenta qué hizo, si quedó finalizada y cuánto tardó, la marca como hecha y la mueve a "Hecho". Antes de empezar pone en la descripción "EN CURSO — haciéndose por <usuario>" para evitar choques entre compañeros, y lo quita al acabar. Admite `simular` para probar sin escribir nada. | Conector de Trello o API REST (`TRELLO_KEY` y `TRELLO_TOKEN`); para correr en segundo plano, una tarea programada y permisos de escritura |

### ✍️ Escritura

| Skill | Para qué sirve |
|-------|----------------|
| `humanizer` | Reescribe texto que suena a IA para que suene a quien lo escribe, sin cambiar lo que dice. Quita contrastes "no es X sino Y", tríos forzados, exceso de guiones y lenguaje de venta. |
| `caveman` | Modo de respuestas ultra-cortas: va directo a la respuesta, sin relleno y conservando todos los datos técnicos. Ahorra tokens. Se activa con `/caveman` o "caveman mode" y sigue hasta "stop caveman". |

#### 🦄 Ponytail se activa solo

`hooks/hooks.json` inyecta `skills/ponytail/SKILL.md` al iniciar cada sesión (arranque, reanudar, `/clear` y compactar).
Es una versión mínima **sin dependencias** de los hooks del plugin original, que necesitan Node.js.
No incluye cambio de nivel por comando, barra de estado ni propagación a subagentes.
Para apagarlo en una sesión, escribe: `stop ponytail`.

---

## ➕ Añadir una skill nueva

Una carpeta por skill dentro de `skills/`. Desde la raíz del repo clonado:

**Skill propia**

```bash
cp -r plantilla skills/mi-skill          # copia la plantilla
# edita skills/mi-skill/SKILL.md (el "name" debe coincidir con el nombre de la carpeta)
```

**Skill de terceros** (de GitHub)

1. Clona el repo de origen en una carpeta temporal y **lee el `SKILL.md` y los scripts** antes de copiar nada: una skill son instrucciones que Claude seguirá, y los scripts se ejecutan en tu máquina.
2. Comprueba la licencia (debe permitir redistribuir).
3. Copia la carpeta a `skills/<nombre>/` junto con su `LICENSE`.
4. Crea `skills/<nombre>/ORIGEN.md` con la URL, el commit y la licencia (mira cualquiera de las existentes).

**En ambos casos**, para terminar:

5. Añade una fila a la tabla de este README.
6. Publica:

```bash
git add -A
git commit -m "Añadir skill <nombre>"
git push
```

7. Quien la quiera ejecuta `/plugin marketplace update mis-skills`.

> No hay `version` en `plugin.json` a propósito: cada commit nuevo cuenta como actualización, sin subir números a mano.

### Actualizar una skill de terceros

Vuelve a descargar su repo de origen (la URL está en su `ORIGEN.md`), revisa los cambios, reemplaza la carpeta, actualiza el commit en `ORIGEN.md` y haz push.

---

## 🗂️ Estructura

```
mis-skills/
├── .claude-plugin/
│   ├── plugin.json         ← define el plugin
│   └── marketplace.json    ← catálogo (lo que se añade con /plugin marketplace add)
├── hooks/hooks.json        ← activa ponytail al iniciar sesión
├── skills/                 ← una carpeta por skill (lo que se instala)
│   └── <nombre>/
│       ├── SKILL.md        ← instrucciones de la skill
│       ├── LICENSE         ← licencia de origen
│       └── ORIGEN.md       ← de dónde viene, commit y licencia
├── plantilla/SKILL.md      ← plantilla para skills nuevas (no se instala)
└── README.md
```

---

## 🩹 Problemas frecuentes

| Síntoma | Causa y solución |
|---------|------------------|
| `Repository not found` al añadir el marketplace o al hacer push | Comprueba que escribiste bien `yery27/mis-skills`. Si falla al hacer push, tu Git usa otra cuenta o no tiene sesión: entra en el Administrador de credenciales de Windows → Credenciales de Windows, borra la entrada `git:https://github.com` y repite. |
| Las skills salen duplicadas | Hay otra copia instalada (por ejemplo el plugin original de ponytail). Desinstálala en `/plugin` → Installed. |
| No aparecen las skills nuevas | Ejecuta `/plugin marketplace update mis-skills` y luego `/reload-plugins`. |
| `webapp-testing` falla | Instala Playwright: `pip install playwright` y `playwright install`. |
| Un script de ciberseguridad falla por un módulo que falta | Los scripts funcionan con la librería estándar; para las funciones opcionales instala `pip install requests dnspython pyyaml`. |
| `find-skills` no encuentra o no instala nada | Necesita Node.js (usa `npx skills`). Instálalo desde nodejs.org. |

---

## 🙏 Créditos y licencias

El resto del repo (README, plantilla, hooks) es MIT, ver `LICENSE`.
Todas las skills son de terceros, salvo `auto-trello-task` (propia, MIT como el resto del repo), copiadas con su licencia (MIT, Apache-2.0 o CC BY 4.0) y un `ORIGEN.md` en cada carpeta.
Los derechos son de sus autores:

| Autor / repo | Skills |
|--------------|--------|
| [Ilm-Alan/frontend-design](https://github.com/Ilm-Alan/frontend-design) | `frontend-design` |
| [jezweb/claude-skills](https://github.com/jezweb/claude-skills) | `tailwind-theme-builder`, `design-review`, `color-palette` |
| [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills) | `shadcn-ui` |
| [jakubkrehel/make-interfaces-feel-better](https://github.com/jakubkrehel/make-interfaces-feel-better) | `make-interfaces-feel-better` |
| [dietrichgebert/ponytail](https://github.com/dietrichgebert/ponytail) | `ponytail`, `ponytail-review`, `ponytail-audit`, `ponytail-debt`, `ponytail-gain`, `ponytail-help` |
| [blader/humanizer](https://github.com/blader/humanizer) | `humanizer` |
| [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) | `caveman` |
| [anthropics/skills](https://github.com/anthropics/skills) | `webapp-testing`, `mcp-builder`, `theme-factory` |
| [obra/superpowers](https://github.com/obra/superpowers) | `systematic-debugging`, `test-driven-development`, `verification-before-completion` |
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | `design-taste-frontend` (solo la skill principal; el repo tiene 12 variantes más) |
| [vercel-labs/skills](https://github.com/vercel-labs/skills) | `find-skills` |
| [sickn33/agentic-awesome-skills](https://github.com/sickn33/agentic-awesome-skills) | `e2e-testing-patterns` (MIT + CC BY 4.0) |
| [Masriyan/Claude-Code-CyberSecurity-Skill](https://github.com/Masriyan/Claude-Code-CyberSecurity-Skill) | `recon-osint`, `threat-hunting`, `incident-response`, `log-analysis`, `blue-team-defense`, `grc-compliance`, `supply-chain-security`, `threat-intelligence` (de sus 22 skills solo se incluyen estas, de perfil defensivo) |

**Para descubrir más skills:** listas curadas por la comunidad en
[ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) y
[travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills).
