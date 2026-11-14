# Verificação: parte "Preparação" (14/11/2026)

Páginas: `t0a` (preparar o computador), `t0b` (plano, limite e custo), `t0c` (o tutor). Versão: Claude Code 2.1.325 (selo das páginas).

## t0a · Preparar o computador

| Item | Como foi verificado | Resultado |
|---|---|---|
| Diagnóstico no Git Bash (laço que lista versões) | Executado | Passou |
| Diagnóstico no PowerShell 5.1 | Executado. Corrigido: `foreach` direto no pipe falha ("Um elemento pipe vazio não é permitido"); a página usa `$r = foreach ...; $r | Out-File -Encoding utf8` | Passou depois da correção |
| Instalar o Claude Code e criar a pasta de clientes | **Não testado** (a ficha traz o selo `nao-testado`) | Pendente |

## t0b · Plano, limite e custo

| Item | Como foi verificado | Resultado |
|---|---|---|
| `claude -p "/usage"` | Executado (com `MSYS_NO_PATHCONV=1` no Git Bash) | Imprime sessão, semana e sugestões. Os números da página são da máquina do autor, usados só como formato |
| Pedido vago x específico | Uma execução de cada, Claude Haiku 5.5, no site da Doce Esquina (399 linhas) | Vago: 11 passos, 11.761 tokens de saída, 57 s, 81 linhas mudadas. Específico: 11 passos, 2.084 tokens, 16 s, 4 linhas |
| Contagem de linhas diferentes (`Compare-Object`) | Executado no PowerShell 5.1 | Passou |
| Fatos de limite e `/usage-credits` | Lidos em `.docs-cache/en/costs.md` | Citados sem números de plano |

**Não testado:** o limite real do plano nunca foi forçado nesta sessão; `/usage-credits` não foi executado.

## t0c · O tutor

| Item | Como foi verificado | Resultado |
|---|---|---|
| Tutor `t1` no `t1c-gabarito` | `claude -p "/revisar-entrega t1"`, Haiku 5.5 | 8 passos, 43 s, 6 de 12; achou cores fora do `CLAUDE.md`; não alterou arquivos |
| Tutor `v` na pasta da proposta | Idem | 7 passos, 24 s, 8 de 12 |
| Instalação (copiar `.claude`) | Comandos do PowerShell testados na T2C; cópia do tutor executada na pasta de teste | Passou |

**Limites:** uma execução por entrega e um só modelo; o tutor pode marcar diferente em outra execução. Um comando composto do Bash foi negado pelas permissões do tutor (esperado).

## Double check (14/11/2026)

- Comandos do PowerShell 5.1 das fichas (criar a pasta `clientes`, extrair `t0c-tutor`, `t1c-gabarito`, `t2-dominio-inicio` e `v3-inicio`, copiar `.claude`, `Rename-Item`, `Compare-Object`) executados numa pasta temporária: passaram. O `t1c-gabarito` tem 399 linhas e o sábado aparece como 8h às 14h, como a ficha descreve.
- Corrigido: afirmação sem prova em `t0b` (limite "bateu uma vez"), referência errada à instalação, "você mesmo/sozinho" (linguagem neutra), tutor precisa ser copiado para a pasta que será revisada (`v2-2`, `v3-2`), referência a uma estação inexistente em `v3`.
