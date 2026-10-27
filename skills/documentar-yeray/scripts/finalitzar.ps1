# Genera el .docx final d'una practica: markdown -> docx -> index actualitzat amb Word -> PDF de revisio -> copia a Descarregues.
# Us: powershell -ExecutionPolicy Bypass -File finalitzar.ps1 -Md <practica.md> -Treball <carpeta temporal> [-Desti <carpeta>] [-Sobreescriu]
# Fitxer en ASCII a proposit: PowerShell 5.1 llegeix malament els .ps1 UTF-8 sense BOM.
param(
  [Parameter(Mandatory = $true)][string]$Md,
  [Parameter(Mandatory = $true)][string]$Treball,
  [string]$Desti = (Join-Path $env:USERPROFILE 'Downloads'),
  [switch]$Sobreescriu
)
$ErrorActionPreference = 'Stop'
$scripts = $PSScriptRoot
New-Item -ItemType Directory -Force $Treball | Out-Null

# 1. Dependencia docx (npm) dins de la carpeta de scripts
if (-not (Test-Path (Join-Path $scripts 'node_modules\docx'))) {
  Push-Location $scripts; npm install --silent; Pop-Location
}

# 2. Markdown -> docx
$raw = Join-Path $Treball 'raw.docx'
$out = & node (Join-Path $scripts 'generar.js') $Md $raw
if ($LASTEXITCODE -ne 0) { throw "generar.js ha fallat" }
$nom = (($out | Where-Object { $_ -like 'sortida=*' }) -replace '^sortida=', '').Trim()
$out | Where-Object { $_ -notlike 'sortida=*' } | ForEach-Object { Write-Output $_ }

# 3. Word: actualitzar index i exportar PDF. Sempre a la carpeta temporal (desar directe a Descarregues penjava Word).
$final = Join-Path $Treball 'final.docx'
$pdf = Join-Path $Treball 'final.pdf'
$abans = @(Get-Process WINWORD -ErrorAction SilentlyContinue | ForEach-Object { $_.Id })
$job = Start-Job -ArgumentList $raw, $final, $pdf {
  param($raw, $final, $pdf)
  $w = New-Object -ComObject Word.Application
  $w.Visible = $false; $w.DisplayAlerts = 0
  try {
    $d = $w.Documents.Open($raw, $false, $false, $false)
    foreach ($t in $d.TablesOfContents) { $t.Update() }
    $d.SaveAs2($final, 16)
    $d.ExportAsFixedFormat($pdf, 17)
    $d.Close(0)
    'word-ok'
  } finally { try { $w.Quit() } catch {} }
}
if (Wait-Job $job -Timeout 150) {
  $r = Receive-Job $job -ErrorAction SilentlyContinue
} else {
  Stop-Job $job
  # tanca nomes les instancies de Word obertes per aquest script
  Get-Process WINWORD -ErrorAction SilentlyContinue | Where-Object { $abans -notcontains $_.Id } | Stop-Process -Force -Confirm:$false
  throw "Word no ha respost en 150 s (pot haver-hi un dialeg ocult). Torna-ho a provar."
}
if (-not (Test-Path $final)) { throw "Word no ha generat $final : $r" }

# 4. Copia a la destinacio sense trepitjar res que ja hi sigui
$desti = Join-Path $Desti $nom
if ((Test-Path $desti) -and -not $Sobreescriu) {
  $base = [IO.Path]::GetFileNameWithoutExtension($nom)
  $desti = Join-Path $Desti ("{0}_{1}.docx" -f $base, (Get-Date -Format 'yyyyMMdd_HHmm'))
}
Copy-Item $final $desti -Force:$Sobreescriu

# 5. Fulls de revisio per mirar la maquetacio
& python -P (Join-Path $scripts 'fulls.py') $pdf $Treball
Write-Output "docx=$desti"
Write-Output "pdf=$pdf"
Write-Output ("fulls=" + (Join-Path $Treball 'full*.png'))
