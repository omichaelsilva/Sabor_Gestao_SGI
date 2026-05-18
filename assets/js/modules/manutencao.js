function renderManutencao(el) {
  el.innerHTML = `
  <div class="page-header">
    <h1>Manutenção Preditiva</h1>
    <p>Monitoramento e agendamento de manutenções preventivas e corretivas</p>
  </div>

  <div class="kpi-grid" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr))">
    <div class="kpi-card" onclick="filtrarTabelaEquip('operacional')" title="Ver equipamentos operacionais">
      <div class="kpi-icon green"><i class="fas fa-check-circle"></i></div>
      <div class="kpi-info"><div class="kpi-label">Operacionais</div>
        <div class="kpi-value" style="color:var(--secondary)" id="m-op"></div></div>
    </div>
    <div class="kpi-card" onclick="filtrarTabelaEquip('atencao')" title="Ver equipamentos em atenção">
      <div class="kpi-icon amber"><i class="fas fa-triangle-exclamation"></i></div>
      <div class="kpi-info"><div class="kpi-label">Em Atenção</div>
        <div class="kpi-value" style="color:var(--warning)" id="m-at"></div></div>
    </div>
    <div class="kpi-card" onclick="filtrarTabelaEquip('vencido')" title="Ver equipamentos com manutenção vencida">
      <div class="kpi-icon red"><i class="fas fa-circle-exclamation"></i></div>
      <div class="kpi-info"><div class="kpi-label">Manutenção Vencida</div>
        <div class="kpi-value" style="color:var(--danger)" id="m-vc"></div></div>
    </div>
    <div class="kpi-card" onclick="filtrarTabelaEquip('')" title="Ver todos os equipamentos">
      <div class="kpi-icon blue"><i class="fas fa-calendar-check"></i></div>
      <div class="kpi-info"><div class="kpi-label">Prox. 30 dias</div>
        <div class="kpi-value" id="m-pr"></div></div>
    </div>
  </div>

  <!-- IA Preditiva -->
  <div class="card section" style="border:1px solid #c4b5fd;background:linear-gradient(135deg,#faf5ff,#fff)">
    <div class="card-header">
      <div>
        <div class="card-title card-title-lg" style="display:flex;align-items:center;gap:8px">
          <span style="background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;padding:3px 9px;border-radius:6px;font-size:11px;font-weight:700;letter-spacing:.5px">IA</span>
          Previsão de Falhas por Inteligência Artificial
        </div>
        <div style="font-size:11.5px;color:var(--gray-400);margin-top:2px">
          Modelo preditivo baseado em uso, histórico de manutenção, horímetro e criticidade
        </div>
      </div>
      <button class="btn btn-sm" style="background:#ede9fe;color:#7c3aed;border:1px solid #c4b5fd" onclick="renderPrevisaoIA()">
        <i class="fas fa-rotate"></i> Reanalisar
      </button>
    </div>
    <div id="previsaoIA"></div>
  </div>

  <div class="card section">
    <div class="card-header">
      <div class="card-title card-title-lg">Equipamentos</div>
      <button class="btn btn-primary btn-sm" onclick="abrirModalEquip()"><i class="fas fa-plus"></i> Novo Equipamento</button>
    </div>
    <div class="toolbar">
      <div class="search-wrap"><i class="fas fa-search"></i><input class="search-input" id="searchEquip" placeholder="Buscar equipamento..." oninput="filterEquip()"></div>
      <select class="form-control" id="filterEquipStatus" onchange="filterEquip()" style="width:160px">
        <option value="">Todos os status</option>
        <option value="operacional">Operacional</option>
        <option value="atencao">Em Atenção</option>
        <option value="vencido">Vencido</option>
      </select>
      <select class="form-control" id="filterEquipSetor" onchange="filterEquip()" style="width:150px">
        <option value="">Todos os setores</option>
        <option>Produção</option><option>Armazenagem</option><option>Utilidades</option><option>Logística</option>
      </select>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Equipamento</th><th>Setor</th><th>Criticidade</th><th>Última Manutenção</th>
          <th>Próxima Manutenção</th><th>Dias Restantes</th><th>Status</th><th>Ações</th></tr>
        </thead>
        <tbody id="tbodyEquip"></tbody>
      </table>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-header"><div class="card-title">Status por Criticidade</div></div>
      <div class="chart-wrap"><canvas id="chartCriticidade"></canvas></div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Calendário de Manutenções (próx. 3 meses)</div></div>
      <div id="calManutencao" style="padding:4px 0"></div>
    </div>
  </div>`;

  refreshManutencaoKpis();
  renderPrevisaoIA();
  filterEquip();

  // Chart criticidade
  const crit = { critico:0, importante:0 };
  const status = { operacional:0, atencao:0, vencido:0 };
  DB.equipamentos.forEach(e => {
    crit[e.criticidade] = (crit[e.criticidade]||0)+1;
    status[e.status] = (status[e.status]||0)+1;
  });
  new Chart(document.getElementById('chartCriticidade'), {
    type: 'bar',
    data: {
      labels: ['Crítico','Importante'],
      datasets: [
        { label:'Operacional', data:[
          DB.equipamentos.filter(e=>e.criticidade==='critico'&&e.status==='operacional').length,
          DB.equipamentos.filter(e=>e.criticidade==='importante'&&e.status==='operacional').length
        ], backgroundColor:'#059669', borderRadius:4 },
        { label:'Em Atenção', data:[
          DB.equipamentos.filter(e=>e.criticidade==='critico'&&e.status==='atencao').length,
          DB.equipamentos.filter(e=>e.criticidade==='importante'&&e.status==='atencao').length
        ], backgroundColor:'#d97706', borderRadius:4 },
        { label:'Vencido', data:[
          DB.equipamentos.filter(e=>e.criticidade==='critico'&&e.status==='vencido').length,
          DB.equipamentos.filter(e=>e.criticidade==='importante'&&e.status==='vencido').length
        ], backgroundColor:'#dc2626', borderRadius:4 },
      ]
    },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ labels:{ font:{size:11} } } },
      scales:{ x:{ stacked:true, ticks:{font:{size:11}} }, y:{ stacked:true, beginAtZero:true, ticks:{stepSize:1,font:{size:11}} } } }
  });

  // Calendário
  renderCalendarioManutencao();
}

function refreshManutencaoKpis() {
  const eq = DB.equipamentos;
  const hoje = new Date(); const lim30 = new Date(); lim30.setDate(hoje.getDate()+30);
  document.getElementById('m-op').textContent = eq.filter(e=>e.status==='operacional').length;
  document.getElementById('m-at').textContent = eq.filter(e=>e.status==='atencao').length;
  document.getElementById('m-vc').textContent = eq.filter(e=>e.status==='vencido').length;
  document.getElementById('m-pr').textContent = eq.filter(e => {
    const d = new Date(e.proximaManutencao+'T00:00:00');
    return d >= hoje && d <= lim30;
  }).length;
}

function filtrarTabelaEquip(valor) {
  const el = document.getElementById('filterEquipStatus');
  if (el) { el.value = valor; filterEquip(); }
  document.querySelector('.card.section .toolbar')?.scrollIntoView({ behavior:'smooth', block:'start' });
}

function filterEquip() {
  const q = (document.getElementById('searchEquip')?.value||'').toLowerCase();
  const st = document.getElementById('filterEquipStatus')?.value||'';
  const se = document.getElementById('filterEquipSetor')?.value||'';
  let itens = DB.equipamentos.filter(e => {
    if (q && !e.nome.toLowerCase().includes(q)) return false;
    if (st && e.status !== st) return false;
    if (se && e.setor !== se) return false;
    return true;
  });
  renderEquipTable(itens);
}

function renderEquipTable(itens) {
  const body = document.getElementById('tbodyEquip');
  if (!body) return;
  if (!itens.length) { body.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--gray-400);padding:32px">Nenhum equipamento encontrado</td></tr>'; return; }
  body.innerHTML = itens.map(e => {
    const days = daysUntil(e.proximaManutencao);
    let daysColor = 'var(--secondary)', daysText = `${days} dias`;
    if (e.status === 'vencido' || days < 0) { daysColor='var(--danger)'; daysText=`${Math.abs(days)} dias vencido`; }
    else if (days <= 15) { daysColor='var(--danger)'; }
    else if (days <= 30) { daysColor='var(--warning)'; }
    const statusBadge = e.status==='operacional'?'<span class="badge green">Operacional</span>':
      e.status==='atencao'?'<span class="badge amber">Atenção</span>':
      '<span class="badge red">Vencido</span>';
    const critBadge = e.criticidade==='critico'?'<span class="badge red">Crítico</span>':'<span class="badge amber">Importante</span>';
    return `
    <tr>
      <td class="fw-600">${e.nome}<br><span style="font-size:11px;color:var(--gray-400)">${e.fabricante} – ${e.modelo}</span></td>
      <td><span class="badge gray">${e.setor}</span></td>
      <td>${critBadge}</td>
      <td style="font-size:12px">${fmtDate(e.ultimaManutencao)}</td>
      <td style="font-size:12px">${fmtDate(e.proximaManutencao)}</td>
      <td style="color:${daysColor};font-weight:600;font-size:12px">${daysText}</td>
      <td>${statusBadge}</td>
      <td>
        <div class="gap-8">
          <button class="btn-icon-sm edit" title="Registrar Manutenção" onclick="registrarManutencao(${e.id})"><i class="fas fa-wrench"></i></button>
          <button class="btn-icon-sm view" title="Editar" onclick="editarEquip(${e.id})"><i class="fas fa-edit"></i></button>
          <button class="btn-icon-sm del" title="Remover" onclick="deletarEquip(${e.id})"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function renderCalendarioManutencao() {
  const el = document.getElementById('calManutencao');
  if (!el) return;
  const hoje = new Date();
  const lim90 = new Date(); lim90.setDate(hoje.getDate()+90);
  const proximos = DB.equipamentos
    .filter(e => { const d = new Date(e.proximaManutencao+'T00:00:00'); return d >= hoje && d <= lim90; })
    .sort((a,b) => new Date(a.proximaManutencao) - new Date(b.proximaManutencao));
  if (!proximos.length) { el.innerHTML = '<div class="empty-state"><i class="fas fa-calendar-check"></i><p>Nenhuma manutenção nos próximos 90 dias</p></div>'; return; }
  el.innerHTML = proximos.map(e => {
    const days = daysUntil(e.proximaManutencao);
    const color = days <= 15 ? 'red' : days <= 30 ? 'amber' : 'green';
    return `
    <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--gray-100)">
      <div style="width:48px;text-align:center;flex-shrink:0">
        <div style="font-size:18px;font-weight:700;color:var(--${color==='red'?'danger':color==='amber'?'warning':'secondary'})">${days}</div>
        <div style="font-size:10px;color:var(--gray-400)">dias</div>
      </div>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:600">${e.nome}</div>
        <div style="font-size:11px;color:var(--gray-400)">${fmtDate(e.proximaManutencao)} – ${e.setor}</div>
      </div>
      <span class="badge ${color}">${e.criticidade}</span>
    </div>`;
  }).join('');
}

function registrarManutencao(id) {
  const e = getById('equipamentos', id);
  openModal(`Registrar Manutenção: ${e.nome}`, `
    <div class="form-row">
      <div class="form-group"><label class="form-label">Data de Realização *</label>
        <input type="date" class="form-control" id="rm-data" value="${todayISO()}">
      </div>
      <div class="form-group"><label class="form-label">Tipo</label>
        <select class="form-control" id="rm-tipo">
          <option>Preventiva</option><option>Corretiva</option><option>Preditiva</option><option>Inspeção</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Próxima Manutenção *</label>
        <input type="date" class="form-control" id="rm-proxima" value="${e.proximaManutencao}">
      </div>
      <div class="form-group"><label class="form-label">Novo Status</label>
        <select class="form-control" id="rm-status">
          <option value="operacional">Operacional</option>
          <option value="atencao">Em Atenção</option>
        </select>
      </div>
    </div>
    <div class="form-group"><label class="form-label">Descrição do Serviço</label>
      <textarea class="form-control" id="rm-desc" rows="3" placeholder="Descreva o serviço realizado..."></textarea>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-success" onclick="confirmarManutencao(${id})"><i class="fas fa-check"></i> Registrar</button>
  `);
}

function confirmarManutencao(id) {
  const data = document.getElementById('rm-data').value;
  const proxima = document.getElementById('rm-proxima').value;
  if (!data || !proxima) { toast('Preencha as datas obrigatórias.', 'error'); return; }
  update('equipamentos', id, {
    ultimaManutencao: data,
    proximaManutencao: proxima,
    status: document.getElementById('rm-status').value
  });
  toast('Manutenção registrada com sucesso!', 'success');
  closeModal();
  renderManutencao(document.getElementById('content'));
}

function abrirModalEquip(equip = null) {
  const isEdit = !!equip;
  openModal(isEdit ? 'Editar Equipamento' : 'Novo Equipamento', `
    <div class="form-row">
      <div class="form-group"><label class="form-label">Nome *</label>
        <input class="form-control" id="eq-nome" value="${equip?.nome||''}" placeholder="Ex: Misturador Industrial #2">
      </div>
      <div class="form-group"><label class="form-label">Setor</label>
        <select class="form-control" id="eq-setor">
          ${['Produção','Armazenagem','Utilidades','Logística'].map(s=>`<option ${equip?.setor===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Fabricante</label>
        <input class="form-control" id="eq-fab" value="${equip?.fabricante||''}">
      </div>
      <div class="form-group"><label class="form-label">Modelo</label>
        <input class="form-control" id="eq-mod" value="${equip?.modelo||''}">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Última Manutenção</label>
        <input type="date" class="form-control" id="eq-ult" value="${equip?.ultimaManutencao||todayISO()}">
      </div>
      <div class="form-group"><label class="form-label">Próxima Manutenção *</label>
        <input type="date" class="form-control" id="eq-prox" value="${equip?.proximaManutencao||''}">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Criticidade</label>
        <select class="form-control" id="eq-crit">
          <option value="critico" ${equip?.criticidade==='critico'?'selected':''}>Crítico</option>
          <option value="importante" ${equip?.criticidade==='importante'?'selected':''}>Importante</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Status</label>
        <select class="form-control" id="eq-st">
          <option value="operacional" ${equip?.status==='operacional'?'selected':''}>Operacional</option>
          <option value="atencao" ${equip?.status==='atencao'?'selected':''}>Em Atenção</option>
          <option value="vencido" ${equip?.status==='vencido'?'selected':''}>Vencido</option>
        </select>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="salvarEquip(${equip?.id||0})"><i class="fas fa-save"></i> ${isEdit?'Salvar':'Cadastrar'}</button>
  `);
}

function editarEquip(id) { abrirModalEquip(getById('equipamentos', id)); }

function salvarEquip(id) {
  const nome = document.getElementById('eq-nome').value.trim();
  if (!nome) { toast('Nome é obrigatório.', 'error'); return; }
  const dados = {
    nome, setor: document.getElementById('eq-setor').value,
    fabricante: document.getElementById('eq-fab').value,
    modelo: document.getElementById('eq-mod').value,
    ultimaManutencao: document.getElementById('eq-ult').value,
    proximaManutencao: document.getElementById('eq-prox').value,
    criticidade: document.getElementById('eq-crit').value,
    status: document.getElementById('eq-st').value,
    horometro: 0
  };
  if (id) { update('equipamentos', id, dados); toast('Equipamento atualizado!'); }
  else { create('equipamentos', dados); toast('Equipamento cadastrado!'); }
  closeModal();
  renderManutencao(document.getElementById('content'));
}

function deletarEquip(id) {
  const e = getById('equipamentos', id);
  openModal('Confirmar Exclusão', `
    <div class="alert danger"><i class="fas fa-trash"></i> Remover <strong>${e.nome}</strong>? Esta ação não pode ser desfeita.</div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-danger" onclick="confirmarDeleteEquip(${id})">Remover</button>
  `);
}

// ===== IA PREDITIVA =====
function calcularRiscoFalha(equip) {
  const hoje = new Date();
  const ultima  = new Date(equip.ultimaManutencao + 'T00:00:00');
  const proxima = new Date(equip.proximaManutencao + 'T00:00:00');

  const intervalo  = Math.max(1, (proxima - ultima) / 86400000);
  const decorrido  = (hoje - ultima) / 86400000;
  const utilizacao = decorrido / intervalo;   // > 1 = vencido

  // Componentes do risco
  const riscoTempo  = Math.min(55, utilizacao * 40);
  const riscoHoras  = equip.horometro > 18000 ? 20 : equip.horometro > 9000 ? 10 : 3;
  const riscoStatus = equip.status === 'vencido' ? 30 : equip.status === 'atencao' ? 15 : 0;

  let risco = riscoTempo + riscoHoras + riscoStatus;
  if (equip.criticidade === 'critico') risco = Math.min(99, risco * 1.2);
  risco = Math.min(99, Math.max(2, Math.round(risco)));

  // Janela estimada de falha
  let janela;
  if (risco >= 75)      janela = 'Iminente (1–7 dias)';
  else if (risco >= 50) janela = `~${Math.round((100 - risco) * 0.6)} dias`;
  else if (risco >= 25) janela = `~${Math.round((100 - risco) * 1.5)} dias`;
  else                  janela = 'Sem previsão de falha';

  // Recomendação
  let rec, recColor;
  if (risco >= 75)      { rec = 'Parar operação e acionar manutenção corretiva imediata.';  recColor = 'var(--danger)'; }
  else if (risco >= 50) { rec = 'Agendar manutenção preventiva com urgência esta semana.';  recColor = '#ea580c'; }
  else if (risco >= 25) { rec = 'Monitorar diariamente. Agendar manutenção preventiva.';    recColor = 'var(--warning)'; }
  else                  { rec = 'Equipamento operando dentro dos parâmetros normais.';       recColor = 'var(--secondary)'; }

  const barColor = risco >= 75 ? '#dc2626' : risco >= 50 ? '#ea580c' : risco >= 25 ? '#d97706' : '#059669';

  return { risco, janela, rec, recColor, barColor,
           nivel: risco >= 75 ? 'Crítico' : risco >= 50 ? 'Alto' : risco >= 25 ? 'Médio' : 'Baixo' };
}

function renderPrevisaoIA() {
  const el = document.getElementById('previsaoIA');
  if (!el) return;

  const analises = DB.equipamentos
    .map(e => ({ ...e, ia: calcularRiscoFalha(e) }))
    .sort((a, b) => b.ia.risco - a.ia.risco);

  const criticos  = analises.filter(e => e.ia.risco >= 75).length;
  const altos     = analises.filter(e => e.ia.risco >= 50 && e.ia.risco < 75).length;
  const medios    = analises.filter(e => e.ia.risco >= 25 && e.ia.risco < 50).length;
  const baixos    = analises.filter(e => e.ia.risco < 25).length;

  el.innerHTML = `
  <!-- Resumo IA -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px">
    ${[
      { label:'Risco Crítico', val:criticos, bg:'#fee2e2', cor:'#dc2626', icon:'fa-circle-exclamation' },
      { label:'Risco Alto',    val:altos,    bg:'#ffedd5', cor:'#ea580c', icon:'fa-triangle-exclamation' },
      { label:'Risco Médio',   val:medios,   bg:'#fef3c7', cor:'#d97706', icon:'fa-circle-info' },
      { label:'Risco Baixo',   val:baixos,   bg:'#d1fae5', cor:'#059669', icon:'fa-circle-check' },
    ].map(r => `
    <div style="background:${r.bg};border-radius:8px;padding:12px;text-align:center">
      <i class="fas ${r.icon}" style="color:${r.cor};font-size:20px;margin-bottom:4px;display:block"></i>
      <div style="font-size:20px;font-weight:800;color:${r.cor}">${r.val}</div>
      <div style="font-size:11px;color:${r.cor};font-weight:600">${r.label}</div>
    </div>`).join('')}
  </div>

  <!-- Lista por risco -->
  <div style="display:flex;flex-direction:column;gap:10px">
    ${analises.map(e => `
    <div style="
      display:flex;align-items:center;gap:14px;
      padding:14px 16px;border-radius:10px;
      border:1px solid ${e.ia.risco>=75?'#fca5a5':e.ia.risco>=50?'#fed7aa':e.ia.risco>=25?'#fde68a':'#6ee7b7'};
      background:${e.ia.risco>=75?'#fff5f5':e.ia.risco>=50?'#fff7ed':e.ia.risco>=25?'#fffbeb':'#f0fdf4'}">

      <!-- Gauge circular (CSS) -->
      <div style="position:relative;width:52px;height:52px;flex-shrink:0">
        <svg width="52" height="52" viewBox="0 0 52 52" style="transform:rotate(-90deg)">
          <circle cx="26" cy="26" r="22" fill="none" stroke="#e5e7eb" stroke-width="5"/>
          <circle cx="26" cy="26" r="22" fill="none" stroke="${e.ia.barColor}" stroke-width="5"
            stroke-dasharray="${Math.round(2*Math.PI*22*e.ia.risco/100)} 200"
            stroke-linecap="round"/>
        </svg>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
          font-size:11px;font-weight:800;color:${e.ia.barColor}">${e.ia.risco}%</div>
      </div>

      <!-- Info -->
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
          <span style="font-weight:700;font-size:13.5px">${e.nome}</span>
          <span class="badge ${e.ia.nivel==='Crítico'?'red':e.ia.nivel==='Alto'?'amber':e.ia.nivel==='Médio'?'amber':'green'}"
            style="${e.ia.nivel==='Alto'?'background:#ffedd5;color:#ea580c':''}">${e.ia.nivel}</span>
          ${e.criticidade==='critico'?'<span class="badge red" style="font-size:10px">CRÍTICO</span>':''}
        </div>
        <div style="font-size:12px;color:var(--gray-500);margin-bottom:5px">
          ${e.setor} &bull; ${e.fabricante} ${e.modelo}
        </div>
        <div style="font-size:12px;color:${e.ia.recColor};font-weight:500">
          <i class="fas fa-robot" style="margin-right:4px"></i>${e.ia.rec}
        </div>
      </div>

      <!-- Janela estimada -->
      <div style="text-align:right;flex-shrink:0;min-width:110px">
        <div style="font-size:10px;color:var(--gray-400);margin-bottom:2px">Janela de falha</div>
        <div style="font-size:12px;font-weight:700;color:${e.ia.barColor}">${e.ia.janela}</div>
        <div style="font-size:10px;color:var(--gray-400);margin-top:4px">
          Prox. manutenção<br>${fmtDate(e.proximaManutencao)}
        </div>
      </div>
    </div>`).join('')}
  </div>`;
}

function confirmarDeleteEquip(id) {
  remove('equipamentos', id);
  toast('Equipamento removido.', 'warning');
  closeModal();
  renderManutencao(document.getElementById('content'));
}
