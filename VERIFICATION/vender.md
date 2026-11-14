# Verificação: parte "Vender" (14/11/2026)

Páginas: `v1`, `v1-2` (preço), `v2`, `v2-2` (proposta e contrato), `v3`, `v3-2` (portfólio e abordagem). Versão: 2.1.325.

| Item | Como foi verificado | Resultado |
|---|---|---|
| Estimativa de horas | `claude -p ... --permission-mode plan`, Sonnet 5.5, no pedido do Studio Lia | 4 passos, 26 s. Mínimo 26 h, provável 46 h, máximo 85 h. Achou a contradição "sistema offline no computador do studio" x "formulário no celular da aluna" |
| Fórmula da calculadora | `tests/calculadora.spec.ts` (Playwright) | 46 h x 50 + 150 = 2.450; x 1,20 = 2.940; manutenção 100. Campo vazio e negativo não geram NaN |
| Proposta e contrato | `acceptEdits`, Haiku 5.5, 5 passos, 86 s | `calculo-do-preco.md`, `proposta.md` (~1.525 palavras), `contrato.md` (~1.144 palavras). Valores marcados EXEMPLO. Arquivos em `lab/estados/v2-gabarito` |
| Tutor `v` na pasta da proposta | Haiku 5.5, 7 passos, 24 s | 8 de 12 (faltavam portfólio e abordagem) |
| Portfólio | `acceptEdits`, Haiku 5.5, 5 passos, 40 s | `docs/index.html` 11 KB, aviso de casos de treino, 3 casos, marcador `[SEU WHATSAPP]`. axe a 390 px: 0 violações, sem rolagem horizontal. Arquivos em `lab/estados/v3-gabarito` |
| Planilha e modelos de abordagem | Escritos pelo autor do curso | **Não testados com pessoas reais** |
| Ensaio de conversa com o Claude fazendo o papel do dono | Prompt descrito, **não executado** | Pendente |

## Fatos sobre MEI e LGPD

- O portal gov.br do MEI foi consultado por um agente de leitura (FAQ, modificado em 16/09/2025): há limite anual e valores de DAS, e uma notícia sobre mudança de teto. **Nenhum valor foi citado nas páginas.** A pergunta "programação e criação de sites constam como atividade MEI?" **não foi confirmada**; a página diz isso e manda conferir.
- Os textos de contrato e política são modelos de treino, **não revisados por advogado nem contador** (aviso nas páginas e no próprio `contrato.md`).

## Limites desta verificação

Uma execução por item. Os números (horas, tokens, tempo) variam entre execuções. Preços e prazos de exemplo são inventados e rotulados.
