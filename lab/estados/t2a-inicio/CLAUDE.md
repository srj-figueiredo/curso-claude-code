# Oficina Boa Estrada

Sistema de ordens de serviço de uma oficina (cliente fictício do curso). Roda no computador da oficina.

## Como construir
- Use apenas o que já vem com o Node.js (sem instalar pacotes). Banco: `node:sqlite`. Servidor: `node:http`.
- O sistema inicia com `node servidor.mjs` e abre em http://localhost:3000.
- O banco fica no arquivo `dados/oficina.db`.

## Regras de conteúdo
- Não guarde CPF nem dado desnecessário.
- Nunca guarde nem mostre senha em texto puro.
- Não invente clientes: no máximo três ordens de exemplo, marcadas como "EXEMPLO".
- Toda informação vem do `briefing.md`. Se faltar dado, pergunte.

## Como trabalhar
- Antes de uma mudança grande, mostre um plano.
- Depois de qualquer mudança, rode `node conferir.mjs` e mostre o resultado.
