// Estrutura aprovada do curso (BRIEFING, seção 7). Fonte única para mapa, navegação e trilhas.

export const VERSAO_CLI = '2.1.323';
export const DATA_VERIFICACAO = '12/11/2026';

export type Parte = { id: string; rotulo: string; titulo: string };
export type Estacao = { id: string; parte: string; titulo: string; curto: string };
export type TrilhaId = 'rapida' | 'completa' | 'empresa';

export const PARTES: Parte[] = [
  { id: 'p0', rotulo: 'Guias', titulo: 'Antes de começar' },
  { id: 'p8', rotulo: 'Temporada 1', titulo: 'Primeiro cliente' },
  { id: 'p9', rotulo: 'Temporada 2', titulo: 'Sistema do cliente' },
  { id: 'p10', rotulo: 'Temporada 3', titulo: 'Atendimento com IA' },
  { id: 'p1', rotulo: 'Guias', titulo: 'Fundamentos' },
  { id: 'p2', rotulo: 'Guias', titulo: 'O menu / dissecado' },
  { id: 'p3', rotulo: 'Guias', titulo: 'Do zero ao ar' },
  { id: 'p4', rotulo: 'Guias', titulo: 'Personalizar' },
  { id: 'p5', rotulo: 'Guias', titulo: 'Escalar' },
  { id: 'p6', rotulo: 'Guias', titulo: 'Construir produtos de verdade' },
  { id: 'p7', rotulo: 'Guias', titulo: 'Cases de mercado' },
];

const e = (id: string, parte: string, titulo: string, curto = titulo): Estacao => ({ id, parte, titulo, curto });

export const ESTACOES: Estacao[] = [
  e('m0', 'p0', 'Mapa do Claude Code e regras do jogo', 'Mapa e regras'),
  e('t1a', 'p8', 'Seu primeiro cliente: o site no navegador', 'Primeiro site'),
  e('t1b', 'p8', 'Conduzir o trabalho: planejar, pedir e conferir', 'Conduzir'),
  e('t1c', 'p8', 'A memória do cliente: o CLAUDE.md', 'Memória'),
  e('t1d', 'p8', 'Guardar e publicar: histórico e site no ar', 'No ar'),
  e('t2a', 'p9', 'O sistema da oficina: dados de verdade', 'Dados'),
  e('t2b', 'p9', 'Quem entra e o que o Claude pode ver', 'Acesso'),
  e('t2c', 'p9', 'Receitas e travas automáticas', 'Travas'),
  e('t2d', 'p9', 'Testar, guardar e entregar o sistema', 'Entrega'),
  e('t3a', 'p10', 'O atendente do pet shop: base, simulador e primeiro atendimento', 'Atendente'),
  e('t3b', 'p10', 'Regras de proteção: guardrails, limite e privacidade', 'Proteção'),
  e('t3c', 'p10', 'Trocar o simulador pela IA: o provedor da API paga', 'IA paga'),
  e('t3d', 'p10', 'Medir, entregar e manter o atendente', 'Medir'),
  e('m1', 'p1', 'Instalação e primeiro contato', 'Instalação'),
  e('m2', 'p1', 'Como o Claude Code pensa', 'Como pensa'),
  e('m3', 'p1', 'Conduzindo no dia a dia', 'Dia a dia'),
  e('r1', 'p2', 'Configurar e personalizar', 'Configurar'),
  e('r2', 'p2', 'Permissões e segurança', 'Permissões'),
  e('r3', 'p2', 'Conduzir a sessão', 'Conduzir'),
  e('r4', 'p2', 'Paralelo e agentes', 'Paralelo'),
  e('r5', 'p2', 'Estender', 'Estender'),
  e('r6', 'p2', 'Qualidade e entrega', 'Qualidade'),
  e('r7', 'p2', 'Todo lugar', 'Todo lugar'),
  e('r8', 'p2', 'Conta, custos e suporte', 'Conta e custos'),
  e('m4', 'p3', 'Git e GitHub do zero', 'Git e GitHub'),
  e('m5', 'p3', 'Do computador para a internet', 'No ar'),
  e('m6', 'p4', 'Memória e CLAUDE.md', 'Memória'),
  e('m7', 'p4', 'Configurações, permissões e segurança', 'Segurança'),
  e('m8', 'p4', 'Skills', 'Skills'),
  e('m9', 'p4', 'Hooks', 'Hooks'),
  e('m10', 'p4', 'MCP', 'MCP'),
  e('m11', 'p4', 'Planejar e verificar', 'Planejar'),
  e('m12', 'p5', 'Subagentes e trabalho paralelo', 'Subagentes'),
  e('m13', 'p5', 'Plugins, marketplaces e mods', 'Plugins'),
  e('m14', 'p5', 'Automação sem você', 'Automação'),
  e('m15', 'p5', 'Claude Code em todo lugar', 'Todo lugar'),
  e('m16', 'p5', 'Revisão e segurança de código', 'Revisão'),
  e('m17', 'p5', 'Agent SDK', 'Agent SDK'),
  e('m18', 'p5', 'Custos e uso', 'Custos'),
  e('m19', 'p5', 'Claude Code na empresa', 'Empresa'),
  e('m20', 'p6', 'Backend, banco, webhooks e hospedagem', 'Backend'),
  e('m21', 'p6', 'Claude API dentro do seu produto', 'Claude API'),
  e('m22', 'p6', 'Claude Code além do código', 'Além do código'),
  e('c0', 'p7', 'Do briefing à entrega', 'Briefing'),
  e('c1', 'p7', 'Chatbot de IA para WhatsApp', 'Chatbot'),
  e('c2', 'p7', 'Sistema/painel sob medida', 'Painel'),
  e('c3', 'p7', 'Automação com IA e relatórios', 'Automação'),
  e('c4', 'p7', 'Landing page de conversão', 'Landing'),
  e('c5', 'p7', 'Conteúdo em escala com IA', 'Conteúdo'),
  e('c6', 'p7', 'Edição de vídeo com Claude Code', 'Vídeo'),
  e('pf', 'p7', 'Projeto final', 'Projeto final'),
];

export const APENDICES = [
  { id: 'a', titulo: 'Glossário' },
  { id: 'b', titulo: 'Cheat sheet' },
  { id: 'c', titulo: 'Troubleshooting e erros' },
  { id: 'd', titulo: 'Settings e variáveis de ambiente' },
  { id: 'e', titulo: 'Custos: do zero ao profissional' },
  { id: 'f', titulo: 'O que mudou' },
  { id: 'g', titulo: 'Radar de demanda' },
  { id: 'h', titulo: 'Fontes e como verificar' },
  { id: 'i', titulo: 'Próximos passos' },
];

const faixa = (prefixo: string, de: number, ate: number) =>
  Array.from({ length: ate - de + 1 }, (_, i) => `${prefixo}${de + i}`);

export const TRILHAS: Record<TrilhaId, { titulo: string; resumo: string; ids: string[] }> = {
  rapida: {
    titulo: 'Rápida para Cases',
    resumo: 'O mínimo para entregar um projeto de cliente.',
    ids: [...faixa('m', 0, 3), 't1a', 't1b', 't1c', 't1d', 't2a', 't2b', 't2c', 't2d', 't3a', 't3b', 't3c', 't3d', 'r3', ...faixa('m', 4, 8), 'm10', 'm11', ...faixa('m', 20, 22), ...faixa('c', 0, 6)],
  },
  completa: {
    titulo: 'Completa',
    resumo: 'Tudo, na ordem. Para quem quer maestria.',
    ids: ESTACOES.map((s) => s.id),
  },
  empresa: {
    titulo: 'Empresa',
    resumo: 'Adoção em time: governança, segurança e custo.',
    ids: [...faixa('m', 0, 3), 'm6', 'm7', 'm12', 'm16', 'm18', 'm19'],
  },
};

export const estacao = (id: string) => ESTACOES.find((s) => s.id === id);
export const parteDe = (id: string) => PARTES.find((p) => p.id === estacao(id)?.parte);
// Estações antigas (guias de referência) não usam mais código: aparecem como "Guia" e pelo nome.
export const ehGuia = (id: string) => /^(m\d+|r\d+|c\d+|pf)$/.test(id);
export const rotulo = (id: string) => (ehGuia(id) ? 'Guia' : id.toUpperCase());
export const nome = (id: string) => (ehGuia(id) ? (estacao(id)?.curto ?? id) : id.toUpperCase());

export function vizinhos(id: string) {
  const i = ESTACOES.findIndex((s) => s.id === id);
  return { anterior: ESTACOES[i - 1], proximo: ESTACOES[i + 1] };
}
