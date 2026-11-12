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
