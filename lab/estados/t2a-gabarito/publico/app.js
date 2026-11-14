const STATUS_TXT = {
  aberta: 'Aberta',
  em_andamento: 'Em andamento',
  pronta: 'Pronta',
  entregue: 'Entregue',
};
const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

async function api(caminho, opcoes) {
  const r = await fetch(caminho, opcoes);
  const corpo = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error('falha na API'), { corpo });
  return corpo;
}

function el(tag, classe, texto) {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (texto !== undefined) e.textContent = texto;
  return e;
}

async function carregarPainel() {
  const p = await api('/api/painel');
  document.getElementById('p-abertas').textContent = p.abertas;
  document.getElementById('p-prontas').textContent = p.prontas;
}

function criarCartao(o) {
  const art = el('article', 'ordem');

  const titulo = el('h3', null, `${o.placa} · ${o.modelo}`);
  if (o.exemplo) titulo.append(el('span', 'selo', 'EXEMPLO'));
  art.append(titulo);

  art.append(el('p', null, `Cliente: ${o.cliente} · Telefone: ${o.telefone}`));
  art.append(el('p', null, `Serviço: ${o.descricao}`));
  art.append(el('p', null, `Valor: ${moeda.format(o.valor_centavos / 100)}`));

  const rotulo = el('label', null, 'Status ');
  const sel = el('select');
  sel.id = `status-${o.id}`;
  for (const [valor, texto] of Object.entries(STATUS_TXT)) {
    const opt = el('option', null, texto);
    opt.value = valor;
    if (valor === o.status) opt.selected = true;
    sel.append(opt);
  }
  sel.addEventListener('change', async () => {
    try {
      await api(`/api/ordens/${o.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: sel.value }),
      });
      await Promise.all([carregarPainel(), carregarLista()]);
    } catch {
      alert('Não foi possível mudar o status. Tente de novo.');
      await carregarLista();
    }
  });
  rotulo.append(sel);
  art.append(rotulo);

  return art;
}

async function carregarLista() {
  const status = document.getElementById('filtro').value;
  const ordens = await api(`/api/ordens?status=${encodeURIComponent(status)}`);
  const lista = document.getElementById('lista');
  lista.replaceChildren();
  if (ordens.length === 0) {
    lista.append(el('p', 'vazio', 'Nenhuma ordem neste filtro.'));
    return;
  }
  lista.append(...ordens.map(criarCartao));
}

document.getElementById('form-ordem').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const erroEl = document.getElementById('form-erro');
  erroEl.textContent = '';
  try {
    await api('/api/ordens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    form.reset();
    await Promise.all([carregarPainel(), carregarLista()]);
  } catch (err) {
    const erros = err.corpo?.erros || ['Não foi possível cadastrar. Tente de novo.'];
    erroEl.textContent = erros.join(' ');
  }
});

document.getElementById('filtro').addEventListener('change', carregarLista);

Promise.all([carregarPainel(), carregarLista()]).catch(() => {
  document.getElementById('lista').textContent = 'Não foi possível carregar as ordens.';
});
