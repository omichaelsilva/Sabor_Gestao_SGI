function renderDocumentos(el) {
  el.innerHTML = `
  <div class="page-header">
    <h1>Gestão de Documentos</h1>
    <p>Controle de certificados, procedimentos e documentos regulatórios</p>
  </div>

  <div class="kpi-grid" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr))">
    <div class="kpi-card" onclick="filtrarTabelaDocs('')" title="Ver todos os documentos">
      <div class="kpi-icon blue"><i class="fas fa-file-lines"></i></div>
      <div class="kpi-info"><div class="kpi-label">Total de Docs.</div><div class="kpi-value">${DB.documentos.length}</div></div>
    </div>
    <div class="kpi-card" onclick="filtrarTabelaDocs('vigente')" title="Ver documentos vigentes">
      <div class="kpi-icon green"><i class="fas fa-circle-check"></i></div>
      <div class="kpi-info"><div class="kpi-label">Vigentes</div>
        <div class="kpi-value" style="color:var(--secondary)">${DB.documentos.filter(d=>d.status==='vigente').length}</div></div>
    </div>
    <div class="kpi-card" onclick="filtrarTabelaDocs('vencer')" title="Ver documentos a vencer">
      <div class="kpi-icon amber"><i class="fas fa-clock"></i></div>
      <div class="kpi-info"><div class="kpi-label">A Vencer</div>
        <div class="kpi-value" style="color:var(--warning)">${DB.documentos.filter(d=>d.status==='vencer').length}</div></div>
    </div>
    <div class="kpi-card" onclick="filtrarTabelaDocs('vencido')" title="Ver documentos vencidos">
      <div class="kpi-icon red"><i class="fas fa-circle-xmark"></i></div>
      <div class="kpi-info"><div class="kpi-label">Vencidos</div>
        <div class="kpi-value" style="color:var(--danger)">${DB.documentos.filter(d=>d.status==='vencido').length}</div></div>
    </div>
  </div>

  ${DB.documentos.filter(d=>d.status==='vencido').length ? `
  <div class="alert danger section">
    <i class="fas fa-triangle-exclamation"></i>
    <div><strong>Documentos vencidos:</strong> ${DB.documentos.filter(d=>d.status==='vencido').map(d=>d.nome).join(', ')}</div>
  </div>` : ''}

  <div class="card">
    <div class="card-header">
      <div class="card-title card-title-lg">Documentos Registrados</div>
      <button class="btn btn-primary btn-sm" onclick="abrirModalDoc()"><i class="fas fa-plus"></i> Novo Documento</button>
    </div>
    <div class="toolbar">
      <div class="search-wrap"><i class="fas fa-search"></i>
        <input class="search-input" id="searchDoc" placeholder="Buscar documento..." oninput="filterDocs()">
      </div>
      <select class="form-control" id="filterDocCat" onchange="filterDocs()" style="width:150px">
        <option value="">Todas as categorias</option>
        <option>Qualidade</option><option>Segurança</option><option>Manutenção</option><option>Legal</option>
      </select>
      <select class="form-control" id="filterDocSt" onchange="filterDocs()" style="width:130px">
        <option value="">Todos os status</option>
        <option value="vigente">Vigente</option><option value="vencer">A vencer</option><option value="vencido">Vencido</option>
      </select>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Documento</th><th>Categoria</th><th>Versão</th><th>Emissão</th><th>Validade</th>
          <th>Dias Restantes</th><th>Responsável</th><th>Status</th><th>Ações</th></tr>
        </thead>
        <tbody id="tbodyDocs"></tbody>
      </table>
    </div>
  </div>`;

  filterDocs();
}

function filtrarTabelaDocs(valor) {
  const el = document.getElementById('filterDocSt');
  if (el) { el.value = valor; filterDocs(); }
}

function filterDocs() {
  const q = (document.getElementById('searchDoc')?.value||'').toLowerCase();
  const cat = document.getElementById('filterDocCat')?.value||'';
  const st = document.getElementById('filterDocSt')?.value||'';
  let itens = DB.documentos.filter(d => {
    if (q && !d.nome.toLowerCase().includes(q)) return false;
    if (cat && d.categoria !== cat) return false;
    if (st && d.status !== st) return false;
    return true;
  });
  renderDocsTable(itens);
}

function renderDocsTable(itens) {
  const body = document.getElementById('tbodyDocs');
  if (!body) return;
  if (!itens.length) { body.innerHTML = '<tr><td colspan="9" style="text-align:center;color:var(--gray-400);padding:32px">Nenhum documento encontrado</td></tr>'; return; }
  body.innerHTML = itens.map(d=>{
    const days = daysUntil(d.dataValidade);
    let diasText = days !== null ? `${days} dias` : '—';
    let diasColor = 'inherit';
    if (d.status === 'vencido') { diasText = 'VENCIDO'; diasColor = 'var(--danger)'; }
    else if (days !== null && days <= 60) diasColor = days <= 30 ? 'var(--danger)' : 'var(--warning)';
    const statusBadge = d.status==='vigente'?'<span class="badge green">Vigente</span>':
      d.status==='vencer'?'<span class="badge amber">A vencer</span>':
      '<span class="badge red">Vencido</span>';
    const catColors = { Qualidade:'blue', Segurança:'red', Manutenção:'amber', Legal:'cyan' };
    return `
    <tr>
      <td class="fw-600" style="max-width:200px">${d.nome}</td>
      <td><span class="badge ${catColors[d.categoria]||'gray'}">${d.categoria}</span></td>
      <td><span class="badge gray">v${d.versao}</span></td>
      <td style="font-size:12px">${fmtDate(d.dataEmissao)}</td>
      <td style="font-size:12px;color:${diasColor}">${fmtDate(d.dataValidade)}</td>
      <td style="font-size:12px;font-weight:600;color:${diasColor}">${diasText}</td>
      <td style="font-size:12px">${d.responsavel}</td>
      <td>${statusBadge}</td>
      <td>
        <div class="gap-8">
          <button class="btn-icon-sm edit" title="Editar" onclick="editarDoc(${d.id})"><i class="fas fa-edit"></i></button>
          <button class="btn-icon-sm del" title="Remover" onclick="deletarDoc(${d.id})"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function abrirModalDoc(doc = null) {
  const isEdit = !!doc;
  openModal(isEdit?'Editar Documento':'Novo Documento', `
    <div class="form-group"><label class="form-label">Nome do Documento *</label>
      <input class="form-control" id="doc-nome" value="${doc?.nome||''}" placeholder="Ex: Manual de BPF">
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Categoria</label>
        <select class="form-control" id="doc-cat">
          ${['Qualidade','Segurança','Manutenção','Legal'].map(c=>`<option ${doc?.categoria===c?'selected':''}>${c}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Versão</label>
        <input class="form-control" id="doc-ver" value="${doc?.versao||'1.0'}" placeholder="1.0">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Data de Emissão</label>
        <input type="date" class="form-control" id="doc-emis" value="${doc?.dataEmissao||todayISO()}">
      </div>
      <div class="form-group"><label class="form-label">Data de Validade</label>
        <input type="date" class="form-control" id="doc-val" value="${doc?.dataValidade||''}">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Responsável</label>
        <input class="form-control" id="doc-resp" value="${doc?.responsavel||''}">
      </div>
      <div class="form-group"><label class="form-label">Status</label>
        <select class="form-control" id="doc-st">
          <option value="vigente" ${doc?.status==='vigente'?'selected':''}>Vigente</option>
          <option value="vencer" ${doc?.status==='vencer'?'selected':''}>A Vencer</option>
          <option value="vencido" ${doc?.status==='vencido'?'selected':''}>Vencido</option>
        </select>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="salvarDoc(${doc?.id||0})"><i class="fas fa-save"></i> ${isEdit?'Salvar':'Cadastrar'}</button>
  `);
}

function editarDoc(id) { abrirModalDoc(getById('documentos', id)); }

function salvarDoc(id) {
  const nome = document.getElementById('doc-nome').value.trim();
  if (!nome) { toast('Nome obrigatório.', 'error'); return; }
  const dados = {
    nome, categoria: document.getElementById('doc-cat').value,
    versao: document.getElementById('doc-ver').value,
    dataEmissao: document.getElementById('doc-emis').value,
    dataValidade: document.getElementById('doc-val').value || null,
    responsavel: document.getElementById('doc-resp').value,
    status: document.getElementById('doc-st').value
  };
  if (id) { update('documentos', id, dados); toast('Documento atualizado!'); }
  else { create('documentos', dados); toast('Documento cadastrado!'); }
  closeModal();
  renderDocumentos(document.getElementById('content'));
}

function deletarDoc(id) {
  const d = getById('documentos', id);
  openModal('Confirmar Exclusão', `
    <div class="alert danger"><i class="fas fa-trash"></i> Remover <strong>${d.nome}</strong>?</div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-danger" onclick="confirmarDeleteDoc(${id})">Remover</button>
  `);
}

function confirmarDeleteDoc(id) {
  remove('documentos', id);
  toast('Documento removido.', 'warning');
  closeModal();
  renderDocumentos(document.getElementById('content'));
}
