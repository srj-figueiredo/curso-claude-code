#!/usr/bin/env node
// Servidor MCP mínimo (transporte stdio, sem dependências) que expõe o app Pendências ao Claude Code.
// Mensagens: JSON-RPC 2.0, uma por linha, na entrada e na saída padrão.
// Atenção: nada além de JSON-RPC pode ir para a saída padrão. Logs vão para a saída de erro.
import { createInterface } from 'node:readline';
import { adicionar, formatar, abertas } from '../src/pendencias.js';
import { carregar, salvar } from '../src/armazenamento.js';

const ferramentas = [
  {
    name: 'listar_pendencias',
    description: 'Lista as pendências do app Pendências. Use quando o usuário perguntar o que há para fazer.',
    inputSchema: {
      type: 'object',
      properties: { apenas_abertas: { type: 'boolean', description: 'Só as que ainda não foram feitas' } },
    },
  },
  {
    name: 'adicionar_pendencia',
    description: 'Adiciona uma pendência nova ao app Pendências.',
    inputSchema: {
      type: 'object',
      properties: {
        texto: { type: 'string', description: 'O que precisa ser feito' },
        prioridade: { type: 'string', enum: ['normal', 'alta'], description: 'Padrão: normal' },
      },
      required: ['texto'],
    },
  },
];

const recursos = [
  {
    uri: 'pendencias://abertas',
    name: 'Pendências abertas',
    description: 'As pendências que ainda não foram feitas',
    mimeType: 'text/plain',
  },
];

const prompts = [
  {
    name: 'resumo_do_dia',
    description: 'Pede um resumo das pendências abertas, para começar o dia',
    arguments: [{ name: 'tom', description: 'formal ou descontraído', required: false }],
  },
];

const texto = (t) => ({ content: [{ type: 'text', text: t }] });

async function chamarFerramenta(nome, args = {}) {
  if (nome === 'listar_pendencias') {
    const lista = await carregar();
    return texto(formatar(args.apenas_abertas ? abertas(lista) : lista) || '(nenhuma pendência)');
  }
  if (nome === 'adicionar_pendencia') {
    const nova = adicionar(await carregar(), args.texto, args.prioridade ?? 'normal');
    await salvar(nova);
    const item = nova.at(-1);
    return texto(`Anotado: ${item.id}. ${item.texto}`);
  }
  throw Object.assign(new Error(`Ferramenta desconhecida: ${nome}`), { codigo: -32602 });
}

async function tratar(msg) {
  const { method, params } = msg;
  switch (method) {
    case 'initialize':
      return {
        protocolVersion: params?.protocolVersion ?? '2025-06-18',
        capabilities: { tools: {}, resources: {}, prompts: {} },
        serverInfo: { name: 'pendencias', version: '1.0.0' },
        instructions: 'Servidor do app Pendências: lista e adiciona pendências.',
      };
    case 'ping':
      return {};
    case 'tools/list':
      return { tools: ferramentas };
    case 'tools/call':
      try {
        return await chamarFerramenta(params.name, params.arguments);
      } catch (erro) {
        if (erro.codigo) throw erro;
        return { ...texto(erro.message), isError: true };
      }
    case 'resources/list':
      return { resources: recursos };
    case 'resources/read': {
      if (params.uri !== 'pendencias://abertas') {
        throw Object.assign(new Error(`Recurso desconhecido: ${params.uri}`), { codigo: -32002 });
      }
      const lista = abertas(await carregar());
      return { contents: [{ uri: params.uri, mimeType: 'text/plain', text: formatar(lista) || '(nenhuma pendência aberta)' }] };
    }
    case 'prompts/list':
      return { prompts };
    case 'prompts/get': {
      if (params.name !== 'resumo_do_dia') {
        throw Object.assign(new Error(`Prompt desconhecido: ${params.name}`), { codigo: -32602 });
      }
      const tom = params.arguments?.tom ?? 'descontraído';
      const lista = formatar(abertas(await carregar())) || '(nenhuma)';
      return {
        description: 'Resumo do dia',
        messages: [
          { role: 'user', content: { type: 'text', text: `Em tom ${tom}, resuma em três linhas estas pendências abertas:\n${lista}` } },
        ],
      };
    }
    default:
      throw Object.assign(new Error(`Método não suportado: ${method}`), { codigo: -32601 });
  }
}

// Uma mensagem por vez: o arquivo da lista não tolera duas gravações ao mesmo tempo.
let fila = Promise.resolve();

async function processar(linha) {
  if (!linha.trim()) return;
  let msg;
  try {
    // O pipe do PowerShell 5.1 antepõe um BOM (U+FEFF) à primeira linha: tolere-o.
    msg = JSON.parse(linha.replace(/^﻿/, ''));
  } catch {
    return;
  }
  // Notificações (sem id) não recebem resposta.
  if (msg.id === undefined) return;
  try {
    const result = await tratar(msg);
    process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: msg.id, result }) + '\n');
  } catch (erro) {
    process.stdout.write(
      JSON.stringify({ jsonrpc: '2.0', id: msg.id, error: { code: erro.codigo ?? -32603, message: erro.message } }) + '\n',
    );
  }
}

createInterface({ input: process.stdin }).on('line', (linha) => {
  fila = fila.then(() => processar(linha));
});
