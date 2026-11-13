// Gera registro.log: 1.200 linhas de log falso (cerca de 100 KB), para encher o contexto de propósito no M2.
// Uso: node ferramentas/gerar-registro.mjs
import { writeFileSync } from 'node:fs';

const linhas = [];
for (let i = 1; i <= 1200; i++) {
  const minuto = String(i % 60).padStart(2, '0');
  const nivel = i % 97 === 0 ? 'ERRO' : 'INFO';
  linhas.push(`2026-11-12T10:${minuto}:00Z ${nivel} pedido ${i} processado em ${(i * 7) % 900} ms pelo servico de pendencias`);
}
writeFileSync('registro.log', linhas.join('\n') + '\n');
console.log(`registro.log criado: ${linhas.length} linhas, ${linhas.filter((l) => l.includes(' ERRO ')).length} com ERRO.`);
