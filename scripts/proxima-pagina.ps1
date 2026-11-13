# Roda uma sessão sem supervisão que segue o CONTINUAR.md (um item da Fila).
# Este arquivo precisa ficar em UTF-8 COM BOM: o Windows PowerShell 5.1 lê sem BOM como ANSI e estraga os acentos.
$utf8 = New-Object System.Text.UTF8Encoding($false)
[Console]::OutputEncoding = $utf8
[Console]::InputEncoding = $utf8
$OutputEncoding = $utf8

$raiz = Split-Path -Parent $PSScriptRoot
Set-Location $raiz
New-Item -ItemType Directory -Force logs | Out-Null
$log = "logs\" + (Get-Date -Format "yyyy-MM-dd-HHmm") + ".log"

$ferramentas = @(
  'Bash(npm run *)', 'Bash(npx astro *)', 'Bash(npx playwright *)',
  'Bash(node scripts/*)', 'Bash(python scripts/*)',
  'Bash(git add *)', 'Bash(git commit *)', 'Bash(git push)',
  'Bash(git status*)', 'Bash(git log*)', 'Bash(git diff*)',
  'Bash(claude -p *)'
)

Write-Host "Iniciando sessão. Saída em $log"
$pedido = "Leia o CONTINUAR.md e continue o trabalho. Faça um item da Fila e pare."
$null | claude -p $pedido `
  --model sonnet --permission-mode acceptEdits `
  --allowedTools ($ferramentas -join ',') *>&1 | Tee-Object -FilePath $log

Write-Host "Fim. Log: $log"
Read-Host "Enter para fechar"
