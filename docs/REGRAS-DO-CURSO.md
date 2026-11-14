# Regras do curso (consolidadas em 13/11/2026)

Reúne tudo o que o autor definiu em conversa. **Leia este arquivo antes de escrever qualquer página.**
Detalhes de cada regra: `DECISIONS.md` (D015 a D018), `docs/ROTEIRO-V2.md`, `docs/GUIA-DO-AUTOR.md` (seção 10) e `docs/MAPA-DE-CONCEITOS.md`.

## 1. Para quem e para quê

1. **Público:** pessoas que **não programam** e querem **vender serviços a pequenas empresas**.
2. **Promessa honesta:** o aluno sai com projetos no ar, sabendo conduzir o processo (briefing, plano, construção, conferência, entrega, manutenção) e sabendo os limites (segurança, LGPD, erros da IA). **Nunca** prometer renda nem clientes. **Nunca** inventar tabela de preços de mercado: ensinar a **construir** o preço.
3. **Tom:** simples e profundo, fluido e agradável, que prenda a atenção. Conversa de professor, frases curtas.
4. **Projetos priorizados pela demanda** do radar do curso (chatbot 41%, sistema sob medida 21%, automação 8%, landing 7%; amostra de 352 projetos de TI do Workana, não é censo). Declarar sempre os limites desse dado.

## 2. Estrutura do curso

5. **Temporadas por projeto**, cada uma com um cliente fictício e uma entrega: T1 site, T2 sistema com login, T3 atendimento com IA, T4 automação, T5 profissional. O recurso entra **na hora em que o projeto precisa dele**.
6. **Os módulos antigos permanecem como Referência** (guias de consulta). Nada se perde.
7. **Nenhum código da nomenclatura antiga (M1, M2, M3...) aparece no texto novo.** Cite o guia pelo **nome**: `o guia "Git e GitHub do zero"`. Termos técnicos (skills, agentes, hooks, MCP) ficam. O código das estações novas (T1A, T1B...) é a nomenclatura nova.
8. **Cobertura total:** todo conceito dos módulos antigos precisa de destino. `docs/MAPA-DE-CONCEITOS.md` (gerado por `node scripts/mapa-de-conceitos.mjs`) não pode ter linha "Planejado" ao final do curso.
9. **Sequência visual mantida** em toda estação: placa, "Em três linhas", Essencial, camadas, fichas, checklist, próxima estação, fontes.

## 3. Molde de cada estação

10. **Abre com `<Conceitos>`:** o que o aluno vai aprender (em frase simples) e o que só vai ouvir falar (com link para o guia de referência, sem código).
11. **Ordem:** cena do cliente, primeiro resultado em até 10 minutos, "por que funcionou" com analogia, quando dá errado (aqui entra o recurso novo), "Como vender isso", camada "Por baixo do capô", camada "Armadilhas", fichas, **Domínio e entrega**, checklist de saída, próxima estação, fontes.
12. **Dor antes da ferramenta.** Mostre o problema do cliente, depois o recurso que o resolve. Nunca abrir com tabela de regras.
13. **Termo técnico só depois de uma frase simples e, de preferência, de uma analogia do dia a dia.**
14. **Nada de JSON ou sintaxe na camada principal.** Configuração: pede-se ao Claude e confere-se o resultado. A sintaxe fica em "Por baixo do capô".
15. **Cada comando traz o motivo antes e o que esperar depois.**
16. **O erro real vira lição.** O que a execução mostrou de defeito (o domingo, o "aliviar", o tom que não mudou) entra na página.
17. **A receita é visível e editável:** `<Arquivo>` mostra briefing, `CLAUDE.md` e `conferir.mjs` na página, e há ficha para o aluno mudar uma linha e ver o efeito.
18. **Fichas:** passos para a tela interativa; quando a execução real foi com `claude -p`, uma `<Nota rotulo="Sem a tela interativa">` traz o equivalente. O extra das fichas se chama `<Desafio>`, que aparece como **"Vá além"**.
19. **Linguagem neutra:** não presumir o gênero de quem lê ("por conta própria", não "você mesma"); cliente genérico é "quem contratou".

## 4. Domínio e entrega (D018)

20. **Toda estação termina com `<Entrega>`:** teste de domínio **sem passo a passo** com um segundo cliente (hoje o Studio Lia), rubrica "você domina se consegue, sem olhar a página", e o **material de entrega** (prévia, relatório de entrega, manual do site, pacote, reunião de entrega, termo de aceite, quem é dono de cada peça).
21. **A última estação de cada Temporada traz o projeto completo** e uma autoavaliação com regra do que fazer conforme o resultado.
22. Os modelos de documento levam o aviso de que **não são aconselhamento jurídico**.

## 5. Verdade e execução

23. **Fonte de verdade:** a documentação oficial em cache (`.docs-cache/en/`) e a CLI instalada. Nunca descrever comando, flag, tecla ou preço de memória. O que não deu para conferir: "não testado" (`verificacao="nao-testado"`).
24. **Executar de verdade**, em pasta temporária fora do repositório, com `claude -p` (a tela interativa não é automatizável). Registrar em `VERIFICATION/<id>.md`: afirmação, fonte, resultado, execução, o que não foi testado.
25. **Apagar o que os testes criam** em `~/.claude/projects` e `~/.claude/plans`. Não alterar a configuração global do usuário (`~/.claude/settings.json`, `~/.claude.json`). Não instalar nada globalmente.
26. **Não publicar nada do aluno nem criar repositório ou conta**: o que depende disso é "não testado".
27. **Versão:** a ficha mostra a versão da CLI da execução (`versao="2.1.325"`). O texto do Claude varia entre execuções e o modelo padrão da máquina varia; as páginas dizem isso.
28. **Preços e limites de terceiros:** só com fonte oficial conferida no dia. Sem fonte, não citar número.

## 6. Verificação (double check, sem pedir permissão)

29. **Ao terminar cada módulo ou estação, fazer a rechecagem sozinho:** números contra as execuções, fatos contra a documentação, comandos reproduzidos no **Windows PowerShell 5.1**, HTML renderizado, links, acessibilidade. Corrigir, registrar a seção "Rechecagem" no `VERIFICATION`, e **seguir para o próximo anunciando qual**.
30. **Portões antes de publicar:** `npm run check` (procurar `error|Result`, não só "errors"), `npm run build`, 0 links internos quebrados, `npm run teste:a11y` (axe, papel e console) sem falhas.
31. **Acessibilidade:** não usar caixas de seleção (`- [ ]`) sem rótulo; contraste mínimo 4,5:1.

## 7. Visual

32. **Identidade "Linhas de metrô"** (D016): uma cor de linha por Parte (a Temporada 1 é a linha roxa), pílulas, cantos arredondados, fundo quase branco, modo Console.
33. **Mascote Bloquinho**, em poucos pontos: cabeçalho, capa, Prova de que funcionou, Deu erro?, Checklist de saída, Domínio e entrega, Conceitos, 404 e favicon. Não é o mascote oficial do Claude Code.

## 8. Processo e privacidade

34. **Commits em português, no imperativo**, com as linhas `Co-Authored-By` e `Claude-Session`. **Push depois de cada item**; o CI publica sozinho. Nunca deixar o build quebrado no `main`.
35. O e-mail do autor não vai a serviços externos nem às páginas do curso. Nenhum segredo, nem de teste, é publicado.
36. **Conversa com o autor:** citar guias e estações **pelo nome**, sem código ("o guia Memória e CLAUDE.md", "a estação Seu primeiro cliente"). Respostas formatadas conforme o `CLAUDE.md` da pasta pai.
37. Pendências que dependem do autor ficam em `PENDENCIAS.md`; decisões, em `DECISIONS.md`; estado e fila, em `PROGRESS.md`.
