function renderEstoque(el) {
  el.innerHTML = `
  <div class="page-header">
    <h1>Controle de Estoque</h1>
    <p>Gestão de matérias-primas, embalagens e insumos</p>
  </div>
  <div class="kpi-grid" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr))">
    <div class="kpi-card" onclick="filtrarTabelaEstoque('')" title="Ver todos os itens">
      <div class="kpi-icon blue"><i class="fas fa-layer-group"></i></div>
      <div class="kpi-info"><div class="kpi-label">Total de Itens</div><div class="kpi-value" id="kpi-total"></div></div>
    </div>
    <div class="kpi-card" onclick="filtrarTabelaEstoque('min')" title="Ver itens abaixo do mínimo">
      <div class="kpi-icon red"><i class="fas fa-arrow-down"></i></div>
      <div class="kpi-info"><div class="kpi-label">Abaixo do Mínimo</div><div class="kpi-value" id="kpi-min" style="color:var(--danger)"></div></div>
    </div>
    <div class="kpi-card" onclick="filtrarTabelaEstoque('venc')" title="Ver itens a vencer em 30 dias">
      <div class="kpi-icon amber"><i class="fas fa-calendar-xmark"></i></div>
      <div class="kpi-info"><div class="kpi-label">Vencendo (30 dias)</div><div class="kpi-value" id="kpi-venc" style="color:var(--warning)"></div></div>
    </div>
    <div class="kpi-card" onclick="filtrarTabelaEstoque('')" title="Ver todos os itens">
      <div class="kpi-icon green"><i class="fas fa-dollar-sign"></i></div>
      <div class="kpi-info"><div class="kpi-label">Valor Total</div>
        <div class="kpi-value" id="kpi-valor" style="font-size:12px;line-height:1.3;word-break:break-word"></div>
      </div>
    </div>
  </div>

  <!-- Alertas Inteligentes -->
  <div id="alertasInteligentes" class="section"></div>

  <div class="card" id="cardTabelaEstoque">
    <div class="card-header">
      <div class="card-title card-title-lg">Itens em Estoque</div>
      <button class="btn btn-primary btn-sm" onclick="abrirModalEstoque()"><i class="fas fa-plus"></i> Novo Item</button>
    </div>
    <div class="toolbar">
      <div class="search-wrap"><i class="fas fa-search"></i><input class="search-input" id="searchEstoque" placeholder="Buscar item..." oninput="filterEstoque()"></div>
      <select class="form-control" id="filterCat" onchange="filterEstoque()" style="width:160px">
        <option value="">Todas as categorias</option>
        <option>Matéria-Prima</option><option>Embalagem</option><option>Aditivo</option><option>EPI/Consumível</option>
      </select>
      <select class="form-control" id="filterStatus" onchange="filterEstoque()" style="width:150px">
        <option value="">Todos os status</option>
        <option value="ok">Normal</option>
        <option value="min">Abaixo do mínimo</option>
        <option value="venc">A vencer</option>
      </select>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Item</th><th>Categoria</th><th>Qtd.</th><th>Mín.</th><th>Localização</th>
            <th>Validade</th><th>Custo Unit.</th><th>Status</th><th>Ações</th>
          </tr>
        </thead>
        <tbody id="tbodyEstoque"></tbody>
      </table>
    </div>
  </div>`;

  refreshEstoqueKpis();
  renderAlertasInteligentes();
  renderEstoqueTable(DB.estoque);
}

function refreshEstoqueKpis() {
  const itens = DB.estoque;
  const hoje = new Date(); const lim30 = new Date(); lim30.setDate(hoje.getDate()+30);
  document.getElementById('kpi-total').textContent = itens.length;
  document.getElementById('kpi-min').textContent = estoqueAbaixoMinimo().length;
  const venc = itens.filter(i => i.validade && new Date(i.validade+'T00:00:00') <= lim30 && new Date(i.validade+'T00:00:00') >= hoje).length;
  document.getElementById('kpi-venc').textContent = venc;
  const val = itens.reduce((s,i) => s + i.quantidade * i.custo, 0);
  document.getElementById('kpi-valor').textContent = fmtCurrency(val);
}

function renderEstoqueTable(itens) {
  const hoje = new Date(); const lim30 = new Date(); lim30.setDate(hoje.getDate()+30);
  const body = document.getElementById('tbodyEstoque');
  if (!body) return;
  if (!itens.length) { body.innerHTML = '<tr><td colspan="9" style="text-align:center;color:var(--gray-400);padding:32px">Nenhum item encontrado</td></tr>'; return; }
  body.innerHTML = itens.map(i => {
    const pct = Math.round((i.quantidade / i.maximo) * 100);
    const baixo = i.quantidade < i.minimo;
    const vencendo = i.validade && new Date(i.validade+'T00:00:00') <= lim30 && new Date(i.validade+'T00:00:00') >= hoje;
    const vencido = i.validade && new Date(i.validade+'T00:00:00') < hoje;
    let statusBadge = '<span class="badge green">Normal</span>';
    if (vencido) statusBadge = '<span class="badge red">Vencido</span>';
    else if (vencendo) statusBadge = '<span class="badge amber">A vencer</span>';
    else if (baixo) statusBadge = '<span class="badge red">Abaixo mín.</span>';
    return `
    <tr>
      <td class="fw-600">${i.nome}</td>
      <td><span class="badge gray">${i.categoria}</span></td>
      <td>
        <div style="min-width:90px">
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
            <span class="${baixo?'text-danger fw-600':''}">${fmtNum(i.quantidade)} ${i.unidade}</span>
          </div>
          <div class="progress-bar-wrap"><div class="progress-bar ${baixo?'red':pct>80?'green':'amber'}" style="width:${Math.min(pct,100)}%"></div></div>
        </div>
      </td>
      <td style="color:var(--gray-500)">${fmtNum(i.minimo)} ${i.unidade}</td>
      <td style="font-size:12px">${i.localizacao}</td>
      <td style="font-size:12px;color:${vencido?'var(--danger)':vencendo?'var(--warning)':'inherit'}">${fmtDate(i.validade)}</td>
      <td>${fmtCurrency(i.custo)}</td>
      <td>${statusBadge}</td>
      <td>
        <div class="gap-8">
          <button class="btn-icon-sm edit" title="Editar" onclick="editarEstoque(${i.id})"><i class="fas fa-edit"></i></button>
          <button class="btn-icon-sm view" title="Movimentar" onclick="movimentarEstoque(${i.id})"><i class="fas fa-exchange-alt"></i></button>
          <button class="btn-icon-sm del" title="Remover" onclick="deletarEstoque(${i.id})"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

// ===== ALERTAS INTELIGENTES =====
function calcularAlertasInteligentes() {
  const hoje = new Date();
  const lim30 = new Date(); lim30.setDate(hoje.getDate() + 30);

  return DB.estoque
    .filter(i => i.quantidade < i.minimo || (i.validade && new Date(i.validade + 'T00:00:00') <= lim30))
    .map(i => {
      const baixo    = i.quantidade < i.minimo;
      const deficit  = Math.max(0, i.minimo - i.quantidade);
      const urgRatio = i.quantidade === 0 ? 1 : deficit / i.minimo;

      // Estima dias até zerar com base na proporção qtd/mínimo
      const diasFim  = i.quantidade === 0 ? 0 : Math.round((i.quantidade / i.minimo) * 22);

      // Sugestão de pedido para atingir o máximo
      const pedido   = i.maximo - i.quantidade;

      // Vencimento
      const vencDays = i.validade ? daysUntil(i.validade) : null;
      const vencendo = vencDays !== null && vencDays <= 30 && vencDays >= 0;
      const vencido  = vencDays !== null && vencDays < 0;

      // Prioridade
      let prioridade, priorCor, priorBg;
      if (i.quantidade === 0 || vencido)         { prioridade = 'Emergência'; priorCor = '#dc2626'; priorBg = '#fee2e2'; }
      else if (urgRatio > 0.6 || vencDays <= 7)  { prioridade = 'Urgente';    priorCor = '#ea580c'; priorBg = '#ffedd5'; }
      else if (urgRatio > 0.3 || vencDays <= 20) { prioridade = 'Atenção';    priorCor = '#d97706'; priorBg = '#fef3c7'; }
      else                                        { prioridade = 'Monitorar';  priorCor = '#2563eb'; priorBg = '#dbeafe'; }

      return { ...i, deficit, urgRatio, diasFim, pedido, vencDays, vencendo, vencido, prioridade, priorCor, priorBg };
    })
    .sort((a, b) => b.urgRatio - a.urgRatio);
}

function renderAlertasInteligentes() {
  const el = document.getElementById('alertasInteligentes');
  if (!el) return;

  const alertas = calcularAlertasInteligentes();
  if (!alertas.length) {
    el.innerHTML = `
    <div class="card" style="border:1px solid #6ee7b7;background:#f0fdf4">
      <div style="display:flex;align-items:center;gap:10px;padding:4px 0">
        <i class="fas fa-circle-check" style="color:var(--secondary);font-size:20px;flex-shrink:0"></i>
        <div>
          <div style="font-weight:600;color:var(--secondary)">Estoque saudável</div>
          <div style="font-size:12px;color:#065f46">Todos os itens estão acima do nível mínimo e com validades dentro do prazo.</div>
        </div>
      </div>
    </div>`;
    return;
  }

  el.innerHTML = `
  <div class="card" style="border:1px solid #fca5a5">
    <div class="card-header" style="margin-bottom:14px">
      <div>
        <div class="card-title card-title-lg" style="display:flex;align-items:center;gap:8px">
          <span style="background:linear-gradient(135deg,#ea580c,#dc2626);color:#fff;padding:3px 9px;border-radius:6px;font-size:11px;font-weight:700">IA</span>
          Alertas Inteligentes de Estoque
        </div>
        <div style="font-size:11.5px;color:var(--gray-400);margin-top:2px">
          ${alertas.length} item(ns) requerem ação — ordenados por urgência
        </div>
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:10px">
      ${alertas.map(i => `
      <div style="
        display:grid;grid-template-columns:auto 1fr auto auto;align-items:center;gap:14px;
        padding:13px 15px;border-radius:9px;
        background:${i.priorBg};border:1px solid ${i.priorCor}33">

        <!-- Prioridade -->
        <div style="text-align:center;min-width:80px">
          <div style="font-size:11px;font-weight:700;color:${i.priorCor};
            background:${i.priorCor}22;border:1px solid ${i.priorCor}55;
            border-radius:20px;padding:3px 8px">${i.prioridade}</div>
        </div>

        <!-- Item info -->
        <div>
          <div style="font-weight:700;font-size:13.5px">${i.nome}</div>
          <div style="font-size:11.5px;color:var(--gray-500);margin-top:2px">
            ${i.categoria} &bull; ${i.localizacao}
          </div>
          <div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:6px">
            ${i.quantidade < i.minimo ? `
            <span style="font-size:11.5px;color:${i.priorCor};font-weight:600">
              <i class="fas fa-arrow-down"></i>
              Estoque: ${fmtNum(i.quantidade)} ${i.unidade} (mín: ${fmtNum(i.minimo)})
            </span>` : ''}
            ${i.vencido ? `
            <span style="font-size:11.5px;color:#dc2626;font-weight:600">
              <i class="fas fa-calendar-xmark"></i> Validade vencida há ${Math.abs(i.vencDays)} dias
            </span>` : i.vencendo ? `
            <span style="font-size:11.5px;color:#d97706;font-weight:600">
              <i class="fas fa-clock"></i> Vence em ${i.vencDays} dias (${fmtDate(i.validade)})
            </span>` : ''}
          </div>
        </div>

        <!-- Previsão de fim -->
        ${i.quantidade > 0 && i.quantidade < i.minimo ? `
        <div style="text-align:center;min-width:90px">
          <div style="font-size:10px;color:var(--gray-400)">Esgota em ≈</div>
          <div style="font-size:18px;font-weight:800;color:${i.diasFim<=7?'#dc2626':i.diasFim<=15?'#d97706':'#d97706'}">${i.diasFim}</div>
          <div style="font-size:10px;color:var(--gray-400)">dias</div>
        </div>` : `<div></div>`}

        <!-- Pedido sugerido -->
        <div style="text-align:right;min-width:110px">
          <div style="font-size:10px;color:var(--gray-400);margin-bottom:3px">Pedido sugerido</div>
          <div style="font-size:13px;font-weight:700;color:${i.priorCor}">${fmtNum(i.pedido)} ${i.unidade}</div>
          <div style="font-size:10px;color:var(--gray-400)">${fmtCurrency(i.pedido * i.custo)}</div>
          <button class="btn btn-sm" style="margin-top:5px;background:${i.priorCor};color:#fff;padding:3px 10px;font-size:11px"
            onclick="movimentarEstoque(${i.id})">
            <i class="fas fa-cart-plus"></i> Repor
          </button>
        </div>
      </div>`).join('')}
    </div>
  </div>`;
}

function filtrarTabelaEstoque(valor) {
  const el = document.getElementById('filterStatus');
  if (el) { el.value = valor; filterEstoque(); }
  setTimeout(() => {
    document.getElementById('cardTabelaEstoque')?.scrollIntoView({ behavior:'smooth', block:'start' });
  }, 50);
}

function filterEstoque() {
  const q = document.getElementById('searchEstoque').value.toLowerCase();
  const cat = document.getElementById('filterCat').value;
  const st = document.getElementById('filterStatus').value;
  const hoje = new Date(); const lim30 = new Date(); lim30.setDate(hoje.getDate()+30);
  let itens = DB.estoque.filter(i => {
    if (q && !i.nome.toLowerCase().includes(q) && !i.categoria.toLowerCase().includes(q)) return false;
    if (cat && i.categoria !== cat) return false;
    if (st === 'min' && i.quantidade >= i.minimo) return false;
    if (st === 'ok' && (i.quantidade < i.minimo || (i.validade && new Date(i.validade+'T00:00:00') <= lim30))) return false;
    if (st === 'venc' && !(i.validade && new Date(i.validade+'T00:00:00') <= lim30)) return false;
    return true;
  });
  renderEstoqueTable(itens);
}

function abrirModalEstoque(item = null) {
  const isEdit = !!item;
  openModal(isEdit ? 'Editar Item' : 'Novo Item de Estoque', `
    <div class="form-row">
      <div class="form-group"><label class="form-label">Nome *</label>
        <input class="form-control" id="e-nome" value="${item?.nome||''}" placeholder="Ex: Farinha de Trigo">
      </div>
      <div class="form-group"><label class="form-label">Categoria *</label>
        <select class="form-control" id="e-cat">
          ${['Matéria-Prima','Embalagem','Aditivo','EPI/Consumível'].map(c=>`<option ${item?.categoria===c?'selected':''}>${c}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-row-3">
      <div class="form-group"><label class="form-label">Quantidade</label>
        <input type="number" class="form-control" id="e-qtd" value="${item?.quantidade||0}" min="0">
      </div>
      <div class="form-group"><label class="form-label">Mínimo</label>
        <input type="number" class="form-control" id="e-min" value="${item?.minimo||0}" min="0">
      </div>
      <div class="form-group"><label class="form-label">Máximo</label>
        <input type="number" class="form-control" id="e-max" value="${item?.maximo||0}" min="0">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Unidade</label>
        <select class="form-control" id="e-un">
          ${['kg','L','g','ml','un','par','cx'].map(u=>`<option ${item?.unidade===u?'selected':''}>${u}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Custo Unitário (R$)</label>
        <input type="number" class="form-control" id="e-custo" value="${item?.custo||0}" min="0" step="0.01">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Fornecedor</label>
        <input class="form-control" id="e-forn" value="${item?.fornecedor||''}">
      </div>
      <div class="form-group"><label class="form-label">Validade</label>
        <input type="date" class="form-control" id="e-val" value="${item?.validade||''}">
      </div>
    </div>
    <div class="form-group"><label class="form-label">Localização</label>
      <input class="form-control" id="e-loc" value="${item?.localizacao||''}" placeholder="Ex: Galpão A – Prateleira 1">
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="salvarEstoque(${item?.id||0})">
      <i class="fas fa-save"></i> ${isEdit?'Salvar Alterações':'Cadastrar'}
    </button>
  `);
}

function editarEstoque(id) { abrirModalEstoque(getById('estoque', id)); }

function salvarEstoque(id) {
  const nome = document.getElementById('e-nome').value.trim();
  if (!nome) { toast('Nome do item é obrigatório.', 'error'); return; }
  const dados = {
    nome, categoria: document.getElementById('e-cat').value,
    quantidade: parseFloat(document.getElementById('e-qtd').value)||0,
    minimo: parseFloat(document.getElementById('e-min').value)||0,
    maximo: parseFloat(document.getElementById('e-max').value)||0,
    unidade: document.getElementById('e-un').value,
    custo: parseFloat(document.getElementById('e-custo').value)||0,
    fornecedor: document.getElementById('e-forn').value,
    validade: document.getElementById('e-val').value || null,
    localizacao: document.getElementById('e-loc').value,
  };
  if (id) { update('estoque', id, dados); toast('Item atualizado!'); }
  else { create('estoque', dados); toast('Item cadastrado!'); }
  closeModal();
  renderEstoque(document.getElementById('content'));
}

function movimentarEstoque(id) {
  const item = getById('estoque', id);
  openModal(`Movimentar: ${item.nome}`, `
    <div class="alert info"><i class="fas fa-info-circle"></i> Estoque atual: <strong>${item.quantidade} ${item.unidade}</strong></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Tipo</label>
        <select class="form-control" id="m-tipo">
          <option value="entrada">Entrada (Recebimento)</option>
          <option value="saida">Saída (Consumo)</option>
          <option value="ajuste">Ajuste de Inventário</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Quantidade</label>
        <input type="number" class="form-control" id="m-qtd" min="0" placeholder="0">
      </div>
    </div>
    <div class="form-group"><label class="form-label">Observação</label>
      <input class="form-control" id="m-obs" placeholder="Ex: Recebimento NF 1234">
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="confirmarMovimentacao(${id})"><i class="fas fa-check"></i> Confirmar</button>
  `);
}

function confirmarMovimentacao(id) {
  const tipo = document.getElementById('m-tipo').value;
  const qtd = parseFloat(document.getElementById('m-qtd').value)||0;
  if (!qtd) { toast('Informe a quantidade.', 'error'); return; }
  const item = getById('estoque', id);
  let nova = item.quantidade;
  if (tipo === 'entrada') nova += qtd;
  else if (tipo === 'saida') nova = Math.max(0, nova - qtd);
  else nova = qtd;
  update('estoque', id, { quantidade: nova });
  toast(`Movimentação registrada! Novo estoque: ${nova} ${item.unidade}`, 'success');
  closeModal();
  renderEstoque(document.getElementById('content'));
}

function deletarEstoque(id) {
  const item = getById('estoque', id);
  openModal('Confirmar Exclusão', `
    <div class="alert danger"><i class="fas fa-trash"></i> Deseja remover <strong>${item.nome}</strong> do estoque? Esta ação não pode ser desfeita.</div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-danger" onclick="confirmarDeleteEstoque(${id})"><i class="fas fa-trash"></i> Remover</button>
  `);
}

function confirmarDeleteEstoque(id) {
  remove('estoque', id);
  toast('Item removido do estoque.', 'warning');
  closeModal();
  renderEstoque(document.getElementById('content'));
}
