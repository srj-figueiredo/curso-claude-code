# Revisão geral 1 (14/11/2026)

Escopo: as 12 estações novas (T1A a T3D), o piloto do guia de segurança, os guias antigos renomeados, o mapa, os componentes novos e os documentos. Roteiro reutilizável na regra 42 de `docs/REGRAS-DO-CURSO.md`.

## O que foi verificado

| Verificação | Resultado |
|---|---|
| Códigos antigos (M, R, C) nas estações novas e no guia de segurança | 0 |
| Códigos antigos no site gerado (texto visível) | 0 (as ocorrências "M4", "M6" etc. são coordenadas de desenhos SVG) |
| Caixas de seleção sem rótulo e rótulo "Desafio extra" | 0 |
| ZIPs de laboratório citados nas páginas existem | todos |
| Fichas do corpo x exercícios do cabeçalho | iguais nas 12 |
| Molde (Conceitos, Como vender, capô, armadilhas, Domínio e entrega, Saída, Fontes, Prova) | completo nas 12 |
| Links internos | 1.112 verificados, 0 quebrados |
| Rolagem horizontal e erros de console no celular (390 px) e no desktop (1280 px), 17 páginas | 0 erros; 0 rolagem |
| Busca (Pagefind) | 23 páginas indexadas, inclusive as 12 novas |
| Acessibilidade (axe, papel e console), 54 testes | **54 de 54, duas rodadas seguidas**. A falha intermitente que aparecia na primeira página tinha causa conhecida: um servidor de desenvolvimento esquecido na porta 4321 (corrigido; ver PENDENCIAS 7.13) |
| Tamanho do Essencial | 864 a 1.330 palavras (antes: ~1.950); total por estação 2.900 a 4.300 |

## Problemas encontrados e corrigidos

1. **"Próxima estação" desatualizada:** a T1D e a T2D diziam que a temporada seguinte estava "em construção" (e a T1D falava de uma clínica). Agora apontam para T2A e T3A.
2. **Gênero marcado ao leitor:** "você mesmo" em 7 pontos das T2 e T3, trocado por formas neutras.
3. **Tempo do cabeçalho subestimado** em 11 das 12 estações (somava só as fichas). Recalculado como leitura + fichas + teste de domínio (+ projeto nas últimas): de 75-210 min para 90-225 min.
4. **Código longo saindo da tela no desktop** dentro da nota "Sem a tela interativa" (cortado em 6 páginas). A nota agora quebra a linha.
5. **Termos sem definição no texto principal:** HTTP (T3C), "conta de API" (T1A). Definidos. Um "módulo" (T1C) virou "guia".
6. **Restos da estrutura antiga:** "Parte II" no cabeçalho do baralho e em dois guias. Trocados por "Guias".
7. **Guia de abertura:** recebeu um aviso de que o curso agora é organizado em Temporadas.
8. **Mapa de conceitos** e **roteiro** atualizados.

## Pendências desta revisão (não corrigidas)

- **Guia "Mapa do Claude Code e regras do jogo":** as seções "Como usar este manual" e "As três trilhas" ainda descrevem a estrutura anterior. Precisa de reescrita; hoje só tem o aviso.
- **Trilhas (Rápida, Completa, Empresa)** na home e no mapa ainda listam estações antigas e novas misturadas. Redesenhar quando as Temporadas 4 e 5 existirem.
- **Selo de versão mistura 2.1.323 (guias) e 2.1.325 (estações novas).** Atualizar quando os guias forem reexecutados.
- **Duração:** as últimas estações de cada temporada passam de 3 horas. Avaliar dividir.
- **Termos definidos só no "Conceitos" e não no corpo** em algumas estações (por exemplo "hash" na T2B). É intencional, mas vale reler com uma pessoa não técnica.
- **Não testado** (reunido em `VERIFICATION/t2.md` e `t3.md`): API real, WhatsApp oficial, hospedagem 24 horas, `iniciar.cmd`, instalação em outro computador, textos jurídicos.

## Adendo (14/11/2026): divisão em partes menores

As 12 estações foram divididas em 30 partes (D022). Conferido depois da divisão: 46 páginas construídas, 2.642 links internos e 0 quebrados; fichas do corpo iguais às do cabeçalho em todas as partes; 3 objetivos ou mais e 3 itens de resumo em cada parte; duas referências a fichas que ficaram em outra parte foram corrigidas ("Ficha 3, na parte 2"); nenhuma rolagem lateral nem erro de console no celular e no desktop nas 13 páginas novas testadas; o mapa mostra um ponto por estação. Maior parte: 80 minutos; menor: 40.

