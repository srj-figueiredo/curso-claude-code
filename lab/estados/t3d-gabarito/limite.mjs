// Limite de mensagens por telefone (proteção contra enxurrada).
// Padrão: no máximo 8 mensagens em 60 segundos. A 9ª recebe o aviso uma vez;
// as seguintes são ignoradas até a janela passar. Fica na memória (reinicia com o servidor).
export function criarLimitador({ maximo = 8, janelaMs = 60_000, agora = () => Date.now() } = {}) {
  const recentes = new Map(); // telefone -> instantes das mensagens aceitas na janela
  const bloqueadoAte = new Map(); // telefone -> instante em que volta a responder

  // Devolve 'ok' (responde normal), 'aviso' (primeira mensagem além do limite) ou 'silencio'.
  return {
    verificar(telefone) {
      const t = agora();
      const fim = bloqueadoAte.get(telefone);
      if (fim !== undefined) {
        if (t < fim) return 'silencio';
        bloqueadoAte.delete(telefone);
      }

      const janela = (recentes.get(telefone) ?? []).filter((instante) => t - instante < janelaMs);
      if (janela.length >= maximo) {
        recentes.delete(telefone);
        bloqueadoAte.set(telefone, t + janelaMs);
        return 'aviso';
      }
      janela.push(t);
      recentes.set(telefone, janela);
      return 'ok';
    },
  };
}
