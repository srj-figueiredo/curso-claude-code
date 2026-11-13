# PROGRESS

Estados: `pendente` · `em andamento` · `verificado`.
Para retomar: "Leia BRIEFING.md e PROGRESS.md e continue de onde parou."

## Onde parou

13/11/2026: modo de trabalho trocado para o do `CONTINUAR.md` (plano Pro, uma página por vez, sem subagentes).
M0 e M1 escritos e no commit, sem passar pelos gates. Atalho local e script de um clique feitos. Publicação bloqueada por permissão (aguarda o autor). M1 nos gates feito (e axe do M0 corrigido: `.fontes` saiu do content-visibility). Próximo item: M0 nos gates (falta `VERIFICATION/m0.md`).

## Fila

Faça na ordem. Marque `[x]` ao concluir (com commit e push).

### Onda 1 · publicar e fechar a Parte 0 e a Parte I
- [ ] **Publicação.** (BLOQUEADA 13/11: o classificador de permissões negou `gh repo create --public`; o autor precisa liberar ou rodar o comando com `!`.) `gh repo create curso-claude-code --public --source . --push`; ligar o Pages por Actions
      (`gh api -X POST repos/{dono}/curso-claude-code/pages -f build_type=workflow`); conferir que o workflow
      `.github/workflows/deploy.yml` passa (ajustar `npm run check` e os testes se quebrarem no Linux);
      abrir a URL e confirmar que a home carrega. Escrever a URL no topo deste arquivo e no `README.md`.
- [x] **Atalho local.** `scripts/abrir-local.cmd` (build se `dist/` não existir, `npm run preview`, abre o
      navegador) + atalho "Manual de Bordo" na Área de Trabalho apontando para ele.
- [x] **Script de um clique.** `scripts/proxima-pagina.ps1` + atalho "Manual de Bordo · próxima página"
      (CONTINUAR.md §7). `logs/` no `.gitignore`.
- [x] **M1 nos gates.** (build e axe ok 13/11; foto 390/1280 fica para o fim da Parte I) Conferir build, axe, uma foto em 390 px; ajustar o que destoar do M3.
- [ ] **M0 nos gates.** Falta `VERIFICATION/m0.md` (o autor foi interrompido): conferir as afirmações do M0
      contra a doc em cache e registrar; depois build, axe, foto.
- [ ] **M2.** Escrever do zero (só existe `lab/estados/m2-inicio/`; confira se serve ou apague). Tem as
      animações 1 (loop agêntico) e 2 (contexto e compactação): ver BRIEFING §6.4. Cada uma vira componente em `src/components/figuras/` usado com
      `<Figura passos={N} legendas={[…]}>`; elementos com `data-de="N"` aparecem a partir do passo N; o estado
      final precisa funcionar como figura estática.
- [ ] **Revisão da Parte I** (M0–M3): estilo (corte ≥ 15%), consistência de termos, fotos 390/1280.

### Onda 2 · trilha rápida até os cases
- [ ] M4 · [ ] M5 · [ ] M6 · [ ] M7 · [ ] M8 · [ ] M10 · [ ] M11
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
| M3 | ok | ok (ficha 2 ilustrativa) | autor | axe ok; LH desempenho 80 | n/a | verificado, ressalva de desempenho |
| M1 | ok (VERIFICATION/m1.md) | ok (instalação não testada: máquina já instalada) | autor | axe ok; foto pendente | n/a | escrito |
| M0 | sem registro | pendente | autor | axe ok; foto pendente | pendente | escrito, falta verificação |

## Fase 0, o que foi feito

- Briefing lido por inteiro.
- Ambiente: Claude Code 2.1.323, Node 24.19, git 2.55, `gh` autenticado, Playwright 1.65.
- Índice oficial lido: 250 entradas em `llms.txt`, 203 páginas únicas, todas em `.docs-cache/en/` (HTTP 200).
- Página oficial de comandos: 121 linhas de tabela (a reconciliar com o snapshot do briefing na Fase 4).
- Repositório git criado; stack e direção de design em `DECISIONS.md` (D001–D005).

