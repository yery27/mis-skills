# Reglas de este repo (mis-skills)

Plugin + marketplace de Claude Code con skills en `skills/<nombre>/`. El README es el catálogo: debe reflejar siempre lo que hay en `skills/`.

## Al añadir, cambiar o quitar una skill, SIEMPRE actualizar `README.md` en el mismo commit

1. **Contador:** el número de skills de la intro ("trae **N skills**") debe coincidir con `ls -d skills/*/ | wc -l`.
2. **Catálogo:** añadir una fila a la tabla de la categoría que le corresponda (🎨 Diseño frontend, 🐛 Calidad de código y desarrollo, 🧪 Testing y herramientas, ✍️ Escritura). Si no encaja en ninguna, crear una categoría nueva con su emoji. Formato de la fila: `` | `nombre` | para qué sirve, en una o dos frases en español | ``. Si necesita algo instalado, usar la columna "Necesita" (solo existe en Testing y herramientas).
3. **Créditos:** añadir la skill a la tabla de "Créditos y licencias" (agrupada con las demás del mismo repo de origen, o fila nueva si es un autor nuevo).
4. **Problemas frecuentes:** si la skill requiere dependencias (Python, Node, Playwright...), añadir la nota correspondiente.
5. Al quitar una skill, borrar su carpeta y todas las menciones en el README.

## Al añadir una skill de terceros

1. Clonar el repo de origen en la carpeta temporal (nunca en el repo) y **leer `SKILL.md` y todos los scripts** antes de copiar. Si hay algo sospechoso (red, ejecución remota, instrucciones raras), no meterla y avisar.
2. Comprobar que la licencia permite redistribuir. Sin licencia clara, no se copia.
3. Copiar solo la carpeta de la skill a `skills/<nombre>/`, sin modificar su contenido. El `name` del frontmatter debe coincidir con el nombre de la carpeta. No copiar material de desarrollo del autor (tests, logs de creación).
4. Incluir su `LICENSE` (y `NOTICE` si la licencia es Apache-2.0 y el origen lo trae).
5. Crear `skills/<nombre>/ORIGEN.md` con repo, ruta, commit, licencia y fecha (copiar el formato de cualquiera existente).

## Al terminar

- `git add -A`, commit en español describiendo la skill, y `git push`.
- Recordar al usuario que, para recibirla, debe ejecutar `/plugin marketplace update mis-skills` y `/reload-plugins`. Si no se actualiza, ofrecer el atajo manual (actualizar `~/.claude/plugins/marketplaces/mis-skills` y la caché del plugin).

## No tocar sin pedirlo

- No poner `version` en `.claude-plugin/plugin.json`: así cada commit cuenta como actualización.
- `hooks/hooks.json` activa ponytail al iniciar sesión (usa `cat`, sin Node). No añadir hooks que dependan de Node.
- `plantilla/` no se instala: es solo la plantilla para skills propias.
