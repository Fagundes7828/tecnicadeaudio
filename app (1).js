/* ============================================================
   Sistema Técnico — Mesa / Medusa / Equipamentos
   app.js — Lógica principal
   ============================================================ */

/* ================= CONSTANTES ================= */
const CATEGORIES = [
  "Instrumentos","Microfones","Cabos","Mesas",
  "Processadores","Monitores","Caixas","Computadores"
];
const CH_TIPOS = ["Microfone","Instrumento","Computador","Playback","DI","Retorno","Outro"];
const EVENT_TIPOS = ["Revisão","Troca de cabo","Limpeza","Calibração","Evento"];
const DOW = ['DOM','SEG','TER','QUA','QUI','SEX','SÁB'];
const MONTHS = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
];
const STORAGE_KEY = 'sistema-tecnico';

/* ================= DADOS PADRÃO ================= */
const defaultChannels = [
  {mesa:1, medusa:1, instrumento:"Bumbo", tipo:"Microfone", equipamentoId:null, observacoes:""},
  {mesa:2, medusa:2, instrumento:"Caixa", tipo:"Microfone", equipamentoId:null, observacoes:""},
  {mesa:3, medusa:3, instrumento:"Hi-Hat", tipo:"Microfone", equipamentoId:null, observacoes:""},
  {mesa:4, medusa:4, instrumento:"Tom 1", tipo:"Microfone", equipamentoId:null, observacoes:""},
  {mesa:5, medusa:5, instrumento:"Tom 2", tipo:"Microfone", equipamentoId:null, observacoes:""},
  {mesa:6, medusa:6, instrumento:"Surdo", tipo:"Microfone", equipamentoId:null, observacoes:""},
  {mesa:7, medusa:7, instrumento:"Overhead L", tipo:"Microfone", equipamentoId:null, observacoes:""},
  {mesa:8, medusa:8, instrumento:"Overhead R", tipo:"Microfone", equipamentoId:null, observacoes:""},
  {mesa:9, medusa:9, instrumento:"Baixo", tipo:"DI", equipamentoId:null, observacoes:""},
  {mesa:10, medusa:10, instrumento:"Guitarra 1", tipo:"Microfone", equipamentoId:null, observacoes:""},
  {mesa:11, medusa:11, instrumento:"Guitarra 2", tipo:"Microfone", equipamentoId:null, observacoes:""},
  {mesa:12, medusa:12, instrumento:"Teclado L", tipo:"DI", equipamentoId:null, observacoes:""},
  {mesa:13, medusa:13, instrumento:"Teclado R", tipo:"DI", equipamentoId:null, observacoes:""},
  {mesa:14, medusa:14, instrumento:"Voz 1 (Principal)", tipo:"Microfone", equipamentoId:null, observacoes:""},
  {mesa:15, medusa:15, instrumento:"Voz 2", tipo:"Microfone", equipamentoId:null, observacoes:""},
  {mesa:16, medusa:16, instrumento:"Voz 3", tipo:"Microfone", equipamentoId:null, observacoes:""},
  {mesa:17, medusa:17, instrumento:"Voz 4", tipo:"Microfone", equipamentoId:null, observacoes:""},
  {mesa:18, medusa:18, instrumento:"Voz 5 (Coro)", tipo:"Microfone", equipamentoId:null, observacoes:""},
  {mesa:19, medusa:19, instrumento:"Violão 1", tipo:"Microfone", equipamentoId:null, observacoes:""},
  {mesa:20, medusa:20, instrumento:"Violão 2", tipo:"Microfone", equipamentoId:null, observacoes:""},
  {mesa:21, medusa:21, instrumento:"Sax", tipo:"Microfone", equipamentoId:null, observacoes:""},
  {mesa:22, medusa:22, instrumento:"Trompete", tipo:"Microfone", equipamentoId:null, observacoes:""},
  {mesa:23, medusa:23, instrumento:"Percussão 1", tipo:"Microfone", equipamentoId:null, observacoes:""},
  {mesa:24, medusa:24, instrumento:"Percussão 2", tipo:"Microfone", equipamentoId:null, observacoes:""},
  {mesa:25, medusa:null, instrumento:"", tipo:"", equipamentoId:null, observacoes:""},
  {mesa:26, medusa:null, instrumento:"", tipo:"", equipamentoId:null, observacoes:""},
  {mesa:27, medusa:null, instrumento:"", tipo:"", equipamentoId:null, observacoes:""},
  {mesa:28, medusa:null, instrumento:"", tipo:"", equipamentoId:null, observacoes:""},
  {mesa:29, medusa:null, instrumento:"", tipo:"", equipamentoId:null, observacoes:""},
  {mesa:30, medusa:null, instrumento:"", tipo:"", equipamentoId:null, observacoes:""},
  {mesa:31, medusa:null, instrumento:"", tipo:"", equipamentoId:null, observacoes:""},
  {mesa:32, medusa:null, instrumento:"", tipo:"", equipamentoId:null, observacoes:""},
];

const defaultEquipment = [
  {id:"eq1", categoria:"Microfones", nome:"Voz Principal", marca:"Shure", modelo:"SM58", tipo:"Dinâmico", quantidade:1, comprimento:"", ultimaManutencao:"", proximaManutencao:"", observacoes:""},
  {id:"eq2", categoria:"Microfones", nome:"Bateria Kit", marca:"Shure", modelo:"SM57", tipo:"Dinâmico", quantidade:6, comprimento:"", ultimaManutencao:"", proximaManutencao:"", observacoes:""},
  {id:"eq3", categoria:"Cabos", nome:"XLR 10m", marca:"Santo Ângelo", modelo:"", tipo:"XLR", quantidade:12, comprimento:"10m", ultimaManutencao:"", proximaManutencao:"", observacoes:""},
  {id:"eq4", categoria:"Instrumentos", nome:"Violão", marca:"Tagima", modelo:"Dallas", tipo:"Acústico", quantidade:2, comprimento:"", ultimaManutencao:"", proximaManutencao:"", observacoes:""},
  {id:"eq5", categoria:"Computadores", nome:"Notebook Playback", marca:"Dell", modelo:"", tipo:"", quantidade:1, comprimento:"", ultimaManutencao:"", proximaManutencao:"", observacoes:""},
  {id:"eq6", categoria:"Mesas", nome:"Mesa Principal 32ch", marca:"Behringer", modelo:"X32", tipo:"", quantidade:1, comprimento:"", ultimaManutencao:"", proximaManutencao:"", observacoes:""},
];

const defaultEvents = [];

/* ================= ESTADO ================= */
let state = {
  channels: JSON.parse(JSON.stringify(defaultChannels)),
  equipment: JSON.parse(JSON.stringify(defaultEquipment)),
  events: JSON.parse(JSON.stringify(defaultEvents)),
};

let chMode = "mesa";
let eqActiveCat = CATEGORIES[0];
let calDate = new Date();
let calSelected = new Date();
let showEqForm = false;
let showEventForm = false;

const saveFlag = document.getElementById('saveFlag');
let saveTimeout;

/* ================= PERSISTÊNCIA (localStorage) ================= */
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state = Object.assign(state, parsed);
    }
  } catch(e) { /* sem dados salvos ainda */ }
  renderAll();
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    flagSaved();
  } catch(e) { console.error('Erro ao salvar', e); }
}

function flagSaved() {
  saveFlag.classList.add('show');
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => saveFlag.classList.remove('show'), 1200);
}

function debouncedPersist() {
  clearTimeout(window._pt);
  window._pt = setTimeout(persist, 400);
}

/* ================= HELPERS ================= */
function escapeHtml(str) {
  return (str || '').toString().replace(/[&<>"']/g, m =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])
  );
}
function uid() { return 'id' + Math.random().toString(36).slice(2, 10); }
function todayStr() { return new Date().toISOString().slice(0, 10); }
function daysUntil(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date(); now.setHours(0, 0, 0, 0);
  return Math.round((d - now) / 86400000);
}
function mantStatus(proximaManutencao) {
  if (!proximaManutencao) return 'none';
  const du = daysUntil(proximaManutencao);
  if (du < 0) return 'danger';
  if (du <= 30) return 'warn';
  return 'ok';
}
function eqById(id) { return state.equipment.find(e => e.id === id); }
function ymd(d) { return d.toISOString().slice(0, 10); }

/* ================= TABS ================= */
document.querySelectorAll('nav.tabs button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('nav.tabs button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + btn.dataset.tab).classList.add('active');
  });
});

/* ================= RENDER ALL ================= */
function renderAll() {
  renderDashboard();
  renderChannels();
  renderEquipCatTabs();
  renderEquipment();
  renderMaintenance();
  renderCalendar();
  renderRouting();
}

/* ================= DASHBOARD ================= */
function renderDashboard() {
  const total = state.equipment.reduce((s, e) => s + (parseInt(e.quantidade) || 0), 0);
  const emManutencao = state.equipment.filter(e => mantStatus(e.proximaManutencao) === 'danger').length;
  const microfones = state.equipment.filter(e => e.categoria === 'Microfones').reduce((s, e) => s + (parseInt(e.quantidade) || 0), 0);
  const cabos = state.equipment.filter(e => e.categoria === 'Cabos').reduce((s, e) => s + (parseInt(e.quantidade) || 0), 0);
  const instrumentos = state.equipment.filter(e => e.categoria === 'Instrumentos').reduce((s, e) => s + (parseInt(e.quantidade) || 0), 0);
  const proximas = state.equipment.filter(e => mantStatus(e.proximaManutencao) === 'warn').length;

  const stats = [
    { num: total, lbl: 'Equipamentos totais', cls: 'c-accent' },
    { num: emManutencao, lbl: 'Vencidos / em manutenção', cls: 'c-danger' },
    { num: microfones, lbl: 'Microfones', cls: 'c-ok' },
    { num: cabos, lbl: 'Cabos', cls: 'c-ok' },
    { num: instrumentos, lbl: 'Instrumentos', cls: 'c-ok' },
    { num: proximas, lbl: 'Próximas revisões', cls: 'c-warn' },
  ];
  document.getElementById('dashStats').innerHTML = stats.map(s => `
    <div class="stat-card ${s.cls}"><div class="num">${s.num}</div><div class="lbl">${s.lbl}</div></div>
  `).join('');

  const upcoming = state.equipment
    .filter(e => e.proximaManutencao)
    .sort((a, b) => a.proximaManutencao.localeCompare(b.proximaManutencao))
    .slice(0, 8);
  const wrap = document.getElementById('dashUpcoming');
  if (upcoming.length === 0) {
    wrap.innerHTML = `<p style="color:var(--muted); font-size:13px;">Nenhuma manutenção agendada ainda.</p>`;
    return;
  }
  wrap.innerHTML = `<table class="list-table"><thead><tr><th>Equipamento</th><th>Categoria</th><th>Próxima manutenção</th><th>Status</th></tr></thead><tbody>
    ${upcoming.map(e => {
      const st = mantStatus(e.proximaManutencao);
      const badgeCls = st === 'danger' ? 'st-danger' : st === 'warn' ? 'st-warn' : 'st-ok';
      const label = st === 'danger' ? 'Vencido' : st === 'warn' ? 'Atenção' : 'Ok';
      return `<tr><td>${escapeHtml(e.nome)}</td><td>${escapeHtml(e.categoria)}</td><td>${e.proximaManutencao}</td><td><span class="badge ${badgeCls}">${label}</span></td></tr>`;
    }).join('')}
  </tbody></table>`;
}

/* ================= CANAIS ================= */
document.getElementById('chModeTabs').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-mode]');
  if (!btn) return;
  chMode = btn.dataset.mode;
  document.querySelectorAll('#chModeTabs button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderChannels();
});

function equipmentOptionsHtml(selectedId) {
  let opts = `<option value="">— Nenhum —</option>`;
  const byCat = {};
  state.equipment.forEach(e => { (byCat[e.categoria] = byCat[e.categoria] || []).push(e); });
  Object.keys(byCat).forEach(cat => {
    opts += `<optgroup label="${escapeHtml(cat)}">`;
    byCat[cat].forEach(e => {
      opts += `<option value="${e.id}" ${e.id === selectedId ? 'selected' : ''}>${escapeHtml(e.nome)}${e.marca ? ' — ' + escapeHtml(e.marca) : ''}</option>`;
    });
    opts += `</optgroup>`;
  });
  return opts;
}

function renderChannels() {
  const grid = document.getElementById('chGrid');
  let list = state.channels.map((ch, idx) => ({ ch, idx }));
  if (chMode === 'medusa') {
    list = list.filter(x => x.ch.medusa !== null).sort((a, b) => a.ch.medusa - b.ch.medusa);
  }
  grid.innerHTML = list.map(({ ch, idx }) => {
    const isLocal = ch.medusa === null;
    const primary = chMode === 'medusa' && !isLocal ? String(ch.medusa).padStart(2, '0') : String(ch.mesa).padStart(2, '0');
    const primaryLbl = chMode === 'medusa' && !isLocal ? 'MEDUSA' : 'MESA';
    const badgeTxt = isLocal ? 'LOCAL' : (chMode === 'medusa' ? 'MESA ' + String(ch.mesa).padStart(2, '0') : 'MED ' + String(ch.medusa).padStart(2, '0'));
    return `
    <div class="card ${isLocal ? 'local' : ''}" data-idx="${idx}">
      <div class="card-top"></div>
      <div class="card-head">
        <div class="ch-mesa"><span class="prefix">${primaryLbl}</span>${primary}</div>
        <div class="badge">${badgeTxt}</div>
      </div>
      <div class="card-body">
        <div class="field">
          <label>Nome do canal</label>
          <input type="text" data-field="instrumento" value="${escapeHtml(ch.instrumento)}" placeholder="Ex: Guitarra">
        </div>
        <div class="field">
          <label>Tipo</label>
          <select data-field="tipo">
            <option value="">—</option>
            ${CH_TIPOS.map(t => `<option value="${t}" ${ch.tipo === t ? 'selected' : ''}>${t}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label>Equipamento vinculado</label>
          <select data-field="equipamentoId">${equipmentOptionsHtml(ch.equipamentoId)}</select>
        </div>
        <div class="field">
          <label>Observações</label>
          <textarea data-field="observacoes" placeholder="Ex: canal com ruído, revisar cabo...">${escapeHtml(ch.observacoes)}</textarea>
        </div>
      </div>
    </div>`;
  }).join('');

  grid.querySelectorAll('input,select,textarea').forEach(inp => {
    inp.addEventListener('input', (e) => {
      const card = e.target.closest('.card');
      const idx = card.dataset.idx;
      const field = e.target.dataset.field;
      state.channels[idx][field] = e.target.value;
      debouncedPersist();
      if (field === 'equipamentoId') renderRouting();
    });
  });

  applyChFilter();
}

function applyChFilter() {
  const q = document.getElementById('chSearch').value.trim().toLowerCase();
  document.querySelectorAll('#chGrid .card').forEach(card => {
    const idx = card.dataset.idx;
    const ch = state.channels[idx];
    const eq = eqById(ch.equipamentoId);
    const hay = `${ch.mesa} ${ch.medusa || ''} ${ch.instrumento} ${ch.tipo} ${ch.observacoes} ${eq ? eq.nome : ''}`.toLowerCase();
    card.classList.toggle('hidden', q && !hay.includes(q));
  });
}
document.getElementById('chSearch').addEventListener('input', applyChFilter);
document.getElementById('chPrintBtn').addEventListener('click', () => window.print());
document.getElementById('chResetBtn').addEventListener('click', () => {
  if (confirm('Restaurar todos os canais para o padrão sugerido? Isso apaga suas edições nos canais.')) {
    state.channels = JSON.parse(JSON.stringify(defaultChannels));
    renderChannels(); renderRouting(); persist();
  }
});

/* ================= EQUIPAMENTOS ================= */
function renderEquipCatTabs() {
  const wrap = document.getElementById('eqCatTabs');
  wrap.innerHTML = CATEGORIES.map(c => `<button data-cat="${c}" class="${c === eqActiveCat ? 'active' : ''}">${c}</button>`).join('');
  wrap.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      eqActiveCat = btn.dataset.cat;
      showEqForm = false;
      renderEquipCatTabs();
      renderEquipment();
    });
  });
}

document.getElementById('eqAddBtn').addEventListener('click', () => {
  showEqForm = !showEqForm;
  renderEqForm();
});

function renderEqForm() {
  const wrap = document.getElementById('eqFormWrap');
  if (!showEqForm) { wrap.innerHTML = ''; return; }
  const isCabo = eqActiveCat === 'Cabos';
  wrap.innerHTML = `
    <div class="event-form">
      <div class="field"><label>Nome</label><input type="text" id="nf-nome" placeholder="Ex: Voz Principal"></div>
      <div class="field"><label>Marca</label><input type="text" id="nf-marca" placeholder="Ex: Shure"></div>
      <div class="field"><label>Modelo</label><input type="text" id="nf-modelo" placeholder="Ex: SM58"></div>
      <div class="field"><label>Tipo</label><input type="text" id="nf-tipo" placeholder="${isCabo ? 'Ex: XLR, P10...' : 'Ex: Dinâmico...'}"></div>
      ${isCabo ? `<div class="field"><label>Comprimento</label><input type="text" id="nf-comp" placeholder="Ex: 10m"></div>` : ''}
      <div class="field"><label>Quantidade</label><input type="number" id="nf-qtd" value="1" min="1"></div>
      <div class="field fspan2"><label>Observações</label><input type="text" id="nf-obs" placeholder="Opcional"></div>
      <div><button class="primary" id="nf-save">Salvar item</button></div>
    </div>
  `;
  document.getElementById('nf-save').addEventListener('click', () => {
    const nome = document.getElementById('nf-nome').value.trim();
    if (!nome) { alert('Informe um nome para o equipamento.'); return; }
    const item = {
      id: uid(), categoria: eqActiveCat,
      nome, marca: document.getElementById('nf-marca').value.trim(),
      modelo: document.getElementById('nf-modelo').value.trim(),
      tipo: document.getElementById('nf-tipo').value.trim(),
      comprimento: isCabo ? document.getElementById('nf-comp').value.trim() : '',
      quantidade: parseInt(document.getElementById('nf-qtd').value) || 1,
      ultimaManutencao: '', proximaManutencao: '',
      observacoes: document.getElementById('nf-obs').value.trim(),
    };
    state.equipment.push(item);
    showEqForm = false;
    renderEqForm(); renderEquipment(); renderMaintenance(); renderDashboard(); persist();
  });
}

function renderEquipment() {
  const grid = document.getElementById('eqGrid');
  const items = state.equipment.filter(e => e.categoria === eqActiveCat);
  grid.innerHTML = items.map(item => {
    const st = mantStatus(item.proximaManutencao);
    const cardCls = st === 'danger' ? 'danger' : st === 'warn' ? 'local' : '';
    return `
    <div class="card ${cardCls}" data-id="${item.id}">
      <div class="card-top"></div>
      <div class="card-head">
        <div class="ch-mesa" style="font-size:15px;"><span class="prefix">${escapeHtml(item.categoria)}</span>${escapeHtml(item.nome) || 'Sem nome'}</div>
      </div>
      <div class="card-body">
        <div class="field"><label>Nome</label><input type="text" data-field="nome" value="${escapeHtml(item.nome)}"></div>
        <div class="field"><label>Marca</label><input type="text" data-field="marca" value="${escapeHtml(item.marca)}"></div>
        <div class="field"><label>Modelo</label><input type="text" data-field="modelo" value="${escapeHtml(item.modelo)}"></div>
        <div class="field"><label>Tipo</label><input type="text" data-field="tipo" value="${escapeHtml(item.tipo)}"></div>
        ${item.categoria === 'Cabos' ? `<div class="field"><label>Comprimento</label><input type="text" data-field="comprimento" value="${escapeHtml(item.comprimento)}"></div>` : ''}
        <div class="field"><label>Quantidade</label><input type="number" min="0" data-field="quantidade" value="${item.quantidade}"></div>
        <div class="field"><label>Observações</label><textarea data-field="observacoes">${escapeHtml(item.observacoes)}</textarea></div>
      </div>
      <div class="card-foot"><button class="small danger-btn" data-del="${item.id}">Excluir</button></div>
    </div>`;
  }).join('');

  grid.querySelectorAll('.card').forEach(card => {
    const id = card.dataset.id;
    card.querySelectorAll('input,textarea').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const item = eqById(id);
        const field = e.target.dataset.field;
        item[field] = field === 'quantidade' ? (parseInt(e.target.value) || 0) : e.target.value;
        debouncedPersist();
        if (field === 'nome') { renderChannels(); renderRouting(); renderDashboard(); }
      });
    });
  });
  grid.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirm('Excluir este equipamento? Canais vinculados a ele perderão o vínculo.')) return;
      const id = btn.dataset.del;
      state.equipment = state.equipment.filter(e => e.id !== id);
      state.channels.forEach(ch => { if (ch.equipamentoId === id) ch.equipamentoId = null; });
      renderEquipment(); renderChannels(); renderMaintenance(); renderDashboard(); renderRouting(); persist();
    });
  });

  applyEqFilter();
}

function applyEqFilter() {
  const q = document.getElementById('eqSearch').value.trim().toLowerCase();
  document.querySelectorAll('#eqGrid .card').forEach(card => {
    const id = card.dataset.id;
    const item = eqById(id);
    const hay = `${item.nome} ${item.marca} ${item.modelo} ${item.tipo}`.toLowerCase();
    card.classList.toggle('hidden', q && !hay.includes(q));
  });
}
document.getElementById('eqSearch').addEventListener('input', applyEqFilter);

/* ================= MANUTENÇÃO ================= */
function renderMaintenance() {
  const vencidos = state.equipment.filter(e => mantStatus(e.proximaManutencao) === 'danger').length;
  const atencao = state.equipment.filter(e => mantStatus(e.proximaManutencao) === 'warn').length;
  const ok = state.equipment.filter(e => mantStatus(e.proximaManutencao) === 'ok').length;
  const semData = state.equipment.filter(e => !e.proximaManutencao).length;
  document.getElementById('mantStats').innerHTML = `
    <div class="stat-card c-danger"><div class="num">${vencidos}</div><div class="lbl">Vencidos</div></div>
    <div class="stat-card c-warn"><div class="num">${atencao}</div><div class="lbl">Atenção (≤30 dias)</div></div>
    <div class="stat-card c-ok"><div class="num">${ok}</div><div class="lbl">Em dia</div></div>
    <div class="stat-card c-accent"><div class="num">${semData}</div><div class="lbl">Sem data definida</div></div>
  `;

  const body = document.getElementById('mantBody');
  const q = document.getElementById('mantSearch').value.trim().toLowerCase();
  const rows = state.equipment.filter(e => !q || `${e.nome} ${e.categoria}`.toLowerCase().includes(q));
  body.innerHTML = rows.map(e => {
    const st = mantStatus(e.proximaManutencao);
    const badgeCls = st === 'danger' ? 'st-danger' : st === 'warn' ? 'st-warn' : st === 'ok' ? 'st-ok' : '';
    const label = st === 'danger' ? 'Vencido' : st === 'warn' ? 'Atenção' : st === 'ok' ? 'Ok' : '—';
    return `<tr data-id="${e.id}">
      <td>${escapeHtml(e.nome)}</td>
      <td>${escapeHtml(e.categoria)}</td>
      <td><input type="date" data-field="ultimaManutencao" value="${e.ultimaManutencao}"></td>
      <td><input type="date" data-field="proximaManutencao" value="${e.proximaManutencao}"></td>
      <td><span class="badge ${badgeCls}">${label}</span></td>
      <td><input type="text" data-field="observacoes" value="${escapeHtml(e.observacoes)}" style="width:100%;"></td>
    </tr>`;
  }).join('');

  body.querySelectorAll('tr').forEach(tr => {
    const id = tr.dataset.id;
    tr.querySelectorAll('input').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const item = eqById(id);
        item[e.target.dataset.field] = e.target.value;
        debouncedPersist();
        renderMaintenance(); renderDashboard(); renderCalendar();
      });
    });
  });
}
document.getElementById('mantSearch').addEventListener('input', renderMaintenance);

/* ================= CALENDÁRIO ================= */
function eventsForDate(dateStr) {
  const manual = state.events.filter(ev => ev.date === dateStr);
  const maint = state.equipment.filter(e => e.proximaManutencao === dateStr).map(e => ({
    id: 'maint-' + e.id, date: dateStr, tipo: 'Manutenção prevista', descricao: e.nome, equipamentoId: e.id, auto: true
  }));
  return [...manual, ...maint];
}

function renderCalendar() {
  const y = calDate.getFullYear(), m = calDate.getMonth();
  document.getElementById('calMonthLbl').textContent = MONTHS[m] + ' ' + y;
  const first = new Date(y, m, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const todayS = todayStr();
  const selS = ymd(calSelected);

  let cells = DOW.map(d => `<div class="cal-dow">${d}</div>`).join('');
  for (let i = 0; i < startDow; i++) cells += `<div class="cal-day empty"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = ymd(new Date(y, m, d));
    const evs = eventsForDate(dateStr);
    const dots = evs.slice(0, 4).map(ev => `<span class="dot ${ev.auto ? 'warn' : 'accent'}"></span>`).join('');
    let cls = 'cal-day';
    if (dateStr === todayS) cls += ' today';
    if (dateStr === selS) cls += ' selected';
    cells += `<div class="${cls}" data-date="${dateStr}"><div class="dnum">${d}</div><div class="cal-dots">${dots}</div></div>`;
  }
  document.getElementById('calGrid').innerHTML = cells;
  document.querySelectorAll('.cal-day[data-date]').forEach(cell => {
    cell.addEventListener('click', () => {
      calSelected = new Date(cell.dataset.date + 'T00:00:00');
      showEventForm = false;
      renderCalendar(); renderEventList(); renderEventForm();
    });
  });
  renderEventList();
}

document.getElementById('calPrev').addEventListener('click', () => { calDate = new Date(calDate.getFullYear(), calDate.getMonth() - 1, 1); renderCalendar(); });
document.getElementById('calNext').addEventListener('click', () => { calDate = new Date(calDate.getFullYear(), calDate.getMonth() + 1, 1); renderCalendar(); });
document.getElementById('calToday').addEventListener('click', () => { calDate = new Date(); calSelected = new Date(); renderCalendar(); });

function renderEventList() {
  const dateStr = ymd(calSelected);
  document.getElementById('calSelLbl').textContent = 'Eventos — ' + dateStr.split('-').reverse().join('/');
  const evs = eventsForDate(dateStr);
  const wrap = document.getElementById('calEventList');
  if (evs.length === 0) {
    wrap.innerHTML = `<p style="color:var(--muted); font-size:13px;">Nenhum evento nesta data.</p>`;
    return;
  }
  wrap.innerHTML = evs.map(ev => `
    <div class="event-item" style="${ev.auto ? 'border-left-color:var(--warn);' : ''}">
      <div>
        <div class="etype">${escapeHtml(ev.tipo)}</div>
        <div class="edesc">${escapeHtml(ev.descricao)}</div>
      </div>
      ${ev.auto ? '' : `<button class="small danger-btn" data-del-event="${ev.id}">Excluir</button>`}
    </div>
  `).join('');
  wrap.querySelectorAll('[data-del-event]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.events = state.events.filter(e => e.id !== btn.dataset.delEvent);
      renderCalendar(); persist();
    });
  });
}

document.getElementById('calAddEventBtn').addEventListener('click', () => {
  showEventForm = !showEventForm;
  renderEventForm();
});

function renderEventForm() {
  const wrap = document.getElementById('calEventForm');
  if (!showEventForm) { wrap.innerHTML = ''; return; }
  wrap.innerHTML = `
    <div class="event-form">
      <div class="field"><label>Data</label><input type="date" id="ef-date" value="${ymd(calSelected)}"></div>
      <div class="field"><label>Tipo</label><select id="ef-tipo">${EVENT_TIPOS.map(t => `<option>${t}</option>`).join('')}</select></div>
      <div class="field fspan2"><label>Descrição</label><input type="text" id="ef-desc" placeholder="Ex: Troca de cabos XLR do bumbo"></div>
      <div><button class="primary" id="ef-save">Salvar evento</button></div>
    </div>
  `;
  document.getElementById('ef-save').addEventListener('click', () => {
    const desc = document.getElementById('ef-desc').value.trim();
    if (!desc) { alert('Descreva o evento.'); return; }
    state.events.push({
      id: uid(),
      date: document.getElementById('ef-date').value,
      tipo: document.getElementById('ef-tipo').value,
      descricao: desc,
      equipamentoId: null,
    });
    showEventForm = false;
    renderEventForm(); renderCalendar(); persist();
  });
}

/* ================= ROTEAMENTO ================= */
function renderRouting() {
  const wrap = document.getElementById('routeList');
  const q = document.getElementById('routeSearch') ? document.getElementById('routeSearch').value.trim().toLowerCase() : '';
  const rows = state.channels.filter(ch => {
    const eq = eqById(ch.equipamentoId);
    const hay = `${ch.mesa} ${ch.medusa || ''} ${ch.instrumento} ${eq ? eq.nome : ''}`.toLowerCase();
    return !q || hay.includes(q);
  });
  wrap.innerHTML = rows.map(ch => {
    const isLocal = ch.medusa === null;
    const eq = eqById(ch.equipamentoId);
    return `<div class="route-chain">
      <span class="node ch">Canal ${String(ch.mesa).padStart(2, '0')}</span>
      <span class="arrow">→</span>
      <span class="node ${isLocal ? 'local' : ''}">${isLocal ? 'LOCAL' : 'Medusa ' + String(ch.medusa).padStart(2, '0')}</span>
      <span class="arrow">→</span>
      <span class="node">${eq ? escapeHtml(eq.nome) : '<span class="empty-eq">Sem equipamento</span>'}</span>
      <span class="arrow">→</span>
      <span class="node">${ch.instrumento ? escapeHtml(ch.instrumento) : '<span class="empty-eq">Sem nome</span>'}</span>
    </div>`;
  }).join('');
}
document.getElementById('routeSearch').addEventListener('input', renderRouting);

/* ================= INICIALIZAÇÃO ================= */
loadData();
