# DECISIONS

Registro de decisões relevantes. Formato: decisão · alternativas · motivo.

## D001 · Stack do site (12/11/2026)

- **Decisão:** Astro 7 + MDX (content collections tipadas), CSS próprio com tokens, Pagefind para busca, fontes via Fontsource, progresso em `localStorage`. É o padrão da seção 5 do briefing, sem desvios.
- **Alternativas:** Eleventy (menos tipagem de conteúdo), Next.js estático (JS demais para um livro), HTML puro (inviável para ~40 páginas com componentes repetidos).
- **Motivo:** HTML estático por padrão, JS só nas ilhas interativas, leitura funciona sem JS.

## D002 · Ambiente de construção (12/11/2026)

- Claude Code **2.1.323** (o briefing citava a série 2.1.28x; a CLI instalada manda). Selos usam `v2.1.323`.
- Windows 11, Node 24.19, npm 11.17, git 2.55, `gh` 2.100 autenticado, Python 3.12, Playwright 1.65.
- Sessão rodando em esforço **medium**, por instrução do autor (o briefing sugeria xhigh).

## D003 · Fonte de verdade em cache local (12/11/2026)

- **Decisão:** baixar o índice `llms.txt` e as 203 páginas `.md` ligadas para `.docs-cache/` (fora do git) e verificar cada afirmação por busca nesse cache.
- **Alternativas:** buscar página a página durante a redação (lento, e a ferramenta de busca truncava páginas longas, devolvendo resumo no lugar do texto).
- **Motivo:** verificação exata, repetível e sem resumo intermediário. O cache não é publicado: o curso reescreve e cita com link.

## D004 · Skill de front-end/design (12/11/2026)

- **Constatação:** não há skill `frontend-design` instalada. As skills de design disponíveis são as do plugin `design` (`design-critique`, `accessibility-review`, `design-system`, `ux-copy`) e a embutida `dataviz`.
- **Decisão:** a direção visual segue a seção 6 do briefing ("Manual de Bordo"); `design-critique` e `accessibility-review` entram no gate visual da Fase 2.
- **Motivo:** instalar plugin de terceiros sem pedido do autor foge do escopo; a seção 6 já é uma direção completa.

## D005 · Direção de design inicial (12/11/2026)

- **Conceito:** "Manual de Bordo", impressão em duas cores.
- **Tipografia:** Fraunces (display, eixos ópticos), Newsreader (leitura), JetBrains Mono (código). Todas OFL, self-hosted via Fontsource.
- **Cor, modo Papel:** papel `#f4efe4`, tinta `#16202b`, vermelho-sinal `#c8321f`, amarelo marca-texto `#f2d44a`, verde verificado `#1f6b46`.
- **Cor, modo Console:** fundo `#15120f`, osso `#e9e0cf`, âmbar `#e0a13a`, vermelho-sinal `#e5533d`.
- Os valores finais são os de `src/styles/tokens.css`, ajustados por contraste no gate visual.

## D006 · Projeto-laboratório: "Pendências" (12/11/2026)

- **Decisão:** o laboratório é uma lista de pendências de linha de comando, em Node sem dependências, com testes em `node --test`.
- **Alternativas:** app web com framework (exige `npm install` e build antes do primeiro exercício); app em Python (segundo runtime para o aluno instalar).
- **Motivo:** cabe na cabeça, roda igual em Mac, Windows e Linux, e tem o que os módulos precisam: regras puras, arquivo de dados, CLI e testes.

## D007 · Estados do laboratório como camadas, não como branches (12/11/2026)

- **Decisão:** cada estado (`m3-inicio`, `m3-gabarito`…) é uma pasta em `lab/estados/` com `_camadas.json`; `scripts/empacotar-lab.mjs` empilha `lab/base` + camadas e gera os ZIPs em `public/lab/`.
- **Alternativas:** branches/tags num repositório separado (pedido no briefing §12).
- **Motivo:** um repositório só, ZIP baixável direto do site, sem publicar um segundo repositório, e um arquivo por estado (autores em paralelo não se atropelam). Desvio do briefing registrado aqui.

## D008 · Terminal-Replay reconstruído da saída estruturada (12/11/2026)

- **Constatação:** a tela interativa do Claude Code não é capturável deste ambiente (Windows, sem pseudo-terminal controlável pela ferramenta).
- **Decisão:** os replays são gerados de sessões reais em `claude -p --output-format stream-json`, sanitizadas em `transcripts/`. A legenda de cada replay diz que é reconstrução e que a tela interativa tem outro desenho. Resumos de resultado usam texto neutro em português, sem imitar o texto da interface.
- **Consequência:** o requisito "reproduzir pedido de permissão, spinner e barra de status como observados" (briefing §6.6) não é atendido por captura; rótulos da barra de status citados no curso vêm da documentação. Vai para o `REPORT.md` como limite.

## D009 · Tabelas e rolagem (12/11/2026)

- O Astro 7 usa o processador Sätteri, e plugins rehype exigem pacote extra. Em vez disso, toda tabela do MDX é mapeada para `Tabela.astro` (contêiner com rolagem, `tabindex` e rótulo), sem perder a semântica de tabela.

## D010 · Desempenho: gate de Lighthouse ainda aberto para páginas longas (12/11/2026)

- **Medido localmente (Windows, Chromium headless):** home 94; M3 78 a 80. Acessibilidade, boas práticas e SEO em 100 nas duas; CLS ≈ 0.
- **Causa encontrada por trace:** o primeiro cálculo de layout de texto com as fontes web (TBT ≈ 0,9 s com CPU 4x mais lenta). Script do site: menos de 50 ms.
- **Feito:** pilhas de fonte curtas, preload das 3 fontes principais, `content-visibility: auto` nos blocos de texto, fim dos layouts forçados no script.
- **Aberto:** medir no CI (Linux) e, se continuar abaixo de 95, trocar as fontes variáveis por instâncias estáticas. Fica na Fase 9.

## D011 · Autores em paralelo sem worktrees (12/11/2026)

- **Decisão:** um subagente autor por página, todos na mesma árvore, cada um restrito aos próprios arquivos (`docs/GUIA-DO-AUTOR.md`); só o integrador constrói e faz commit.
- **Alternativas:** um worktree por autor (pedido no briefing §4).
- **Motivo:** os arquivos são disjuntos por desenho, então não há o que mesclar; worktrees multiplicariam `node_modules` e a etapa de merge. Vira estudo de caso do M12.
- **Lição da primeira leva:** seis autores em paralelo esgotaram o limite de 5 horas antes de gravar qualquer arquivo. As levas passaram a ter três.
