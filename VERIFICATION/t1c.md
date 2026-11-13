# VERIFICATION · T1C A memória do cliente: o CLAUDE.md

CLI: 2.1.325 · Data: 13/11/2026 · Doc: cache local (`memory.md`, `best-practices.md`). Ambiente como na T1A (Haiku 5.5 em todos os passos). Uma amostra por lado; o texto varia.

## Afirmações conferidas

| # | Afirmação | Fonte | Resultado |
|---|---|---|---|
| 1 | O CLAUDE.md é carregado em toda sessão; é contexto, não imposição | memory.md | confere |
| 2 | Locais: política, usuário (`~/.claude/CLAUDE.md`), projeto e local | memory.md (tabela) | confere |
| 3 | Alvo de menos de 200 linhas por arquivo | memory.md § Write effective instructions | confere |
| 4 | `@arquivo` importa o arquivo inteiro e não reduz o custo de contexto | memory.md | confere |
| 5 | Mudança vale em sessão nova, `/clear` ou `/compact` | M2, M6 | confere |
| 6 | `/init` pode escrever em inglês e é rascunho | M6 (executado) | confere |

## Execuções (pastas copiadas de `t1b-gabarito`)

| Passo | Observado |
|---|---|
| Pedido que contraria as regras, sem CLAUDE.md | 9 passos, 0 negações; **escreveu 2 depoimentos inventados** e pôs "Mais vendido" no bolo inteiro; avisou no fim e deixou comentário HTML; `conferir.mjs`: `4 de 4 OK` |
| Mesmo pedido, com CLAUDE.md | 3 passos, 0 negações; **não alterou** o arquivo; explicou que CLAUDE.md e briefing proíbem; pediu dados reais |
| Criar o CLAUDE.md pedindo ao Claude, com o texto exato | 3 passos; arquivo **idêntico** ao do gabarito (diff vazio) |

## Não testado

- `/init` interativo e `/memory`: só na tela interativa (já tratados no M6).
- Mais de uma amostra por lado: a página diz que foi uma só.

## Rechecagem (13/11/2026)

Conferido: passos e negações com os JSON. Corrigido: a resposta da ficha 2 passou a ser marcada como resumida, e a frase sobre o `t1c-gabarito.zip` descrevia o conteúdo errado (o ZIP traz site, conferência e CLAUDE.md). A extração dos ZIPs foi reproduzida no PowerShell 5.1 (`Expand-Archive` e `Rename-Item`), e o `node conferir.mjs` da cópia deu `4 de 4`.
