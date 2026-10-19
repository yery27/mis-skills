---
titol: Directives de grup (GPO)
numero: ==1.5==
assignatura: ==M03 - Implantació de sistemes operatius==
curs: 2n ASIX
alumne: Nom Cognom Cognom
portada: portada.png
---

<!-- EXEMPLE DE FORMA. Mostra el to, la profunditat de les justificacions i la densitat de captures que s'esperen.
     El contingut (domini, usuaris, GPO) és d'aquesta pràctica concreta: no el reutilitzis en altres.
     La portada surt de exemple-portada.json. -->

# INTRODUCCIÓ

L'objectiu d'aquesta pràctica és aplicar directives de grup (GPO, Group Policy Objects) al domini empresa.local per controlar de manera centralitzada la configuració dels usuaris i dels equips, sense haver d'anar ordinador per ordinador. Primer es modifiquen les dues GPO que el sistema crea per defecte, **Default Domain Policy** i **Default Domain Controllers Policy**. Després es creen dues GPO pròpies, **GPO Oficines** i **GPO Tarragona**, vinculades a les seves unitats organitzatives, i s'hi configuren restriccions per als usuaris. Finalment, es comprova el resultat des d'un client Windows 11, es fa una còpia de seguretat i una restauració d'una GPO i es decideix quina GPO té preferència quan dues directives es contradiuen.

Per entendre la pràctica cal tenir present com s'apliquen les GPO. S'apliquen en l'ordre **Local, Lloc (Site), Domini i UO** (ordre LSDOU), i quan dues directives es contradiuen guanya la que s'aplica més tard, és a dir, la de la UO més propera a l'objecte. A més, cada GPO té dues parts: les directives de **Configuración del equipo** s'apliquen als equips quan arrenquen, i les de **Configuración de usuario** s'apliquen als usuaris quan inicien sessió, sigui quin sigui l'equip.

L'esquema de la portada mostra on queda vinculada cada GPO. La UO ==Seu Tarragona penja de la UO Oficines==, de manera que un usuari de Seu Tarragona rep, per herència, tant la GPO Oficines com la GPO Tarragona. Tot el treball s'ha fet des de la consola **Administración de directivas de grupo** (`gpmc.msc`) del servidor SRV01.

# PART I: APLICACIÓ DE DIRECTIVES A LA GPO DEL DOMINI

## Exercici 1. Directives Default Domain Policy i Default Domain Controllers Policy

> Fes que la longitud mínima de les contrasenyes sigui de 8 caràcters.

[captura: clic dret a Default Domain Policy > Editar | Directiva de contraseñas > Longitud mínima = 8]
[captura: resultat de gpupdate /force i net accounts]

A la consola **Administración de directivas de grupo** he desplegat el bosc fins al domini empresa.local, he fet clic dret sobre **Default Domain Policy** i he triat **Editar**. A l'editor he anat a **Configuración del equipo > Directivas > Configuración de Windows > Configuración de seguridad > Directivas de cuenta > Directiva de contraseñas** i he obert **Longitud mínima de la contraseña**. He marcat **Definir esta configuración de directiva** i hi he posat **8 caracteres**.

Ho he configurat a la Default Domain Policy, i no en una GPO nova, perquè les directives de contrasenya dels comptes del domini només tenen efecte quan estan en una GPO vinculada a l'arrel del domini. Si es posessin en una GPO vinculada a una UO, només afectarien els comptes locals dels equips d'aquella UO, no els usuaris del domini.

Per aplicar el canvi sense esperar el refresc automàtic he executat `gpupdate /force`, i amb `net accounts` he comprovat que la **Longitud mínima de contraseña** ja és 8. Per comprovar-ho a la pràctica he intentat posar a un usuari una contrasenya de menys de 8 caràcters, i el sistema l'ha rebutjada perquè no compleix els requisits de la directiva. Les contrasenyes que ja existien continuen sent vàlides fins que l'usuari les canvia.

> Fes que l'usuari "Ofi1" en concret es pugui loguejar localment.

[captura: Default Domain Controllers Policy > Permitir el inicio de sesión local | ofi1 afegit sense treure els grups per defecte]
[captura: inici de sessió d'ofi1 al servidor]

Per seguretat, en un controlador de domini només poden iniciar sessió localment els administradors i alguns grups d'operadors. Com que SRV01 és el controlador de domini, aquest dret es configura a la **Default Domain Controllers Policy**, que és la GPO vinculada a la UO Domain Controllers i, per tant, la que s'aplica als controladors de domini.

He editat aquesta GPO i he anat a **Configuración del equipo > Directivas > Configuración de Windows > Configuración de seguridad > Directivas locales > Asignación de derechos de usuario > Permitir el inicio de sesión local**. Amb **Agregar usuario o grupo...** he afegit **EMPRESA\ofi1**. He afegit l'usuari en concret, i no el seu grup Oficina0001, perquè l'enunciat demana que el permís sigui només per a ofi1.

És important no treure els grups que ja hi havia (Administradores, Operadores de cuentas, Operadores de copia de seguridad, Operadores de impresión, Operadores de servidores i CONTROLADORES DE DOMINIO DE EMPRESA). En definir aquest dret, la llista que hi posem substitueix l'anterior: si només hi quedés ofi1, ni tan sols l'administrador podria iniciar sessió al servidor.

Després d'executar `gpupdate /force` he tancat la sessió i he entrat al servidor com a ofi1. Abans del canvi no era possible, perquè sortia el missatge que el mètode d'inici de sessió no està permès.

# PART II: CREACIÓ I CONFIGURACIÓ DE GPO

## Exercici 2. Creació de GPOs

> Crea una GPO anomenada "GPO Oficines" enllaçada a l'OU Oficines.

[captura: clic dret a Oficines > Crear un GPO en este dominio y vincularlo aquí... | finestra Nuevo GPO amb el nom GPO Oficines]
[captura: GPO Oficines vinculada sota la UO Oficines (pestanya Ámbito)]

A la consola he fet clic dret sobre la UO **Oficines** i he triat **Crear un GPO en este dominio y vincularlo aquí...**. A la finestra **Nuevo GPO** he escrit el nom **GPO Oficines** i he deixat **GPO de inicio de origen** a (ninguno), perquè no cal partir de cap plantilla.

Aquesta opció fa dues coses alhora: crea la GPO dins del contenidor **Objetos de directiva de grupo** i la vincula a la UO. Són dues coses diferents: la mateixa GPO es podria vincular a diverses UO, i si s'esborra el vincle la GPO continua existint. A la captura es veu la GPO sota la UO Oficines i, a la pestanya **Ámbito**, que el vincle està habilitat a empresa.local/Oficines.

> Ara crea una GPO anomenada "GPO Tarragona", enllaçada evidentment a l'OU "Seu Tarragona", que vam crear a la pràctica anterior.

[captura: GPO Tarragona vinculada a la UO Seu Tarragona | pestanya Herencia de directivas de grupo de Seu Tarragona]

He repetit el mateix procediment sobre la UO **Seu Tarragona** amb el nom **GPO Tarragona**. Com que ==Seu Tarragona és una UO filla d'Oficines==, els seus usuaris reben les dues GPO: la GPO Oficines per herència de la UO pare i la GPO Tarragona perquè està vinculada directament. Es veu a la pestanya **Herencia de directivas de grupo** de Seu Tarragona, on surten totes dues amb el seu ordre de preferència.

Les dues GPO també es poden crear i vincular amb PowerShell:

```
New-GPO -Name "GPO Oficines" | New-GPLink -Target "OU=Oficines,DC=empresa,DC=local"
New-GPO -Name "GPO Tarragona" | New-GPLink -Target "OU=Seu Tarragona,OU=Oficines,DC=empresa,DC=local"
```

---

## Exercici 3. Ocultar funcionalitats

> Restringeix l'accés al Panell de control per evitar canvis no autoritzats, dins de la GPO Oficines.

[captura: editor de la GPO Oficines > Plantillas administrativas > Panel de control | Prohibir el acceso a Configuración del PC y a Panel de control: Habilitada]

He editat la **GPO Oficines** i he anat a **Configuración de usuario > Directivas > Plantillas administrativas > Panel de control**. He obert la directiva **Prohibir el acceso a Configuración del PC y a Panel de control** i l'he posat a **Habilitada**. Amb aquesta directiva l'usuari no pot obrir ni el Panell de control clàssic ni l'aplicació Configuració de Windows 11, ni des del menú Inici ni executant `control`.

És una directiva de **Configuración de usuario**, i per això s'aplica als usuaris de la UO Oficines (i de les seves UO filles) en qualsevol equip on iniciïn sessió. Així s'evita que un usuari normal canviï la configuració de xarxa, desinstal·li programes o modifiqui altres opcions del sistema.

> Evita que s'obri l'Administrador de tasques per impedir finalitzar processos.

[captura: Sistema > Opciones de Ctrl+Alt+Supr > Quitar el Administrador de tareas: Habilitada]

A la mateixa GPO Oficines he anat a **Configuración de usuario > Directivas > Plantillas administrativas > Sistema > Opciones de Ctrl+Alt+Supr** i he posat **Quitar el Administrador de tareas** a **Habilitada**. L'he posat a la GPO Oficines, igual que el Panell de control, perquè forma part del mateix exercici d'ocultar funcionalitats.

Així l'usuari no pot obrir l'Administrador de tasques ni amb Ctrl+Maj+Esc ni des de la pantalla de Ctrl+Alt+Supr. Per tant, no pot finalitzar processos com l'antivirus o els programes de l'empresa, ni veure què s'executa a l'equip.

---

## Exercici 4. Deshabilitar el símbol del sistema (cmd)

> Bloqueja cmd.exe en la GPO Tarragona.

[captura: editor de la GPO Tarragona > Sistema | Impedir el acceso al símbolo del sistema: Habilitada]

He editat la **GPO Tarragona** i, a **Configuración de usuario > Directivas > Plantillas administrativas > Sistema**, he posat **Impedir el acceso al símbolo del sistema** a **Habilitada**. A l'opció **¿Deshabilitar también el procesamiento de scripts del símbolo del sistema?** he deixat **No**: si es posa **Sí**, tampoc s'executarien els scripts .bat d'inici de sessió que pugui tenir el domini.

Bloquejar el cmd evita que l'usuari executi ordres que li permetrin saltar-se altres restriccions. Cal tenir en compte que aquesta directiva només bloqueja cmd.exe, no PowerShell. Per bloquejar també PowerShell caldria una altra directiva (**No ejecutar aplicaciones de Windows especificadas**) o AppLocker.

## Exercici 5. Mostrar extensions d'arxius

> Força veure les extensions per identificar el tipus real dels fitxers, a la GPO Tarragona.

[captura: Preferencias > Configuración del Panel de control > Opciones de carpeta > Nuevo | casella Ocultar las extensiones... desmarcada]

Aquesta opció no existeix com a directiva a les Plantillas administrativas, així que l'he configurat amb les **Preferencias** de la **GPO Tarragona**. He anat a **Configuración de usuario > Preferencias > Configuración del Panel de control > Opciones de carpeta**, he fet clic dret i he triat **Nuevo > Opciones de carpeta (al menos Windows Vista)**. A la finestra he desmarcat **Ocultar las extensiones de archivo para tipos de archivo conocidos** i he acceptat.

A les preferències, cada opció només s'aplica si queda subratllada en verd; si està subratllada en vermell, s'ignora. Per això he comprovat que la casella quedés en verd (amb la tecla F6 s'activa l'opció seleccionada). La diferència amb una directiva és que la preferència escriu el valor al registre de l'usuari (`HideFileExt = 0`): l'usuari el podria canviar, però a cada refresc de la GPO es torna a forçar.

Mostrar les extensions és una mesura de seguretat: evita que un fitxer maliciós com factura.pdf.exe es faci passar per un PDF, perquè l'usuari veu que en realitat és un executable.

---

## Exercici 6. Comprovacions

> Comprova, entrant dins d'un dels usuaris (des d'una màquina Windows 11), que les directives dels exercicis 2, 3, 4 i 5 funcionen. Tingueu en compte que a l'usuari se li han d'haver aplicat totes les GPOs.

[captura: gpresult /r /scope user amb les GPO aplicades]
[captura: Panell de control bloquejat | Administrador de tasques deshabilitat]
[captura: cmd deshabilitat per l'administrador | Explorador amb les extensions visibles]

Per fer les comprovacions he iniciat sessió al client Windows 11 amb l'usuari ==tgn1==, que és a la UO Seu Tarragona. És l'únic tipus d'usuari que rep totes les GPO: la **Default Domain Policy** (del domini), la **GPO Oficines** (heretada de la UO pare) i la **GPO Tarragona** (de la seva UO). Un usuari d'Oficines, en canvi, no rebria la GPO Tarragona.

Primer he executat `gpupdate /force` des de Win+R i he tancat i tornat a obrir la sessió, perquè algunes directives d'usuari només s'apliquen en iniciar sessió. Després he comprovat quines GPO s'havien aplicat amb `gpresult /r /scope user`. Com que el cmd ja estava bloquejat, l'he executat des de PowerShell, que no queda afectat per aquesta directiva. A l'apartat **Objetos de directiva de grupo aplicados** surten les tres GPO, cosa que confirma que les GPO de l'exercici 2 estan ben vinculades.

Després he comprovat cada directiva:

- **Panell de control (exercici 3):** en executar `control` des de Win+R surt el missatge que l'operació s'ha cancel·lat per les restriccions de l'equip, i la Configuració de Windows tampoc s'obre.
- **Administrador de tasques (exercici 3):** en prémer Ctrl+Maj+Esc surt el missatge **El administrador ha deshabilitado el Administrador de tareas**.
- **Símbol del sistema (exercici 4):** en obrir `cmd`, la finestra indica que l'administrador ha deshabilitat el símbol del sistema i no deixa escriure cap ordre.
- **Extensions (exercici 5):** a l'Explorador de fitxers els noms es veuen amb la seva extensió (.txt, .docx, .exe...) sense haver tocat les opcions de carpeta.

Totes les directives funcionen, així que les GPO estan ben configurades i s'apliquen a l'usuari tal com s'esperava segons l'estructura d'UO.

# PART III: OPERACIONS AMB LA GPO

## Exercici 7. Còpies de seguretat

> Crea una còpia de seguretat de la GPO Oficines.

[captura: Objetos de directiva de grupo > GPO Oficines > Hacer copia de seguridad... | carpeta de destí i descripció]
[captura: progrés de la còpia acabat amb estat Correcto]

Abans de fer la còpia he creat la carpeta **C:\CopiesGPO** al servidor. A la consola he desplegat **Objetos de directiva de grupo**, he fet clic dret sobre **GPO Oficines** i he triat **Hacer copia de seguridad...**. Hi he indicat la carpeta C:\CopiesGPO i una descripció ("Còpia GPO Oficines") i he premut **Copia de seguridad**. La finestra de progrés ha acabat amb l'estat **Correcto**.

La còpia es desa en una subcarpeta amb un identificador únic (GUID) i conté tota la configuració de la GPO, els seus permisos i la informació necessària per restaurar-la. En un entorn real convé guardar-la fora del servidor: si el controlador de domini falla, una còpia guardada al mateix disc es perdria amb ell. Amb PowerShell es pot fer el mateix amb aquesta ordre:

```
Backup-GPO -Name "GPO Oficines" -Path C:\CopiesGPO -Comment "Còpia GPO Oficines"
```

> I després restaura-la.

[captura: canvi fet abans de restaurar (directiva a No configurada) | GPO Oficines > Restaurar desde copia de seguridad...]
[captura: directiva recuperada després de restaurar]

Per demostrar que la restauració funciona, primer he fet un canvi a la GPO: he posat la directiva **Quitar el Administrador de tareas** a **No configurada**. Després he fet clic dret sobre **GPO Oficines > Restaurar desde copia de seguridad...**, he seleccionat la carpeta C:\CopiesGPO i la còpia feta abans, i he completat l'assistent. En tornar a editar la GPO, la directiva torna a estar **Habilitada**: la GPO ha tornat exactament a l'estat de la còpia.

La restauració recupera la configuració de la GPO però no els vincles, perquè els vincles es guarden a la UO i no a la GPO. En aquest cas la GPO no s'havia esborrat i el vincle amb la UO Oficines s'ha mantingut. Si s'hagués esborrat, caldria restaurar-la des de **Objetos de directiva de grupo > Administrar copias de seguridad...** i tornar-la a vincular a mà.

---

## Exercici 8. Preferència de directives entre GPOs

> Pot ser que hi hagi dues directives de diferents GPO que provoquin un conflicte, ja que són contradictòries. Fes que les directives de la "GPO Oficines" tinguin preferència sobre les de "GPO Tarragona".

[captura: Herencia de directivas de grupo de Seu Tarragona abans del canvi | vincle de GPO Oficines > Exigido]
[captura: Herencia de directivas de grupo després: GPO Oficines (Exigido) primera | gpresult /h: GPO ganador = GPO Oficines]

Com s'ha explicat a la introducció, quan dues directives es contradiuen guanya la de la UO més propera a l'usuari. Per tant, per defecte, per a un usuari de Seu Tarragona la GPO Tarragona té preferència sobre la GPO Oficines. Es veu a la pestanya **Herencia de directivas de grupo** de la UO Seu Tarragona: GPO Tarragona té la prioritat 1 i GPO Oficines la 2.

Per crear un conflicte real, a la GPO Oficines he configurat la mateixa directiva que a l'exercici 4, **Impedir el acceso al símbolo del sistema**, però a **Deshabilitada**, mentre que a la GPO Tarragona continua **Habilitada**. Sense fer res més, guanya la GPO Tarragona i el cmd continua bloquejat.

Per donar preferència a la GPO Oficines, a la UO Oficines he fet clic dret sobre el **vincle** de GPO Oficines i he marcat **Exigido**. Un vincle exigit s'aplica per sobre de qualsevol GPO vinculada a les UO filles, i a més no es pot bloquejar amb **Bloquear herencia**. Ara, a la pestanya Herencia de directivas de grupo de Seu Tarragona, GPO Oficines apareix en primer lloc amb la marca **(Exigido)**.

Al client, després de `gpupdate /force` i de tornar a iniciar sessió amb ==tgn1==, el cmd ja s'obre, perquè ara guanya la directiva de la GPO Oficines. A l'informe HTML que genera `gpresult /h`, la columna **GPO ganador** d'aquesta directiva indica **GPO Oficines**.

Si les dues GPO estiguessin vinculades a la mateixa UO, no caldria marcar Exigido: n'hi hauria prou de canviar l'**Orden de vínculos** a la pestanya **Objetos de directiva de grupo vinculados** i posar la GPO Oficines en el número 1, que és el que té més preferència.

# PART EXTRA: FUNCIONALITAT GPO TOP

## Windows LAPS: contrasenya d'administrador local única per equip

> Cerca informació sobre les GPO i selecciona la que, segons el teu criteri, és la funcionalitat més útil que pots configurar, aplica-la i comprova que funcioni.

[captura: Update-LapsADSchema i Set-LapsADComputerSelfPermission | directives LAPS a la GPO LAPS]
[captura: Get-LapsADPassword amb la contrasenya de l'equip | pestanya LAPS de l'equip a Usuarios y equipos de AD]

He escollit **Windows LAPS** (Local Administrator Password Solution) perquè, al meu criteri, és la GPO que aporta més seguretat amb menys feina. En molts dominis tots els equips tenen la mateixa contrasenya d'administrador local, posada en instal·lar o clonar els equips. Si un atacant l'aconsegueix en un equip, pot entrar a tots els altres (moviment lateral o pass-the-hash). Amb LAPS, cada equip té una contrasenya d'administrador local diferent, aleatòria i que canvia sola periòdicament, i la desa a Active Directory, on només els administradors la poden llegir.

Windows LAPS ja ve integrat a les versions actualitzades de Windows Server i Windows 11, així que no cal instal·lar res. Primer he preparat Active Directory des d'una consola de PowerShell com a administrador:

```
Update-LapsADSchema
Set-LapsADComputerSelfPermission -Identity "OU=Oficines,DC=empresa,DC=local"
```

La primera ordre afegeix a l'esquema els atributs on es guarda la contrasenya, i la segona dona permís als equips de la UO Oficines per escriure-hi la seva pròpia contrasenya.

LAPS és una directiva de **Configuración del equipo**, és a dir, s'aplica als equips i no als usuaris. Per això he mogut l'objecte del client Windows 11 des del contenidor **Computers**, on no es poden vincular GPO, a la UO **Oficines**. He creat una GPO nova, **GPO LAPS**, vinculada a Oficines: és millor tenir-la separada perquè cada GPO tingui una sola funció i sigui fàcil de localitzar. A **Configuración del equipo > Directivas > Plantillas administrativas > Sistema > LAPS** he configurat:

- **Configurar el directorio de copia de seguridad de contraseñas:** Habilitada, amb el directori **Active Directory**.
- **Configuración de contraseña:** Habilitada, amb majúscules, minúscules, números i caràcters especials, longitud de **14** caràcters i canvi cada **30** dies.

Al client he executat `gpupdate /force` i, des del servidor, he consultat la contrasenya amb aquesta ordre:

```
Get-LapsADPassword -Identity "==NOM-DEL-PC==" -AsPlainText
```

L'ordre mostra la contrasenya generada, quan s'ha canviat i quan caduca. També es veu a la pestanya **LAPS** de les propietats de l'equip a Usuarios y equipos de Active Directory. Per comprovar que funciona, he habilitat el compte Administrador local del client (a Windows 11 ve deshabilitat per defecte) i hi he iniciat sessió amb aquesta contrasenya. Finalment, he executat `Reset-LapsPassword` al client i, en tornar a consultar-la, la contrasenya ja era una altra: la rotació funciona.

# CONCLUSIÓ

Amb aquesta pràctica he vist que les GPO permeten aplicar la mateixa configuració a molts usuaris i equips des d'un sol punt. Les directives que afecten tot el domini, com les de contrasenyes, i les dels controladors de domini, com el dret d'iniciar sessió localment, es configuren a les GPO per defecte. En canvi, les restriccions per a un grup d'usuaris es posen en GPO pròpies vinculades a cada UO.

També he comprovat que l'estructura d'UO determina quines GPO rep cada usuari i en quin ordre, i que aquest ordre es pot controlar amb l'opció Exigido o amb l'ordre de vincles. Finalment, les còpies de seguretat permeten desfer canvis i recuperar una GPO si es configura malament, i funcionalitats com Windows LAPS demostren que les GPO són també una eina de seguretat, no només de configuració.
