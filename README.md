# mis-skills

Mis skills de Claude Code, empaquetadas como plugin + marketplace.

## Instalar

En Claude Code:

```
/plugin marketplace add yery27/mis-skills
/plugin install mis-skills@mis-skills
```

El repo es privado: hace falta ser colaborador y tener Git autenticado en GitHub.

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
