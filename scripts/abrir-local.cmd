@echo off
rem Sobe o Manual de Bordo localmente e abre o navegador.
cd /d "%~dp0.."
if not exist dist\index.html (
  echo Gerando o site pela primeira vez...
  call npm run build || (echo Build falhou. & pause & exit /b 1)
)
start "" "http://localhost:4321/curso-claude-code/"
call npm run preview
