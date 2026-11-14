import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const versao = z.string().regex(/^\d+\.\d+\.\d+$/);
const data = z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/);
const status = z.enum(['estável', 'beta', 'depende-de-plano']);

const exercicio = z.object({
  id: z.string(),
  titulo: z.string(),
  minutos: z.number().int().positive(),
  custo: z.enum(['gratis', 'opcional-pago']),
});

// Frontmatter obrigatório (BRIEFING, seção 5). Vale para módulos, seções do menu e cases.
const pagina = z.object({
  id: z.string(),
  titulo: z.string(),
  parte: z.string(),
  ordem: z.number(),
  minutos: z.number().int().positive(),
  pre_requisitos: z.array(z.string()),
  objetivos: z.array(z.string()).min(3).max(5),
  tldr: z.array(z.string()).length(3),
  verificado_em_versao: versao,
  verificado_em_data: data,
  status,
  trilhas: z.array(z.enum(['venda', 'rapida', 'completa', 'empresa'])),
  nivel: z.enum(['essencial', 'aprofundamento']).optional(),
  exercicios: z.array(exercicio),
});

const apendice = z.object({
  id: z.string(),
  titulo: z.string(),
  resumo: z.string(),
  verificado_em_versao: versao,
  verificado_em_data: data,
});

const comando = z.object({
  id: z.string(),
  nome: z.string().startsWith('/'),
  aliases: z.array(z.string()),
  categoria: z.enum(['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8']),
  argumentos: z.string(),
  o_que_faz: z.string(),
  quando_usar: z.string(),
  exemplo: z.string(),
  armadilha: z.string(),
  tipo: z.enum(['embutido', 'skill embutida', 'workflow', 'removido', 'oculto']),
  disponibilidade: z.object({
    plano: z.string(),
    plataforma: z.string(),
    requisitos: z.string(),
  }),
  versao_minima: z.string(),
  status,
  testado_localmente: z.boolean(),
  verificado_em_versao: versao,
  verificado_em_data: data,
  fonte: z.string().url(),
});

const mudanca = z.object({
  id: z.string(),
  versao_cli: versao,
  data,
  afetados: z.array(z.string()),
  resumo: z.string(),
  link: z.string().url(),
});

const mdx = (pasta: string) => glob({ pattern: '*.mdx', base: `./src/content/${pasta}` });

export const collections = {
  modulos: defineCollection({ loader: mdx('modulos'), schema: pagina }),
  menu: defineCollection({ loader: mdx('menu'), schema: pagina }),
  cases: defineCollection({ loader: mdx('cases'), schema: pagina }),
  apendices: defineCollection({ loader: mdx('apendices'), schema: apendice }),
  comandos: defineCollection({ loader: file('src/content/comandos/commands.json'), schema: comando }),
  mudancas: defineCollection({ loader: file('src/content/mudancas/mudancas.json'), schema: mudanca }),
};
