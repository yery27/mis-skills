# mis-skills

Mis skills de Claude Code. Cada skill vive en `skills/<nombre>/SKILL.md`.

## Usar en un proyecto

Copiar:

```bash
git clone https://github.com/<usuario>/mis-skills.git
mkdir -p .claude/skills && cp -r mis-skills/skills/* .claude/skills/
```

Enlazar a nivel de usuario (Windows, PowerShell):

```powershell
git clone https://github.com/<usuario>/mis-skills.git $HOME\mis-skills
New-Item -ItemType Junction -Path $HOME\.claude\skills -Target $HOME\mis-skills\skills
```

En macOS/Linux: `ln -s ~/mis-skills/skills ~/.claude/skills`.
