# Trello por API REST

Vía alternativa para agentes sin conector de Trello. Documentación oficial: https://developer.atlassian.com/cloud/trello/rest/

## Credenciales

Variables de entorno `TRELLO_KEY` y `TRELLO_TOKEN` (el usuario las crea en https://trello.com/power-ups/admin). **No las imprimas, no las pegues en comentarios ni en archivos.** Envíalas en la cabecera, no en la URL, para que no queden en logs:

```bash
AUTH="Authorization: OAuth oauth_consumer_key=\"$TRELLO_KEY\", oauth_token=\"$TRELLO_TOKEN\""
API=https://api.trello.com/1
curl -s -H "$AUTH" "$API/members/me?fields=id,fullName,username"
```

Para texto con acentos, saltos de línea o emojis (descripciones, comentarios) usa `--data-urlencode`.

## Operaciones

| Operación | Llamada |
|-----------|---------|
| Usuario actual | `GET /members/me?fields=id,fullName,username` |
| Tableros abiertos del usuario | `GET /members/me/boards?filter=open&fields=name,url,shortLink` |
| Tablero por URL o `shortLink` | `GET /boards/{shortLink}?fields=name,url,closed` |
| Buscar tableros por nombre | `GET /search?query={texto}&modelTypes=boards&board_fields=name,url` |
| Listas de un tablero | `GET /boards/{boardId}/lists?filter=open&fields=name,pos` |
| Miembros de un tablero | `GET /boards/{boardId}/members?fields=fullName,username` |
| Tarjetas abiertas de una lista | `GET /lists/{listId}/cards?fields=name,desc,closed,dueComplete,idList,url` |
| Tarjeta entera | `GET /cards/{cardId}?fields=name,desc,closed,dueComplete,idList,url&checklists=all&attachments=true` |
| Comentarios de una tarjeta | `GET /cards/{cardId}/actions?filter=commentCard` |
| Quién creó / editó la tarjeta | `GET /cards/{cardId}/actions?filter=createCard,updateCard:name,updateCard:desc` (cada acción trae `idMemberCreator` y `memberCreator`) |
| Editar la descripción | `PUT /cards/{cardId}` con `--data-urlencode "desc=..."` |
| Añadir un comentario | `POST /cards/{cardId}/actions/comments` con `--data-urlencode "text=..."` |
| Marcar completada | `PUT /cards/{cardId}` con `dueComplete=true` |
| Mover a otra lista (arriba) | `PUT /cards/{cardId}` con `idList={listaHecho}` y `pos=top` |

## Ejemplos

```bash
# Reclamar: nuevo desc = aviso + --- + descripción original
curl -s -X PUT -H "$AUTH" "$API/cards/$CARD" \
  --data-urlencode "desc=$NUEVA_DESC"

# Comentar el resultado
curl -s -X POST -H "$AUTH" "$API/cards/$CARD/actions/comments" \
  --data-urlencode "text=$COMENTARIO"

# Cerrar: marcar completada y mover a Hecho
curl -s -X PUT -H "$AUTH" "$API/cards/$CARD" \
  --data-urlencode "dueComplete=true" \
  --data-urlencode "idList=$LISTA_HECHO" \
  --data-urlencode "pos=top"
```

## Notas

- Las acciones traen `type` (`createCard`, `updateCard`, `commentCard`...) y `data.old` con los valores anteriores cuando cambia un campo; sirve para detectar ediciones de `desc` o `name` hechas por otra persona.
- Una lista vacía de tarjetas devuelve `[]`: es normal, no un error.
- Límite de Trello: unas 100 peticiones cada 10 segundos por token. Con el tope de 10 tarjetas por ejecución no se alcanza.
- Los identificadores de tablero, lista y tarjeta son los de 24 caracteres hexadecimales que devuelve la propia API; no los inventes ni los copies de memoria.
