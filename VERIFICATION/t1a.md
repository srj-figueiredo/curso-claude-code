# VERIFICATION · T1A Seu primeiro cliente: o site no navegador

CLI: 2.1.325 · Data: 13/11/2026 · Doc: cache local de `code.claude.com/docs/en/*.md` (12/11/2026).
Ambiente: Windows 11, PowerShell 5.1, login por assinatura. O modelo de cada `-p` é o padrão da máquina (aqui, Haiku 5.5; em outras estações aparece também Sonnet 5.5). O texto varia entre execuções.
Pastas de transcrição criadas em `~/.claude/projects` pelos testes foram apagadas.

## Afirmações conferidas

| # | Afirmação | Fonte | Resultado |
|---|---|---|---|
| 1 | O plano gratuito do claude.ai não inclui o Claude Code; Pro, Max, Ultra, Team, Enterprise ou conta Console incluem | setup.md | confere |
| 2 | Comando de instalação por sistema (`install.sh`, `install.ps1`) | setup.md; M1 | confere (não reexecutado: a máquina já tinha o Claude) |
| 3 | `claude --version` imprime `número (Claude Code)` | M1; execução | `2.1.325 (Claude Code)` |
| 4 | `claude doctor` só lê e relata | M1 | confere |

## Execuções

| Ficha | Comando | Observado |
|---|---|---|
| 2 | `claude -p "Leia o briefing.md e crie o site ..." --permission-mode acceptEdits` em `t1a-inicio` | 4 passos, 19,6 s, 0 negações, `index.html` de 6.650 bytes; o resumo avisa de 3 decisões não pedidas ("aberto agora", mensagem pré-preenchida, frase de boas-vindas) e que não viu no navegador |
| 2 | Conferência manual do HTML contra o briefing | 6 preços exatos, 3 cores, 2 links wa.me, regras de não fazer respeitadas |
| 2 | Extração do ZIP no PowerShell 5.1 (`Expand-Archive`), `cd`, `Get-ChildItem` | pasta `doce-esquina` com `briefing.md` |

## Não testado

- Instalação e login (ficha 1): seguem a documentação; a verificação de versão foi executada.
- A tela interativa (licença, `/exit`): só existe no modo interativo. A ficha 2 foi executada com `-p`, e a própria ficha diz isso.
- Abrir o `index.html` com `start`, `open` e `xdg-open`: comandos padrão, não executados um a um.

## Rechecagem (13/11/2026)

Refeita contra os números, a documentação e o HTML final. Corrigido: "créditos de API" virou "uma conta de API" (a doc diz conta Console). Conferido sem mudança: 20 s, 4 passos, 6,6 KB, a tabela da Prova, 0 links quebrados, axe (papel e console) e renderização sem Markdown solto.
