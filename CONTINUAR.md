# CONTINUAR — como retomar o trabalho em qualquer sessão

Frase de retomada do autor, em qualquer sessão aberta nesta pasta:
**"Leia o CONTINUAR.md e continue o trabalho."**

Este arquivo manda no modo de trabalho. O `BRIEFING.md` continua sendo a fonte do conteúdo e da qualidade,
**exceto onde este arquivo o substitui** (escopo, economia e gates, abaixo). Decisões: `DECISIONS.md`.
Estado e fila: `PROGRESS.md`.

---

## 1. Ao abrir a sessão (sempre, nesta ordem)

1. Leia este arquivo inteiro e o `PROGRESS.md` (seções "Onde parou" e "Fila").
2. `git status --short` e `git log --oneline -5`. Arquivos sem commit são trabalho de sessão anterior
   interrompida: confira, termine e faça commit antes de começar item novo.
3. Pegue **o primeiro item não feito da Fila** e execute (seção 3). Ao terminar, faça o checkpoint
   (seção 5) e pegue o próximo. Continue até o limite de uso ou até o autor pedir para parar.
4. Não peça aprovação para nada que esteja na Fila: o autor já aprovou (seção 6).
5. Leia também o **`PENDENCIAS.md`**: o que está aberto e precisa do autor. Não tente contornar os itens bloqueados;
   lembre o autor deles no resumo final.

## 2. Economia (o autor usa o plano Pro)

- Modelo recomendado para escrever: **Sonnet**, esforço **medium**. Se a sessão estiver em outro modelo,
  siga assim mesmo; não troque o modelo sozinho.
- **Sem subagentes** para escrever páginas. Você mesmo escreve, uma página por vez.
- Leia da documentação só o que a página precisa: `Grep` em `.docs-cache/en/` e leitura de trechos.
  Nunca leia arquivos inteiros grandes da doc.
- Execução real (`claude -p`) **só para a Prova principal** de cada ficha. O resto vai marcado
  "conferido na documentação". Sessões `-p` curtas, sem repetir.
- Fotos de tela: só 390 e 1280 px, modo Papel, uma vez por **parte** (não por página).
- Não persiga Lighthouse de desempenho: a pendência está registrada (D010) e fica para o fim.
- Termine a página antes de começar outra. Página pela metade é o pior desperdício quando o limite bate.

## 3. Como fazer cada tipo de item

**Página (módulo M*, case C*, projeto final PF):** siga `docs/GUIA-DO-AUTOR.md` (seções 1 a 7), com duas
diferenças: (a) aqui **você mesmo** roda build, testes e commit (o guia proíbe isso a subagentes, não a você);
(b) as metas de volume valem, mas prefira o limite de baixo. Molde: `src/content/modulos/m3.mdx`.
Depois de escrever:

```bash
npm run build                 # precisa terminar sem erro
npx playwright test           # axe: zero violações sérias
```

**Página de case:** o esquema é o mesmo dos módulos (coleção `cases`, `src/content/cases/<id>.mdx`). Siga o
molde de case do BRIEFING §11 dentro da estrutura do guia (as seções do case viram `###` do Essencial; as
fichas cobrem a Trilha Grátis; `<Troca>` para cada TROCA POR PAGO, com preço só se conferido em fonte
oficial no dia, senão "consulte <link>").

**Item de infraestrutura:** está descrito na própria Fila.

## 4. Escopo aprovado (substitui o BRIEFING §7 onde diferir)

- **Fazem parte:** M0–M22, R3, Baralho de Comandos, C0–C6, Projeto final, Apêndice A (glossário),
  Apêndice B (cheat sheet) e Apêndice F (O que mudou), estes dois em versão mínima.
- **Parte II:** em vez de oito seções escritas, **uma página R3** (escrita, trilha rápida) **+ o Baralho**:
  as 117 cartas de `docs/comandos-por-secao.json`, em `src/content/comandos/partes/r1.json` … `r8.json`.
  Cartas curtas, em palavras próprias, conferidas em `.docs-cache/en/commands.md`; `quando_usar`,
  `exemplo` e `armadilha` podem ficar vazios (ajustar o esquema para opcionais e a Carta para escondê-los).
  As estações R1, R2, R4–R8 do mapa apontam para o Baralho filtrado pela seção.
- **Fora por agora:** apêndices C, D, E (exceto o necessário aos cases), G, H, I. Ficam "em obras" no mapa.

## 5. Checkpoint (ao fim de cada item)

1. Commit em português, no imperativo, terminando com as linhas de atribuição que o sistema indicar.
2. `git push` (depois que a publicação existir; seção 6). O GitHub Pages publica sozinho.
3. Atualize o `PROGRESS.md`: marque o item como feito na Fila, preencha a linha da tabela de páginas
   (gates), escreva em "Onde parou" uma frase dizendo o próximo item. Commit e push de novo.
4. Decisão nova relevante: uma entrada curta no `DECISIONS.md`.

Se o limite estiver perto (a sessão vai avisar, ou `/usage` mostra), faça o checkpoint **antes** de
começar outro item.

## 6. Autorizações dadas pelo autor (13/11/2026)

Valem para qualquer sessão que siga este arquivo:

- **Publicar:** criar o repositório **público** `curso-claude-code` na conta GitHub do autor (o `gh` já
  está autenticado nesta máquina), fazer push do branch `main`, ligar o GitHub Pages por GitHub Actions e
  fazer push a cada item concluído.
- **Atalho local:** criar na Área de Trabalho do autor um atalho "Manual de Bordo" que sobe o site local e
  abre o navegador.
- **Script sem supervisão:** criar e manter `scripts/proxima-pagina.ps1` (seção 7).

**Não autorizado:** gastar dinheiro, criar contas, mexer em outros repositórios, alterar a configuração
global do Claude Code (`~/.claude/settings.json`, `~/.claude.json`), instalar programas globalmente,
publicar em qualquer outro lugar. Nunca publique segredo, nem de teste.

## 7. O script de um clique

`scripts/proxima-pagina.ps1` roda uma sessão sem supervisão que segue este arquivo. Requisitos:

- Chama `claude -p "Leia o CONTINUAR.md e continue o trabalho. Faça um item da Fila e pare." --model sonnet`
  com `--permission-mode acceptEdits` e `--allowedTools` restrito a: `Bash(npm run *)`, `Bash(npx astro *)`,
  `Bash(npx playwright *)`, `Bash(node scripts/*)`, `Bash(python scripts/*)`, `Bash(git add *)`,
  `Bash(git commit *)`, `Bash(git push)`, `Bash(git status*)`, `Bash(git log*)`, `Bash(git diff*)`,
  `Bash(claude -p *)`. Nada de `rm -rf`, instalação ou rede além do git.
- Grava a saída em `logs/AAAA-MM-DD-HHMM.log` (pasta no `.gitignore`).
- Um atalho na Área de Trabalho, "Manual de Bordo · próxima página", roda o script com dois cliques.

## 7b. Se esta sessão estiver na nuvem (claude.ai/code)

Sinal: a pasta não é `C:\Users\<usuário>\...` e o sistema é Linux.

- `.docs-cache/` não vem no clone (está no `.gitignore` de propósito: não republicamos a documentação).
  Recrie-o com `node scripts/baixar-docs.mjs` (o ambiente precisa liberar `code.claude.com`). Sem o cache,
  não escreva conteúdo técnico.
- Itens que dependem desta máquina Windows ficam para uma sessão local: atalhos da Área de Trabalho,
  `proxima-pagina.ps1` e Provas que precisem de `claude -p` ou de PowerShell. Marque-os "pendente local"
  no `PROGRESS.md` e siga para o próximo item.
- A sessão na nuvem envia um branch, não o `main`. Ao fim de cada item, abra um PR para `main` (o autor
  aprova pelo celular) e diga isso no resumo.

## 8. Ritual de fim de sessão (se o autor pedir para parar)

Termine ou desfaça o item em curso (nunca deixe build quebrado no `main`), faça o checkpoint e responda com
um resumo de até 10 linhas: o que ficou pronto, o que vem a seguir, quantos itens faltam.
