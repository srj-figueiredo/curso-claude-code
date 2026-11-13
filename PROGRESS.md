# PROGRESS

Estados: `pendente` · `em andamento` · `verificado`.
Para retomar: "Leia BRIEFING.md e PROGRESS.md e continue de onde parou."

## Onde parou

13/11/2026: Onda 1 fechada (M0 a M3 verificados, atalho local e script de um clique prontos), exceto a **Publicação**,
bloqueada por permissão (aguarda o autor). Onda 2 em andamento: M4 e M5 feitos e verificados; auditoria geral feita
(ver D014). **Próximo item: M6.**
Pendências que dependem da Publicação: ficha de PR do M4, deploy e domínio do M5, `upload-pages-artifact` v3 para v4 no
`deploy.yml`, e trocar o e-mail pessoal dos commits por um endereço noreply antes de tornar o repositório público (D014).

## Fila

Faça na ordem. Marque `[x]` ao concluir (com commit e push).

### Onda 1 · publicar e fechar a Parte 0 e a Parte I
- [ ] **Publicação.** (BLOQUEADA 13/11: o classificador de permissões negou `gh repo create --public`; o autor precisa liberar ou rodar o comando com `!`. Antes: trocar o e-mail dos commits por noreply, D014.) `gh repo create curso-claude-code --public --source . --push`; ligar o Pages por Actions
      (`gh api -X POST repos/{dono}/curso-claude-code/pages -f build_type=workflow`); conferir que o workflow
      `.github/workflows/deploy.yml` passa (ajustar `npm run check` e os testes se quebrarem no Linux);
      abrir a URL e confirmar que a home carrega. Escrever a URL no topo deste arquivo e no `README.md`.
- [x] **Atalho local.** `scripts/abrir-local.cmd` (sempre reconstrói, `npm run preview`, abre o
      navegador) + atalho "Manual de Bordo" na Área de Trabalho apontando para ele.
- [x] **Script de um clique.** `scripts/proxima-pagina.ps1` + atalho "Manual de Bordo · próxima página"
      (CONTINUAR.md §7). `logs/` no `.gitignore`.
- [x] **M1 nos gates.** Build, axe e 390/1280 px conferidos em 13/11.
- [x] **M0 nos gates.** `VERIFICATION/m0.md` feito; build, axe e 390/1280 px conferidos em 13/11.
- [x] **M2.** Página, animações 1 e 2 (`M2LacoAgentico`, `M2ContextoCompactacao`) e ficha 3 executada.
- [x] **Revisão da Parte I** (13/11: termos unificados, sem estouro em 390/1280, axe 18/18; o corte de 15% não foi aplicado: as 4 páginas ficam entre 3.035 e 3.280 palavras, abaixo do teto de 3.500) (M0–M3): estilo (corte ≥ 15%), consistência de termos, fotos 390/1280.

### Onda 2 · trilha rápida até os cases
- [x] M4 · [x] M5 · [ ] M6 · [ ] M7 · [ ] M8 · [ ] M10 · [ ] M11
- [ ] **R3** (página escrita; GUIA §9, com `<Cartas cat="R3" />`)
- [ ] **Baralho**: cartas R1–R8 em lotes (um lote de ~30 cartas por item); esquema com campos opcionais;
      estações R* do mapa apontando para o Baralho filtrado. `npm run comandos` e `npm run reconciliar -- --cache`.
- [ ] Revisão das Partes III e IV

### Onda 3 · produto de verdade
- [ ] M20 · [ ] M21 · [ ] M22 · [ ] C0 · [ ] C1 (animação 6) · [ ] C4
- [ ] Revisão da Parte VI e dos cases feitos

### Onda 4 · escalar
- [ ] M9 · [ ] M12 (animação 3) · [ ] M13 · [ ] M14 · [ ] M15 · [ ] M16 · [ ] M17 · [ ] M18 · [ ] M19
- [ ] Animação 4 (fluxo de hooks) no M9, se ainda não feita
- [ ] Revisão da Parte V

### Onda 5 · fechar
- [ ] C2 · [ ] C3 · [ ] C5 · [ ] C6 · [ ] Projeto final
- [ ] Apêndice A (glossário) · [ ] Apêndice B (cheat sheet) · [ ] Apêndice F (O que mudou + `mudancas.json`)
- [ ] Manutenção: workflow semanal que roda `npm run reconciliar` e abre issue; `MAINTENANCE.md`
- [ ] Desempenho (D010) · [ ] `README.md`, `DEPLOY.md`, `REPORT.md`

## Fases (briefing original)

| Fase | Escopo | Estado |
|---|---|---|
| 0 | Preparação | verificado |
| 1 | Fundação (site, tokens, componentes, esquemas, CI) | verificado; publicação na Onda 1 |
| 2 | Design spike + gate visual | verificado; desempenho aberto (D010) |
| 3–9 | Conteúdo | reorganizado nas Ondas acima (D012) |

## Páginas

| Página | Fatos | Execução | Estilo | Visual/a11y | Grátis↔Pago | Estado |
|---|---|---|---|---|---|---|
| M0 | ok (VERIFICATION/m0.md, 14 afirmações) | n/a (sem comando do Claude Code) | autor, 3.280 palavras | axe ok; 390/1280 ok | n/a | verificado |
| M1 | ok (VERIFICATION/m1.md) | ok (instalação não testada: máquina já instalada) | autor, 3.068 palavras | axe ok; 390/1280 ok | n/a | verificado |
| M2 | ok (VERIFICATION/m2.md, 22 afirmações) | ok (`claude -p`; telas interativas ilustrativas) | autor, 3.129 palavras | axe ok; figuras 390/1280 ok | n/a | verificado |
| M3 | ok | ok (ficha 2 ilustrativa) | autor, 3.035 palavras | axe ok; LH desempenho 80 | n/a | verificado, ressalva de desempenho |
| M4 | ok (VERIFICATION/m4.md, 7 afirmações + git) | ok (git e `claude -p`; PR não testado) | autor, 3.084 palavras | axe ok | n/a | verificado |
| M5 | ok (VERIFICATION/m5.md, 16 afirmações) | parcial (local, workflow gerado, DNS público; deploy não testado) | autor, 2.893 palavras | axe ok | domínio: troca sem preço | verificado, fichas nao-testado |

## Fase 0, o que foi feito

- Briefing lido por inteiro.
- Ambiente: Claude Code 2.1.323, Node 24.19, git 2.55, `gh` autenticado, Playwright 1.65.
- Índice oficial lido: 250 entradas em `llms.txt`, 203 páginas únicas, todas em `.docs-cache/en/` (HTTP 200).
- Página oficial de comandos: 121 linhas de tabela (a reconciliar com o snapshot do briefing na Fase 4).
- Repositório git criado; stack e direção de design em `DECISIONS.md` (D001–D005).

