# VERIFICATION · T1D Guardar e publicar: histórico e site no ar

CLI: 2.1.325 · Data: 13/11/2026 · Doc: cache local; GitHub Pages conforme o M5. Ambiente como na T1A.

## Afirmações conferidas

| # | Afirmação | Fonte | Resultado |
|---|---|---|---|
| 1 | O Pages publica de um branch (`main`) na raiz ou em `/docs` | M5 (tabela dos modos) | confere |
| 2 | Caminho: Settings, Pages, Build and deployment, Deploy from a branch | M5 | confere (não executado) |
| 3 | O Pages não é permitido como hospedagem gratuita de negócio comercial | M5 (armadilha) | confere |
| 4 | Tudo o que se publica num site estático é legível por qualquer pessoa | M5 | confere |
| 5 | O aviso LF para CRLF no Windows é inofensivo | M4 (armadilha de quebra de linha) | confere |

## Execuções (pasta copiada de `t1c-gabarito`)

| Passo | Observado |
|---|---|
| Primeiro commit pedido ao Claude (`--allowedTools "Bash(git *)"`) | 3 passos, 0 negações; commit `3d27e40` com mensagem em português e corpo explicativo; avisou do LF para CRLF; linha `Co-Authored-By: Claude Haiku 5.5` |
| Estrago (`h1` e `R$ 68,00`) e conferência | `git status --short`: ` M index.html`; `node conferir.mjs`: `FALHOU` no item 1, `3 de 4` |
| Pedido para desfazer | 6 passos, 2 negações (o `node` não estava liberado); `git status` limpo; `conferir.mjs` rodado por nós: `4 de 4` |
| Mover para `docs/` com `git mv`, ajustar `conferir.mjs` e `CLAUDE.md`, commit | 9 passos, 1 negação; commit `f5859af`; `4 de 4`; o Claude avisou que briefing, CLAUDE.md e conferir.mjs continuam rastreados na raiz |

## Não testado

- **A ficha 4 inteira** (criar o repositório, ligar o Pages, abrir o endereço público): exige criar repositório e publicar na conta de quem faz, o que o ambiente de teste não faz. Marcada `nao-testado`.
- Pages em repositório privado depende do plano do GitHub: a página manda conferir, e não verificamos.
- O `.gitignore` do Desafio da ficha 3.

## Rechecagem (13/11/2026)

Conferidos: os códigos dos commits (`3d27e40`, `f5859af`), a saída `nothing to commit, working tree clean`, a estrutura final da pasta (`CLAUDE.md`, `briefing.md`, `conferir.mjs`, `docs/index.html`) e o conteúdo do `t1d-gabarito.zip` (4 arquivos). Corrigido um trecho impreciso ("quatro comandos" virou "uma sequência de comandos"). Links: 0 quebrados. Axe: ok.

## Adendo (13/11/2026): projeto da Lia, modelos e rubrica

- A missão do projeto final reaproveita o que foi executado nas quatro estações para a Lia (dúvidas, `CLAUDE.md`, site, conferência) e para a Doce Esquina (git, desfazer, `docs/`).
- **Não testados:** o passo "No ar" para a Lia (publicação exige conta do aluno), a reunião de entrega e os modelos de relatório, manual e termo de aceite (são textos; foram escritos para esta página, não conferidos com cliente real).
- Os modelos trazem aviso de que não são aconselhamento jurídico.
- Corrigido na rechecagem: a lista de verificação usava caixas de seleção sem rótulo (falha de acessibilidade do axe), e foi trocada por lista simples.
