const EPI_LABELS = { capacete:'Capacete', luvas:'Luvas', oculos:'Óculos Prot.', protetor:'Prot. Auricular', bota:'Bota Seg.', avental:'Avental' };
const EPI_ICONS  = { capacete:'fa-hard-hat', luvas:'fa-hand-dots', oculos:'fa-glasses', protetor:'fa-ear-deaf', bota:'fa-shoe-prints', avental:'fa-vest' };

function renderSeguranca(el) {
  const total = DB.colaboradores.length;
  const compl = DB.colaboradores.filter(c => Object.values(c.epis).every(v=>v)).length;
  const semCompl = total - compl;
  const acidentes = DB.acidentes.length;
  const afastamentos = DB.acidentes.filter(a=>a.afastamento).length;
  const taxaCompl = Math.round((compl/total)*100);

  el.innerHTML = `
  <div class="page-header">
    <h1>Segurança do Trabalho</h1>
    <p>Monitoramento de EPIs, acidentes e conformidade de segurança</p>
  </div>

  <div class="kpi-grid" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr))">
    <div class="kpi-card" onclick="document.getElementById('secao-ranking')?.scrollIntoView({behavior:'smooth'})" title="Ver ranking de segurança">
      <div class="kpi-icon green"><i class="fas fa-shield-halved"></i></div>
      <div class="kpi-info"><div class="kpi-label">Taxa EPI Completo</div>
        <div class="kpi-value" style="color:${taxaCompl>=80?'var(--secondary)':'var(--danger)'}">${taxaCompl}%</div>
        <div class="kpi-sub">${compl}/${total} colaboradores</div>
      </div>
    </div>
    <div class="kpi-card" onclick="document.getElementById('secao-acidentes')?.scrollIntoView({behavior:'smooth'})" title="Ver registro de acidentes">
      <div class="kpi-icon red"><i class="fas fa-person-falling"></i></div>
      <div class="kpi-info"><div class="kpi-label">Acidentes (2026)</div>
        <div class="kpi-value" style="color:var(--danger)">${acidentes}</div>
        <div class="kpi-sub">${afastamentos} afastamentos</div>
      </div>
    </div>
    <div class="kpi-card" onclick="document.getElementById('secao-colaboradores')?.scrollIntoView({behavior:'smooth'})" title="Ver colaboradores sem EPI completo">
      <div class="kpi-icon amber"><i class="fas fa-user-xmark"></i></div>
      <div class="kpi-info"><div class="kpi-label">Sem EPI Completo</div>
        <div class="kpi-value" style="color:var(--warning)">${semCompl}</div>
        <div class="kpi-sub">necessitam atenção</div>
      </div>
    </div>
    <div class="kpi-card" onclick="document.getElementById('secao-acidentes')?.scrollIntoView({behavior:'smooth'})" title="Ver histórico de acidentes">
      <div class="kpi-icon blue"><i class="fas fa-calendar-days"></i></div>
      <div class="kpi-info"><div class="kpi-label">Dias sem Acidente</div>
        <div class="kpi-value" style="color:var(--primary)" id="diasSemAcidente"></div>
        <div class="kpi-sub">desde último registro</div>
      </div>
    </div>
  </div>

  <!-- Ranking de Segurança -->
  <div class="card section" id="secao-ranking">
    <div class="card-header">
      <div>
        <div class="card-title card-title-lg" style="display:flex;align-items:center;gap:8px">
          <i class="fas fa-trophy" style="color:#f59e0b"></i> Ranking de Segurança
        </div>
        <div style="font-size:11.5px;color:var(--gray-400);margin-top:2px">
          Pontuação: conformidade de EPIs (70 pts) + histórico sem acidentes (30 pts)
        </div>
      </div>
    </div>
    <div id="rankingSeguranca"></div>
  </div>

  <div class="grid-2 section">
    <!-- Colaboradores EPI -->
    <div class="card" id="secao-colaboradores">
      <div class="card-header">
        <div class="card-title card-title-lg">Colaboradores – Conformidade EPI</div>
        <button class="btn btn-primary btn-sm" onclick="abrirModalColaborador()"><i class="fas fa-plus"></i> Novo</button>
      </div>
      <div id="listaColaboradores"></div>
    </div>

    <!-- Acidentes -->
    <div class="card" id="secao-acidentes">
      <div class="card-header">
        <div class="card-title card-title-lg">Registro de Acidentes / Incidentes</div>
        <button class="btn btn-danger btn-sm" onclick="abrirModalAcidente()"><i class="fas fa-plus"></i> Registrar</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Data</th><th>Colaborador</th><th>Tipo</th><th>Causa</th><th>Afastamento</th></tr></thead>
          <tbody id="tbodyAcidentes"></tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="grid-2 section">
    <div class="card">
      <div class="card-header"><div class="card-title">Acidentes por Setor</div></div>
      <div class="chart-wrap"><canvas id="chartAcidenteSetor"></canvas></div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Conformidade EPI por Tipo</div></div>
      <div class="chart-wrap"><canvas id="chartEpiCompliance"></canvas></div>
    </div>
  </div>`;

  // Dias sem acidente
  const ultimo = DB.acidentes.reduce((max, a) => new Date(a.data) > new Date(max) ? a.data : max, '2000-01-01');
  document.getElementById('diasSemAcidente').textContent = Math.abs(daysUntil(ultimo));

  renderListaColaboradores();
  renderTabelaAcidentes();
  renderRankingSeguranca();

  // Chart acidentes por setor
  const setores = [...new Set(DB.acidentes.map(a=>a.setor))];
  const contSetor = setores.map(s => DB.acidentes.filter(a=>a.setor===s).length);
  new Chart(document.getElementById('chartAcidenteSetor'), {
    type: 'bar',
    data: { labels: setores, datasets: [{ label:'Ocorrências', data: contSetor,
      backgroundColor: ['#dc2626','#d97706','#2563eb','#059669'], borderRadius:5 }] },
    options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}},
      scales:{ y:{beginAtZero:true, ticks:{stepSize:1, font:{size:11}}}, x:{ticks:{font:{size:11}}} } }
  });

  // Chart EPI compliance por tipo
  const tipos = Object.keys(EPI_LABELS);
  const conformes = tipos.map(t => DB.colaboradores.filter(c=>c.epis[t]).length);
  const total2 = DB.colaboradores.length;
  new Chart(document.getElementById('chartEpiCompliance'), {
    type: 'bar',
    data: {
      labels: Object.values(EPI_LABELS),
      datasets: [
        { label:'Conforme', data: conformes, backgroundColor:'#059669', borderRadius:4 },
        { label:'Não conforme', data: conformes.map(v=>total2-v), backgroundColor:'#dc2626', borderRadius:4 }
      ]
    },
    options: { responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ labels:{font:{size:11}} } },
      scales:{ x:{stacked:true, ticks:{font:{size:11}}}, y:{stacked:true, beginAtZero:true, max:total2, ticks:{stepSize:1, font:{size:11}}} } }
  });
}

function renderListaColaboradores() {
  const el = document.getElementById('listaColaboradores');
  if (!el) return;
  el.innerHTML = DB.colaboradores.map(c => {
    const tipos = Object.keys(EPI_LABELS);
    const ok = tipos.filter(t=>c.epis[t]).length;
    const pct = Math.round((ok/tipos.length)*100);
    const completo = ok === tipos.length;
    return `
    <div style="border-bottom:1px solid var(--gray-100);padding:10px 0">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
        <div>
          <span class="fw-600" style="font-size:13px">${c.nome}</span>
          <span style="font-size:11px;color:var(--gray-400);margin-left:8px">${c.funcao} – ${c.setor}</span>
        </div>
        <div style="display:flex;gap:6px;align-items:center">
          <span style="font-size:12px;color:${completo?'var(--secondary)':'var(--danger)'};font-weight:600">${pct}%</span>
          <button class="btn-icon-sm edit" onclick="editarColaborador(${c.id})"><i class="fas fa-edit"></i></button>
        </div>
      </div>
      <div class="epi-grid">
        ${tipos.map(t=>`
        <div class="epi-item ${c.epis[t]?'ok':'nok'}" onclick="toggleEpi(${c.id},'${t}')">
          <i class="fas ${EPI_ICONS[t]}"></i> ${EPI_LABELS[t]}
          <i class="fas ${c.epis[t]?'fa-check':'fa-times'}" style="margin-left:auto;font-size:11px"></i>
        </div>`).join('')}
      </div>
    </div>`;
  }).join('');
}

function toggleEpi(colabId, tipo) {
  const c = getById('colaboradores', colabId);
  const novoEpis = { ...c.epis, [tipo]: !c.epis[tipo] };
  update('colaboradores', colabId, { epis: novoEpis });
  updateBadges();
  renderListaColaboradores();
  toast(`EPI atualizado para ${c.nome}`, 'info');
}

function renderTabelaAcidentes() {
  const body = document.getElementById('tbodyAcidentes');
  if (!body) return;
  const itens = [...DB.acidentes].sort((a,b)=>new Date(b.data)-new Date(a.data));
  body.innerHTML = itens.map(a=>`
  <tr>
    <td style="font-size:12px">${fmtDate(a.data)}</td>
    <td class="fw-600" style="font-size:12px">${a.colaborador}<br><span style="color:var(--gray-400);font-weight:400">${a.setor}</span></td>
    <td><span class="badge ${a.tipo==='Leve'?'amber':'red'}">${a.tipo}</span></td>
    <td style="font-size:11px;max-width:140px">${a.causa}</td>
    <td>${a.afastamento?'<span class="badge red">Sim</span>':'<span class="badge green">Não</span>'}</td>
  </tr>`).join('');
}

function abrirModalAcidente() {
  openModal('Registrar Acidente / Incidente', `
    <div class="form-row">
      <div class="form-group"><label class="form-label">Data *</label>
        <input type="date" class="form-control" id="ac-data" value="${todayISO()}">
      </div>
      <div class="form-group"><label class="form-label">Tipo</label>
        <select class="form-control" id="ac-tipo"><option>Leve</option><option>Moderado</option><option>Grave</option></select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Colaborador *</label>
        <select class="form-control" id="ac-colab">
          ${DB.colaboradores.map(c=>`<option>${c.nome}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Setor</label>
        <select class="form-control" id="ac-setor">
          ${['Produção','Logística','Manutenção','Qualidade','Administrativo'].map(s=>`<option>${s}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-group"><label class="form-label">Descrição</label>
      <textarea class="form-control" id="ac-desc" rows="2" placeholder="Descreva o ocorrido..."></textarea>
    </div>
    <div class="form-group"><label class="form-label">Causa Raiz</label>
      <input class="form-control" id="ac-causa" placeholder="Ex: Ausência de EPI, piso molhado...">
    </div>
    <label class="checkbox-wrap form-group">
      <input type="checkbox" id="ac-afas"> Gerou afastamento
    </label>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-danger" onclick="salvarAcidente()"><i class="fas fa-save"></i> Registrar</button>
  `);
}

function salvarAcidente() {
  const data = document.getElementById('ac-data').value;
  const colab = document.getElementById('ac-colab').value;
  if (!data) { toast('Data obrigatória.', 'error'); return; }
  create('acidentes', {
    data, tipo: document.getElementById('ac-tipo').value,
    colaborador: colab, setor: document.getElementById('ac-setor').value,
    descricao: document.getElementById('ac-desc').value,
    causa: document.getElementById('ac-causa').value,
    afastamento: document.getElementById('ac-afas').checked
  });
  toast('Acidente/incidente registrado.', 'warning');
  closeModal();
  renderSeguranca(document.getElementById('content'));
}

function abrirModalColaborador(col = null) {
  const isEdit = !!col;
  const tipos = Object.keys(EPI_LABELS);
  openModal(isEdit?'Editar Colaborador':'Novo Colaborador', `
    <div class="form-row">
      <div class="form-group"><label class="form-label">Nome *</label>
        <input class="form-control" id="col-nome" value="${col?.nome||''}">
      </div>
      <div class="form-group"><label class="form-label">Função</label>
        <input class="form-control" id="col-func" value="${col?.funcao||''}">
      </div>
    </div>
    <div class="form-group"><label class="form-label">Setor</label>
      <select class="form-control" id="col-setor">
        ${['Produção','Logística','Manutenção','Qualidade','Administrativo'].map(s=>`<option ${col?.setor===s?'selected':''}>${s}</option>`).join('')}
      </select>
    </div>
    <div class="form-group"><label class="form-label">EPIs Disponíveis</label>
      <div class="epi-grid">
        ${tipos.map(t=>`
        <label class="checkbox-wrap">
          <input type="checkbox" id="col-epi-${t}" ${col?.epis[t]?'checked':''}>
          <i class="fas ${EPI_ICONS[t]}"></i> ${EPI_LABELS[t]}
        </label>`).join('')}
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="salvarColaborador(${col?.id||0})"><i class="fas fa-save"></i> ${isEdit?'Salvar':'Cadastrar'}</button>
  `);
}

// ===== RANKING DE SEGURANÇA =====
function calcularScoreSeguranca(colab) {
  const tipos = Object.keys(EPI_LABELS);
  const episOk = tipos.filter(t => colab.epis[t]).length;
  const epiScore = Math.round((episOk / tipos.length) * 70);

  const acidColab = DB.acidentes.filter(a => a.colaborador === colab.nome);
  const afastamentos = acidColab.filter(a => a.afastamento).length;
  const safetyScore = Math.max(0, 30 - (acidColab.length * 8) - (afastamentos * 10));

  const total = epiScore + safetyScore;

  let status, statusColor;
  if (total >= 90)      { status = 'Exemplar'; statusColor = 'green'; }
  else if (total >= 70) { status = 'Bom';      statusColor = 'blue'; }
  else if (total >= 50) { status = 'Regular';  statusColor = 'amber'; }
  else                  { status = 'Crítico';  statusColor = 'red'; }

  return { total, epiScore, safetyScore, episOk, totalEpis: tipos.length,
           acidentes: acidColab.length, afastamentos, status, statusColor };
}

function renderRankingSeguranca() {
  const el = document.getElementById('rankingSeguranca');
  if (!el) return;

  const ranking = DB.colaboradores
    .map(c => ({ ...c, score: calcularScoreSeguranca(c) }))
    .sort((a, b) => b.score.total - a.score.total);

  const medalhas = [
    { icon:'fa-trophy', cor:'#f59e0b', label:'1º' },
    { icon:'fa-medal',  cor:'#9ca3af', label:'2º' },
    { icon:'fa-medal',  cor:'#b45309', label:'3º' },
  ];

  // Pódio top 3
  const podioHTML = `
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px">
    ${ranking.slice(0,3).map((c,i) => `
    <div style="
      background:${i===0?'linear-gradient(135deg,#fef3c7,#fde68a)':i===1?'linear-gradient(135deg,#f1f5f9,#e2e8f0)':'linear-gradient(135deg,#fef3c7,#fed7aa)'};
      border:1px solid ${i===0?'#fcd34d':i===1?'#cbd5e1':'#fb923c'};
      border-radius:12px;padding:16px;text-align:center;position:relative">
      <div style="font-size:28px;margin-bottom:6px">
        <i class="fas ${medalhas[i].icon}" style="color:${medalhas[i].cor}"></i>
      </div>
      <div style="font-size:11px;font-weight:700;color:${medalhas[i].cor};margin-bottom:6px">${medalhas[i].label} LUGAR</div>
      <div style="font-weight:700;font-size:14px;color:var(--gray-900)">${c.nome.split(' ')[0]}</div>
      <div style="font-size:11px;color:var(--gray-500);margin-bottom:10px">${c.setor}</div>
      <div style="font-size:26px;font-weight:800;color:${i===0?'#92400e':i===1?'var(--gray-700)':'#9a3412'}">${c.score.total}</div>
      <div style="font-size:10px;color:var(--gray-400)">pontos</div>
      <div style="margin-top:8px"><span class="badge ${c.score.statusColor}">${c.score.status}</span></div>
    </div>`).join('')}
  </div>`;

  // Lista completa
  const listaHTML = `
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th style="width:40px">#</th>
          <th>Colaborador</th>
          <th>Setor</th>
          <th style="width:160px">Pontuação</th>
          <th>EPI</th>
          <th>Acidentes</th>
          <th>Afastamentos</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${ranking.map((c, i) => {
          const s = c.score;
          const barColor = s.statusColor === 'green' ? 'green' : s.statusColor === 'blue' ? 'blue' : s.statusColor === 'amber' ? 'amber' : 'red';
          const posIcon = i === 0 ? `<i class="fas fa-trophy" style="color:#f59e0b"></i>` :
                          i === 1 ? `<i class="fas fa-medal" style="color:#9ca3af"></i>` :
                          i === 2 ? `<i class="fas fa-medal" style="color:#b45309"></i>` :
                          `<span style="color:var(--gray-400);font-weight:600">${i+1}</span>`;
          return `
          <tr>
            <td style="text-align:center">${posIcon}</td>
            <td class="fw-600">${c.nome}</td>
            <td><span class="badge gray">${c.setor}</span></td>
            <td>
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-weight:700;font-size:15px;min-width:32px">${s.total}</span>
                <div style="flex:1">
                  <div class="progress-bar-wrap">
                    <div class="progress-bar ${barColor}" style="width:${s.total}%"></div>
                  </div>
                </div>
              </div>
            </td>
            <td>
              <span style="font-size:12px;font-weight:600;color:${s.epiScore>=60?'var(--secondary)':'var(--danger)'}">
                ${s.epiScore} pts
              </span>
              <span style="font-size:11px;color:var(--gray-400)"> (${s.episOk}/${s.totalEpis})</span>
            </td>
            <td style="text-align:center">
              <span style="color:${s.acidentes>0?'var(--danger)':'var(--secondary)'};font-weight:600">${s.acidentes}</span>
            </td>
            <td style="text-align:center">
              <span style="color:${s.afastamentos>0?'var(--danger)':'var(--secondary)'};font-weight:600">${s.afastamentos}</span>
            </td>
            <td><span class="badge ${s.statusColor}">${s.status}</span></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>`;

  el.innerHTML = podioHTML + listaHTML;
}

function editarColaborador(id) { abrirModalColaborador(getById('colaboradores', id)); }

function salvarColaborador(id) {
  const nome = document.getElementById('col-nome').value.trim();
  if (!nome) { toast('Nome obrigatório.', 'error'); return; }
  const tipos = Object.keys(EPI_LABELS);
  const epis = {};
  tipos.forEach(t => { epis[t] = document.getElementById(`col-epi-${t}`).checked; });
  const dados = { nome, funcao: document.getElementById('col-func').value, setor: document.getElementById('col-setor').value, epis };
  if (id) { update('colaboradores', id, dados); toast('Colaborador atualizado!'); }
  else { create('colaboradores', dados); toast('Colaborador cadastrado!'); }
  closeModal();
  renderSeguranca(document.getElementById('content'));
}
