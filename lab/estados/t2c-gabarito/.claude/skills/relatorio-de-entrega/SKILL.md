---
name: relatorio-de-entrega
description: Gera o ENTREGA.md da Oficina Boa Estrada com cinco seções - o que foi combinado, o que foi feito, como conferi (com a saída de node conferir.mjs colada), o que ficou de fora e o que depende do cliente. Use quando o usuário pedir relatório de entrega, ENTREGA.md, fechamento de etapa ou resumo para o cliente.
---

# Relatório de entrega

Gera o arquivo `ENTREGA.md` na raiz do projeto. Ele é o registro do que foi combinado, do que foi feito e do que ainda depende de alguém.

## Regras

- **Só afirme o que foi conferido.** Se `node conferir.mjs` falhar, diga isso no relatório, com a saída. Nunca escreva "tudo funciona" sem a conferência ter passado.
- **Nada de dado pessoal ou segredo.** Não escreva CPF, senha, conteúdo do `.env` nem dado real de cliente. Use só os nomes fictícios do briefing.
- **Não invente.** Toda informação do "combinado" vem de `briefing.md` (e do `CLAUDE.md`). Se faltar algo, vá para a seção "O que depende do cliente".
- Use só Node para a conferência: rode `node conferir.mjs` direto, sem script auxiliar.

## Passos

1. **Leia o combinado.** Abra `briefing.md` e `CLAUDE.md`. Liste os pedidos do cliente e as regras do que não fazer.
2. **Levante o que foi feito.** Use as mudanças desta entrega: arquivos criados ou alterados e o que cada um faz. Se houver histórico de git, use-o também. Não cite nada que não existe no disco.
3. **Rode a conferência.** Execute `node conferir.mjs` na raiz do projeto e guarde a saída completa, sem resumir nem cortar as linhas de OK ou FALHA.
4. **Compare o combinado com o feito.** Para cada pedido do briefing, marque se está feito, parcial ou faltando.
5. **Escreva `ENTREGA.md`** com as seções abaixo, nesta ordem e com estes títulos.

## Modelo do ENTREGA.md

```markdown
# Entrega: <nome da etapa> - Oficina Boa Estrada

Data: <AAAA-MM-DD>

## O que foi combinado

<Pedidos do briefing.md desta etapa, em lista. Cite a regra de cada um, como "não guardar CPF".>

## O que foi feito

<Lista de arquivos e funções entregues, com uma frase por item. Diga o que cada parte faz para a oficina.>

## Como conferi

Comando: `node conferir.mjs`

```text
<saída completa do comando, colada sem alteração>
```

Resultado: <X de Y verificações OK>. <Se houve falha, liste aqui cada FALHA e diga que a entrega não está pronta.>

## O que ficou de fora

<Pedidos do combinado que não foram feitos nesta etapa, e o motivo. Se nada ficou de fora, escreva "Nada ficou de fora nesta etapa.">

## O que depende do cliente

<Perguntas e dados que só o cliente pode dar. Exemplo: senhas definidas na instalação, dados reais de ordens, decisões sobre status.>
```

## Depois de gerar

- Mostre ao usuário o caminho do `ENTREGA.md` e o resultado da conferência, em uma ou duas linhas.
- Se alguma seção ficou vazia, diga por quê, em vez de deixar em branco.
