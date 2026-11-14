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

## D012 · Escopo e modo de trabalho para o plano Pro (13/11/2026, decisão do autor)

- **Escopo:** M0–M22, R3, Baralho de Comandos (117 cartas curtas), C0–C6, projeto final, apêndices A, B e F. Fora por agora: R1, R2, R4–R8 como páginas escritas e os apêndices C, D, E, G, H, I.
- **Modo:** uma sessão por vez, uma página por vez, sem subagentes; Sonnet com esforço medium; execução real só da Prova principal; revisão e fotos por parte. Regras em `CONTINUAR.md`.
- **Motivo:** a primeira leva paralela esgotou duas janelas de 5 horas entregando uma página.

## D013 · Publicação aprovada pelo autor (13/11/2026)

- GitHub Pages em repositório público `curso-claude-code` na conta do autor, com push a cada item, e atalho local na Área de Trabalho. Script de um clique sem supervisão, com ferramentas restritas (`CONTINUAR.md` §7).

## D014 · Auditoria de 13/11/2026: correções e riscos abertos

- **Links para páginas ainda não escritas** davam 404 (prosa e rodapé: 142 links quebrados). Corrigido na raiz: o componente `LinkInterno` (sobrescreve `a` no MDX) troca o link por texto "em obras"; a gaveta e o rodapé só ligam apêndices que existem. Verificação: varredura de `dist/` com resolução de links relativos e âncoras (0 quebrados depois).
- **`scripts/proxima-pagina.ps1`** estragava acentos ("Faça" virava "FaÃ§a") porque o Windows PowerShell 5.1 lê `.ps1` sem BOM como ANSI. Regra: arquivos `.ps1` do repositório ficam em UTF-8 **com BOM**. O script também passou a forçar UTF-8 no console e a fechar o stdin do `claude -p`.
- **`scripts/abrir-local.cmd`** passou a reconstruir sempre (antes servia um `dist/` possivelmente velho) e a abrir o navegador só depois de o servidor subir.
- **Privacidade (aberto):** todos os commits levam o e-mail pessoal do autor. Num repositório público isso fica exposto. Antes da Publicação: configurar `user.email` com o endereço noreply do GitHub e decidir se reescreve o histórico (só com autorização do autor).
- **Versão de ação (aberto):** o `deploy.yml` usa `upload-pages-artifact@v3`; a documentação do GitHub de 13/11/2026 mostra `@v4`.

## D015 · Publicação feita (13/11/2026)

- **Repositório público** `srj-figueiredo/curso-claude-code`, criado pelo autor com `gh repo create ... --public --source . --push` (o classificador de permissões bloqueia esse comando quando é o Claude a rodá-lo, então o autor o digitou com `!`). **Site:** https://srj-figueiredo.github.io/curso-claude-code/, por GitHub Pages com Actions.
- **E-mail dos commits:** decidido manter o gmail do autor, que já é o e-mail público do perfil do GitHub (D014 fica resolvido).
- **CI:** o primeiro build no Linux passou sem ajustes (check, build, 30 testes axe, deploy). A ação `upload-pages-artifact` foi para v4 antes do push.
- **Aberto:** os avisos de Node 20 e do `ubuntu-latest` (PENDENCIAS 1.6).

## D016 · Nova identidade visual "Linhas de metrô" e o mascote Bloquinho (13/11/2026, escolha do autor)

- **Direção:** Opção C da prévia `docs/identidade-opcoes.html`: fundo quase branco (`#fffdf7`), tinta escura (`#101820`), botões em pílula, cantos arredondados (18 a 22 px) e **uma cor de linha por Parte** (tokens `--linha-0` a `--linha-7`, cada uma com o `-t` da cor de texto que vai por cima). O modo Console fica mais vivo (laranja e menta de terminal). O grão de papel saiu, o corpo ficou em peso 450 e os títulos mais firmes. Contraste do texto principal: 17,6:1; vermelho-sinal 5,3:1; todos os pares cor-de-linha com texto >= 4,5:1; axe 30/30 nos dois modos.
- **Implementação:** tokens em `tokens.css`; formas, cores por Parte e mapa em `identidade.css` (carregado depois de `componentes.css`); a Parte da página chega por `data-parte` no `<article>`.
- **Mascote:** o **Bloquinho** (pixel-art original, desenho próprio; escolhido em `docs/mascotes-pixel.html`). Componente `Mascote.astro`, com expressões neutro, feliz, pensando, acenando e surpreso, e cores por variável (`--mq-*`), então serve aos dois modos. **Onde aparece (e só aí, para não poluir):** logo do cabeçalho, capa (acenando), "Prova de que funcionou" (feliz), "Deu erro?" (pensando), "Checklist de saída" (feliz), página 404 (surpreso) e favicon. Não aparece no corpo do texto nem nas figuras.
- **Não é o mascote oficial do Claude Code** (personagem de terceiros; o curso se declara independente). Se o autor obtiver permissão da Anthropic, o desenho oficial pode substituir o Bloquinho trocando só o componente `Mascote.astro`.
- **Mapa do metrô:** cada Parte ganhou a sua cor (antes eram 4 estilos que se repetiam).


## D017 · Mudança de rumo: Temporadas por projeto, para quem quer vender serviços (13/11/2026, decisão do autor)

- **Por quê:** o autor leu o M7 e outros módulos e avaliou que começavam bem e viravam manual: comandos sem motivo, termos sem definição, nada que prendesse. Pedido: ensinar de forma simples e profunda a **não programadores que querem vender serviços a pequenas empresas**, de modo fluido, chegando a projetos profissionais.
- **O que muda:** o curso deixa de ser organizado por recurso (Memória, Skills, MCP) e passa a **Temporadas**, cada uma com um cliente fictício e uma entrega (T1 site, T2 sistema com login, T3 atendimento com IA, T4 automação, T5 profissional). O recurso entra **na hora em que o projeto precisa dele**. Prioridade dos projetos segundo o radar de demanda do curso (chatbot 41%, sistema 21%, automação 8%, landing 7%; amostra de 352 projetos de TI do Workana, não é censo e não mede a procura de pequenas empresas locais). Roteiro completo em `docs/ROTEIRO-V2.md`.
- **Molde de cada estação:** `<Conceitos>` de abertura (o que vai aprender, em palavras simples; o que só ouve falar, com link para o módulo de referência), cena, primeiro resultado em minutos, por que funcionou, quando dá errado, entrega e "Como vender isso". Sem JSON na camada principal; sintaxe fica em "Por baixo do capô". Mantém a sequência visual do formato antigo (placa, três linhas, Essencial, camadas, fichas, saída, fontes).
- **Cobertura:** os módulos antigos permanecem no ar como **Referência**, e `docs/MAPA-DE-CONCEITOS.md` lista cada conceito deles e onde será ensinado. Ao final do curso, nenhum fica "Planejado".
- **Mapa do metrô:** nova linha roxa `p8` (Temporada 1) entre a Parte 0 e a Parte I; as cores agora vêm do número do id da Parte (`--linha-N`), não da posição no array. Reorganização completa do mapa fica para quando as Temporadas existirem.
- **Versão nas fichas:** `Ficha` aceita `versao` (as estações novas foram executadas na CLI 2.1.325; as antigas, na 2.1.323).
- **Modelo e variação:** os `claude -p` desta máquina usam o modelo padrão, que variou entre Sonnet 5.5 e Haiku 5.5. As páginas dizem que o texto varia.

## D018 · Domínio e entrega ao fim de cada estação; ver e editar a receita (13/11/2026, pedido do autor)

- **Por quê:** o autor pediu que o aluno tenha a segurança de dominar o que fez e saiba **entregar** ao cliente, e que possa ver e editar o arquivo MD que gerou o site para entender como o Claude Code funciona.
- **O que entrou:**
  - Componente `<Entrega>` (bloco "Domínio e entrega", antes do checklist de saída). Cada estação traz: **teste de domínio sem passo a passo** com um segundo cliente (Studio Lia, `lab/estados/t1-dominio-inicio`), **rubrica** ("você domina se consegue...") e **material de entrega** (T1A prévia e mensagem; T1B relatório de entrega; T1C manual do site; T1D pacote, reunião de 15 minutos, termo de aceite, quem é dono de cada peça).
  - T1D fecha com o **projeto final da Temporada 1** (Lia, do briefing à entrega), com autoavaliação de 7 perguntas.
  - Componente `<Arquivo estado nome>`: mostra na página o arquivo do laboratório (lido no build, sem duplicar texto), com copiar. Usado para `briefing.md` e `conferir.mjs`.
  - T1A, ficha 3 **"Mexa na receita"**: editar três linhas do briefing e pedir ao Claude para atualizar o site, com `diff`.
  - O rótulo "Desafio extra" passou a **"Vá além"**.
- **Honestidade do teste:** o Claude acha armadilhas que não plantamos (contraste, ambiguidade do plano mensal) e às vezes aplica a mudança de cor e horário mas ignora o tom de voz; ambos viraram lições na página.
- **Linguagem neutra:** o texto não presume o gênero de quem lê; "cliente" genérico virou "quem contratou".

## D019 · Sem códigos da nomenclatura antiga no texto novo (13/11/2026, pedido do autor)

- **Regra:** as páginas do formato novo não citam M1, M2, M3 etc. Citam o guia pelo nome (`o guia "Git e GitHub do zero"`); termos técnicos (skills, agentes, hooks, MCP) continuam. O componente `<Conceitos>` mostra "Referência: Título" sem código. O código das estações novas (T1A...) é a nomenclatura nova.
- **Feito:** T1A a T1D e o piloto do guia de segurança limpos (0 ocorrências de `M<número>`). `pre_requisitos` da T1A ficou vazio.
- **Fica para a reorganização do mapa:** os guias antigos ainda aparecem com o código M0 a M10 no mapa do metrô e na navegação lateral; os textos internos deles também. Renomear quando as Temporadas existirem.
- Todas as regras estão consolidadas em `docs/REGRAS-DO-CURSO.md`.
