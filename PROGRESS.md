# PROGRESS

**Site publicado:** https://srj-figueiredo.github.io/curso-claude-code/  
**Repositório:** https://github.com/srj-figueiredo/curso-claude-code  
Identidade visual nova (13/11/2026): ver D016.  
Publicado em 13/11/2026; cada push no `main` roda o CI (check, build, axe) e publica sozinho.

Estados: `pendente` · `em andamento` · `verificado`.
Para retomar: "Leia BRIEFING.md e PROGRESS.md e continue de onde parou."

## Onde parou

13/11/2026, **mudança de rumo (D017):** o autor avaliou que os módulos liam como manual e definiu o público: **não programadores
que querem vender serviços a pequenas empresas**. O curso passa de módulos por recurso para **Temporadas por projeto**.
Roteiro aprovado em `docs/ROTEIRO-V2.md`; o mapa de conceitos dos módulos antigos está em `docs/MAPA-DE-CONCEITOS.md`
(gerado por `node scripts/mapa-de-conceitos.mjs`; regra: nenhum conceito pode ficar sem destino até o fim).

- **Piloto M7** reescrito (cena, analogias, referência recolhida): publicado, aguardando avaliação final do autor.
- **Temporada 1 (Primeiro cliente), escrita e verificada:** T1A, T1B, T1C, T1D (`src/content/modulos/t1*.mdx`, cliente fictício
  Doce Esquina, labs `lab/estados/t1*`). Cada estação abre com `<Conceitos>` (o que vai aprender e o que só ouve falar, com link
  para o módulo de referência). A ficha 4 da T1D (publicar no GitHub Pages) é `nao-testado`.
- **Domínio e entrega (D018):** cada estação termina com teste de domínio (cliente Studio Lia), rubrica e material de entrega; a T1D fecha com o projeto final da Lia. `<Arquivo>` mostra a receita (briefing, conferir.mjs) e a T1A tem a ficha "Mexa na receita".
- **Módulos antigos (M0 a M8, M10) continuam no ar como Referência.** M9 e M11 (Planejar e verificar) entram reescritos dentro das
  Temporadas (M11 em T1 e T5; M9 em T2). O estado `lab/estados/m11-inicio/` fica guardado para quando chegar a hora.
- **Temporada 2 (Sistema do cliente), escrita e verificada:** T2A (dados de verdade), T2B (login, papéis e segredos), T2C (hooks e skills), T2D (backup, LGPD básica e entrega). Cliente Oficina Boa Estrada; projeto final: agenda do Studio Lia. Verificação em `VERIFICATION/t2.md`. Labs `lab/estados/t2*`.
- **Temporada 3 (Atendimento com IA), escrita e verificada:** T3A (base, simulador, provedor local), T3B (guardrails, limite, privacidade), T3C (provedor da API paga, testado só contra servidor falso; fita "Troca por pago"), T3D (avaliação com nota antes de corrigir, relatório, manutenção e entrega). Cliente Pet Shop Patas Felizes; projeto final: atendente do Studio Lia. Verificação em `VERIFICATION/t3.md`. Labs `lab/estados/t3*`.
- **Guias antigos renomeados (D019):** sem códigos M, R, C no mapa, na navegação e no texto.
- **Estações divididas em partes (D022):** as 12 estações viraram 30 páginas de 40 a 80 minutos (t1a, t1a-2...). O mapa mostra um ponto por estação.
- **Próximo:** Temporada 4 (automação com IA e relatórios). A API real, o WhatsApp oficial e a hospedagem 24 horas seguem não testados (PENDENCIAS 7.14 a 7.17).

Pausa anterior (limite do plano): M0 a M8 e M10 estão escritos e verificados; a Publicação saiu em 13/11/2026.

## Retomar o M11 (Planejar e verificar)

Pesquisa já feita (fontes em `.docs-cache/en/`): `best-practices.md` (prompt específico, "Brainstorm with Claude first",
"Give Claude a check to run", "Review against your spec", Stop hook, "Steer the session", "What you can stop doing"),
`goal.md`, `skills.md` § Run and verify your app (`/run`, `/verify`, `/run-skill-generator`) e `commands.md` (`/goal`, `/verify`,
`/run`, `/debug`, `/simplify`, `/code-review`). Pontos já confirmados na doc:

- `/debug [descrição]` liga o log de depuração **do Claude Code** e analisa esse log: serve para diagnosticar problemas da
  sessão (skill que não dispara, MCP que não conecta), **não** para caçar bug no código do aluno. A ficha "caçar um bug"
  do briefing deve usar pedido + teste que reproduz, e mostrar o `/debug` num caso de configuração (skill com YAML quebrado).
- `/goal <condição>`: um avaliador (modelo pequeno) confere a condição depois de cada turno; condição de até 4.000 caracteres;
  funciona em `claude -p` (roda o laço até o fim); `/goal clear` limpa; cláusula "ou pare depois de N turnos".
- `/simplify` não procura bugs (4 agentes: reuso, simplificação, eficiência, nível de abstração); `/code-review` procura bugs
  e aceita `low`..`max`, `--fix`, `--comment`; `/review` é alias.
- `/verify` e `/run` constroem e rodam o app (CLI, servidor, TUI, navegador); `/run-skill-generator` grava a receita em
  `.claude/skills/run-<nome>/`.
- Dica "o que nunca delegar" e anti-padrões: "What you can stop doing" (best-practices.md) e BRIEFING §M11.

Experimentos já executados em `claude -p` (laboratório em pasta temporária, apagada ao reiniciar; refazer se precisar):

1. **Modo plano com SPEC.md** (`--permission-mode plan`, "leia @SPEC.md e proponha um plano... não edite nada"): devolveu um
   plano com arquivos tocados e ordem; `git status` mostrou só o `SPEC.md` novo (nada editado). 8 turnos.
2. **`/goal` em `-p`**: condição "existem `buscar`, `contar` e `limparFeitas` exportadas de `src/pendencias.js` e `npm test` e
   `node ferramentas/cobertura.mjs` saem com 0... ou pare depois de 8 turnos" (com `--permission-mode acceptEdits` e
   `--allowedTools "Bash(npm test)" "Bash(node ferramentas/cobertura.mjs)"`). Resultado: 13 turnos, 5 chamadas negadas (o Claude
   tentou comandos compostos com `echo $?`, que a allowlist não cobre, e disse isso honestamente); conferência independente:
   `npm test` pass 13, `cobertura.mjs` exit 0, +18 linhas em `src/pendencias.js` e testes novos.
3. **Testes primeiro** (`--output-format stream-json --verbose` + parser de eventos): **interrompido pelo limite do plano** no
   passo 8. Parou depois de escrever os testes e rodar `npm test` (que falhou, como esperado: `buscar` ainda não existia).
   Refazer do zero: extrair `m11-inicio`, criar o `SPEC.md` da busca (`buscar <texto>`, "Nada encontrado.", regra em
   `src/pendencias.js`), e pedir "testes primeiro: escreva os testes, rode e mostre que falham, só então implemente".
4. **Ainda não executados:** `/verify`, `/code-review low`, `/simplify`, `/debug` num caso de skill quebrada, e a ficha do bug
   do `relatorio.mjs`.

Plano de fichas sugerido (4): (1) spec, plano e testes primeiro para o comando `buscar`; (2) objetivo longo com `/goal` e
`cobertura.mjs`; (3) caçar o bug do `NaN%` (pedido com sintoma + teste que reproduz) e usar `/debug` num caso de configuração;
(4) verificação por quem não escreveu o código (`/code-review`, `/verify`, `/simplify`).

Depois do M11, a Fila segue: R3, Baralho, Revisão das Partes III e IV (Onda 2); depois a Onda 3. **Lembrete:** ao terminar cada
módulo, fazer o double check (CONTINUAR.md §3b) e citar sempre "M11 (Planejar e verificar)" com o nome ao falar com o autor.

## Fila

Faça na ordem. Marque `[x]` ao concluir (com commit e push).

### Onda 1 · publicar e fechar a Parte 0 e a Parte I
- [x] **Publicação (feita 13/11/2026; o autor rodou o `gh repo create`).** (era: BLOQUEADA 13/11: o classificador de permissões negou `gh repo create --public`; o autor precisa liberar ou rodar o comando com `!`. Antes: trocar o e-mail dos commits por noreply, D014.) `gh repo create curso-claude-code --public --source . --push`; ligar o Pages por Actions
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
- [x] M4 · [x] M5 · [x] M6 · [x] M7 · [x] M8 · [x] M10 · [ ] M11 (em andamento, ver "Retomar o M11")
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
| M6 | ok (VERIFICATION/m6.md, 19 afirmações) | ok (`claude -p`: /init, A/B, memória, /doctor; telas interativas não testadas) | autor, 3.279 palavras | axe ok | n/a | verificado |
| M7 | ok (VERIFICATION/m7.md, 28 afirmações) | ok (`claude -p`: .env, allowlist, precedência, injection; sandbox não testado) | autor, 3.336 palavras (Essencial + fichas) | axe ok | n/a | verificado, ficha 4 nao-testado |
| M8 | ok (VERIFICATION/m8.md, 21 afirmações) | ok (`claude -p`: skill de commit, argumentos, `paths`, custo; telas interativas não testadas) | autor, 2.949 palavras (Essencial + fichas) | axe ok | n/a | verificado |
| M10 | ok (VERIFICATION/m10.md, 16 afirmações) | ok (`claude -p`: servidor MCP próprio, ferramenta, prompt, recurso, deny, strict; n8n e Playwright nao-testado) | autor, 2.839 palavras (Essencial + fichas) | axe ok | n/a | verificado, ficha 4 nao-testado |

## Fase 0, o que foi feito

- Briefing lido por inteiro.
- Ambiente: Claude Code 2.1.323, Node 24.19, git 2.55, `gh` autenticado, Playwright 1.65.
- Índice oficial lido: 250 entradas em `llms.txt`, 203 páginas únicas, todas em `.docs-cache/en/` (HTTP 200).
- Página oficial de comandos: 121 linhas de tabela (a reconciliar com o snapshot do briefing na Fase 4).
- Repositório git criado; stack e direção de design em `DECISIONS.md` (D001–D005).

