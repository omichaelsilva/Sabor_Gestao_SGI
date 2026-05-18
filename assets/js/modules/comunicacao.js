function renderComunicacao(el) {
  const naoLidas = mensagensNaoLidas().length;
  el.innerHTML = `
  <div class="page-header">
    <h1>Comunicação Interna</h1>
    <p>Canal de mensagens entre setores da NovaEra Alimentos</p>
  </div>

  <div class="kpi-grid" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr))">
    <div class="kpi-card" onclick="filtrarMensagens('')" title="Ver todas as mensagens">
      <div class="kpi-icon blue"><i class="fas fa-envelope"></i></div>
      <div class="kpi-info"><div class="kpi-label">Total de Mensagens</div><div class="kpi-value">${DB.mensagens.length}</div></div>
    </div>
    <div class="kpi-card" onclick="filtrarMensagens('0')" title="Ver mensagens não lidas">
      <div class="kpi-icon red"><i class="fas fa-envelope-open"></i></div>
      <div class="kpi-info"><div class="kpi-label">Não Lidas</div>
        <div class="kpi-value" style="color:${naoLidas?'var(--danger)':'var(--secondary)'}">${naoLidas}</div></div>
    </div>
    <div class="kpi-card" onclick="filtrarMensagensPrioridade('alta')" title="Ver mensagens de alta prioridade">
      <div class="kpi-icon amber"><i class="fas fa-fire"></i></div>
      <div class="kpi-info"><div class="kpi-label">Alta Prioridade</div>
        <div class="kpi-value">${DB.mensagens.filter(m=>m.prioridade==='alta').length}</div></div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="card-title card-title-lg">Caixa de Mensagens</div>
      <button class="btn btn-primary btn-sm" onclick="abrirModalMensagem()"><i class="fas fa-pen"></i> Nova Mensagem</button>
    </div>
    <div class="toolbar">
      <div class="search-wrap"><i class="fas fa-search"></i>
        <input class="search-input" id="searchMsg" placeholder="Buscar assunto..." oninput="filterMensagens()">
      </div>
      <select class="form-control" id="filterMsgPrior" onchange="filterMensagens()" style="width:150px">
        <option value="">Todas as prioridades</option>
        <option value="alta">Alta</option><option value="media">Média</option><option value="baixa">Baixa</option>
      </select>
      <select class="form-control" id="filterMsgLida" onchange="filterMensagens()" style="width:130px">
        <option value="">Todas</option><option value="0">Não lidas</option><option value="1">Lidas</option>
      </select>
    </div>
    <div id="listaMensagens"></div>
  </div>`;

  renderListaMensagens(DB.mensagens);
}

function filtrarMensagens(lida) {
  const el = document.getElementById('filterMsgLida');
  if (el) { el.value = lida; filterMensagens(); }
}
function filtrarMensagensPrioridade(prior) {
  const el = document.getElementById('filterMsgPrior');
  if (el) { el.value = prior; filterMensagens(); }
}

function filterMensagens() {
  const q = document.getElementById('searchMsg').value.toLowerCase();
  const prior = document.getElementById('filterMsgPrior').value;
  const lida = document.getElementById('filterMsgLida').value;
  let itens = DB.mensagens.filter(m => {
    if (q && !m.assunto.toLowerCase().includes(q) && !m.mensagem.toLowerCase().includes(q)) return false;
    if (prior && m.prioridade !== prior) return false;
    if (lida === '0' && m.lida) return false;
    if (lida === '1' && !m.lida) return false;
    return true;
  });
  renderListaMensagens(itens);
}

function renderListaMensagens(itens) {
  const el = document.getElementById('listaMensagens');
  if (!el) return;
  if (!itens.length) { el.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>Nenhuma mensagem encontrada</p></div>'; return; }
  const sorted = [...itens].sort((a,b) => new Date(b.data)-new Date(a.data));
  el.innerHTML = sorted.map(m=>`
  <div class="msg-item${!m.lida?' nova':''}" style="
    padding:14px 16px; border-bottom:1px solid var(--gray-200);
    cursor:pointer; display:flex; gap:12px; align-items:flex-start;"
    onclick="abrirMensagem(${m.id})"
  >
    <div style="margin-top:2px"><span class="dot ${m.prioridade==='alta'?'red':m.prioridade==='media'?'amber':'green'}"></span></div>
    <div style="flex:1;min-width:0">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:13px;font-weight:${!m.lida?'700':'500'}">${m.assunto}</span>
        <span style="font-size:11px;color:var(--gray-400);flex-shrink:0">${fmtDate(m.data)}</span>
      </div>
      <div style="font-size:11.5px;color:var(--gray-500);margin-top:2px">
        <strong>${m.de}</strong> → ${m.para}
      </div>
      <div style="font-size:12px;color:var(--gray-500);margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
        ${m.mensagem}
      </div>
    </div>
    <div style="flex-shrink:0">
      ${!m.lida?'<span class="badge blue">Nova</span>':''}
    </div>
  </div>`).join('');
}

function abrirMensagem(id) {
  const m = getById('mensagens', id);
  if (!m.lida) { update('mensagens', id, { lida: true }); updateBadges(); }
  openModal(m.assunto, `
    <div style="margin-bottom:14px">
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">
        <span class="badge gray"><i class="fas fa-paper-plane"></i> De: ${m.de}</span>
        <span class="badge blue"><i class="fas fa-inbox"></i> Para: ${m.para}</span>
        <span class="badge ${m.prioridade==='alta'?'red':m.prioridade==='media'?'amber':'green'}">
          Prioridade ${m.prioridade}
        </span>
        <span class="badge gray"><i class="fas fa-calendar"></i> ${fmtDate(m.data)}</span>
      </div>
    </div>
    <div style="background:var(--gray-50);border-radius:8px;padding:16px;font-size:13.5px;line-height:1.7;border:1px solid var(--gray-200)">
      ${m.mensagem}
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Fechar</button>
    <button class="btn btn-primary" onclick="responderMensagem(${id})"><i class="fas fa-reply"></i> Responder</button>
  `);
  if (currentModule === 'comunicacao') renderComunicacao(document.getElementById('content'));
}

function responderMensagem(id) {
  const m = getById('mensagens', id);
  closeModal();
  setTimeout(() => {
    abrirModalMensagem({ para: m.de, assunto: `Re: ${m.assunto}` });
  }, 200);
}

function abrirModalMensagem(defaults = {}) {
  const setores = ['Produção','Logística','Manutenção','Qualidade','RH','Administrativo','Diretoria','Todos'];
  openModal('Nova Mensagem', `
    <div class="form-row">
      <div class="form-group"><label class="form-label">De (Setor)</label>
        <select class="form-control" id="msg-de">
          ${setores.filter(s=>s!=='Todos').map(s=>`<option>${s}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Para</label>
        <select class="form-control" id="msg-para">
          ${setores.map(s=>`<option ${defaults.para===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Assunto *</label>
        <input class="form-control" id="msg-assunto" value="${defaults.assunto||''}" placeholder="Assunto da mensagem">
      </div>
      <div class="form-group"><label class="form-label">Prioridade</label>
        <select class="form-control" id="msg-prior">
          <option value="baixa">Baixa</option><option value="media">Média</option><option value="alta">Alta</option>
        </select>
      </div>
    </div>
    <div class="form-group"><label class="form-label">Mensagem *</label>
      <textarea class="form-control" id="msg-texto" rows="4" placeholder="Digite sua mensagem..."></textarea>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="enviarMensagem()"><i class="fas fa-paper-plane"></i> Enviar</button>
  `);
}

function enviarMensagem() {
  const assunto = document.getElementById('msg-assunto').value.trim();
  const texto = document.getElementById('msg-texto').value.trim();
  if (!assunto || !texto) { toast('Assunto e mensagem são obrigatórios.', 'error'); return; }
  create('mensagens', {
    de: document.getElementById('msg-de').value,
    para: document.getElementById('msg-para').value,
    assunto, mensagem: texto,
    data: todayISO(), lida: false,
    prioridade: document.getElementById('msg-prior').value
  });
  toast('Mensagem enviada!', 'success');
  closeModal();
  updateBadges();
  if (currentModule === 'comunicacao') renderComunicacao(document.getElementById('content'));
}
