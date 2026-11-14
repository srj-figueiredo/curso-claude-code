// Escolhe o provedor pela variável PROVEDOR (padrão: local).
// Para trocar depois: escreva o novo provedor em provedores/, importe aqui e registre no REGISTRO.
// Nada mais do sistema muda.
import * as local from './local.mjs';
import * as claude from './claude.mjs';
import * as testeRuim from './teste-ruim.mjs';

const REGISTRO = { local, claude, 'teste-ruim': testeRuim };
// Provedores de teste só valem com PATAS_TESTE=1 (o conferir.mjs liga isso).
const SOMENTE_TESTE = new Set(['teste-ruim']);

export function resolverProvedor(nomeSolicitado) {
  const chave = nomeSolicitado?.trim() || 'local';
  if (!Object.hasOwn(REGISTRO, chave)) {
    throw new Error(`PROVEDOR "${chave}" não existe. Opções: ${Object.keys(REGISTRO).filter((k) => !SOMENTE_TESTE.has(k)).join(', ')}`);
  }
  if (SOMENTE_TESTE.has(chave) && process.env.PATAS_TESTE !== '1') {
    throw new Error(`PROVEDOR "${chave}" é só para testes (conferir.mjs).`);
  }
  const provedor = REGISTRO[chave];
  // Recusa iniciar se faltar configuração (ex.: chave da API), dizendo o que falta.
  const faltando = provedor.verificarAmbiente?.() ?? [];
  if (faltando.length) {
    throw new Error(`PROVEDOR "${chave}" precisa de: ${faltando.join(', ')}. Defina essas variáveis e tente de novo.`);
  }
  return provedor;
}
