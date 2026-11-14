const STATUS_TXT = {
  aberta: 'Aberta',
  em_andamento: 'Em andamento',
  pronta: 'Pronta',
  entregue: 'Entregue',
};
const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

class SemLogin extends Error {}

async function api(caminho, opcoes) {
  const r = await fetch(caminho, opcoes);
  if (r.status === 401) throw new SemLogin();
  const corpo = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error('falha na API'), { corpo, codigo: r.status });
  return corpo;
}

function el(tag, classe, texto) {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (texto !== undefined) e.textContent = texto;
  return e;
}

// ---------- entrar e sair ----------

function mostrarLogin() {
  document.getElementById('app').hidden = true;
  document.getElementById('sair').hidden = true;
  document.getElementById('entrar').hidden = false;
  document.querySelector('#form-entrar input[name="senha"]').value = '';
  document.querySelector('#form-entrar input[name="usuario"]').focus();
}

// O cartão de faturamento só é criado para o dono. Para a atendente ele nem existe na tela.
function mostrarAplicacao(sessao) {
  document.getElementById('entrar').hidden = true;
  document.getElementById('sair').hidden = false;
  document.getElementById('app').hidden = false;
  if (sessao.papel === 'dono' && !document.getElementById('p-faturamento')) {
    const cartao = el('div', 'cartao');
    cartao.append(el('span', 'rotulo', 'Faturado no mês'));
    const valor = el('strong', null, '-');
    valor.id = 'p-faturamento';
    cartao.append(valor);
    document.querySelector('.painel').append(cartao);
  }
}

async function iniciar() {
  try {
    const sessao = await api('/api/sessao');
    mostrarAplicacao(sessao);
    await Promise.all([
      carregarPainel(),
      sessao.papel === 'dono' ? carregarFaturamento() : null,
      carregarLista(),
    ]);
  } catch (err) {
    if (err instanceof SemLogin) mostrarLogin();
    else document.getElementById('lista').textContent = 'Não foi possível carregar a página.';
  }
}

document.getElementById('form-entrar').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const erroEl = document.getElementById('entrar-erro');
  erroEl.textContent = '';
  try {
    await api('/api/entrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    form.reset();
    await iniciar();
  } catch (err) {
    if (err.codigo === 429) erroEl.textContent = 'Muitas senhas erradas seguidas. Espere 1 minuto e tente de novo.';
    else if (err.codigo === 400) erroEl.textContent = 'Informe usuário e senha.';
    else erroEl.textContent = 'Usuário ou senha incorretos.';
    form.querySelector('input[name="senha"]').value = '';
  }
});

document.getElementById('sair').addEventListener('click', async () => {
  await fetch('/api/sair', { method: 'POST' });
  document.getElementById('lista').replaceChildren();
  mostrarLogin();
});

// ---------- painel e ordens ----------

async function carregarPainel() {
  const p = await api('/api/painel');
  document.getElementById('p-abertas').textContent = p.abertas;
  document.getElementById('p-prontas').textContent = p.prontas;
}

async function carregarFaturamento() {
  const f = await api('/api/faturamento');
  document.getElementById('p-faturamento').textContent = moeda.format(f.centavos / 100);
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
    } catch (err) {
      if (err instanceof SemLogin) return mostrarLogin();
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
    if (err instanceof SemLogin) return mostrarLogin();
    const erros = err.corpo?.erros || ['Não foi possível cadastrar. Tente de novo.'];
    erroEl.textContent = erros.join(' ');
  }
});

document.getElementById('filtro').addEventListener('change', carregarLista);

iniciar();
