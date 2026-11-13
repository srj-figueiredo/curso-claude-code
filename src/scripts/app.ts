// Camada de melhoria progressiva. O curso lê sem isto; com isto ganha memória e movimento.
// Estado só em localStorage. Sem cookies, sem rede, sem rastreamento.

type Estado = {
  feitos: Record<string, number>;
  cartas: Record<string, number>;
  trilha?: string;
  so?: string;
  tema?: string;
  ultimo?: { id: string; titulo: string; href: string };
};

const CHAVE = 'mdb:v1';
const raiz = document.documentElement;
const $ = <T extends Element = HTMLElement>(sel: string, el: ParentNode = document) => el.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, el: ParentNode = document) => [...el.querySelectorAll<T>(sel)];

export function ler(): Estado {
  try {
    const bruto = JSON.parse(localStorage.getItem(CHAVE) || '{}');
    return { feitos: {}, cartas: {}, ...bruto };
  } catch {
    return { feitos: {}, cartas: {} };
  }
}

export function gravar(muda: (e: Estado) => void) {
  const estado = ler();
  muda(estado);
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch {
    /* armazenamento indisponível: o curso segue funcionando sem memória */
  }
  pintar();
}

const movimentoReduzido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Tema e sistema ---------- */

function tema() {
  const botao = $<HTMLButtonElement>('[data-alterna-tema]');
  if (!botao) return;
  botao.hidden = false;
  botao.addEventListener('click', () => {
    const escuro = raiz.dataset.tema
      ? raiz.dataset.tema === 'console'
      : matchMedia('(prefers-color-scheme: dark)').matches;
    const novo = escuro ? 'papel' : 'console';
    raiz.dataset.tema = novo;
    gravar((e) => (e.tema = novo));
  });
}

function sistema() {
  if (!raiz.dataset.so) {
    const ua = navigator.userAgent;
    raiz.dataset.so = /Windows/.test(ua) ? 'win' : /Mac|iPhone|iPad/.test(ua) ? 'mac' : 'linux';
  }
  const marcar = () =>
    $$('[data-define-so]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.defineSo === raiz.dataset.so)));
  document.addEventListener('click', (ev) => {
    const b = (ev.target as Element).closest<HTMLElement>('[data-define-so]');
    if (!b) return;
    raiz.dataset.so = b.dataset.defineSo;
    gravar((e) => (e.so = b.dataset.defineSo));
    marcar();
  });
  marcar();
}

/* ---------- Progresso ---------- */

function pintar() {
  const estado = ler();
  const estacoes = (document.body.dataset.estacoes || '').split(',').filter(Boolean);
  const feitas = estacoes.filter((id) => estado.feitos[id]).length;
  const pct = estacoes.length ? Math.round((feitas / estacoes.length) * 100) : 0;

  raiz.style.setProperty('--progresso', String(pct));
  $$('[data-progresso-pct]').forEach((el) => (el.textContent = `${pct}%`));
  $$('[data-progresso-texto]').forEach((el) => (el.textContent = `${feitas} de ${estacoes.length} estações`));

  $$('[data-estacao]').forEach((el) => {
    const id = el.dataset.estacao!;
    el.classList.toggle('feita', Boolean(estado.feitos[id]));
    el.classList.toggle('trem', estado.ultimo?.id === id);
    if (estado.trilha) el.classList.toggle('fora-da-trilha', !(el.dataset.trilhas || '').includes(estado.trilha));
  });

  $$<HTMLButtonElement>('[data-marca]').forEach((b) => {
    const feito = Boolean(estado.feitos[b.dataset.marca!]);
    b.setAttribute('aria-pressed', String(feito));
    const rotulo = $('[data-marca-rotulo]', b);
    if (rotulo) rotulo.textContent = feito ? b.dataset.rotuloFeito || 'Feito' : b.dataset.rotuloPendente || 'Marcar como feito';
    b.closest('.ficha')?.classList.toggle('ficha--feita', feito);
  });

  $$<HTMLButtonElement>('[data-carimbo]').forEach((b) => {
    const usado = Boolean(estado.cartas[b.dataset.carimbo!]);
    b.setAttribute('aria-pressed', String(usado));
    b.closest('.carta')?.classList.toggle('carta--usada', usado);
  });
  const totalCartas = $$('[data-carimbo]').length;
  if (totalCartas) {
    const usadas = $$('[data-carimbo][aria-pressed="true"]').length;
    $$('[data-cartas-contador]').forEach((el) => (el.textContent = `você já usou ${usadas} de ${totalCartas}`));
  }

  $$('[data-trilha-escolha]').forEach((el) =>
    el.setAttribute('aria-pressed', String(el.dataset.trilhaEscolha === estado.trilha)),
  );

  const retomar = $<HTMLAnchorElement>('[data-retomar]');
  if (retomar && estado.ultimo) {
    retomar.hidden = false;
    retomar.href = estado.ultimo.href;
    const alvo = $('[data-retomar-titulo]', retomar);
    if (alvo) alvo.textContent = estado.ultimo.titulo;
  }
}

function progresso() {
  document.addEventListener('click', (ev) => {
    const alvo = ev.target as Element;
    const marca = alvo.closest<HTMLElement>('[data-marca]');
    if (marca) {
      const id = marca.dataset.marca!;
      gravar((e) => (e.feitos[id] ? delete e.feitos[id] : (e.feitos[id] = Date.now())));
    }
    const carimbo = alvo.closest<HTMLElement>('[data-carimbo]');
    if (carimbo) {
      const id = carimbo.dataset.carimbo!;
      gravar((e) => (e.cartas[id] ? delete e.cartas[id] : (e.cartas[id] = Date.now())));
    }
    const trilha = alvo.closest<HTMLElement>('[data-trilha-escolha]');
    if (trilha) {
      const id = trilha.dataset.trilhaEscolha!;
      gravar((e) => (e.trilha = e.trilha === id ? undefined : id));
    }
  });

  const atual = document.body.dataset.estacaoAtual;
  if (atual) {
    const titulo = $('h1')?.textContent?.trim() || atual;
    return gravar((e) => (e.ultimo = { id: atual, titulo, href: location.pathname }));
  }
  pintar();
}

/* ---------- Copiar código ---------- */

function copiar() {
  $$<HTMLPreElement>('.prosa pre, .ficha pre').forEach((pre) => {
    if (pre.closest('.bloco-codigo') || pre.closest('.terminal')) return;
    const caixa = document.createElement('div');
    caixa.className = 'bloco-codigo';
    pre.replaceWith(caixa);
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'copiar';
    botao.textContent = 'Copiar';
    botao.addEventListener('click', async () => {
      await navigator.clipboard.writeText(pre.innerText.replace(/\n$/, ''));
      botao.textContent = 'Copiado';
      botao.dataset.ok = '';
      setTimeout(() => {
        botao.textContent = 'Copiar';
        delete botao.dataset.ok;
      }, 1600);
    });
    pre.tabIndex = 0;
    caixa.append(pre, botao);
  });
}

/* ---------- Notas laterais: abertas na margem em telas largas ---------- */

function notas() {
  const largo = matchMedia('(min-width: 78rem)');
  const ajustar = () => $$<HTMLDetailsElement>('details.nota').forEach((d) => (d.open = largo.matches));
  largo.addEventListener('change', ajustar);
  ajustar();
}

/* ---------- Player (animações e Terminal-Replay) ----------
   Cada figura declara data-passos=N. O passo atual fica em data-passo; o CSS decide o que aparece.
   Sem JS, ou com movimento reduzido, a figura mostra o estado final completo. */

function players() {
  $$('[data-player]').forEach((fig) => {
    const total = Number(fig.dataset.passos || 0);
    const intervalo = Number(fig.dataset.intervalo || 1100);
    const faixa = $<HTMLInputElement>('input[type=range]', fig);
    const botao = $<HTMLButtonElement>('[data-player-toca]', fig);
    const legenda = $('[data-player-legenda]', fig);
    const legendas = $$('[data-legenda]', fig);
    if (!total || !faixa || !botao) return;
    let relogio: number | undefined;
    const tela = $('.terminal__tela', fig);

    const ir = (n: number) => {
      const passo = Math.max(0, Math.min(total, n));
      fig.dataset.passo = String(passo);
      faixa.value = String(passo);
      $$('[data-de]', fig).forEach((el) => {
        const de = Number(el.dataset.de);
        const ate = el.dataset.ate ? Number(el.dataset.ate) : Infinity;
        el.classList.toggle('visivel', passo >= de && passo <= ate);
        el.classList.toggle('agora', passo === de);
      });
      const texto = legendas.find((l) => Number(l.dataset.legenda) === passo)?.textContent;
      if (legenda && texto) legenda.textContent = texto;
      // Só acompanha o fim da tela enquanto toca; no estado parado não força layout.
      if (relogio && tela) tela.scrollTop = tela.scrollHeight;
    };
    const parar = () => {
      clearInterval(relogio);
      relogio = undefined;
      botao.setAttribute('aria-pressed', 'false');
      botao.setAttribute('aria-label', 'Reproduzir');
    };
    const tocar = () => {
      if (Number(fig.dataset.passo) >= total) ir(0);
      botao.setAttribute('aria-pressed', 'true');
      botao.setAttribute('aria-label', 'Pausar');
      relogio = window.setInterval(() => {
        const prox = Number(fig.dataset.passo) + 1;
        ir(prox);
        if (prox >= total) parar();
      }, intervalo);
    };

    fig.dataset.ativo = '';
    botao.addEventListener('click', () => (relogio ? parar() : tocar()));
    faixa.addEventListener('input', () => {
      parar();
      ir(Number(faixa.value));
    });

    // Estado inicial: completo. Só toca sozinho quando pedido e o sistema permite movimento.
    ir(total);
    if (fig.dataset.autoplay !== undefined && !movimentoReduzido()) {
      const obs = new IntersectionObserver(
        (entradas) => {
          if (entradas.some((x) => x.isIntersecting)) {
            obs.disconnect();
            ir(0);
            tocar();
          }
        },
        { threshold: 0.4 },
      );
      obs.observe(fig);
    }
  });
}

/* ---------- Gaveta e busca ---------- */

function dialogos() {
  const gaveta = $<HTMLDialogElement>('#gaveta');
  const busca = $<HTMLDialogElement>('#busca');
  const campo = $<HTMLInputElement>('#busca-campo');
  const lista = $('#busca-resultados');
  let pagefind: any;

  const abrirBusca = async () => {
    if (!busca || busca.open) return;
    busca.showModal();
    campo?.focus();
    if (!pagefind) {
      try {
        const base = import.meta.env.BASE_URL.replace(/\/$/, '');
        pagefind = await import(/* @vite-ignore */ `${base}/pagefind/pagefind.js`);
        await pagefind.init();
      } catch {
        if (lista) lista.innerHTML = '<li class="busca__vazio">O índice de busca só existe no site construído (npm run build).</li>';
      }
    }
  };

  $$<HTMLAnchorElement>('[data-abre]').forEach((a) =>
    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      if (a.dataset.abre === 'gaveta') gaveta?.showModal();
      else abrirBusca();
    }),
  );

  // Clique fora do painel fecha.
  [gaveta, busca].forEach((d) => d?.addEventListener('click', (ev) => ev.target === d && d.close()));

  document.addEventListener('keydown', (ev) => {
    const el = ev.target as HTMLElement;
    const digitando = /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable;
    if (ev.key === '/' && !digitando && !ev.ctrlKey && !ev.metaKey) {
      ev.preventDefault();
      abrirBusca();
    }
  });

  let vez = 0;
  campo?.addEventListener('input', async () => {
    if (!pagefind || !lista) return;
    const minha = ++vez;
    const termo = campo.value.trim();
    if (!termo) return void (lista.innerHTML = '');
    const busca = await pagefind.debouncedSearch(termo, {}, 160);
    if (!busca || minha !== vez) return;
    const itens = await Promise.all(busca.results.slice(0, 8).map((r: any) => r.data()));
    lista.innerHTML = itens.length
      ? itens
          .map(
            (d: any) =>
              `<li><a href="${d.url}"><strong>${d.meta?.title ?? d.url}</strong><span>${d.excerpt}</span></a></li>`,
          )
          .join('')
      : '<li class="busca__vazio">Nada encontrado. Tente o nome de um comando, como <code>/compact</code>.</li>';
  });

  campo?.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      $<HTMLAnchorElement>('a', lista!)?.click();
    }
  });
}

/* ---------- Baralho de comandos: filtros e virar carta ---------- */

function baralho() {
  const mesa = $('[data-baralho]');
  if (!mesa) return;
  const campo = $<HTMLInputElement>('[data-baralho-busca]', mesa);
  const cartas = $$('.carta', mesa);
  const filtros: Record<string, string> = {};

  const aplicar = () => {
    const termo = (campo?.value || '').toLowerCase().trim();
    let visiveis = 0;
    cartas.forEach((c) => {
      const ok =
        Object.entries(filtros).every(([k, v]) => !v || (c.dataset[k] || '').split(' ').includes(v)) &&
        (!termo || (c.dataset.texto || '').includes(termo));
      c.hidden = !ok;
      if (ok) visiveis++;
    });
    $$('[data-baralho-total]', mesa).forEach((el) => (el.textContent = String(visiveis)));
  };

  mesa.addEventListener('click', (ev) => {
    const alvo = ev.target as Element;
    const f = alvo.closest<HTMLElement>('[data-filtro]');
    if (f) {
      const [k, v] = f.dataset.filtro!.split(':');
      filtros[k] = filtros[k] === v ? '' : v;
      $$(`[data-filtro^="${k}:"]`, mesa).forEach((b) =>
        b.setAttribute('aria-pressed', String(b.dataset.filtro === `${k}:${filtros[k]}`)),
      );
      aplicar();
    }
    const vira = alvo.closest<HTMLElement>('[data-vira]');
    if (vira) {
      const carta = vira.closest('.carta')!;
      const aberta = carta.classList.toggle('carta--virada');
      $$('[data-vira]', carta).forEach((b) => b.setAttribute('aria-expanded', String(aberta)));
    }
  });
  campo?.addEventListener('input', aplicar);
}

/* ---------- Exportar e importar progresso ---------- */

function portabilidade() {
  $('[data-exportar]')?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(ler(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'manual-de-bordo-progresso.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });
  $<HTMLInputElement>('[data-importar]')?.addEventListener('change', async (ev) => {
    const arquivo = (ev.target as HTMLInputElement).files?.[0];
    const aviso = $('[data-importar-aviso]');
    if (!arquivo) return;
    try {
      const dados = JSON.parse(await arquivo.text());
      if (typeof dados !== 'object' || typeof dados.feitos !== 'object') throw new Error('formato');
      localStorage.setItem(CHAVE, JSON.stringify({ feitos: {}, cartas: {}, ...dados }));
      if (aviso) aviso.textContent = 'Progresso importado.';
      pintar();
    } catch {
      if (aviso) aviso.textContent = 'Este arquivo não parece um progresso exportado daqui.';
    }
  });
  $('[data-apagar]')?.addEventListener('click', () => {
    if (confirm('Apagar todo o progresso deste navegador?')) {
      localStorage.removeItem(CHAVE);
      pintar();
    }
  });
}

tema();
sistema();
progresso();
copiar();
notas();
players();
dialogos();
baralho();
portabilidade();
