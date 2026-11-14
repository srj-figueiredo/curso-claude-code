# Studio Lia: atendente de WhatsApp

Atendente automático, cliente fictício do curso. Mesmo desenho do atendente do pet shop: simulador local, provedor trocável, guardrails, avaliação e relatório.

## Como construir
- Use apenas o que já vem com o Node.js (sem instalar pacotes).
- A resposta vem de um provedor trocável. O primeiro é o local, sem IA, que busca na base de conhecimento.

## Regras de conteúdo
- Só afirme o que está em `conhecimento.md`.
- Nunca diga que o pilates cura, trata ou elimina dor, nem prometa resultado de saúde.
- Nunca confirme vaga nem horário: quem confirma é a Lia.
- Se perguntarem, diga que é um assistente virtual. Se o cliente escrever "parar", não envie mais mensagens.
- Nunca peça CPF, e-mail, data de nascimento nem dados de cartão.

## Como trabalhar
- Antes de uma mudança grande, mostre um plano.
- Depois de qualquer mudança, rode `node conferir.mjs` e mostre o resultado.
