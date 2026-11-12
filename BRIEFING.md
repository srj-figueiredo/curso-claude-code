# BRIEFING — Curso interativo de Claude Code (HTML, estilo livro)

Para: Claude Code · Modelo: Claude Fable 5.2 (`claude-fable-5-2`) · Dono do projeto: Sergio Figueiredo
Briefing de 12/11/2026 · Claude Code na época: série 2.1.28x (a documentação já cita requisitos da v2.1.287)

---

## 0. Como usar este arquivo (instruções para o humano)

1. Crie uma pasta vazia `curso-claude-code/` e salve este arquivo nela como `BRIEFING.md`.
2. Abra o Claude Code na pasta: `claude --model claude-fable-5-2` (ou `/model` dentro da sessão; o Fable exige acesso liberado na conta). Depois `/effort xhigh`.
3. Primeira mensagem: **"Leia o BRIEFING.md inteiro e execute todas as fases na ordem, sem pedir aprovação, seguindo a seção 4."**
4. Trabalho longo. Se o limite de uso acabar, o estado fica em `PROGRESS.md`. Para retomar: "Leia BRIEFING.md e PROGRESS.md e continue de onde parou." Acompanhe com `/usage`.
5. Rode numa pasta isolada. Prefira `/sandbox` ou o modo de permissões do seu gosto; não use bypass total.

---

## 1. Missão

Construir um **curso completo, prático e interativo de Claude Code**, como **site estático em HTML**, que seja:

- **Melhor explicado e mais interativo** que a documentação oficial. Não a substitui: aprofunda, organiza e coloca a mão na massa.
- **Estilo livro**: texto e imagens, sem vídeos. Código pronto para copiar. No máximo 6 animações (motions) geradas por você, listadas na seção 6.
- **Visualmente impressionante e realmente diferente** de tudo que se vê em cursos na internet (seção 6).
- **Profundo e direto ao ponto ao mesmo tempo** (seção 3).
- **Gratuito primeiro**: todo exercício e case roda com custo zero (exceto o acesso ao próprio Claude Code, que é pré-requisito pago), com a indicação clara de onde trocar por solução paga (seção 10).
- **Sempre verdadeiro e datado**: cada afirmação técnica conferida na documentação oficial e na CLI instalada; selo de versão em tudo; página "O que mudou" e rotina de manutenção.

Público: brasileiros, do iniciante curioso ao profissional que quer vender serviços com IA. Língua: **português do Brasil**.

Tom: explicativo e informal, como um amigo experiente conversando; humor inteligente e refinado, dosado. **Proibido**: "Ótima pergunta!", "Claro!", "Neste capítulo veremos…", linguagem corporativa, jargão sem explicação, enrolação.

**Definição de pronto do projeto**: seção 14.

---

## 2. Decisões já tomadas (não reabrir)

- Estrutura de partes/módulos da seção 7 está **aprovada**. Pode melhorar o conteúdo interno; não remova nem renomeie módulos sem registrar o motivo em `DECISIONS.md`.
- O "dissecado" do menu `/` fica **logo após o M3** (Parte II).
- Os **6 cases** (C1 a C6) saíram de um levantamento de demanda no Workana (seção 11). Lista fechada.
- Telas do Claude Code são **mockups HTML fiéis** (não prints), derivados de sessões reais (seção 6.6).
- **M19 (Claude Code na empresa) fica.**
- Selo de versão por módulo + página "O que mudou" + rotina de manutenção (seção 13).
- O curso é **independente**: não afiliado nem endossado pela Anthropic. Sem logotipos ou marcas da Anthropic como identidade visual. "Claude" e "Claude Code" aparecem apenas de forma nominativa. Aviso no rodapé de todas as páginas.

---

## 3. Princípios inegociáveis de conteúdo

1. **Verdade primeiro.** Fonte de verdade: documentação oficial (`https://code.claude.com/docs/llms.txt` e páginas ligadas) + comportamento real da CLI instalada (`claude --version`, `/help`, `/doctor`). **Nunca invente** comando, flag, evento de hook, campo de frontmatter ou preço. Se não conseguir verificar, marque "não verificado em DATA" ou omita. Nenhum recurso é descrito de memória.
2. **Direto ao ponto.** Todo módulo abre com um **TL;DR de 3 linhas** (o que você vai conseguir fazer). Frases curtas (média ≤ 22 palavras). Zero aquecimento, zero repetição. Cada parágrafo ganha o direito de existir.
3. **Profundo em camadas.** Camada **Essencial** (sempre visível, resolve 90%), camada **Por baixo do capô** (colapsável: como funciona de verdade, limites, custos), camada **Armadilhas** (erros que realmente acontecem). Quem quer rapidez lê só a primeira; quem quer maestria desce.
4. **Mão na massa.** Nada de módulo só teórico. Cada módulo tem 2–4 exercícios executáveis com "prova de que funcionou". O leitor aprende fazendo no **projeto-laboratório** (seção 12).
5. **Grátis primeiro, pago como troca explícita** (seção 10).
6. **Fiel à versão.** Selo `verificado em vX.Y.Z · DD/MM/AAAA` em cada módulo, cada cartão de comando e cada exercício. Recurso beta/experimental/dependente de plano recebe selo próprio.
7. **Honestidade sobre limites.** Se um recurso exige plano que você não tem (Team, Enterprise, créditos de ultrareview, app desktop/mobile), escreva "descrito com base na documentação de DATA; não testado localmente". Jamais finja ter testado.
8. **Palavras próprias.** Não copie trechos da documentação nem de artigos. Reescreva, explique melhor, **cite a fonte com link**. Citações literais: raras e curtas.
9. **Sem pendências.** Se houver dúvida, **decida**, registre em `DECISIONS.md` (decisão, alternativas, motivo) e siga. Não deixe item aberto nem peça aprovação repetida. Única exceção: ação irreversível fora do repositório (comprar domínio, gastar dinheiro, publicar em nome do autor). Nesses casos, prepare tudo, pare e relate.
10. **Segurança e privacidade.** Nenhum segredo real em lugar nenhum. Nenhum dado pessoal real. Clientes e dados dos cases são **fictícios**. Exemplos de segredo usam valores falsos obviamente falsos.

---

## 4. Modo de trabalho (como você executa)

**Arquivos de controle na raiz (crie na Fase 0):**
- `PROGRESS.md`: ledger de fases/módulos (pendente, em andamento, verificado), o que falta, onde parou.
- `DECISIONS.md`: toda decisão relevante.
- `VERIFICATION/`: um arquivo por módulo listando cada afirmação técnica, a fonte (URL ou comando executado) e o resultado.
- `REPORT.md`: relatório final (seção 15).

**Fluxo por fase:** planeje (`/plan`) → execute → verifique → commit. Use `/goal` com condição mensurável por fase (ex.: "Fase 3 concluída quando M0–M3 tiverem os 5 gates da seção 14 aprovados"). Commits pequenos e frequentes, mensagens em português no imperativo.

**Paralelize com seus próprios recursos (e registre o que aprender, vira conteúdo do M12):**
- Um **subagente autor por módulo**, cada um com o molde da seção 8 e a lista de fontes do módulo, em **worktrees** separados.
- Um **subagente verificador independente** que não viu a redação: confere cada afirmação contra a documentação e executa todo comando e exercício num diretório limpo.
- Um **subagente de estilo** que corta enrolação (meta: remover ≥ 15% do texto do primeiro rascunho sem perder informação).
- Um **subagente de design/QA visual** que tira screenshots (via navegador/Playwright MCP ou `/claude-in-chrome`) em 390, 768, 1280 e 1920 px, claro e escuro, e critica.
- Use `/code-review`, `/simplify` e `/verify` antes de fechar cada fase.
- Você, agente principal, é o integrador: mantém consistência de tom, termos, selos e navegação.

**Limites de uso:** o trabalho é grande. Faça checkpoint no `PROGRESS.md` ao fim de cada módulo. Prefira terminar módulos inteiros a deixar muitos pela metade.

**Fases (gates obrigatórios entre elas):**
- **Fase 0, Preparação:** ler este briefing; `claude --version`; listar skills instaladas (`/skills`) e **usar a skill de front-end/design instalada** (se nenhuma, a `frontend-design`); buscar e ler o índice oficial; criar repositório git, arquivos de controle, `DECISIONS.md` com a stack escolhida.
- **Fase 1, Fundação:** esqueleto do site, tokens de design, componentes base, esquemas de dados (módulos e `commands.json`), CI, deploy gratuito.
- **Fase 2, Design spike:** home, mapa do metrô, 1 página de módulo completa (use o M3), 1 cartão de comando, 1 terminal-replay. **Gate visual**: screenshots + crítica + correção. Só escale depois.
- **Fase 3:** M0 a M3 completos, com starters/gabaritos do laboratório.
- **Fase 4:** Parte II, dissecado R1 a R8.
- **Fase 5:** M4 a M11.
- **Fase 6:** M12 a M19.
- **Fase 7:** M20 a M22 + Tabela Grátis↔Pago verificada.
- **Fase 8:** C0, C1 a C6, projeto final.
- **Fase 9:** apêndices, busca, impressão/PDF, "O que mudou", automação de manutenção, QA geral, `REPORT.md`.

---

## 5. Stack e arquitetura do site

**Padrão (mude só com justificativa em `DECISIONS.md`):**
- **Astro** + **MDX** (content collections tipadas). Gera HTML estático; JS só onde há interatividade ("islands").
- TypeScript mínimo. CSS próprio com variáveis (tokens); sem framework de UI pesado.
- Busca: **Pagefind** (estática, gratuita). Atalho: tecla `/` abre a busca, homenagem ao menu do Claude Code.
- Progresso do aluno: `localStorage` (por id de módulo/exercício), com **exportar/importar JSON**. **Sem tracking.** Sem cookies. Analytics, se houver, privacy-friendly e gratuito (verificar opções).
- Hospedagem gratuita: GitHub Pages ou Cloudflare Pages (verificar termos vigentes de uso comercial e registrar). Deploy por GitHub Actions.
- Fontes **self-hosted** (Fontsource ou equivalente), com subset e `font-display: swap`.
- Funciona **sem JS para leitura** (JS melhora, não é requisito).
- Estrutura sugerida: `src/content/modulos/*.mdx`, `src/content/comandos/commands.json`, `src/content/cases/*.mdx`, `src/components/*`, `src/styles/tokens.css`, `public/`, `lab/` (projeto-laboratório, seção 12), `scripts/` (verificação, sincronização com a doc), `VERIFICATION/`.

**Frontmatter obrigatório de módulo:** `id`, `titulo`, `parte`, `ordem`, `minutos`, `pre_requisitos[]`, `objetivos[]`, `verificado_em_versao`, `verificado_em_data`, `status` (estável|beta|depende-de-plano), `trilhas[]`, `exercicios[]` (id, titulo, minutos, custo: gratis|opcional-pago).

**Distribuição:** site estático público por padrão. Deixe a estrutura pronta para, no futuro, restringir acesso (ex.: Cloudflare Access) sem reescrever. Isso entra na Tabela Grátis↔Pago, não implemente agora.

---

## 6. Direção de design (aqui está a diferença do curso)

**Conceito: "Manual de Bordo"** — um livro-instrumento. A elegância editorial de um manual técnico bem impresso fundida com a vida de um terminal. Não é "site de curso". É um objeto que dá vontade de folhear.

### 6.1 Linguagem visual
- **Modo Papel (padrão):** fundo off-white quente com granulado muito sutil (SVG/CSS inline, minúsculo), tinta quase preta azulada, **um** vermelho-sinal para comandos e interação, **um** amarelo marca-texto usado com parcimônia, **um** verde "verificado" só para selos. Aparência de impressão em duas cores.
- **Modo Console (escuro):** quase preto com tom quente, texto cor de osso, acento âmbar/vermelho-sinal. Nada de neon, nada de roxo, nada de ciano "cyberpunk".
- **Tipografia:** uma serifada de display com personalidade (ex.: Fraunces com eixos ópticos ou Instrument Serif), uma serifada de leitura confortável (ex.: Newsreader ou Source Serif 4), uma mono excelente (ex.: JetBrains Mono, IBM Plex Mono ou Commit Mono). Todas open-source. **Proibido**: Inter, Roboto, Arial, system-ui como identidade.
- **Numerais gigantes** nas aberturas de módulo (placas de capítulo), com contorno/offset de impressão.
- **Ilustrações**: todas autorais em SVG, traço único e consistente, texturas de retícula (halftone) via CSS. **Sem fotos de banco, sem ilustrações genéricas de "IA".**
- **Microcopy** com humor refinado, curto.

### 6.2 Layout de livro
- Coluna de leitura de ~62–68 caracteres, margens generosas.
- **Notas laterais (sidenotes)** estilo Tufte no desktop; viram notas inline recolhíveis no celular.
- Cabeçalho corrido com parte, módulo e **selo de versão**. Barra de progresso como **fita de marcador de página**.
- **Abas de profundidade** (Essencial / Por baixo do capô / Armadilhas) com visual de orelhas de livro.
- **Mobile-first de verdade**: o autor lê no celular. Blocos de código com rolagem horizontal suave, botão copiar grande, alvos de toque ≥ 44 px, sidebar vira gaveta.

### 6.3 Componentes-assinatura (todos obrigatórios)
1. **Mapa do Metrô**: o curso inteiro como mapa de metrô em SVG. Linhas = partes, estações = módulos, estações preenchidas = concluídas, "trem" marca a posição atual. Na home (grande) e na navegação (mini). Hover/toque mostra tempo, pré-requisitos, trilha.
2. **Baralho de Comandos** (Parte II): cada comando do menu `/` é uma **carta** com a barra gigante como glifo. Filtros por categoria e plano, busca, carta que vira para o detalhe, carimbo "já usei" com contador ("você já usou 23 de 104").
3. **Terminal-Replay**: mockup fiel do Claude Code que "digita" e responde, com **play/pausa/scrubber** e versão estática (reduced-motion). Dados vêm de transcrições reais (6.6).
4. **Anatomias**: figuras SVG anotadas (janela de contexto, pasta `.claude`, precedência de settings, ciclo de vida de hooks). Chamadas numeradas ligadas ao texto.
5. **Selos/carimbos**: `VERIFICADO vX · data`, `BETA`, `PLANO: Pro+`, `NÃO TESTADO LOCALMENTE`, e a fita **`TROCA POR PAGO`** (seção 10).
6. **Ficha de Campo** (exercício): objetivo, tempo, pré-requisitos, passos numerados, **Prova de que funcionou** (comando + saída esperada), gabarito colapsável (sem spoiler por padrão), caixa "Deu erro?", desafio extra, marcar como feito.
7. **Diff viewer** leve para antes/depois.
8. **Seletor de sistema** (Mac / Windows / Linux) persistente que troca comandos em todo o curso.

### 6.4 Movimento (máximo 6 animações; propositais)
Todas em SVG/CSS/JS leve, com play/pausa/scrubber e **fallback estático**; respeitam `prefers-reduced-motion`; sem scroll-jacking.
1. Loop agêntico (coletar → agir → verificar).
2. Janela de contexto enchendo e a compactação (`/compact`).
3. Subagentes em paralelo com worktrees.
4. Fluxo de hooks (eventos e decisões).
5. Abertura do Mapa do Metrô (home).
6. Fluxo do chatbot: webhook → LLM → resposta → repasse a humano (C1).
Transições entre páginas sutis (View Transitions com fallback).

### 6.5 Home
Uma "capa de livro" viva: título em display gigante, mini-terminal digitando o primeiro comando do curso, o Mapa do Metrô se desdobrando, escolha de **trilha** (Rápida para Cases / Completa / Empresa) e retomada de onde o aluno parou.

### 6.6 Fidelidade dos mockups
Rode o Claude Code de verdade durante a construção, capture as saídas (ex.: `script`, `asciinema` ou `claude -p` com saída estruturada) em `transcripts/` com versão e data, e gere os mockups a partir delas. Um script regenera os mockups quando a versão mudar. Reproduza elementos reais da interface (pedido de permissão, chamadas de ferramenta, diffs, spinner, barra de status) **como observados**, nunca de memória.

### 6.7 Anti-padrões (proibidos)
Gradiente roxo-azul, glassmorphism, grade de cards arredondados com sombra genérica, hero com ilustração de robô/cérebro, tipografia padrão de template, emoji como ícone (use SVG próprio), seções "Por que escolher este curso", imagens de banco, lorem ipsum, animação decorativa sem função.

### 6.8 Qualidade técnica do visual
WCAG 2.2 AA (contraste, foco visível, navegação por teclado, landmarks, `alt`), Lighthouse ≥ 95 em todas as categorias nas páginas principais, CLS ≈ 0, sem layout que pule, imagens/SVG otimizados, JS total enxuto. Teste com axe-core (Playwright) no CI.

### 6.9 Processo de design
Faça o **design spike (Fase 2)**: tokens + tipografia + componentes em todos os estados + home + M3 completo + 1 carta + 1 replay. Screenshots nos 4 tamanhos × 2 temas, crítica do subagente de design, correções, **só então** escale. Registre a direção final em `DECISIONS.md`. Se a primeira direção ficar genérica, descarte e refaça. O padrão de qualidade é "isto parece feito por um estúdio de design editorial", não "parece um tema".

> Observação: este projeto é a exceção explícita à preferência do autor por HTML simples no dia a dia. Aqui o nível é **profissional e elaborado**, por pedido expresso.

---

## 7. Estrutura final do curso

**Trilhas:** *Rápida para Cases* (M0–M3, R3, M4–M8, M10–M11, M20–M22, C0–C6) · *Completa* (tudo) · *Empresa* (M0–M3, M6–M7, M12, M16, M18–M19). Navegação livre; trilhas só filtram e recomendam.

**Parte 0 — Antes de começar**
- **M0. Mapa do Claude Code e regras do jogo.** O que é (agente que lê, edita, roda e verifica); onde roda (terminal, VS Code, JetBrains, desktop, web/cloud, celular, Chrome, Slack, SDK); qual ferramenta para quê (chat para estratégia e planejamento; Claude Code para executar); como usar o curso; trilhas; selo de versão; **o pré-requisito pago inescapável** e custos reais; glossário inicial. EXERCÍCIO: kit de partida (conta/plano, terminal, GitHub, editor) e escolha da trilha.

**Parte I — Fundamentos**
- **M1. Instalação e primeiro contato.** Terminal para leigo (abrir, `pwd`, `ls`, `cd`); instalação nativa, Homebrew, WinGet, apt/dnf/apk; **trilha Windows** (PowerShell vs CMD, Git for Windows, WSL); PATH; `claude --version`; login e planos (Pro/Max/Team/Enterprise/Console) e provedores de nuvem (visão rápida); app desktop e extensão VS Code como alternativas; tour da interface; troubleshooting de instalação. EXERCÍCIOS: instalar e verificar; primeira tarefa real (criar uma página "Olá" e abrir); sessão interativa vs pergunta única vs `-p`.
- **M2. Como o Claude Code pensa.** Loop agêntico; ferramentas internas (confira na referência oficial de ferramentas); janela de contexto (o que entra e o que sobrevive à compactação); prompt caching (por que trocar modelo/esforço no meio custa); modelos, esforço e thinking; limites. EXERCÍCIOS: encher o contexto de propósito e medir com `/context`; compactar com instruções; observar o efeito do cache.
- **M3. Conduzindo no dia a dia.** Anatomia de um bom prompt (objetivo, restrições, critério de pronto, exemplos); `@arquivos`, imagens, logs e pipes; modo plano; modos de permissão; checkpoints e rewind; sessões (continuar, retomar, ramificar, renomear); modo interativo (atalhos, multilinha, histórico, mensagens na fila); perguntas laterais; fazer o Claude commitar. EXERCÍCIOS: tarefa em modo plano; desfazer um erro proposital com rewind; retomar a sessão de "ontem"; A/B de prompt ruim vs bom.

**Parte II — O menu `/` dissecado** (seção 9 detalha o formato)
- **R1. Configurar e personalizar.** **R2. Permissões e segurança.** **R3. Conduzir a sessão.** **R4. Paralelo e agentes.** **R5. Estender.** **R6. Qualidade e entrega.** **R7. Todo lugar.** **R8. Conta, custos e suporte** (inclui ocultos, removidos e curiosos). Cada seção termina com uma **volta guiada** no projeto-laboratório.

**Parte III — Do zero ao ar**
- **M4. Git e GitHub do zero.** Repo, commit, branch, merge, remote, PR; o Claude operando git com segurança (ler o diff antes de commitar, convenção de mensagens); `gh`; `.gitignore` e segredos; conflitos; reverter e recuperar (reflog); PR do início ao fim. EXERCÍCIOS: repo + 3 commits; branch + PR; reverter erro; resolver conflito proposital com o Claude; vazar um segredo **de teste** e remediar (rotacionar).
- **M5. Do computador para a internet.** Site estático em hospedagem gratuita; build; domínio e DNS (subdomínio grátis → domínio próprio pago); HTTPS; variáveis e segredos no deploy; deploys de prévia e rollback; analytics sem tracking. EXERCÍCIOS: publicar o site do M1; rollback; (opcional pago) domínio próprio.

**Parte IV — Personalizar**
- **M6. Memória e CLAUDE.md.** Hierarquia de memória; compatibilidade com `AGENTS.md`; auto memory; `/init` (e a versão interativa); `/memory`; pasta `.claude`; o que escrever e o que não (CLAUDE.md enxuto; especializado vira skill); o que sobrevive à compactação; projetos grandes/monorepo. EXERCÍCIOS: escrever o CLAUDE.md do laboratório e **testar a obediência** (A/B); ver auto memory em ação; auditar instruções com `/doctor prompt-audit`.
- **M7. Configurações, permissões e segurança.** Arquivos de settings e precedência; regras allow/ask/deny; modos de permissão; auto mode e classificador; sandbox; `/fewer-permission-prompts`; segredos e `.env` com regras de bloqueio; **prompt injection** (web, MCP, arquivos); confiança em MCP/plugins; quando **nunca** usar bypass; devcontainers; privacidade e uso de dados. EXERCÍCIOS: bloquear leitura de `.env` e provar; montar allowlist; ligar sandbox; plantar um prompt injection num arquivo e observar a defesa.
- **M8. Skills.** O que são vs CLAUDE.md vs hooks vs MCP vs subagentes (matriz "quando usar o quê"); anatomia do `SKILL.md`; campos de frontmatter (confira a lista oficial); **comandos customizados são skills**; contexto dinâmico com comando de shell; skills embutidas; custo de contexto (`/skill-doctor`); padrão aberto Agent Skills; skills de front-end/design; distribuir via plugin. EXERCÍCIOS: criar uma skill de commit em português; skill com argumentos; skill que carrega sozinha por `paths`; medir custo.
- **M9. Hooks.** Eventos disponíveis (use a referência oficial; não liste de memória), tipos de hook, matchers, entrada/saída e códigos de saída, decisões, escopo (settings, skill, agente, plugin), segurança (hooks rodam com suas permissões), `/hooks`. EXERCÍCIOS: formatar código automaticamente após editar; bloquear um comando perigoso; notificação ao terminar; log de uso.
- **M10. MCP.** O que é; transportes; escopos; `claude mcp add`; `/mcp`; OAuth; prompts MCP como comandos; recursos com `@`; busca de ferramentas (muitos servers); custo de contexto; confiança e segurança; servidores úteis (GitHub, Playwright, banco de dados, Drive). **Laboratório n8n**: o Claude Code criando e editando workflows via MCP (há servidor da comunidade e suporte nativo em versões recentes do n8n; verifique versão e requisitos). EXERCÍCIOS: conectar um servidor e usar numa tarefa real; criar um mini-MCP próprio; laboratório n8n (instância gratuita local); teste visual com Playwright MCP.
- **M11. Planejar e verificar.** Do pedido ao plano (spec → plano → tarefas); modo plano; `/goal`; critérios de pronto verificáveis; testes primeiro; `/verify`, `/run`, `/debug`; auto-checagem; `/simplify` e `/code-review`; biblioteca de prompts e boas práticas oficiais; anti-padrões (pedir tudo de uma vez, aceitar sem ler o diff); **o que nunca delegar**. EXERCÍCIOS: feature com teste que prova que funciona; objetivo longo com `/goal`; caçar um bug com `/debug`.

**Parte V — Escalar**
- **M12. Subagentes e trabalho paralelo.** Contexto isolado; criar subagentes (frontmatter, ferramentas, modelo); foreground/background; subagentes vs skills; worktrees; agent view; `/background`, `/fork`, `/subtask`, `/tasks`; agent teams; mensagens entre sessões; dynamic workflows (`/workflows`, `/batch`, `/deep-research`); custo do paralelismo; padrões (revisor, pesquisador, testador). **Inclua estudos de caso reais de como este próprio curso foi construído (seção 4).** EXERCÍCIOS: subagente revisor; 3 agentes em worktrees na mesma tarefa; `/batch` numa migração pequena; workflow simples próprio.
- **M13. Plugins, marketplaces e mods.** Anatomia (skills, agentes, hooks, MCP, LSP); `/plugin`; marketplaces oficiais; confiança; criar (`claude plugin init`), manifesto, dependências, testes com evals, publicar, medir custo; marketplace próprio; **mods** (mudanças na interface: painéis, barra de status, toasts, hooks de evento; confira a doc). EXERCÍCIOS: empacotar suas skills num plugin; instalar de um marketplace local; criar um mod simples.
- **M14. Automação sem você.** Modo headless `-p`, formatos de saída, ferramentas permitidas, pipes e códigos de saída; `/loop`; scheduled tasks na nuvem (`/schedule`, gatilhos por API/GitHub) e no desktop; channels (empurrar eventos para uma sessão: Telegram, Discord, iMessage, webhooks); lançar sessões por link; `/goal` contínuo; segurança de automação sem humano; idempotência. EXERCÍCIOS: relatório diário agendado; script com `-p` em pipeline; channel com Telegram (gratuito); loop que vigia um deploy.
- **M15. Claude Code em todo lugar.** VS Code, JetBrains, app desktop (sessões lado a lado, diffs, tarefas agendadas, simulador iOS), web/cloud (`--cloud`, `--teleport`, auto-fix de PR), app mobile, Remote Control, Projects, **Claude in Chrome** (testar UI, ler console), computer use pela CLI, Slack/Claude Tag, artifacts, ditado por voz. Inclua o **ciclo visual**: o Claude abre a página no Chrome, confere e corrige. EXERCÍCIOS: começar no PC e terminar no celular; teste visual com Chrome; publicar um artifact; abrir sessão na nuvem e puxar com teleport.
- **M16. Revisão e segurança de código.** `/code-review` (níveis, `--fix`, `--comment`), ultrareview (nuvem; créditos), `/simplify`, `/security-review`, scans de segurança, GitHub Actions, GitLab CI/CD, Code Review para times, `/autofix-pr`, `/install-github-app`; sinal vs ruído; custo; revisão humana continua obrigatória. EXERCÍCIOS: PR revisado automaticamente (em repo público; o Claude em CI consome crédito de API, sinalizar como **troca por pago**); `/security-review` num app propositalmente vulnerável.
- **M17. Agent SDK.** SDK vs Claude Code vs Claude API (quando usar qual); TypeScript e Python; o loop do agente; sessões; streaming; saída estruturada; aprovações; ferramentas customizadas; MCP; subagentes, skills e plugins no SDK; permissões e hooks; checkpointing; custo e uso; OpenTelemetry; hospedagem e segurança. EXERCÍCIOS: primeiro agente; agente com ferramenta própria; saída estruturada; hospedar de graça.
- **M18. Custos e uso.** `/usage`, `/cost`, `/stats`; planos e limites; o que consome (skills, subagentes, MCP, plugins); cache, esforço e modelo por tarefa; fast mode; advisor; compactação; `/insights`; créditos de uso; API pay-as-you-go e como calcular; orçamento por case; quando migrar de plano. EXERCÍCIOS: auditar uma sessão; reduzir em ~40% o custo de uma tarefa com mudanças **medidas**.
- **M19. Claude Code na empresa.** Setup organizacional, autenticação, managed settings e server-managed settings, controle de MCP, auto mode da organização, Bedrock/Vertex/Foundry/Claude Platform on AWS, gateways, rede corporativa, devcontainers, monitoramento (OpenTelemetry) e analytics, custos, segurança e dados (retenção zero, ambiente HIPAA-ready: informativo), kits de adoção, `/team-onboarding`, ambientes self-hosted, Code Review para times. EXERCÍCIOS (gratuitos, por simulação): plano de rollout para empresa fictícia; `managed-settings` de exemplo rodando localmente; checklist de segurança. **Troca por pago:** ambiente corporativo real.

**Parte VI — Construir produtos de verdade** (pré-requisito dos cases)
- **M20. Backend, banco, webhooks e hospedagem.** HTTP/REST essencial; servidor (uma stack só nos exercícios, justifique em `DECISIONS.md`; critérios: hospedagem gratuita que não "dorme", simplicidade); webhooks (assinatura, idempotência, retentativas); banco (SQLite → Postgres), migrações; login/sessões; segredos; logs e alerta; limite de requisições, CORS, backup; deploy gratuito de backend; domínio. EXERCÍCIOS: API que recebe webhook, grava no banco e vai ao ar; login simples; logs e um alerta.
- **M21. Claude API dentro do seu produto.** Chave e segredos; Messages API; system prompt; tool use; saída estruturada; streaming; prompt caching; lotes; custo por mil conversas; erros, limites e retentativas; avaliação simples (evals); guardrails; **camada de abstração de provedor** (grátis ↔ Claude API); RAG simples (FTS/embeddings); skill `/claude-api`. **Padrão grátis:** mesma interface com provedor gratuito; **troca por pago:** Claude API. EXERCÍCIOS: assistente com tool use; medir custo e latência; eval de 20 casos; trocar o provedor só por variável de ambiente.
- **M22. Claude Code além do código.** Pastas e arquivos, PDFs → planilha, relatórios (xlsx/docx/pdf por script), pesquisa (`/deep-research`), tratamento de dados, escrita de documentos; cuidado com dados de cliente (LGPD); quando usar chat/outras superfícies em vez do Claude Code. EXERCÍCIOS: pasta bagunçada → organizada; PDFs → planilha + gráfico; relatório PDF gerado por script.

**Parte VII — Cases de mercado** (seção 11)
- **C0. Do briefing à entrega**, **C1 a C6**, **Projeto final** (portfólio).

**Apêndices:** A Glossário · B Cheat sheet (atalhos, flags da CLI, comandos mais usados) · C Troubleshooting e referência de erros · D Settings e variáveis de ambiente (resumo + links) · E **Custos: do zero ao profissional** (Tabela Grátis↔Pago) · F **O que mudou** · G Radar de demanda (dados e método) · H Fontes e como verificar tudo sozinho · I Próximos passos (Claude Academy, comunidades).

---

## 8. Molde de módulo (use em todos)

1. **Cabeçalho**: número, título, minutos, pré-requisitos, trilhas, **selo de versão**, status.
2. **TL;DR (3 linhas)** + **"Ao final você consegue…"** (3–5 objetivos verificáveis).
3. **Essencial** (resolve 90%): conceito em uma frase → por que importa → como fazer → exemplo real mínimo → erro comum.
4. **Por baixo do capô** (colapsável).
5. **Armadilhas** (colapsável, só o que realmente acontece).
6. **Terminal-Replay / Anatomia** onde ajudar.
7. **Fichas de Campo** (2–4 exercícios; seção 12), cada uma com Prova, gabarito colapsável, "Deu erro?", desafio extra e, quando houver custo, **Trilha Grátis + TROCA POR PAGO**.
8. **Checklist de saída** e **Próximo módulo**.
9. **Fontes** (links oficiais; "verificado em").

Meta de volume: 1.800–3.500 palavras visíveis (Essencial + exercícios), mais camadas colapsáveis. Se passar muito disso, corte ou divida.

---

## 9. Parte II — o dissecado do menu `/`

**Fonte:** página oficial "Commands" (reler ao vivo) + `/help` na CLI instalada. O snapshot abaixo é de 12/11/2026; **a página ao vivo manda**. Conte e reconcilie: comandos novos entram, removidos viram carta "removido".

**Dados:** `commands.json`, um registro por comando: `nome`, `aliases`, `categoria` (R1–R8), `argumentos`, `o_que_faz` (palavras próprias), `quando_usar`, `exemplo`, `armadilha`, `tipo` (embutido | skill embutida | workflow | removido | oculto), `disponibilidade` (plano, plataforma, requisitos como `gh`, repositório git, artifacts), `versao_minima`, `status`, `verificado_em_versao`, `verificado_em_data`, `fonte`. A carta e a página de seção são **geradas** deste JSON. Um script compara o JSON com a página oficial e aponta diferenças.

**Para cada comando:** execute-o no laboratório sempre que possível. Quando depende de plano/plataforma que você não tem, marque "não testado localmente".

**Menus que mudam (ensine isso):** disponibilidade varia por plano, plataforma e versão; comandos ocultos só aparecem digitando o nome completo; o menu filtra por prefixo/alias (`/new` leva a `/clear`); comandos podem ser enfileirados ou rodar na hora durante uma resposta; prompts de servidores MCP aparecem como comandos; skills empilháveis numa mensagem.

**Snapshot por seção (12/11/2026):**
- **R1 Configurar:** `/init` `/memory` `/config` (`/settings`) `/status` `/doctor` (`/checkup`) `/model` `/effort` `/fast` `/advisor` `/output-style` `/theme` `/color` `/statusline` `/keybindings` `/terminal-setup` `/tui` `/focus` `/scroll-speed` `/voice` `/update-config` `/import` `/login` `/logout` `/privacy-settings` `/vim` (removido)
- **R2 Permissões e segurança:** `/permissions` (`/allowed-tools`) `/fewer-permission-prompts` `/sandbox` `/auto-mode-setup` `/add-dir` `/cd` `/security-review`
- **R3 Conduzir a sessão:** `/plan` `/goal` `/btw` `/context` `/compact` `/autocompact` `/clear` (`/reset`, `/new`) `/rewind` (`/checkpoint`, `/undo`) `/resume` (`/continue`) `/branch` `/rename` `/recap` `/copy` `/export` `/diff` `/help` `/powerup` `/release-notes` `/exit` (`/quit`) `/ultraplan` (removido)
- **R4 Paralelo e agentes:** `/agents` `/tasks` (`/bashes`) `/background` (`/bg`) `/fork` `/subtask` `/batch` `/list-agents` (`/peers`) `/stop` `/workflows` `/deep-research` `/loop` (`/proactive`) `/schedule` (`/routines`)
- **R5 Estender:** `/skills` `/skill-doctor` `/reload-skills` `/plugin` `/reload-plugins` `/plugin-authoring` `/mcp` `/hooks` `/run-skill-generator` `/claude-api` + prompts MCP
- **R6 Qualidade e entrega:** `/code-review` (`/review`) `/ultrareview` `/simplify` `/verify` `/run` `/debug` `/autofix-pr` `/install-github-app` `/install-slack-app` `/pr-comments` (removido)
- **R7 Todo lugar:** `/desktop` (`/app`) `/teleport` (`/tp`) `/remote-control` (`/rc`) `/remote-env` `/web-setup` `/chrome` `/claude-in-chrome` `/ide` `/mobile` (`/ios`, `/android`) · artifacts: `/artifacts` `/artifact-capabilities` `/artifact-diagramming` `/design` `/design-login` `/design-sync` `/slides` `/dataviz`
- **R8 Conta, custos e suporte:** `/usage` (`/cost`, `/stats`) `/usage-credits` `/rate-limit-options` `/upgrade` `/insights` `/team-onboarding` `/passes` `/feedback` `/bug` (`/share`) `/heapdump` (oculto) `/setup-bedrock` `/setup-vertex` `/stickers` `/radio`

Cada seção Rn termina com uma **volta guiada** (Ficha de Campo) que usa cada comando da seção ao menos uma vez no laboratório, com Prova de que funcionou.

---

## 10. Regra GRÁTIS-PRIMEIRO e Tabela Grátis ↔ Pago

**Regra:** todo exercício e case tem uma **Trilha Grátis** que funciona com custo zero. Onde existir alternativa paga relevante, aparece a fita **TROCA POR PAGO** com: o que trocar, por quê (gatilho), custo aproximado (com data), como trocar. O código usa **variáveis de ambiente e interfaces/adaptadores** (ex.: `LLM_PROVIDER`, `CHANNEL`, `DB_URL`, `HOST`) para que a troca seja **mudar configuração, não reescrever**.

**Honestidade sobre o que não é grátis:** o acesso ao Claude Code exige plano pago ou créditos de API (verifique planos vigentes e escreva no M0). "Grátis" no curso significa todo o **resto**.

**Atenção a "grátis ≠ liberado para uso comercial":** para cada serviço, verifique e registre os termos de uso comercial vigentes (hospedagem, banco, licenças como n8n e Remotion). Sem isso, o curso induziria o aluno a erro com cliente real.

**Candidatos (verifique TUDO ao vivo: plano gratuito, limites, termos comerciais; registre data no Apêndice E):**

| Peça | Grátis (padrão) | Pago (troca) | Gatilho |
|---|---|---|---|
| Acesso ao Claude Code | — (pré-requisito pago) | Pro/Max/Team/Enterprise ou créditos de API | sempre |
| LLM nos produtos | free tier de API de grandes provedores (ex.: Google AI Studio), provedores com modelos gratuitos, modelo local (ex.: Ollama) | Claude API (pay-as-you-go) | qualidade, limites de taxa, SLA, dados do cliente |
| Canal de atendimento | simulador local de WhatsApp + **Telegram Bot API** | **WhatsApp Business Platform oficial** (Cloud API da Meta ou BSP) | cliente real no WhatsApp |
| Site estático | GitHub Pages / Cloudflare Pages / Netlify (planos gratuitos) | plano pago, CDN | tráfego, termos comerciais |
| Backend | Cloudflare Workers / Render / equivalentes gratuitos | VPS ou plano pago sempre ligado | "dorme", volume, uptime |
| Banco | SQLite / D1 / Turso / Supabase / Neon (gratuitos) | plano pago + backups | pausa por inatividade, backup, volume |
| Automação | n8n self-hosted (verificar licença) / Make free | n8n Cloud / Make pago | volume, SLA, manutenção |
| E-mail transacional | provedores com plano gratuito | plano pago + domínio verificado | entregabilidade |
| Domínio | subdomínio gratuito | domínio .com.br/.com | marca do cliente |
| Vídeo e áudio | FFmpeg, whisper.cpp / faster-whisper locais, Remotion (verificar licença) | APIs de edição em nuvem, render em nuvem, transcrição paga | volume, tempo de render, licença |
| Formulários | função própria / serviços com plano gratuito | plano pago | volume |
| Analytics | opção privacy-friendly gratuita | plano pago | relatórios do cliente |
| Monitoramento | free tier de uptime | plano pago | SLA |
| CI | GitHub Actions em repo público | minutos pagos / runner próprio | repo privado |
| Claude em CI | — (consome crédito de API) | créditos de API | sempre |

**Proibido recomendar bibliotecas não oficiais de WhatsApp para cliente real** (risco de banimento do número e violação de termos). Pode explicar o risco; o caminho profissional é a plataforma oficial.

---

## 11. Cases de mercado (Parte VII)

**Origem:** radar de demanda do Workana em 12/11/2026 (Apêndice G): amostra de 352 projetos abertos de TI e Programação (~4 semanas; de 8.369 abertos), classificados por título, mais páginas de projetos indexadas de dez/2025 a nov/2026 para checar recorrência ao longo dos meses. **Limites a declarar no Apêndice G:** não é censo; classificação por título (regra "primeira que bate"); não foi possível contar 4–6 meses nem as outras categorias (Design, Marketing, Tradução e conteúdo); o site limitou requisições. O case 6 foi acrescentado por decisão do autor.

| # | Case | % da amostra (TI) | Propostas/projeto | Recorrência |
|---|---|---|---|---|
| C1 | Chatbot/agente de IA para WhatsApp | 41% | 44 | jan, mar, abr, mai, jun/2026 |
| C2 | Sistema/painel sob medida | 21% | 45 | todos os meses |
| C3 | Automação com IA + relatórios/planilhas | 8% (subcontada) | 45 | jan, mar, mai, jun/2026 |
| C4 | Landing page/site de conversão (+ agente embutido) | 7% | 72 | jun, ago/2026 |
| C5 | Conteúdo em escala com IA | n/d (categoria não amostrada) | n/d | mar, abr/2026 |
| C6 | Edição de vídeo com Claude Code | n/d (decisão do autor) | n/d | — |

Nota para o Apêndice G: ~44 propostas por projeto indica mercado saturado. O Workana serve como **radar de demanda para treino**, não como canal de venda recomendado.

**Cada case segue este molde:** (1) **Briefing do cliente** fictício e realista (inspirado nos padrões de demanda, sem copiar anúncios reais) · (2) critérios de aceite · (3) **Trilha Grátis** passo a passo com checkpoints, prova e gabarito colapsável · (4) **TROCA POR PAGO** (o que trocar, quando, custo estimado) · (5) **versão Desafio** sem guia · (6) rubrica de autoavaliação · (7) riscos (segurança, LGPD, limites da IA) · (8) entregáveis: repo, README, demo no ar (grátis), relatório de custos, documentação para o cliente · (9) pré-requisitos (módulos).

- **C0. Do briefing à entrega.** Ler e questionar um briefing; escopo e **definição de pronto**; perguntas ao cliente; estimativa de esforço e de custos de IA/hospedagem (quem paga o quê); modelo de proposta; contrato/NDA em nível conceitual (**não é aconselhamento jurídico**; recomendar profissional); LGPD básica (base legal, minimização, retenção, consentimento, opt-out, operador/controlador); política oficial do WhatsApp; entrega (documentação, treinamento, manutenção/SLA); honestidade sobre uso de IA no marketplace (alguns clientes proíbem texto/arte de IA: ler o briefing); portfólio. Sem inventar tabelas de preço de mercado; ensine a **construir** preço. EXERCÍCIO: escrever escopo e proposta para o C1.
- **C1. Chatbot/agente de IA para WhatsApp** (atendimento, vendas, pós-venda). Pré: M10, M11, M20, M21, C0. **Grátis:** simulador local de WhatsApp com payloads no formato oficial + **bot real no Telegram**; LLM gratuito via camada de provedor; base de conhecimento (FAQ/PDFs) com busca local; repasse a humano; registro de conversas; relatório simples de desempenho; guardrails (a IA não promete resultado, respeita CDC/LGPD, pede consentimento, oferece opt-out); logs; limites de taxa; deploy gratuito. **Troca por pago:** WhatsApp Business Platform oficial; Claude API; hospedagem sempre ligada; banco gerenciado. Inclua a animação 6 (fluxo do chatbot).
- **C2. Sistema/painel sob medida** (CRM leve, ordens de serviço, gestão). Pré: M4, M5, M20. CRUD, papéis e login, painel com indicadores, exportação, backup, testes. Grátis: banco e hospedagem gratuitos. Troca: Postgres gerenciado, domínio, e-mail transacional, backups pagos.
- **C3. Automação com IA + relatórios/planilhas.** Pré: M10, M14, M21. **Dois caminhos:** (a) por código (scripts/serviço) e (b) **n8n** com o Claude Code via MCP (instância gratuita local). Entrada: documentos/planilhas/e-mails; saída: relatório (PDF/planilha) enviado por e-mail; resumo com IA; Google Sheets. Grátis: n8n self-hosted (conferir licença), provedores de e-mail com plano gratuito. Troca: n8n Cloud/Make, e-mail pago, Claude API.
- **C4. Landing page/site de conversão** (com agente de diagnóstico embutido opcional). Pré: M5, M8 (skill de design), M15 (Chrome). Foco em design real (use a skill de front-end), performance, SEO, acessibilidade, formulário funcionando, **ciclo visual com Chrome**. Grátis: hospedagem estática, função própria para formulário. Troca: domínio, hospedagem paga, integração com CRM.
- **C5. Conteúdo em escala com IA.** Pré: M14, M21, M22. Pipeline: tema → rascunho → **revisão humana** → agendamento → publicação (blog estático gerado pelo próprio projeto); calendário editorial em Markdown; checagem de SEO; transparência sobre IA. Grátis: provedor gratuito + blog estático. Troca: Claude API, CMS/WordPress hospedado, agendador pago.
- **C6. Edição de vídeo com Claude Code.** Pré: M14, M22. **Local, no computador** (não roda no chat). Fluxo: transcrever (local) → o Claude propõe lista de cortes → FFmpeg executa → legendas animadas e overlays com Remotion (verificar licença) → reenquadre vertical → exportação por plataforma. Seja honesto: funciona bem para cortes por trecho, legendas e overlays; **não** substitui edição quadro a quadro nem gosto criativo. Material de teste: gravação própria ou banco livre de direitos (declare a licença). Grátis: FFmpeg + transcrição local + Remotion (conferir licença). Troca: APIs de edição/render em nuvem, transcrição paga. **Encadeia com o C5** (vídeo longo → cortes → posts). Distinção explícita: **editar vídeo existente ≠ gerar vídeo com IA generativa** (este último fora do escopo).
- **Projeto final.** Escolher um case e entregar ponta a ponta: repositório público, README, demo no ar (grátis), relatório de custos real, auditoria de segurança (`/security-review`), página de apresentação (portfólio) e uma proposta comercial. Rubrica de avaliação.

---

## 12. Projeto-laboratório e Fichas de Campo

- Crie um repositório-modelo **`lab/`** (um app pequeno e útil, escolha com critério e registre) que atravessa M1–M11. Cada módulo tem **ponto de partida e gabarito** como branches/tags (`m3-inicio`, `m3-gabarito`), baixáveis em ZIP direto do site.
- **Ficha de Campo** (formato fixo): Objetivo · Tempo · Pré-requisitos · Passos numerados · **Prova de que funcionou** (comando + saída esperada) · Gabarito (colapsável) · **Deu erro?** (3 causas mais prováveis) · Desafio extra · Custo (grátis | opcional-pago) · marcar como feito (localStorage).
- Todo exercício é **executado por você, do zero, em diretório limpo** antes de ser publicado. Registre em `VERIFICATION/`.

---

## 13. Versionamento, "O que mudou" e manutenção automática

- **Selo de versão** em módulo, carta de comando, exercício e rodapé: `verificado em vX.Y.Z · DD/MM/AAAA` + status (estável | beta | depende de plano).
- **Página "O que mudou"** (Apêndice F), alimentada por um arquivo de dados: versão da CLI, data, módulos/cartas afetados, resumo, link do changelog oficial. Também um `CHANGELOG` do próprio curso.
- **Rotina semanal de manutenção (grátis primeiro):** GitHub Action agendada (cron) que busca o changelog oficial e a página de comandos, compara com a versão verificada, reconcilia `commands.json`, lista módulos potencialmente afetados e abre uma issue/PR com o diagnóstico. **Opcional pago:** tarefa agendada na nuvem do Claude Code (`/schedule`) que, além do diagnóstico, propõe o patch dos textos. Documente em `MAINTENANCE.md`: como atualizar em 15 minutos.
- Script `scripts/verificar-versao` que lê `claude --version` e acusa selos defasados.
- Aviso visível quando um módulo estiver verificado numa versão com mais de N versões de atraso.

---

## 14. Qualidade: definição de pronto

**Um módulo só está pronto quando passa nos 5 gates:**
1. **Fatos:** cada afirmação técnica conferida (documentação oficial + CLI) e registrada em `VERIFICATION/`.
2. **Execução:** todo comando e código do módulo foi executado (ou marcado "ilustrativo"/"não testado localmente"); todos os exercícios rodaram do zero em diretório limpo.
3. **Estilo:** passou pelo subagente de estilo (direto ao ponto, PT-BR, sem os padrões proibidos da seção 1) e pelo checklist do molde (seção 8).
4. **Visual/acessibilidade:** screenshots nos 4 tamanhos × 2 temas aprovados; axe sem violações sérias; Lighthouse ≥ 95.
5. **Grátis↔Pago:** toda fita TROCA POR PAGO tem custo e data verificados; termos comerciais conferidos.

**Projeto pronto quando:** todos os módulos, as 8 seções do dissecado (com `commands.json` reconciliado com a página oficial do dia), C0–C6 e projeto final passaram nos gates; busca, progresso, trilhas, impressão/PDF por módulo, "O que mudou" e manutenção automática funcionam; site no ar em hospedagem gratuita; `REPORT.md` entregue.

**Nice-to-have (só depois do núcleo completo):** leitura offline (PWA), livro inteiro em PDF (Chromium headless, gratuito), cartão de conclusão gerado no navegador.

---

## 15. Entrega final

- Repositório completo e organizado + README (como rodar, construir, publicar, atualizar).
- Site publicado (URL gratuita) e `DEPLOY.md`.
- `MAINTENANCE.md` (rotina semanal; "atualizar em 15 minutos").
- `REPORT.md` com: o que foi entregue por parte/módulo; **o que NÃO foi verificado localmente e por quê**; decisões relevantes (resumo do `DECISIONS.md`); custos de uso estimados desta construção; pendências reais (se houver, com motivo); como evoluir (acesso restrito, venda do curso, novos cases).
- Resumo de 10 linhas no chat ao fim de cada fase.

---

## 16. Restrições legais e éticas

- Não reproduza texto da documentação nem de terceiros; reescreva e cite. Respeite licenças de fontes, ícones e imagens (declare cada uma).
- Não use dados reais de clientes, de anúncios ou de pessoas. Cases fictícios.
- Não faça scraping de sites durante a construção do curso; use documentação oficial e fontes públicas citadas.
- Conteúdo jurídico (contrato, LGPD) é informativo; recomende profissional habilitado.
- Aviso de independência (não afiliado à Anthropic) em todas as páginas.
- Nunca publique credenciais, mesmo de teste, em repositório público.

---

## 17. Primeira ação

Leia este arquivo por inteiro. Execute a **Fase 0** agora: crie `PROGRESS.md` e `DECISIONS.md`, verifique o ambiente, escolha e registre a stack (padrão: seção 5) e a direção de design inicial. Siga direto para a Fase 1 sem pedir aprovação.
