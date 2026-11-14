// Gera docs/MAPA-DE-CONCEITOS.md: cada conceito (título ###) dos módulos de referência e onde ele é ensinado
// nas Temporadas. Regra do curso: ao final, nenhum conceito pode ficar "Pendente" sem destino.
// Uso: node scripts/mapa-de-conceitos.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const MODULOS = {
  m0: 'Mapa do Claude Code e regras do jogo',
  m1: 'Instalação e primeiro contato',
  m2: 'Como o Claude Code pensa',
  m3: 'Conduzindo no dia a dia',
  m4: 'Git e GitHub do zero',
  m5: 'Do computador para a internet',
  m6: 'Memória e CLAUDE.md',
  m7: 'Configurações, permissões e segurança',
  m8: 'Skills',
  m10: 'MCP',
};

// Destino planejado por módulo (roteiro v2, seção 6). O módulo antigo continua como referência.
const DESTINO = {
  m0: 'T1A + Referência',
  m1: 'T1A',
  m2: 'T1B + T5',
  m3: 'T1B',
  m4: 'T1D + T2',
  m5: 'T1D + T5',
  m6: 'T1C + T2',
  m7: 'T2',
  m8: 'T2',
  m10: 'T3',
};

// Conceitos já ensinados nas estações escritas (trecho do título → onde). Parcial = só o essencial.
const FEITO = {
  m1: [
    ['O terminal em cinco minutos', 'T1A'],
    ['Instalar', 'T1A'],
    ['A trilha Windows', 'T1A (Referência)'],
    ['Verificar, e o tal do PATH', 'T1A (Referência)'],
    ['Entrar com a sua conta', 'T1A'],
  ],
  m2: [['A janela de contexto', 'T1B (parcial)']],
  m3: [
    ['O pedido: três coisas', 'T1A e T1B'],
    ['Entregue o material', 'T1A'],
    ['Quanta rédea', 'T1B (parcial)'],
    ['Modo plano', 'T1B'],
    ['Pedir o commit', 'T1D'],
  ],
  m4: [
    ['Por que git vem antes de tudo', 'T1D'],
    ['O modelo mental', 'T1D (parcial)'],
    ['O Claude operando git', 'T1D'],
    ['Do seu computador para o GitHub', 'T1D (parcial)'],
    ['Desfazer e recuperar', 'T1D (parcial)'],
  ],
  m5: [
    ['Publicar no GitHub Pages', 'T1D (parcial)'],
    ['O que vai para o navegador é público', 'T1D'],
  ],
  m7: [
    ['Quem decide', 'T2B (parcial)'],
    ['Como escrever uma regra', 'T2B (parcial)'],
    ['O .env: a regra que parece cofre', 'T2B'],
    ['O sandbox', 'T2B (parcial)'],
    ['Resumo: as camadas', 'T2B (parcial)'],
  ],
  m8: [
    ['O que é uma skill', 'T2C (parcial)'],
    ['Skill, CLAUDE.md, hook', 'T2C (parcial)'],
    ['Anatomia de uma skill', 'T2C (parcial)'],
  ],
  m6: [
    ['Duas memórias, dois autores', 'T1C (parcial)'],
    ['Onde o CLAUDE.md mora', 'T1C (parcial)'],
    ['Gerar o primeiro com', 'T1C'],
    ['O que escrever', 'T1C'],
  ],
};

const linhas = [];
let total = 0;
let feitos = 0;
for (const [id, titulo] of Object.entries(MODULOS)) {
  const texto = readFileSync(`src/content/modulos/${id}.mdx`, 'utf8');
  const corpo = texto.replace(/^---\n[\s\S]*?\n---\n/, '');
  const ate = corpo.indexOf('<Camada tipo="armadilhas"');
  const ficha = corpo.indexOf('## Fichas de campo');
  const fim = [ate, ficha].filter((n) => n > 0).sort((a, b) => a - b)[0] ?? corpo.length;
  const conceitos = [...corpo.slice(0, fim).matchAll(/^### (.+)$/gm)].map((m) => m[1].replace(/`/g, ''));
  linhas.push(`\n### ${id.toUpperCase()} (${titulo})\n`, '| Conceito | Onde é ensinado |', '|---|---|');
  for (const c of conceitos) {
    const feito = (FEITO[id] ?? []).find(([trecho]) => c.includes(trecho.replace(/`/g, '')));
    total++;
    if (feito) feitos++;
    linhas.push(`| ${c} | ${feito ? `**${feito[1]}** (escrito)` : `Planejado: ${DESTINO[id]}`} |`);
  }
}

const saida = `# Mapa de conceitos

Gerado por \`node scripts/mapa-de-conceitos.mjs\` em ${new Date().toISOString().slice(0, 10)}. **Não edite à mão**: ajuste as tabelas \`FEITO\` e \`DESTINO\` do script.

Regra do curso: todo conceito dos módulos de referência (M0 a M8 e M10, os já escritos) precisa de um destino nas Temporadas.
No início de cada estação nova, o componente \`<Conceitos>\` avisa o que a pessoa vai aprender e aponta a referência dos conceitos que só virão depois.
Ao final do curso, nenhuma linha pode ficar em "Planejado".

**Progresso:** ${feitos} de ${total} conceitos já ensinados nas estações escritas (T1A a T2D).

Os módulos ainda não escritos (M9 Hooks, M11 Planejar e verificar, M12 a M19, M20 a M22, R1 a R8, C0 a C6 e o projeto final) entram na ordem do roteiro v2 (\`docs/ROTEIRO-V2.md\`). Os conceitos deles serão acrescentados aqui quando as páginas existirem.
${linhas.join('\n')}
`;
writeFileSync('docs/MAPA-DE-CONCEITOS.md', saida);
console.log(`${feitos} de ${total} conceitos ensinados (T1); ${total - feitos} planejados`);
