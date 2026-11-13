# VERIFICATION · T1B Conduzir o trabalho: planejar, pedir e conferir

CLI: 2.1.325 · Data: 13/11/2026 · Doc: cache local. Ambiente como na T1A (modelo padrão da máquina: Sonnet 5.5 no plano e na implementação; Haiku 5.5 nas conferências). O texto varia entre execuções.

## Afirmações conferidas

| # | Afirmação | Fonte | Resultado |
|---|---|---|---|
| 1 | Plano: `Shift+Tab`, `/plan`, `claude --permission-mode plan` | permission-modes.md (§ plan mode) | confere |
| 2 | Aprovar o plano muda o modo conforme a opção escolhida | permission-modes.md | confere |
| 3 | Em `-p`, o plano é gravado em `~/.claude/plans/` | M3 e esta execução | confere |
| 4 | `-p` nega o que exigiria pergunta; `--allowedTools "Bash(comando)"` libera um comando | M3, M7 | confere (2 negações observadas na implementação) |
| 5 | `/clear` recomeça a conversa | M2 | confere |

## Execuções

| Passo | Comando | Observado |
|---|---|---|
| Plano | `claude -p "Quero adicionar à página um formulário ..." --permission-mode plan` | 6 passos, 0 negações; plano com 4 blocos e 2 perguntas; nenhum arquivo do site alterado; arquivo de plano em `~/.claude/plans/` (apagado depois) |
| Implementar | `claude -p "Pode implementar o plano ..." --continue --permission-mode acceptEdits` | 7 passos, 2 negações (Bash), só o `index.html` mudou (12.171 bytes) |
| Conferência | `claude -p "Crie um arquivo conferir.mjs ..." --allowedTools "Bash(node conferir.mjs)"` | 7 passos, 1 negação, `conferir.mjs` criado; `node conferir.mjs`: `4 de 4 itens OK`, saída 0 |
| Falha provocada | `R$ 9,00` trocado por `R$ 10,00` no HTML | `FALHOU` no item 1, "não está no briefing: R$ 10,00", `3 de 4`, saída 1; restaurado volta a `4 de 4` |
| Sintaxe | `node --check` nos scripts embutidos do HTML | sem erro |
| Navegador | Playwright (Chromium, 390 px): domingo, caixa para amanhã, café válido, bolo com 3 dias ou mais | domingo recusado; caixa para amanhã recusada com a sugestão **15/11, que é domingo** (defeito real, documentado na página); café e bolo abrem `wa.me/5511900000000?text=` com a mensagem completa |

## Não testado

- A tela de aprovação do plano e o atalho `Shift+Tab` na tela interativa.
- A instalação do Node.js pelo aluno (a máquina de teste já tinha Node 24).
- O formulário em Safari e Firefox (só Chromium).

## Rechecagem (13/11/2026)

Números conferidos com os JSON das execuções (passos 6, 7 e 7; negações 0, 2 e 1). Conferido sem mudança: saída 1 na falha, `4 de 4`, 0 links quebrados e axe. Corrigido um `tldr` do frontmatter que começava com aspas e quebrava o YAML.
