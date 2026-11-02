# Mode autònom: fer la pràctica jo

Només quan l'Yeray ha triat **"La fas tu"** a l'inici. Jo faig la pràctica de veritat a les seves màquines virtuals, faig les captures i ho vaig deixant al document.

## Regles que no es negocien

- **Tot el que surt al document ha passat de debò.** Mai captures, sortides d'ordres ni resultats inventats. Si una cosa no ha funcionat, es documenta com un error.
- **Insisteix fins que funcioni, per difícil que sigui.** Davant d'un problema: llegeix el missatge exacte, mira logs, busca a la documentació oficial, prova alternatives i comprova el resultat. No et rendeixis al primer error. Si després de **tres camins diferents** continua bloquejat, para: explica a l'Yeray què has provat i què creus que passa, i pregunta. No simulis que ha anat bé.
- **Si em falta informació, pregunto.** Una dada que l'enunciat no dona (IP, nom de domini, usuari, quina VM és quina, versió), una VM sense sessió iniciada, un teclat que escriu mal, un pas gràfic que no puc fer... pregunto a l'Yeray en un missatge curt i espero. No m'invento valors ni suposo. Agrupa les preguntes en una sola vegada.
- **Només el laboratori de l'Yeray.** Les seves VMs i el que demana l'enunciat. Mai sistemes de tercers, ni escanejar la xarxa real.
- **Contrasenyes: mai les escric jo.** L'Yeray inicia sessió a les VMs (o ja les té obertes). Si surt un prompt de contrasenya (sudo, UAC, login), paro i li demano que l'escrigui ell, o li proposo preparar-ho (usuari amb `NOPASSWD`, o un fitxer de contrasenya que crea ell fora del repo i que jo només referencio amb `--passwordfile`). No poso contrasenyes a les ordres ni al document.
- **No modifiquis les VMs, amb una sola excepció: la xarxa.** Prohibit crear snapshots, restaurar-los, clonar, esborrar, importar/exportar o canviar maquinari (CPU, RAM, discs, controladors, `storageattach`, `unregistervm`...). Només es pot **mirar** (`list`, `showvminfo`), **engegar**, **fer captures**, **escriure amb el teclat** i **executar ordres dins del guest**.
- **Xarxa: l'Yeray em deixa canviar-la si alguna cosa no funciona** (tipus d'adaptador, xarxa interna, només-amfitrió, pont, nom de la xarxa, adaptador connectat). Només aquests ajustos (`modifyvm --nicN`, `--nictypeN`, `--intnetN`, `--hostonlyadapterN`, `--bridgeadapterN`, `--cableconnectedN`), i només després de **diagnosticar** que el problema és de xarxa. La VM ha d'estar apagada per canviar-ho (`modifyvm` no funciona amb la VM encesa, tret d'alguns `controlvm nicN`); si cal apagar-la, fes-ho net (`acpipowerbutton`). Abans de canviar, anota el valor antic. Cada canvi va al document, a `# ERRORS`, amb el valor de **abans i després**, i al resum final.
- **Demana OK abans de** tocar res de l'amfitrió fora del que demani l'enunciat.

## Pas 1. Preparació

1. **Eines de control.** Mira què tens: una eina d'ordinador (captura i ratolí) si la sessió en porta, i sempre `VBoxManage` (a `C:/Program Files/Oracle/VirtualBox/VBoxManage.exe`; no és al PATH, crida'l amb el camí complet).
2. `VBoxManage list vms` i `list runningvms`. Lliga cada màquina de l'enunciat amb una VM. Si en falta una o hi ha dubte, pregunta.
3. Per a cada VM implicada: xarxes (`showvminfo "<vm>" --machinereadable`, línies `nic`, `bridgeadapter`, `intnet`, `hostonlyadapter`) i si té Guest Additions (`guestproperty get "<vm>" /VirtualBox/GuestAdd/Version`).
4. Avisa a l'Yeray que **no es fan snapshots ni canvis a la VM, tret de la xarxa si cal**, així que si alguna cosa surt mal dins del guest, no hi ha punt de retorn automàtic. Si vol un snapshot, el fa ell.
5. Resum curt a l'Yeray: màquines, ordre de feina, xarxes i què crec que pot donar problemes. Continua sense esperar si no hi ha dubtes.

## Eines de VirtualBox

Totes comencen per `VBoxManage` (camí complet). Entre cometes els noms amb espais.

| Què | Ordre |
|---|---|
| Engegar amb finestra | `startvm "<vm>" --type gui` |
| Estat | `showvminfo "<vm>" --machinereadable` (línia `VMState`) |
| **Captura de pantalla** | `controlvm "<vm>" screenshotpng <fitxer.png>` |
| Escriure text | `controlvm "<vm>" keyboardputstring "text"` |
| Enter | `controlvm "<vm>" keyboardputscancode 1c 9c` |
| Ctrl+Alt+Supr | `controlvm "<vm>" keyboardputscancode 1d 38 e0 53 e0 d3 b8 9d` |
| Executar dins del guest (Guest Additions) | `guestcontrol "<vm>" run --exe <programa> --username <usuari> --passwordfile <fitxer> --wait-stdout --wait-stderr -- <programa> <args>` |
| Copiar a / des del guest | `guestcontrol "<vm>" copyto` / `copyfrom` |
| Aturar (només si ho demana l'enunciat o l'Yeray) | `controlvm "<vm>" acpipowerbutton` |

Límits: `VBoxManage` **no mou ni clica el ratolí**. Si el pas es fa per interfície gràfica, o utilitzo l'eina d'ordinador sobre la finestra de VirtualBox, o ho faig per terminal, PowerShell o `guestcontrol`. Si no hi ha cap manera, ho dic i demano a l'Yeray que faci aquest clic.

**Com faig que la captura serveixi:** escric l'ordre dins del terminal visible de la VM (`keyboardputstring` + Enter) i faig la captura després, de manera que es vegi l'ordre **i** el resultat, com la faria ell. `guestcontrol` serveix per preparar coses o per llegir sortides exactes, però no substitueix la captura.

## Pas 2. Fer la pràctica

Per a cada exercici o apartat de l'enunciat, en ordre:

1. Fes el pas a la VM correcta.
2. **Mira la pantalla de veritat** (fes la captura i llegeix-la amb Read) i comprova que el resultat és l'esperat. Mai donis per fet que ha funcionat.
3. Si ha anat bé, desa la captura a `captures/` amb nom `E<exercici>-<n>-<descripcio>.png` (per exemple `E2-1-ipconfig.png`). Una captura per cada 📸 de l'enunciat, més les que demostrin el resultat.
4. Apunta-ho al registre `registre.md`: pas, VM, ordre, resultat, captura. D'aquí surt després l'explicació.
5. Si falla, vés a **Errors**.

Captures útils: finestra completa de la VM, ordre i sortida a la vista, res tallat, res d'una altra màquina.

## Errors

Cada error que surti, **encara que l'arreglis**, va a `# ERRORS` del document (en qualsevol assignatura, en mode autònom):

1. Captura de l'error i missatge exacte.
2. Diagnòstic de veritat: logs (`journalctl -xe`, `systemctl status`, Visor d'esdeveniments), `ping`, `nslookup`, `ip a` / `ipconfig`, ports i serveis.
3. Arregla, torna a provar i fes captura de la comprovació.
4. Redacta-ho al format de `format.md` (missatge, causa, solució amb ordres que han funcionat, comprovació).

Causes habituals amb VirtualBox, per mirar abans de res:
- adaptador de xarxa equivocat (aquí sí que puc canviar-ho jo, apuntant el valor antic) (NAT no deixa que les VMs es vegin entre elles; per a això, xarxa interna, adaptador només-amfitrió o pont) i IP en una altra xarxa;
- MAC o nom de màquina repetits després de clonar;
- Guest Additions que falten (sense portapapers, sense `guestcontrol`);
- Hyper-V o virtualització activats que fan anar la VM molt lenta o no deixen engegar-la;
- tallafocs de Windows que bloqueja el `ping`;
- hora desajustada, que trenca Kerberos i els certificats;
- DNS apuntant a un lloc equivocat dins del domini.

## Pas 3. Escriure el document

- Escriu `practica.md` seguint la resta de la skill, amb les captures reals: `[captura: etiqueta @ captures/E2-1-ipconfig.png]` (camí relatiu al `.md`; la carpeta `captures/` va al costat).
- L'explicació és **del que ha passat de veritat**, a partir del `registre.md`, en primera persona i passat, justificant cada pas.
- Les ordres que han funcionat van en blocs de codi normals. **No** es fan servir quadres `fer`: la pràctica ja està feta.
- Fes també la part extra, si n'hi ha.
- Després de generar, mira les pàgines: les captures s'han de veure i llegir. Si una és il·legible, la refaig.

## Al final

Diu a l'Yeray, en poques línies: què s'ha fet, els errors que han sortit, el que no s'ha pogut fer, els canvis de xarxa fets (abans i després) i quines VMs han quedat enceses. **No** apago les VMs sense preguntar.

## L'entorn de l'Yeray (comprova-ho, pot canviar)

VirtualBox 7.2.6. VMs que té: Windows Server 2025, Windows Server 2025 Serveis, Windows11 Yeray, Win Client, DC1-YERAYGARCIA, DC2-YERAYGARCIA, Ubuntu, ubuntu server, ubuntu desktop DHCP S, ubuntu desktop DHCP C, mosquitto. Adaptadors només-amfitrió a 192.168.56.0/24. Cal tornar a mirar-ho amb `list vms` a cada pràctica.
