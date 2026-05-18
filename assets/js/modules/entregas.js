const STATUS_ENTREGA = {
  atrasado:  { label:'Atrasado',   badge:'red' },
  producao:  { label:'Em Produção', badge:'blue' },
  separando: { label:'Separando',  badge:'amber' },
  aguardando:{ label:'Aguardando', badge:'gray' },
  entregue:  { label:'Entregue',   badge:'green' },
};

function renderEntregas(el) {
  const pendentes = DB.entregas.filter(e=>e.status!=='entregue');
  const atrasados = entregasAtrasadas().length;
  el.innerHTML = `
  <div class="page-header">
    <h1>Controle de Entregas</h1>
    <p>Acompanhamento de pedidos e logística de distribuição</p>
  </div>

  <div class="kpi-grid" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr))">
    <div class="kpi-card" onclick="filtrarTabelaEntregas('')" title="Ver todos os pedidos">
      <div class="kpi-icon blue"><i class="fas fa-clipboard-list"></i></div>
      <div class="kpi-info"><div class="kpi-label">Total de Pedidos</div><div class="kpi-value">${DB.entregas.length}</div></div>
    </div>
    <div class="kpi-card" onclick="filtrarTabelaEntregasPendentes()" title="Ver pedidos pendentes">
      <div class="kpi-icon amber"><i class="fas fa-hourglass-half"></i></div>
      <div class="kpi-info"><div class="kpi-label">Pendentes</div><div class="kpi-value">${pendentes.length}</div></div>
    </div>
    <div class="kpi-card" onclick="filtrarTabelaEntregas('atrasado')" title="Ver pedidos atrasados">
      <div class="kpi-icon red"><i class="fas fa-triangle-exclamation"></i></div>
      <div class="kpi-info"><div class="kpi-label">Atrasados</div>
        <div class="kpi-value" style="color:${atrasados?'var(--danger)':'var(--secondary)'}">${atrasados}</div></div>
    </div>
    <div class="kpi-card" onclick="filtrarTabelaEntregas('entregue')" title="Ver pedidos entregues">
      <div class="kpi-icon green"><i class="fas fa-circle-check"></i></div>
      <div class="kpi-info"><div class="kpi-label">Entregues</div>
        <div class="kpi-value" style="color:var(--secondary)">${DB.entregas.filter(e=>e.status==='entregue').length}</div></div>
    </div>
  </div>

  ${atrasados ? `
  <div class="alert danger section">
    <i class="fas fa-truck"></i>
    <div><strong>${atrasados} pedido(s) atrasado(s)!</strong> Verifique o status da produção e acione a transportadora.</div>
  </div>` : ''}

  <div class="card">
    <div class="card-header">
      <div class="card-title card-title-lg">Pedidos</div>
      <button class="btn btn-primary btn-sm" onclick="abrirModalEntrega()"><i class="fas fa-plus"></i> Novo Pedido</button>
    </div>
    <div class="toolbar">
      <div class="search-wrap"><i class="fas fa-search"></i>
        <input class="search-input" id="searchEntrega" placeholder="Buscar pedido ou cliente..." oninput="filterEntregas()">
      </div>
      <select class="form-control" id="filterEntSt" onchange="filterEntregas()" style="width:160px">
        <option value="">Todos os status</option>
        <option value="atrasado">Atrasado</option>
        <option value="producao">Em Produção</option>
        <option value="separando">Separando</option>
        <option value="aguardando">Aguardando</option>
        <option value="entregue">Entregue</option>
      </select>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Pedido</th><th>Cliente</th><th>Produto</th><th>Qtd.</th>
          <th>Previsão</th><th>Transportadora</th><th>Status</th><th>Ações</th></tr>
        </thead>
        <tbody id="tbodyEntregas"></tbody>
      </table>
    </div>
  </div>

  <div class="card section">
    <div class="card-header"><div class="card-title">Pedidos por Status</div></div>
    <div class="chart-wrap-sm"><canvas id="chartEntregasStatus"></canvas></div>
  </div>`;

  filterEntregas();

  // Chart
  const labels = Object.keys(STATUS_ENTREGA).map(k=>STATUS_ENTREGA[k].label);
  const valores = Object.keys(STATUS_ENTREGA).map(k=>DB.entregas.filter(e=>e.status===k).length);
  const colors = ['#dc2626','#2563eb','#d97706','#94a3b8','#059669'];
  new Chart(document.getElementById('chartEntregasStatus'), {
    type: 'doughnut',
    data: { labels, datasets:[{ data:valores, backgroundColor:colors }] },
    options: { responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ position:'right', labels:{font:{size:11}} } } }
  });
}

function filtrarTabelaEntregas(valor) {
  const el = document.getElementById('filterEntSt');
  if (el) { el.value = valor; filterEntregas(); }
}
function filtrarTabelaEntregasPendentes() {
  // Mostra todos exceto entregue
  const el = document.getElementById('filterEntSt');
  if (el) { el.value = ''; filterEntregas(); }
  // Filtra manualmente na tabela
  const hoje = new Date();
  const itens = DB.entregas.filter(e => e.status !== 'entregue');
  renderEntregasTable(itens);
}

function filterEntregas() {
  const q = (document.getElementById('searchEntrega')?.value||'').toLowerCase();
  const st = document.getElementById('filterEntSt')?.value||'';
  let itens = DB.entregas.filter(e => {
    if (q && !e.pedido.toLowerCase().includes(q) && !e.cliente.toLowerCase().includes(q) && !e.produto.toLowerCase().includes(q)) return false;
    if (st && e.status !== st) return false;
    return true;
  });
  renderEntregasTable(itens);
}

function renderEntregasTable(itens) {
  const body = document.getElementById('tbodyEntregas');
  if (!body) return;
  if (!itens.length) { body.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--gray-400);padding:32px">Nenhum pedido encontrado</td></tr>'; return; }
  const hoje = new Date();
  body.innerHTML = itens.map(e=>{
    const info = STATUS_ENTREGA[e.status] || { label:e.status, badge:'gray' };
    const atrasado = e.status !== 'entregue' && new Date(e.dataPrevisao+'T00:00:00') < hoje;
    const days = daysUntil(e.dataPrevisao);
    let daysText = '';
    if (e.status !== 'entregue') {
      if (atrasado) daysText = `<br><span style="color:var(--danger);font-size:11px">${Math.abs(days)} dias atrasado</span>`;
      else if (days <= 3) daysText = `<br><span style="color:var(--warning);font-size:11px">em ${days} dias</span>`;
    }
    return `
    <tr>
      <td class="fw-600" style="font-size:12px">${e.pedido}</td>
      <td style="font-size:13px">${e.cliente}</td>
      <td style="font-size:12px">${e.produto}</td>
      <td>${fmtNum(e.quantidade)} un</td>
      <td style="font-size:12px;color:${atrasado?'var(--danger)':'inherit'}">${fmtDate(e.dataPrevisao)}${daysText}</td>
      <td style="font-size:12px">${e.transportadora}</td>
      <td><span class="badge ${info.badge}">${info.label}</span></td>
      <td>
        <div class="gap-8">
          <button class="btn-icon-sm edit" title="Atualizar Status" onclick="atualizarStatusEntrega(${e.id})"><i class="fas fa-arrow-right"></i></button>
          <button class="btn-icon-sm view" title="Editar" onclick="editarEntrega(${e.id})"><i class="fas fa-edit"></i></button>
          <button class="btn-icon-sm del" title="Remover" onclick="deletarEntrega(${e.id})"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function atualizarStatusEntrega(id) {
  const e = getById('entregas', id);
  const statusKeys = Object.keys(STATUS_ENTREGA);
  openModal(`Atualizar Status: ${e.pedido}`, `
    <div class="alert info"><i class="fas fa-info-circle"></i>
      Status atual: <strong>${STATUS_ENTREGA[e.status]?.label}</strong>
    </div>
    <div class="form-group"><label class="form-label">Novo Status</label>
      <select class="form-control" id="ent-st">
        ${statusKeys.map(k=>`<option value="${k}" ${e.status===k?'selected':''}>${STATUS_ENTREGA[k].label}</option>`).join('')}
      </select>
    </div>
    <div class="form-group"><label class="form-label">Observação</label>
      <input class="form-control" id="ent-obs" placeholder="Observação opcional...">
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="confirmarStatusEntrega(${id})"><i class="fas fa-check"></i> Atualizar</button>
  `);
}

function confirmarStatusEntrega(id) {
  const novoStatus = document.getElementById('ent-st').value;
  update('entregas', id, { status: novoStatus });
  toast('Status atualizado!', 'success');
  closeModal();
  updateBadges();
  renderEntregas(document.getElementById('content'));
}

function abrirModalEntrega(ent = null) {
  const isEdit = !!ent;
  openModal(isEdit?'Editar Pedido':'Novo Pedido', `
    <div class="form-row">
      <div class="form-group"><label class="form-label">Nº do Pedido *</label>
        <input class="form-control" id="ent-ped" value="${ent?.pedido||''}" placeholder="PED-2025-XXX">
      </div>
      <div class="form-group"><label class="form-label">Cliente *</label>
        <input class="form-control" id="ent-cli" value="${ent?.cliente||''}">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Produto</label>
        <input class="form-control" id="ent-prod" value="${ent?.produto||''}">
      </div>
      <div class="form-group"><label class="form-label">Quantidade (un)</label>
        <input type="number" class="form-control" id="ent-qtd" value="${ent?.quantidade||0}" min="0">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Previsão de Entrega *</label>
        <input type="date" class="form-control" id="ent-prev" value="${ent?.dataPrevisao||''}">
      </div>
      <div class="form-group"><label class="form-label">Transportadora</label>
        <input class="form-control" id="ent-transp" value="${ent?.transportadora||''}">
      </div>
    </div>
    <div class="form-group"><label class="form-label">Status</label>
      <select class="form-control" id="ent-status">
        ${Object.keys(STATUS_ENTREGA).map(k=>`<option value="${k}" ${ent?.status===k?'selected':''}>${STATUS_ENTREGA[k].label}</option>`).join('')}
      </select>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="salvarEntrega(${ent?.id||0})"><i class="fas fa-save"></i> ${isEdit?'Salvar':'Cadastrar'}</button>
  `);
}

function editarEntrega(id) { abrirModalEntrega(getById('entregas', id)); }

function salvarEntrega(id) {
  const pedido = document.getElementById('ent-ped').value.trim();
  const cliente = document.getElementById('ent-cli').value.trim();
  if (!pedido || !cliente) { toast('Pedido e cliente são obrigatórios.', 'error'); return; }
  const dados = {
    pedido, cliente,
    produto: document.getElementById('ent-prod').value,
    quantidade: parseInt(document.getElementById('ent-qtd').value)||0,
    dataPrevisao: document.getElementById('ent-prev').value,
    transportadora: document.getElementById('ent-transp').value,
    status: document.getElementById('ent-status').value
  };
  if (id) { update('entregas', id, dados); toast('Pedido atualizado!'); }
  else { create('entregas', dados); toast('Pedido cadastrado!'); }
  closeModal();
  updateBadges();
  renderEntregas(document.getElementById('content'));
}

function deletarEntrega(id) {
  const e = getById('entregas', id);
  openModal('Confirmar Exclusão', `
    <div class="alert danger"><i class="fas fa-trash"></i> Remover pedido <strong>${e.pedido}</strong> – ${e.cliente}?</div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-danger" onclick="confirmarDeleteEntrega(${id})">Remover</button>
  `);
}

function confirmarDeleteEntrega(id) {
  remove('entregas', id);
  toast('Pedido removido.', 'warning');
  closeModal();
  renderEntregas(document.getElementById('content'));
}
