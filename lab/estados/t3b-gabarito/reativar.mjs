// Uso da equipe, no computador da loja: node reativar.mjs 5511999990001
// Tira o "parar" do cliente, para o atendente voltar a poder responder a ele.
import { fileURLToPath } from 'node:url';
import { abrirBanco } from './banco.mjs';

const telefone = process.argv[2];
if (!/^\d{5,20}$/.test(telefone ?? '')) {
  console.error('Uso: node reativar.mjs <telefone com DDI, só números>');
  process.exit(1);
}

const banco = abrirBanco(fileURLToPath(new URL('./dados/patas.db', import.meta.url)));
banco.reativarCliente(telefone);
banco.fechar();
console.log(`Cliente ${telefone} reativado.`);
