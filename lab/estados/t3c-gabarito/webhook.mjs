// Lê o formato do WhatsApp Business: entry -> changes -> value -> messages.
// Eventos de status (value.statuses) são ignorados de propósito.

export class PayloadInvalido extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'PayloadInvalido';
  }
}

export function extrairMensagens(payload) {
  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.entry)) {
    throw new PayloadInvalido('payload sem "entry"');
  }

  const mensagens = [];
  for (const entrada of payload.entry) {
    const changes = Array.isArray(entrada?.changes) ? entrada.changes : [];
    for (const change of changes) {
      if (change?.field !== 'messages') continue;

      const value = change.value ?? {};
      const contatos = Array.isArray(value.contacts) ? value.contacts : [];
      const lista = Array.isArray(value.messages) ? value.messages : [];

      for (const msg of lista) {
        if (typeof msg?.id !== 'string' || typeof msg?.from !== 'string') {
          throw new PayloadInvalido('mensagem sem "id" ou "from"');
        }
        if (!/^\d{5,20}$/.test(msg.from)) {
          throw new PayloadInvalido('"from" deve ter só números');
        }

        const contato = contatos.find((c) => c?.wa_id === msg.from);
        const tipo = typeof msg.type === 'string' ? msg.type : 'desconhecido';
        mensagens.push({
          wa_id: msg.id,
          telefone: msg.from,
          nome: contato?.profile?.name ?? null, // dado pessoal
          tipo,
          texto: tipo === 'text' && typeof msg.text?.body === 'string' ? msg.text.body : null,
          timestamp: msg.timestamp ?? null,
        });
      }
    }
  }
  return mensagens;
}
