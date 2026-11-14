# PENDÊNCIAS para resolver juntos (no computador)

Criado em 13/11/2026, ao fim do M5. Reúne tudo que ficou aberto até aqui e **precisa de você** (decisão, permissão
ou acesso à sua conta/máquina). A fila de escrita continua no `PROGRESS.md`; este arquivo é só o que trava ou arrisca
o projeto. Ao resolver um item, marque `[x]` e anote a data e o commit.

Legenda: 🔴 bloqueia ou expõe algo · 🟡 importante, não bloqueia · 🟢 baixa prioridade.

---

## 1. Publicação e privacidade (🔴 fazer primeiro, nesta ordem)

- [x] **1.1 (feito 13/11/2026)** Liberar a criação do repositório público.** O classificador de permissões negou
  `gh repo create curso-claude-code --public --source . --push` (13/11). Nada foi criado nem enviado.
  *Como resolver:* no computador, rodar o comando você mesmo (no Claude Code, digitando `! gh repo create ...`), ou
  adicionar uma regra de permissão para ele no seu `settings.json` (eu não posso editar a configuração global).
  *Depois:* ligar o Pages (`gh api -X POST repos/{dono}/curso-claude-code/pages -f build_type=workflow`), esperar o
  workflow, abrir a URL e escrevê-la no topo do `PROGRESS.md` e no `README.md`. A URL esperada, pelo `astro.config.mjs`,
  é `https://srj-figueiredo.github.io/curso-claude-code/`.
- [x] **1.2 (decidido 13/11/2026: manter o gmail; ele já é público no perfil)** E-mail pessoal nos commits (🔴 antes de 1.1).** Os 19 commits (até 13/11) levam `srfigueiredo@gmail.com` como autor.
  Num repositório público, isso fica exposto. *Decidir:*
  (a) só trocar o e-mail dos commits **futuros** pelo endereço `ID+usuario@users.noreply.github.com`
  (GitHub, Settings, Emails, "Keep my email addresses private"), aceitando que os antigos mantêm o e-mail; ou
  (b) **reescrever o histórico** antes de publicar (`git filter-repo`/`rebase`), que é destrutivo e exige sua
  autorização explícita. *Recomendação:* (b) agora, enquanto o repositório ainda é só local e não há ninguém clonando.
- [x] **1.3 (feito 13/11/2026: passou de primeira, 1m41s + 11s)** Primeiro CI de verdade no Linux.** O `.github/workflows/deploy.yml` nunca rodou. Pode quebrar em:
  `npm run check`, `npx playwright install --with-deps chromium`, o empacotamento dos ZIPs do laboratório
  (`scripts/empacotar-lab.mjs`) e os 22 testes de acessibilidade. *Ajustar o que falhar.*
- [x] **1.4 (feito 13/11, antes da publicação)** Atualizar `actions/upload-pages-artifact` de `@v3` para `@v4` no `deploy.yml`.** A documentação do GitHub
  de 13/11/2026 mostra v4 (e `actions/checkout` mais novo). Conferir as versões atuais na doc antes de trocar.
- [x] **1.5 (feito: https://srj-figueiredo.github.io/curso-claude-code/)** Seu link para ver no celular.** Você pediu um link e não havia nada publicado. Duas saídas: resolver 1.1 (o
  site completo no ar) ou, enquanto isso, publicar **uma página avulsa privada** (HTML único) como artefato do
  claude.ai. A segunda opção não foi feita.

- [ ] **1.6 (novo) Avisos do CI:** o GitHub avisa que `actions/checkout@v4`, `setup-node@v4` e `upload-artifact` rodam em Node 20
  (descontinuado) e são forçados a Node 24, e que `ubuntu-latest` migra para o Ubuntu 26 em 19/10/2026. Não quebra nada;
  atualizar para as majors novas (a doc de Pages mostra `checkout@v6`; o GitHub já tem v7) quando houver folga.

## 2. Testes que dependem da sua conta GitHub (🟡, só depois de 1.1)

- [ ] **2.1 M4, ficha 2, passo 4:** `gh pr create --fill`, `gh pr view --web`, `gh pr merge --squash --delete-branch`.
  Só foi conferida a ajuda do `gh` (`--help`). Executar num repositório de teste e trocar o selo "não testado".
- [ ] **2.2 M5, fichas 1 e 2:** publicar o `index.html` do M1 por GitHub Actions e fazer o rollback com `git revert`.
  Hoje as fichas estão marcadas "não testado".
- [ ] **2.3 M5, ficha 3 (opcional paga):** domínio próprio, DNS e HTTPS. Exige registrador e domínio (custo seu). Se
  não quiser gastar, manter "não testado" e a fita "Troca por pago" sem preço, como está.
- [ ] **2.4 Rotação real de chave (M4, ficha 4):** foi só simulada ("chave antiga revogada"). Aceitável; só registrar.

## 3. Coisas que só existem na tela interativa (🟡)

Conferidas na documentação, mas nunca executadas, porque eu rodo em modo não interativo (`claude -p`):

- [ ] **3.1** `/context` como grade colorida, o slider do `/effort`, `/fast`, `/autocompact`, e a linha
  `Prompt cache (main)` do `/usage` (M2).
- [ ] **3.2** Menu de rewind (`Esc Esc`) e o ciclo do `Shift+Tab` (M3, ficha 2 já marcada "ilustrativo").
- [ ] **3.3** Pergunta de confiança ao abrir `claude` numa pasta nova e instalação nativa (M1; a máquina já tem tudo
  instalado, então a instalação do zero não foi testada).
- [ ] **3.4 (M6)** `/init` interativo (`CLAUDE_CODE_NEW_INIT=1`), tela do `/memory` e `CLAUDE.md` de subpasta com carga sob
  demanda (aparece uma linha `Loaded` no terminal). Rodei só em `-p`.
- [ ] **3.5 (M7)** `/permissions` e o diálogo de confiança da pasta (só interativos); `/fewer-permission-prompts` (não
  executei: ela lê o histórico das suas sessões; rode num projeto seu); regras `ask`.
- [ ] **3.7 (M8)** `/skills` (menu), o menu `/` com skills, a aba Stats do `/plugin`, `/doctor` completo e `context: fork`
  em skill. Rodei só em `-p`.
- [ ] **3.8 (M10)** Tela do `/mcp`, fluxo de login OAuth e aprovação do `.mcp.json` (só interativos). **Ficha 4:** n8n
  (`npx n8n`) e Playwright MCP (`npx @playwright/mcp@latest`) são pacotes de terceiros que eu não baixo sem você; rodar juntos e,
  no n8n, conferir a versão a partir da qual o MCP embutido existe (a doc não diz) e se criar/editar workflows funciona.
- [ ] **3.6 (M7) Sandbox e dev container.** A ficha 4 está "não testado": o sandbox não existe no Windows nativo e esta
  máquina não tem WSL2 nem Docker. Para testar: instalar o WSL2 (`wsl --install`, instalação global que eu não faço
  sem você) e rodar `/sandbox` lá; e conferir se o sandbox realmente fecha o desvio do `ler-env.mjs` da ficha 1.
  *Como resolver juntos:* você roda cada passo na tela e me diz se bate com o texto; eu ajusto e troco o selo.

- [ ] **3.9 (limite do plano)** O limite de 5 horas bateu em 13/11/2026 durante o M11. Sessões longas sem supervisão gastam
  o plano rápido; retomar depois da renovação. O `proxima-pagina.ps1` roda um item por vez para respeitar isso.

## 4. Scripts e atalhos na sua máquina (🟡)

- [ ] **4.1 `proxima-pagina.ps1` nunca rodou uma sessão de ponta a ponta.** Corrigi o problema dos acentos (13/11) e a
  sintaxe está válida, mas rodar uma vez com você olhando, porque gasta limite do plano e edita arquivos. Verificar:
  (a) se as `--allowedTools` restritas bastam no Windows (o `Bash(...)` cobre o Git Bash; a ferramenta PowerShell
  seria negada); (b) se o `logs/` é criado; (c) se o `git push` falha de forma inofensiva sem remoto.
- [ ] **4.2 O atalho "Manual de Bordo"** foi testado só por linha de comando (build, preview, HTTP 200). Dar dois
  cliques e ver se o navegador abre na página certa. Ao testar, o navegador pode ter aberto sozinho na sua máquina.
- [ ] **4.3 Sessões na nuvem** (`CONTINUAR.md` §7b): o `node scripts/baixar-docs.mjs` e o fluxo de PR por branch nunca
  foram exercitados fora desta máquina.

## 5. Decisões editoriais suas (🟡)

- [ ] **5.1 Corte de 15% do texto (Fila da Parte I).** Não apliquei. As páginas têm de 2.893 a 3.280 palavras, abaixo
  do teto de 3.500, e não havia rascunho anterior para comparar. *Decidir:* aceitar como está, ou pedir uma passada de
  enxugamento (item separado, custa limite).
- [ ] **5.2 Fotos de tela formais por parte (390 e 1280, modo Papel).** Conferi estouro horizontal e olhei o topo de M0
  (1280) e M2 (390), mais as figuras do M2. Não gerei o conjunto completo de fotos guardadas em `screenshots/`
  (a pasta está no `.gitignore`). *Decidir* se quer o conjunto formal ao fim da Parte I.
- [ ] **5.3 Cloudflare Web Analytics, Netlify e Vercel (M5):** a documentação não diz se o Web Analytics é gratuito
  nem se usa cookies, e não conferi preços de Netlify/Vercel. O texto não afirma nada disso. Se quiser tabela de
  preços, é preciso conferir nas páginas oficiais no dia.
- [ ] **5.4 Padrão de `Co-Authored-By` nos projetos de cliente (M4):** o Claude acrescenta o trailer por padrão.
  O módulo manda "decidir conscientemente"; definir a sua política e, se quiser, ajustar a configuração `attribution`.

## 6. Dívida técnica conhecida (🟢)

- [ ] **6.1 Desempenho (D010):** Lighthouse de desempenho em 78 a 80 nas páginas longas (meta 95). Fica para o fim, como
  decidido. Pode ser a troca das fontes variáveis por estáticas.
- [ ] **6.2 Quebra de linha (LF/CRLF):** o git avisa a cada commit. Criar um `.gitattributes` (`* text=auto`, e
  `*.ps1`/`*.cmd` com `eol=crlf`) para parar o ruído. Lembrar que `scripts/*.ps1` precisa de **BOM** (D014).
- [ ] **6.3 `astro check`:** 2 "hints" antigos e avisos de coleções vazias (`menu`, `cases`, `apendices`, `comandos`)
  que somem quando as páginas existirem.
- [ ] **6.4 Detalhes de verificação registrados, sem ação:** passos 1 e 2 da ficha 3 do M2 rodaram no modelo padrão da
  conta (Haiku 5.5); a Prova do reflog (M4) veio de uma execução em ordem um pouco diferente da ficha. Ambos estão
  anotados nos `VERIFICATION/`.

---

## Onde isso aparece no resto do projeto

- Fila de escrita e estado: `PROGRESS.md`. Decisões e riscos: `DECISIONS.md` (D012 a D014).
- Registros de verificação por página: `VERIFICATION/m0.md` a `m5.md`.
- **Próximo item de escrita, quando você mandar:** M6, Memória e CLAUDE.md.

---

## 7. Temporada 1 (13/11/2026)

- **7.1** Ficha 4 da T1D (criar repositório, ligar o Pages, abrir o endereço público) não foi executada: precisa da conta GitHub de quem faz. Marcada `nao-testado`.
- **7.2** Fichas das estações novas foram executadas com `claude -p`; a tela interativa (licença, aprovação do plano, `/exit`) segue descrita pela documentação.
- **7.3** Pages em repositório privado depende do plano do GitHub: a T1D manda conferir; não verificado.
- **7.4** O Pages não permite hospedagem gratuita de negócio comercial: a T1D avisa; decidir com o autor se o curso recomenda outra hospedagem para clientes reais.
- **7.5** O gabarito `t1b-gabarito` carrega de propósito um defeito real (o aviso das 48 horas pode sugerir um domingo); é o Desafio da T1B.
- **7.6** `VERSAO_CLI` em `src/data/curso.ts` ainda diz 2.1.323; as estações novas foram executadas na 2.1.325. Atualizar o selo global quando os módulos antigos forem reexecutados.
- **7.7** O M7 piloto e a T1 aguardam a leitura do autor (tom, tamanho, lacunas).
- **7.8** O projeto final da T1 pede publicar a Lia no GitHub Pages; não testado (conta do aluno). Os modelos de relatório, manual e termo de aceite não foram validados com cliente real nem com profissional jurídico.
- **7.9** A regra das 24 horas do formulário da Lia só aparece no dia certo (terça ou quinta próxima); não foi exercitada no navegador.
- **7.10** T2D: o `iniciar.cmd` (atalho de dois cliques no Windows) não foi verificado; o teste travou o terminal. Testar em máquina limpa.
- **7.11** T2: instalação do sistema em outro computador (Node do zero) e hook sem Git para Windows não foram testados.
- **7.12** T2: texto da LGPD não conferido em fonte oficial; modelos de aviso de privacidade, manual, ficha de acessos e termo de aceite não validados com cliente real nem profissional jurídico.
- **7.13** ~~Teste axe local intermitente~~ **Resolvido em 14/11/2026:** a causa era um servidor de desenvolvimento esquecido na porta 4321, reaproveitado pelo teste (`reuseExistingServer`). Com a porta livre, 54 de 54 passam, duas vezes. Regra: antes de rodar `npm run teste:a11y`, não deixar `npm run dev` ligado.
- **7.14** T3: o provedor da IA nunca foi chamado na API real (sem chave). Antes de usar com cliente, testar com chave de verdade, conversa curta, e conferir o formato da resposta.
- **7.15** T3: formato do pacote do WhatsApp Business, regras e custos da plataforma oficial e hospedagem 24 horas não verificados.
- **7.16** T3: falta no atendente a função de apagar as conversas de um número (a página diz); `reativar.mjs` imprime o telefone inteiro.
- **7.17** T3: `$env:PROVEDOR=...` e `$LASTEXITCODE` no PowerShell 5.1 não foram executados; textos de política, proposta de custo e termo de aceite não validados com cliente nem profissional jurídico.
