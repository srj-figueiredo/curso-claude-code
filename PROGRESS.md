# PROGRESS

Estados: `pendente` · `em andamento` · `verificado`.
Para retomar: "Leia BRIEFING.md e PROGRESS.md e continue de onde parou."

## Onde parou

Fases 0, 1 e 2 concluídas. Fase 3 em andamento: M3 pronto; M0, M1 e M2 com subagentes autores.
Fase 4 preparada (distribuição de comandos, junção e reconciliação); R1–R3 foram disparados e pararam no
limite de uso sem gravar nada: disparar de novo.

Próximos passos: integrar M0–M2 (build, axe, fotos) → R1–R8 em levas de três → M4–M11 → M12–M19 → M20–M22 →
C0–C6 e projeto final → apêndices e Fase 9.

Como integrar uma leva: `npm run comandos && npm run build && npx playwright test`, olhar as páginas novas
com `node scripts/recortes.mjs`, corrigir, commit.

## Fases

| Fase | Escopo | Estado |
|---|---|---|
| 0 | Preparação | verificado |
| 1 | Fundação (site, tokens, componentes, esquemas, CI) | verificado; deploy público ainda não feito |
| 2 | Design spike + gate visual | verificado; Lighthouse de desempenho aberto (D010) |
| 3 | M0–M3 + laboratório | em andamento |
| 4 | Parte II, R1–R8 | pendente (infra pronta) |
| 5 | M4–M11 | pendente |
| 6 | M12–M19 | pendente |
| 7 | M20–M22 + Tabela Grátis↔Pago | pendente |
| 8 | C0–C6 + projeto final | pendente |
| 9 | Apêndices, busca, impressão, manutenção, QA, REPORT | pendente |

## Páginas

| Página | Fatos | Execução | Estilo | Visual/a11y | Grátis↔Pago | Estado |
|---|---|---|---|---|---|---|
| M3 | ok | ok (ficha 2 ilustrativa) | autor | axe ok; LH desempenho 80 | n/a | verificado, com ressalva de desempenho |
| M0, M1, M2 | | | | | | em andamento |

## Fase 0, o que foi feito

- Briefing lido por inteiro.
- Ambiente: Claude Code 2.1.323, Node 24.19, git 2.55, `gh` autenticado, Playwright 1.65.
- Índice oficial lido: 250 entradas em `llms.txt`, 203 páginas únicas, todas em `.docs-cache/en/` (HTTP 200).
- Página oficial de comandos: 121 linhas de tabela (a reconciliar com o snapshot do briefing na Fase 4).
- Repositório git criado; stack e direção de design em `DECISIONS.md` (D001–D005).

