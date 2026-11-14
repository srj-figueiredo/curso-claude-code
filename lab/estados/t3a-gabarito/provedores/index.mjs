// Escolhe o provedor pela variável PROVEDOR (padrão: local).
// Para trocar depois: escreva o novo provedor em provedores/, importe aqui e registre no REGISTRO.
// Nada mais do sistema muda.
import * as local from './local.mjs';

const REGISTRO = { local };

export function resolverProvedor(nomeSolicitado) {
  const chave = nomeSolicitado?.trim() || 'local';
  if (!Object.hasOwn(REGISTRO, chave)) {
    throw new Error(`PROVEDOR "${chave}" não existe. Opções: ${Object.keys(REGISTRO).join(', ')}`);
  }
  return REGISTRO[chave];
}
