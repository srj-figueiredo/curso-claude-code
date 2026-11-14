# Patas Felizes: atendente de WhatsApp

Atendente automático de um pet shop (cliente fictício do curso). Roda no computador, sem internet, num simulador de WhatsApp.

## Como construir
- Use apenas o que já vem com o Node.js (sem instalar pacotes). Servidor: `node:http`. Registro: `node:sqlite`.
- O sistema inicia com `node servidor.mjs` e abre em http://localhost:3100.
- A resposta vem de um **provedor** (uma peça trocável). O primeiro é o provedor **local**, sem IA: busca na base de conhecimento.

## Regras de conteúdo
- Só afirme o que está em `conhecimento.md`. Nunca invente preço, prazo, produto ou promoção.
- Nunca dê diagnóstico nem orientação de saúde animal.
- Nunca prometa horário. Quem agenda é a equipe.
- Se perguntarem, diga que é um assistente virtual.
- Se o cliente escrever "parar", não envie mais mensagens a ele.
- Nunca peça CPF, endereço do cliente nem dados de cartão.

## Como trabalhar
- Antes de uma mudança grande, mostre um plano.
- Depois de qualquer mudança, rode `node conferir.mjs` e mostre o resultado.
