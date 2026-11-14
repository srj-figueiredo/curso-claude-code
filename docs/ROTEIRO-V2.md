# Roteiro v2 (rascunho para aprovação)

Data: 13/11/2026 (revisado em 14/11/2026). Estado: **aprovado pelo autor**. Temporadas 1 a 3 escritas; a T4 e a T5 seguem o roteiro. Diferenças da proposta: o cliente da T2 virou uma oficina (não uma clínica, para evitar dado de saúde) e a T3 usa simulador local, com a troca para a API paga orientada e testada só contra servidor falso (D021).

## 1. Para quem é

Uma pessoa que **não programa** e quer **vender serviços a pequenas empresas** usando o Claude Code.
Perfil de referência: alguém de 30 a 45 anos vindo de administração, atendimento, marketing ou
comércio, que usa bem o WhatsApp e o Excel, nunca abriu um terminal e quer uma renda nova com IA.

O que ela precisa sentir: "consigo", "isso serve para um cliente real" e "quero o próximo".

## 2. A promessa (honesta)

Ao terminar, a pessoa:

1. Entrega ao menos **três projetos de portfólio** que funcionam e estão no ar.
2. Sabe **conduzir o processo** de um trabalho profissional: briefing, escopo, construção, verificação,
   entrega, manutenção e proposta comercial.
3. Sabe os **limites** (segurança, LGPD, o que a IA erra) e não vende o que não consegue sustentar.

O curso **não promete** renda nem clientes. Ensina a fazer o trabalho com rigor e a construir o preço
(sem tabela de mercado inventada).

## 3. A mudança de arquitetura

| Hoje | Proposto |
|---|---|
| Módulos por **recurso** (Memória, Skills, MCP, Hooks) | **Temporadas por projeto**, cada uma com um cliente fictício |
| Ferramenta primeiro, uso depois | **Dor primeiro**: o recurso entra quando o projeto precisa dele |
| Projetos de verdade só no fim | Projeto desde a primeira hora; o aluno entrega algo visível a cada etapa |
| Parte II "O menu / dissecado" no caminho de estudo | Vira **Referência**, para consulta, fora do caminho principal |
| Vender (C0) no final | **"Como vender isso"** ao fim de cada temporada, em pequenas doses |

## 4. As temporadas

A ordem segue o **que o aluno precisa saber para o seguinte**, e a prioridade de projetos segue o
radar de demanda do curso (Workana, 12/11/2026; amostra de 352 projetos de TI, classificada por título,
não é censo). Chatbot (41%) e sistema sob medida (21%) lideram. Por isso ocupam o miolo, mas o chatbot
vem depois do sistema, porque usa o mesmo alicerce (servidor e banco) e é mais difícil.

| T | Cliente fictício | Entrega | O que o aluno aprende (na hora da dor) | Demanda |
|---|---|---|---|---|
| **T1** Primeiro cliente | Um pequeno negócio local precisa de site | **Site no ar com formulário que funciona** | Instalar, conversar com o Claude Code, ele "pensar", conduzir, git e GitHub explicados como "histórico e cópia de segurança", publicar, `CLAUDE.md` (quando ele esquece a identidade do cliente), pedir plano e verificar | Landing: 7% |
| **T2** Sistema do cliente | Uma clínica ou prestadora precisa organizar clientes e atendimentos | **Painel com login, banco e relatório** | Dados reais, login, segredos e permissões (a regra que parece cofre), backup, testes, skills, hooks como "travas automáticas" | Sistema: 21% |
| **T3** Atendimento com IA | A mesma empresa quer responder clientes no WhatsApp | **Agente de atendimento com base de conhecimento e repasse a humano** | Servidor e webhooks, Claude API no produto, MCP, guardrails, LGPD, custo por conversa | Chatbot: 41% |
| **T4** Rotina automática | Uma loja quer relatórios e planilhas sem digitação | **Automação que lê documentos e envia relatório** | Automação sem você, PDFs e planilhas, agendar, revisar | Automação: 8% (subcontada) |
| **T5** Profissional | O aluno escolhe um caso e fecha o ciclo | **Projeto final + proposta comercial** | Subagentes, revisão e segurança, custos, entrega e manutenção, portfólio | Todos |

Opcionais (trilha extra, mesmo molde): conteúdo em escala (C5) e edição de vídeo (C6).
Para aprofundar (fora do caminho principal): Agent SDK, plugins e mods, Claude Code na empresa.

## 5. Como cada estação é escrita

Seis passos, sempre nesta ordem:

1. **Cena.** Uma situação do cliente em três a cinco linhas.
2. **Primeiro resultado em até 10 minutos.** O aluno vê funcionar antes de entender.
3. **Por que funcionou.** A explicação simples, com uma analogia.
4. **Quando dá errado.** O tropeço realista e como sair dele (é aqui que entra o recurso novo).
5. **Entrega.** O que o aluno pode mostrar a alguém.
6. **Como vender isso.** Dois ou três parágrafos: o que prometer, o que não prometer, como cobrar.

Regras de linguagem:

- Linguagem de conversa. Termo técnico só depois de uma frase simples que o explique.
- **Nada de JSON na camada principal.** Configuração se faz pedindo ao Claude e conferindo o resultado.
  A sintaxe fica na camada recolhida ("Por baixo do capô").
- Terminal apresentado como "a janela de conversa com o Claude Code".
- Cada comando traz o **motivo** antes e **o que esperar** depois.
- Profundidade preservada, em camadas recolhíveis e na Referência.

## 6. O que aproveitamos

| Existente | Destino |
|---|---|
| M1 Instalação, M2 Como pensa, M3 Dia a dia | T1 (reescritos como começo de projeto) |
| M4 Git/GitHub, M5 No ar | T1 |
| M6 Memória | T1, no ponto em que o Claude esquece o cliente |
| M7 Segurança (piloto) | T2, motivado pelos dados reais da clínica |
| M8 Skills, M9 Hooks | T2 |
| M10 MCP, M20 Backend, M21 Claude API | T3 |
| M11 Planejar e verificar | T1 e T5 |
| M14, M22 | T4 |
| R1 a R8 (menu dissecado) | Referência |
| C0 a C6, projeto final | Diluídos nas temporadas (C0 em doses; C5 e C6 como opcionais) |
| Fatos verificados, provas, laboratórios, site, visual, CI | Mantidos |

## 7. Riscos e limites que preciso declarar

- **Demanda:** o radar cobre um marketplace de freelancers (TI), com ~44 propostas por projeto.
  Não tenho dado sobre a procura de **pequenas empresas locais** por esses serviços. O curso deve dizer isso
  e tratar o radar como treino, não como previsão.
- **Esforço:** é uma reorganização grande. As ondas seguintes (Hooks, agentes, plugins etc.) ficam em pausa.
- **Conteúdo técnico profundo** (hooks, MCP, SDK) pesa para um não técnico. A ordem e a camada recolhível
  existem para isso, mas é o ponto mais difícil do texto.
- **Qualidade "vendável":** exige revisão humana e, em segurança e LGPD, orientação profissional.
  O curso ensina o processo, não substitui um advogado ou um especialista.

## 8. Execução proposta

1. Você aprova (ou corrige) este roteiro.
2. Escrevo a **T1 inteira** como piloto de verdade: cliente, 3 a 4 estações, entrega no ar. É o teste
   do formato novo.
3. Você lê no celular e aprova.
4. Reescrevo T2 a T5 em lotes, com o double check de sempre.
5. Atualizo `BRIEFING.md`, `GUIA-DO-AUTOR.md`, `curso.ts` (mapa do metrô) e a home.
