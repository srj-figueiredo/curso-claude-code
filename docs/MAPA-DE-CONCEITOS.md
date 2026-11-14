# Mapa de conceitos

Gerado por `node scripts/mapa-de-conceitos.mjs` em 2026-11-14. **Não edite à mão**: ajuste as tabelas `FEITO` e `DESTINO` do script.

Regra do curso: todo conceito dos módulos de referência (M0 a M8 e M10, os já escritos) precisa de um destino nas Temporadas.
No início de cada estação nova, o componente `<Conceitos>` avisa o que a pessoa vai aprender e aponta a referência dos conceitos que só virão depois.
Ao final do curso, nenhuma linha pode ficar em "Planejado".

**Progresso:** 30 de 146 conceitos já ensinados nas estações escritas (T1A a T2D).

Os módulos ainda não escritos (M9 Hooks, M11 Planejar e verificar, M12 a M19, M20 a M22, R1 a R8, C0 a C6 e o projeto final) entram na ordem do roteiro v2 (`docs/ROTEIRO-V2.md`). Os conceitos deles serão acrescentados aqui quando as páginas existirem.

### M0 (Mapa do Claude Code e regras do jogo)

| Conceito | Onde é ensinado |
|---|---|
| O que é: um agente, não um chat com sotaque de programador | Planejado: T1A + Referência |
| Onde roda: um motor, várias portas | Planejado: T1A + Referência |
| Chat para pensar, Claude Code para fazer | Planejado: T1A + Referência |
| O pré-requisito pago inescapável | Planejado: T1A + Referência |
| Como usar este manual | Planejado: T1A + Referência |
| O selo de versão | Planejado: T1A + Referência |
| As três trilhas | Planejado: T1A + Referência |
| Glossário de bolso | Planejado: T1A + Referência |
| Três ambientes de execução | Planejado: T1A + Referência |
| O que as portas compartilham, e o que não | Planejado: T1A + Referência |
| O que cada tipo de conta alcança | Planejado: T1A + Referência |
| Requisitos de sistema da CLI | Planejado: T1A + Referência |
| Por que sua versão anda na frente do selo | Planejado: T1A + Referência |

### M1 (Instalação e primeiro contato)

| Conceito | Onde é ensinado |
|---|---|
| O terminal em cinco minutos | **T1A** (escrito) |
| Instalar | **T1A** (escrito) |
| A trilha Windows | **T1A (Referência)** (escrito) |
| Verificar, e o tal do PATH | **T1A (Referência)** (escrito) |
| Entrar com a sua conta | **T1A** (escrito) |
| Sem terminal: app desktop e VS Code | Planejado: T1A |
| Tour da interface | Planejado: T1A |
| Três jeitos de chamar | Planejado: T1A |
| O que o instalador põe na sua máquina | Planejado: T1A |
| Atualizações e canais | Planejado: T1A |
| A instalação por npm | Planejado: T1A |
| Onde a credencial mora | Planejado: T1A |
| Quando há mais de uma credencial | Planejado: T1A |
| O -p carrega a mesma configuração | Planejado: T1A |
| Quanto custou o "Olá" | Planejado: T1A |

### M2 (Como o Claude Code pensa)

| Conceito | Onde é ensinado |
|---|---|
| O laço: coletar, agir, verificar | Planejado: T1B + T5 |
| As ferramentas que ele tem | Planejado: T1B + T5 |
| A janela de contexto: a memória de trabalho | **T1B (parcial)** (escrito) |
| O cache: por que trocar de modelo no meio custa | Planejado: T1B + T5 |
| Modelos, esforço e raciocínio | Planejado: T1B + T5 |
| O cache expira | Planejado: T1B + T5 |
| Onde o cache vive e o que o separa | Planejado: T1B + T5 |
| Subagentes e cache | Planejado: T1B + T5 |
| Janela de contexto e compactação automática | Planejado: T1B + T5 |
| Imagens acumuladas | Planejado: T1B + T5 |
| O que o laço faz com permissões | Planejado: T1B + T5 |

### M3 (Conduzindo no dia a dia)

| Conceito | Onde é ensinado |
|---|---|
| O pedido: três coisas que ele não tem como adivinhar | **T1A e T1B** (escrito) |
| Entregue o material em vez de descrevê-lo | **T1A** (escrito) |
| Quanta rédea: os modos de permissão | **T1B (parcial)** (escrito) |
| Modo plano: pense antes, edite depois | **T1B** (escrito) |
| Corrigir cedo: Esc, rewind e recomeço | Planejado: T1B |
| Guardar a conversa: sessões | Planejado: T1B |
| No teclado | Planejado: T1B |
| Pedir o commit | **T1D** (escrito) |
| O que um checkpoint guarda | Planejado: T1B |
| Quando a mensagem da fila chega | Planejado: T1B |
| O que uma sessão retomada traz de volta | Planejado: T1B |
| O plano no modo -p | Planejado: T1B |
| Quanto custa retomar | Planejado: T1B |

### M4 (Git e GitHub do zero)

| Conceito | Onde é ensinado |
|---|---|
| Por que git vem antes de tudo | **T1D** (escrito) |
| O modelo mental: três lugares | **T1D (parcial)** (escrito) |
| O Claude operando git | **T1D** (escrito) |
| Do seu computador para o GitHub | **T1D (parcial)** (escrito) |
| .gitignore e segredos | Planejado: T1D + T2 |
| Conflitos: quando duas mudanças brigam | Planejado: T1D + T2 |
| Desfazer e recuperar | **T1D (parcial)** (escrito) |
| Quando um segredo vaza | Planejado: T1D + T2 |
| O que o git guarda de verdade | Planejado: T1D + T2 |
| merge, rebase e squash | Planejado: T1D + T2 |
| Regras de permissão para git | Planejado: T1D + T2 |
| Instruções de git que o Claude já traz | Planejado: T1D + T2 |
| Worktrees | Planejado: T1D + T2 |

### M5 (Do computador para a internet)

| Conceito | Onde é ensinado |
|---|---|
| O que é um site estático | Planejado: T1D + T5 |
| Onde publicar de graça | Planejado: T1D + T5 |
| Publicar no GitHub Pages, passo a passo | **T1D (parcial)** (escrito) |
| Domínio e DNS | Planejado: T1D + T5 |
| HTTPS | Planejado: T1D + T5 |
| O que vai para o navegador é público | **T1D** (escrito) |
| Prévias e voltar atrás | Planejado: T1D + T5 |
| Medir visitas sem rastrear gente | Planejado: T1D + T5 |
| Site de usuário e site de projeto | Planejado: T1D + T5 |
| Limites de build do GitHub Pages | Planejado: T1D + T5 |
| Versões das ações | Planejado: T1D + T5 |
| Apex, ALIAS e ANAME | Planejado: T1D + T5 |
| Como o concurrency ajuda | Planejado: T1D + T5 |
| Cache e "não atualizou" | Planejado: T1D + T5 |

### M6 (Memória e CLAUDE.md)

| Conceito | Onde é ensinado |
|---|---|
| Duas memórias, dois autores | **T1C (parcial)** (escrito) |
| Onde o CLAUDE.md mora | **T1C (parcial)** (escrito) |
| Gerar o primeiro com /init | **T1C** (escrito) |
| O que escrever (e o que não escrever) | **T1C** (escrito) |
| Importar arquivos e manter o pessoal fora do git | Planejado: T1C + T2 |
| Quando um arquivo só não basta | Planejado: T1C + T2 |
| Repositório que já tem AGENTS.md | Planejado: T1C + T2 |
| A memória automática | Planejado: T1C + T2 |
| Memória e compactação | Planejado: T1C + T2 |
| A pasta .claude | Planejado: T1C + T2 |
| Em projeto grande | Planejado: T1C + T2 |
| Tamanhos que importam | Planejado: T1C + T2 |
| O aviso de tamanho | Planejado: T1C + T2 |
| Outras pastas e hooks de diagnóstico | Planejado: T1C + T2 |
| Instruções do próprio Claude Code competindo com as suas | Planejado: T1C + T2 |
| Importação externa | Planejado: T1C + T2 |
| Subagentes e memória | Planejado: T1C + T2 |
| Desligar a memória automática | Planejado: T1C + T2 |

### M7 (Configurações, permissões e segurança)

| Conceito | Onde é ensinado |
|---|---|
| Quem decide: o Claude ou o Claude Code? | **T2B (parcial)** (escrito) |
| Onde guardar as listas | Planejado: T2 |
| Como escrever uma regra que realmente pega | **T2B (parcial)** (escrito) |
| O .env: a regra que parece cofre e não é | **T2B** (escrito) |
| Modos de permissão: quanto você confia hoje | Planejado: T2 |
| Prompt injection: o bilhete escondido no livro | Planejado: T2 |
| O sandbox: a cerca de verdade | **T2B (parcial)** (escrito) |
| Resumo: as camadas, do mais fraco ao mais forte | **T2B (parcial)** (escrito) |
| Regras de Bash em detalhe | Planejado: T2 |
| Regras de Read e Edit | Planejado: T2 |
| Modos: travas e caminhos protegidos | Planejado: T2 |
| Confiança da pasta e claude -p | Planejado: T2 |
| Wrappers | Planejado: T2 |
| Remoção em caminho crítico | Planejado: T2 |
| Limites de diretório e travas | Planejado: T2 |
| Windows e WebDAV | Planejado: T2 |
| Menos prompts, sem abrir a guarda | Planejado: T2 |
| Confiança em MCP e plugins | Planejado: T2 |
| O bypass e o dev container | Planejado: T2 |
| Privacidade e uso de dados | Planejado: T2 |
| Glossário rápido | Planejado: T2 |

### M8 (Skills)

| Conceito | Onde é ensinado |
|---|---|
| O que é uma skill | **T2C (parcial)** (escrito) |
| Skill, CLAUDE.md, hook, MCP ou subagente? | **T2C (parcial)** (escrito) |
| Anatomia de uma skill | **T2C (parcial)** (escrito) |
| Os campos do cabeçalho que mais importam | Planejado: T2 |
| Argumentos | Planejado: T2 |
| Contexto vivo: ! e um comando | Planejado: T2 |
| Vida e custo de uma skill | Planejado: T2 |
| Distribuir | Planejado: T2 |
| De onde vem o nome do comando | Planejado: T2 |
| Nomes que o Claude Code recusa | Planejado: T2 |
| Descrição cortada | Planejado: T2 |
| Validar cabeçalhos | Planejado: T2 |
| Arquivos de apoio e variáveis | Planejado: T2 |
| Dica de design | Planejado: T2 |

### M10 (MCP)

| Conceito | Onde é ensinado |
|---|---|
| O que é MCP | Planejado: T3 |
| Como ligar um servidor: transporte e comando | Planejado: T3 |
| Escopos: onde a configuração mora | Planejado: T3 |
| Usar: ferramentas, recursos e prompts | Planejado: T3 |
| Autenticação | Planejado: T3 |
| Custo de contexto: a busca de ferramentas | Planejado: T3 |
| Confiança e segurança | Planejado: T3 |
| Servidores úteis | Planejado: T3 |
| Como um servidor stdio conversa | Planejado: T3 |
| Encerramento e variáveis | Planejado: T3 |
| Atualização, reconexão e canais | Planejado: T3 |
| claude mcp add-json e o Claude Desktop | Planejado: T3 |
| Administração | Planejado: T3 |
| Claude Code como servidor MCP | Planejado: T3 |
