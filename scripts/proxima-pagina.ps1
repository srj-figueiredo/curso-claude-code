# Roda uma sessão sem supervisão que segue o CONTINUAR.md (um item da Fila).
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

Write-Host "Iniciando sessao. Saida em $log"
claude -p "Leia o CONTINUAR.md e continue o trabalho. Faça um item da Fila e pare." `
  --model sonnet --permission-mode acceptEdits `
  --allowedTools ($ferramentas -join ',') *>&1 | Tee-Object -FilePath $log

Write-Host "Fim. Log: $log"
Read-Host "Enter para fechar"
