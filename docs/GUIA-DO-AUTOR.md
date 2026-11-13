# Guia do autor

Contrato para quem escreve uma página do curso (pessoa ou subagente). O molde vivo é
`src/content/modulos/m3.mdx`: leia-o inteiro antes de começar. As regras de conteúdo estão no
`BRIEFING.md`, seções 1, 3, 8, 10 e 12.

## 1. O que você entrega

Para a página `<id>` (ex.: `m7`, `r3`, `c1`):

1. `src/content/<colecao>/<id>.mdx` (`modulos` para M*, `menu` para R*, `cases` para C* e `pf`).
2. `VERIFICATION/<id>.md`, no formato de `VERIFICATION/m3.md`.
3. Se houver figura: `src/components/figuras/<Id><Nome>.astro`, importada no próprio MDX.
4. Se houver replay: `transcripts/<id>-<nome>.jsonl` + `.meta.json`, e rodar `node scripts/gerar-replays.mjs`.
5. Se houver estado de laboratório: `lab/estados/<id>-inicio/` e `lab/estados/<id>-gabarito/` (seção 6).

**Não edite** arquivos compartilhados: `src/data/curso.ts`, `src/lib/*`, `src/styles/*`, `src/layouts/*`,
componentes fora de `figuras/`, `package.json`, `PROGRESS.md`, `DECISIONS.md`. Precisa de mudança neles?
Descreva no relatório final. **Não rode** `npm run build` nem `astro build` (várias pessoas escrevem ao mesmo
tempo e o build é único); o integrador constrói. **Não faça commit.**

## 2. Verdade primeiro (inegociável)

- Fonte de verdade: a documentação oficial em cache, `.docs-cache/en/*.md` (203 páginas, baixadas em
  12/11/2026; índice em `.docs-cache/llms.txt`; `/` do caminho vira `__` no nome do arquivo, ex.:
  `agent-sdk__overview.md`), e a CLI instalada (`claude --version` → 2.1.323, `claude --help`).
- Use `Grep`/`Read` no cache. **Nunca** descreva comando, flag, tecla, campo, evento, limite ou preço de memória.
  Seu conhecimento prévio sobre o Claude Code está desatualizado: confie no cache.
- Não achou na doc nem conseguiu executar? Omita, ou escreva "não verificado em 12/11/2026".
- Preços e limites de serviços de terceiros (hospedagem, bancos, APIs): só com fonte oficial conferida hoje
  por busca/leitura da página do fornecedor. Sem fonte conferida, não cite número: diga onde consultar.
- Recurso que exige plano, app ou plataforma que este ambiente não tem: `verificacao="nao-testado"` na ficha e
  a frase "descrito com base na documentação de 12/11/2026; não testado localmente". Jamais finja ter testado.
- Palavras próprias. Não copie frases da doc. Cite com link `https://code.claude.com/docs/en/<pagina>.md`.
- Nada de dado pessoal nem segredo real. Exemplos de segredo: `sk-FALSO-nao-use-0000`.

## 3. Executar de verdade

Todo comando e exercício é executado do zero, num diretório limpo dentro da pasta temporária da sessão
(nunca dentro do repositório do curso). Ambiente: Windows 11, Git Bash e PowerShell, Node 24, Python 3.12,
git, `gh` autenticado. Não há WSL nem Docker garantidos: confira antes de depender deles.

- Monte o laboratório com `node scripts/empacotar-lab.mjs --extrair <estado> <pasta>` (rode da raiz do repo).
- Sessões reais do Claude Code: `claude -p "<pedido>" --output-format json` (ou `stream-json --verbose` para
  replay). A tela interativa **não** é automatizável aqui. Passos que só existem nela (teclas, menus, `/comandos`
  interativos) são conferidos na doc e a ficha leva `verificacao="ilustrativo"` com uma frase explicando.
- Cada `claude -p` consome limite de uso do autor. Seja econômico: sessões curtas, só as necessárias para a
  Prova e para um replay. Não rode o mesmo teste duas vezes sem motivo.
- Apague o que criar fora da pasta temporária (ex.: arquivos em `~/.claude/` gerados por testes). Não altere
  a configuração global do usuário (`~/.claude/settings.json`, `~/.claude.json`); use configuração de projeto
  no diretório de teste. Não instale nada globalmente. Não publique nada (sem `git push`, sem deploy, sem
  criar repositório ou conta) e não gaste dinheiro: o que depender disso vira "não testado localmente".
- Para gravar uma transcrição sem dados pessoais:
  `python scripts/sanitizar-transcricao.py <entrada.jsonl> <id>-<nome> <pasta-do-projeto-de-teste>`.
- Registre em `VERIFICATION/<id>.md`: cada afirmação técnica → fonte → resultado; cada execução → comando →
  saída observada; e a lista do que não foi testado, com o motivo.

## 4. Estilo

Português do Brasil, tom de amigo experiente, humor refinado e raro. Frases curtas (média ≤ 22 palavras).
Zero aquecimento. Proibido: "Ótima pergunta", "Claro!", "Neste módulo veremos", linguagem corporativa, jargão
sem explicação, emoji, travessão como muleta. Meta: 1.800 a 3.500 palavras visíveis (Essencial + fichas).
Depois do rascunho, corte pelo menos 15% sem perder informação.

Termos fixos: "modo plano", "modos de permissão", "pedido" (para prompt, quando couber), "ficha de campo",
"laboratório", "sessão", "pasta de trabalho". Nomes de comandos, flags e textos da interface ficam como na CLI.

## 5. Estrutura do MDX

Frontmatter (todos obrigatórios; o build valida):

```yaml
id: m7
titulo: Configurações, permissões e segurança   # igual ao de src/data/curso.ts
parte: p4
ordem: 7
minutos: 80
pre_requisitos: [m3, m6]
objetivos: [de 3 a 5 frases verificáveis]
tldr: [exatamente 3 linhas]
verificado_em_versao: 2.1.323
verificado_em_data: 12/11/2026
status: estável            # ou beta, ou depende-de-plano
trilhas: [rapida, completa, empresa]   # conforme BRIEFING seção 7
exercicios:
  - { id: m7-e1, titulo: ..., minutos: 15, custo: gratis }   # ou opcional-pago
```

Corpo, nesta ordem: `## Essencial` (com `###` por assunto) → `<Camada tipo="capo">` →
`<Camada tipo="armadilhas">` → `## Fichas de campo` (2 a 4 `<Ficha>`) → `<Saida>` → parágrafo
"**Próxima estação:**" → `<Fontes>`. A placa, o TL;DR e os objetivos saem do frontmatter: não os repita.

Componentes disponíveis sem import:

| Componente | Uso |
|---|---|
| `<Camada tipo="capo" titulo="…">` / `tipo="armadilhas"` | Camadas colapsáveis. Dentro, use `###`. |
| `<Ficha id n titulo objetivo minutos pre custo verificacao>` | `verificacao`: `executado` (padrão), `nao-testado`, `ilustrativo`. |
| `<Prova>`, `<Gabarito>`, `<DeuErro>`, `<Desafio>` | Dentro da ficha, nesta ordem, depois da lista numerada de passos. `<DeuErro>` traz as 3 causas mais prováveis. |
| `<Troca oque gatilho custo data como />` | Fita TROCA POR PAGO. `custo` e `data` conferidos em fonte oficial. |
| `<Nota rotulo="…">` | Nota lateral curta (uma ou duas frases). |
| `<SO mac="…" win="…" linux="…" />` (ou `unix` para mac+linux) | Comando de uma linha que muda por sistema. |
| `<Para so="win">…</Para>` | Bloco que só vale para um sistema (`mac`, `win`, `linux`, combináveis com espaço). |
| `<Diff arquivo="…">` + bloco ```` ```diff ```` | Antes/depois. |
| `<Figura id titulo chamadas={[…]}>` | Anatomia SVG com legenda numerada. Com `passos={n} legendas={[…]}` vira animação. |
| `<Replay id="…" legenda="…" />` | Terminal-replay de `src/data/replays/<id>.json`. |
| `<Selo tipo="beta" />`, `tipo="plano" texto="Max"`, `tipo="nao-testado" data="12/11/2026"` | Carimbos avulsos. |
| `<Cartas cat="R3" />` | Só nas páginas R*: as cartas da seção. |
| `<Saida>`, `<Fontes>` | Checklist de saída e lista de fontes (listas Markdown dentro). |

Armadilhas do MDX: `{`, `}` e `<` em texto corrido precisam de escape (`\{`, `\<`) ou de crase; dentro de
blocos de código não. Deixe uma linha em branco depois de abrir e antes de fechar componentes que contêm
Markdown. `|` dentro de célula de tabela vira `\|`. Links internos são relativos: `[M7](../m7/)`.
Blocos de pedido em linguagem natural usam ```` ```text ```` (quebram linha sozinhos).

## 6. Laboratório

O laboratório é o app **Pendências** (`lab/base`, Node sem dependências, `npm test` com `node --test`).
Um estado é uma pilha de camadas: `lab/base` + as camadas listadas em `lab/estados/<nome>/_camadas.json`
(array de nomes, na ordem) + os arquivos da própria pasta. Exemplo: `lab/estados/m6-inicio/_camadas.json`
com `["m3-gabarito"]` e nenhum outro arquivo significa "começa do gabarito do M3".
Links no MDX: `[m6-inicio.zip](../lab/m6-inicio.zip)`.
Módulos que não usam o Pendências (ex.: cases com projeto próprio) guardam o projeto em
`lab/projetos/<id>/` e explicam no texto; nada de ZIP nesse caso, a menos que você crie o estado.

## 7. Figuras

SVG autoral em componente `.astro`, traço único, só as classes de `src/styles/componentes.css`
(`svg-traco`, `svg-sinal`, `svg-cheio`, `svg-cheio-sinal`, `svg-papel`, `svg-papel-2`, `svg-marca`,
`svg-texto`, `svg-texto-forte`, `svg-texto-claro`, `svg-titulo`, `svg-num`). Sem cores fixas, sem imagem
externa, com `<title>` e `<desc>`. `viewBox` de 800 de largura; confira que nenhum texto vaza da caixa
(fonte mono 13px ≈ 7,8px por caractere). Veja `src/components/figuras/CicloModos.astro`.

## 8. Relatório final (sua resposta)

Máximo 25 linhas: arquivos criados; contagem de palavras visíveis; execuções reais feitas e resultado; o que
ficou "não testado" e por quê; mudanças necessárias em arquivos compartilhados; dúvidas que você decidiu
sozinho (e como).

## 9. Páginas R1–R8 (o menu `/` dissecado)

Além do MDX em `src/content/menu/<id>.mdx`, você entrega `src/content/comandos/partes/<id>.json`: um array com
**uma carta por comando** da sua seção, exatamente os nomes de `docs/comandos-por-secao.json` (nem a mais, nem a
menos). Fonte: `.docs-cache/en/commands.md` (a linha do comando) + a página de detalhe que ela liga + a CLI.

```json
{
  "id": "compact",
  "nome": "/compact",
  "aliases": [],
  "categoria": "R3",
  "argumentos": "[instruções]",
  "o_que_faz": "Uma frase, palavras próprias, até 160 caracteres.",
  "quando_usar": "Situação concreta em que este comando é a escolha certa.",
  "exemplo": "/compact mantenha as decisões sobre o banco",
  "armadilha": "O erro que realmente acontece com ele. Se não houver, a limitação mais relevante.",
  "tipo": "embutido",
  "disponibilidade": { "plano": "Todos", "plataforma": "CLI e apps", "requisitos": "" },
  "versao_minima": "",
  "status": "estável",
  "testado_localmente": false,
  "verificado_em_versao": "2.1.323",
  "verificado_em_data": "12/11/2026",
  "fonte": "https://code.claude.com/docs/en/commands.md"
}
```

- `tipo`: `embutido` | `skill embutida` | `workflow` | `removido` | `oculto`, como a página oficial indica.
- `aliases`: com barra (`["/reset", "/new"]`). `versao_minima`: só se a doc declarar (ex.: `"2.1.221"`).
- `disponibilidade.plano`: `"Todos"` quando a doc não restringe; senão o que a doc diz (ex.: `"Pro, Max e Ultra"`).
- `status`: `depende-de-plano` quando plano ou plataforma restringem; `beta` só se a doc disser.
- `testado_localmente`: `true` **somente** se você executou o comando nesta máquina e viu o resultado. Muitos
  comandos de barra funcionam em modo não interativo: teste com `claude -p "/comando args"` num diretório de
  teste e registre a saída em `VERIFICATION/<id>.md`. Os que abrem painel interativo, exigem navegador, outro
  app, plano ou conta que você não pode usar ficam `false` (a carta mostra "não testado localmente").
  Não rode comandos que publicam, gastam, enviam feedback, alteram a conta ou a configuração global
  (`/login`, `/logout`, `/upgrade`, `/feedback`, `/bug`, `/install-*`, `/passes`, `/usage-credits`, etc.).
- Comando removido: carta com `tipo: "removido"`, dizendo desde quando e o que usar no lugar.

O MDX da seção: `## Essencial` curto (o que a seção resolve, uma tabela "quero X → comando Y", e o que a doc
ensina sobre menus que mudam quando for pertinente à seção), depois `<Cartas cat="R3" />`, as camadas, e
**uma** ficha de campo: a **volta guiada**, que usa cada comando testável da seção ao menos uma vez no
laboratório, com Prova. `minutos` entre 30 e 60. Meta de texto visível: 900 a 1.800 palavras (as cartas não contam).
