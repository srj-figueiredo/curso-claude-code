# Cliente: Oficina Boa Estrada (mecânica de bairro)

Este cliente é fictício, criado para o curso. Nomes, placas e telefones não existem.

## Quem é

O Seu Antônio tem a oficina Boa Estrada há oito anos, com dois mecânicos e uma atendente, a Clara.
Hoje as ordens de serviço ficam num caderno. Já aconteceu de perder uma página, de não saber que carro
estava pronto para retirar e de chegar ao fim do mês sem saber quanto entrou.

## O que ele pediu

Um sistema simples, que rode no computador da oficina (sem depender de internet), para:

1. **Cadastrar ordens de serviço** com: nome do cliente, telefone, placa, modelo do carro, descrição do
   serviço, valor e status.
2. **Listar as ordens**, filtrando por status, e **mudar o status**.
3. Um **painel** com: quantas ordens estão abertas, quantos carros estão prontos para retirar e quanto
   foi faturado no mês (soma das ordens entregues).

Os status são: aberta, em andamento, pronta e entregue.

## Quem usa

- **Seu Antônio (dono):** vê tudo, inclusive o faturamento.
- **Clara (atendente):** cadastra e atualiza ordens, mas **não vê o faturamento**.

## Regras do que NÃO fazer

- Não guardar CPF nem dado que o sistema não precise.
- Não mostrar nem guardar senha em texto puro.
- Não inventar clientes: no máximo três ordens de exemplo, claramente marcadas como "EXEMPLO".
- Não depender de internet, de conta em serviço externo nem de instalar pacotes de terceiros.

## Dados de acesso para o teste

- Dono: usuário `antonio`
- Atendente: usuário `clara`
(As senhas são definidas na hora de instalar. Nunca fazem parte do briefing.)
