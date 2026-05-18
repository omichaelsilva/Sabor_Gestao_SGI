function renderDashboard(el) {
  const semEPI = colaboradoresSemEPI().length;
  const acidentes = DB.acidentes.length;
  const afastamentos = DB.acidentes.filter(a => a.afastamento).length;
  const critAlerts = estoqueAbaixoMinimo().length + equipamentosAlerta().filter(e=>e.status==='vencido').length;
  const estoqueTotal = DB.estoque.reduce((s, i) => s + i.quantidade * i.custo, 0);

  el.innerHTML = `
  <div class="page-header">
    <h1>Dashboard Operacional</h1>
    <p>Visão geral em tempo real – NovaEra Alimentos</p>
  </div>

  <!-- KPIs -->
  <div class="kpi-grid">
    <div class="kpi-card" onclick="irParaEstoque('min')" title="Ver itens abaixo do mínimo">
      <div class="kpi-icon blue"><i class="fas fa-boxes-stacked"></i></div>
      <div class="kpi-info">
        <div class="kpi-label">Itens em Estoque</div>
        <div class="kpi-value">${DB.estoque.length}</div>
        <div class="kpi-sub" style="color:${estoqueAbaixoMinimo().length?'var(--danger)':'var(--secondary)'}">
          ${estoqueAbaixoMinimo().length} abaixo do mínimo
        </div>
      </div>
    </div>
    <div class="kpi-card" onclick="irParaManutencao('atencao')" title="Ver equipamentos em atenção">
      <div class="kpi-icon amber"><i class="fas fa-wrench"></i></div>
      <div class="kpi-info">
        <div class="kpi-label">Equipamentos</div>
        <div class="kpi-value">${DB.equipamentos.length}</div>
        <div class="kpi-sub" style="color:${equipamentosAlerta().length?'var(--warning)':'var(--secondary)'}">
          ${equipamentosAlerta().length} requerem atenção
        </div>
      </div>
    </div>
    <div class="kpi-card" onclick="irParaSeguranca('secao-acidentes')" title="Ver registro de acidentes">
      <div class="kpi-icon red"><i class="fas fa-triangle-exclamation"></i></div>
      <div class="kpi-info">
        <div class="kpi-label">Acidentes (2026)</div>
        <div class="kpi-value">${acidentes}</div>
        <div class="kpi-sub" style="color:var(--danger)">${afastamentos} afastamentos</div>
      </div>
    </div>
    <div class="kpi-card" onclick="irParaSeguranca('secao-colaboradores')" title="Ver colaboradores sem EPI completo">
      <div class="kpi-icon red"><i class="fas fa-hard-hat"></i></div>
      <div class="kpi-info">
        <div class="kpi-label">Sem EPI Completo</div>
        <div class="kpi-value">${semEPI}</div>
        <div class="kpi-sub">${DB.colaboradores.length} colaboradores cadastrados</div>
      </div>
    </div>
    <div class="kpi-card" onclick="irParaEntregas('atrasado')" title="Ver entregas atrasadas">
      <div class="kpi-icon green"><i class="fas fa-truck"></i></div>
      <div class="kpi-info">
        <div class="kpi-label">Entregas Pendentes</div>
        <div class="kpi-value">${DB.entregas.filter(e=>e.status!=='entregue').length}</div>
        <div class="kpi-sub" style="color:${entregasAtrasadas().length?'var(--danger)':'var(--secondary)'}">
          ${entregasAtrasadas().length} atrasadas
        </div>
      </div>
    </div>
    <div class="kpi-card" onclick="navigate('energia')" title="Ver monitoramento de energia">
      <div class="kpi-icon cyan"><i class="fas fa-bolt"></i></div>
      <div class="kpi-info">
        <div class="kpi-label">Consumo (Abr/26)</div>
        <div class="kpi-value">46.200 kWh</div>
        <div class="kpi-sub" style="color:var(--danger)">+15,5% acima da meta</div>
      </div>
    </div>
    <div class="kpi-card" onclick="irParaComunicacao('0')" title="Ver mensagens não lidas">
      <div class="kpi-icon purple"><i class="fas fa-comments"></i></div>
      <div class="kpi-info">
        <div class="kpi-label">Mensagens Não Lidas</div>
        <div class="kpi-value">${mensagensNaoLidas().length}</div>
        <div class="kpi-sub">${DB.mensagens.length} total na caixa</div>
      </div>
    </div>
    <div class="kpi-card" onclick="irParaDocumentos('vencido')" title="Ver documentos em alerta">
      <div class="kpi-icon amber"><i class="fas fa-folder-open"></i></div>
      <div class="kpi-info">
        <div class="kpi-label">Documentos em Alerta</div>
        <div class="kpi-value">${documentosAlerta().length}</div>
        <div class="kpi-sub">${DB.documentos.length} documentos total</div>
      </div>
    </div>
  </div>

  <!-- Alertas críticos -->
  ${critAlerts > 0 ? `
  <div class="section">
    <div class="alert danger">
      <i class="fas fa-circle-exclamation"></i>
      <div>
        <strong>Atenção!</strong> Existem ${critAlerts} alertas críticos que necessitam ação imediata.
        ${estoqueAbaixoMinimo().length ? `<br>• ${estoqueAbaixoMinimo().length} itens de estoque abaixo do mínimo.` : ''}
        ${equipamentosAlerta().filter(e=>e.status==='vencido').length ? `<br>• ${equipamentosAlerta().filter(e=>e.status==='vencido').length} equipamento(s) com manutenção vencida.` : ''}
      </div>
    </div>
  </div>` : ''}

  <!-- Charts row -->
  <div class="grid-2 section">
    <div class="card">
      <div class="card-header">
        <div class="card-title">Estoque Crítico</div>
        <span class="badge red">${estoqueAbaixoMinimo().length} itens</span>
      </div>
      <div id="chartEstoqueWrap">
        ${renderEstoqueCriticoList()}
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">Consumo de Energia (kWh)</div>
      </div>
      <div class="chart-wrap">
        <canvas id="chartEnergiaDash"></canvas>
      </div>
    </div>
  </div>

  <div class="grid-2 section">
    <div class="card">
      <div class="card-header">
        <div class="card-title">Status dos Equipamentos</div>
      </div>
      <div class="chart-wrap-sm">
        <canvas id="chartEquipStatus"></canvas>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">Acidentes por Mês (2026)</div>
      </div>
      <div class="chart-wrap-sm">
        <canvas id="chartAcidentes"></canvas>
      </div>
    </div>
  </div>

  <!-- Mensagens recentes -->
  <div class="card section">
    <div class="card-header">
      <div class="card-title">Mensagens Recentes</div>
      <button class="btn btn-secondary btn-sm" onclick="navigate('comunicacao')">Ver todas</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Prioridade</th><th>De → Para</th><th>Assunto</th><th>Data</th><th>Status</th></tr></thead>
        <tbody>
          ${DB.mensagens.slice(0,4).map(m=>`
          <tr>
            <td><span class="dot ${m.prioridade==='alta'?'red':m.prioridade==='media'?'amber':'green'}"></span></td>
            <td>${m.de} → ${m.para}</td>
            <td class="fw-600">${m.assunto}</td>
            <td>${fmtDate(m.data)}</td>
            <td><span class="badge ${m.lida?'gray':'blue'}">${m.lida?'Lida':'Nova'}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
  `;

  // Chart: Energia
  new Chart(document.getElementById('chartEnergiaDash'), {
    type: 'line',
    data: {
      labels: DB.energia.meses,
      datasets: [{
        label: 'Consumo (kWh)', data: DB.energia.consumo,
        borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,.08)',
        tension: .3, fill: true, pointRadius: 4, pointBackgroundColor: '#2563eb'
      },{
        label: 'Meta', data: Array(6).fill(DB.energia.meta),
        borderColor: '#dc2626', borderDash: [5,5], borderWidth: 1.5,
        pointRadius: 0, fill: false
      }]
    },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ labels:{ font:{size:11} } } }, scales:{ y:{ ticks:{ font:{size:11} } }, x:{ ticks:{ font:{size:11} } } } }
  });

  // Chart: Equipamentos status
  const eq = DB.equipamentos;
  const statusCount = { operacional:0, atencao:0, vencido:0 };
  eq.forEach(e => { statusCount[e.status] = (statusCount[e.status]||0) + 1; });
  new Chart(document.getElementById('chartEquipStatus'), {
    type: 'doughnut',
    data: {
      labels: ['Operacional','Atenção','Manutenção Vencida'],
      datasets: [{ data: [statusCount.operacional, statusCount.atencao, statusCount.vencido],
        backgroundColor: ['#059669','#d97706','#dc2626'] }]
    },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'right', labels:{ font:{size:11} } } } }
  });

  // Chart: Acidentes por mês
  const meses = ['Jan','Fev','Mar','Abr','Mai'];
  const porMes = meses.map((m, i) => DB.acidentes.filter(a => {
    const d = new Date(a.data); return d.getMonth() === i;
  }).length);
  new Chart(document.getElementById('chartAcidentes'), {
    type: 'bar',
    data: {
      labels: meses,
      datasets: [{ label: 'Ocorrências', data: porMes,
        backgroundColor: '#dc2626', borderRadius: 5 }]
    },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true, ticks:{ stepSize:1, font:{size:11} } }, x:{ ticks:{ font:{size:11} } } } }
  });
}

function renderEstoqueCriticoList() {
  const itens = estoqueAbaixoMinimo();
  if (!itens.length) return '<div class="empty-state"><i class="fas fa-check-circle" style="color:var(--secondary)"></i><p>Todos os itens dentro do mínimo</p></div>';
  return itens.map(i => {
    const pct = Math.round((i.quantidade / i.minimo) * 100);
    const color = pct < 50 ? 'red' : 'amber';
    return `
    <div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:12.5px;font-weight:600">${i.nome}</span>
        <span style="font-size:12px;color:var(--danger)">${i.quantidade} / ${i.minimo} ${i.unidade}</span>
      </div>
      <div class="progress-bar-wrap"><div class="progress-bar ${color}" style="width:${Math.min(pct,100)}%"></div></div>
    </div>`;
  }).join('');
}
