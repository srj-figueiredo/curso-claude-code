@echo off
rem Sobe o Manual de Bordo localmente e abre o navegador.
cd /d "%~dp0.."
echo Gerando o site (leva alguns segundos)...
call npm run build || (echo Build falhou. & pause & exit /b 1)
rem Abre o navegador 5 s depois, quando o servidor ja subiu.
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep 5; Start-Process 'http://localhost:4321/curso-claude-code/'"
call npm run preview
