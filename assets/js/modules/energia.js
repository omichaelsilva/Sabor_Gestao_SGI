function renderEnergia(el) {
  const en = DB.energia;
  const ultConsumo = en.consumo[en.consumo.length-1];
  const ultCusto = en.custo[en.custo.length-1];
  const varPct = Math.round(((ultConsumo - en.consumo[en.consumo.length-2]) / en.consumo[en.consumo.length-2]) * 100);
  const acimaMeta = Math.round(((ultConsumo - en.meta) / en.meta) * 100);

  el.innerHTML = `
  <div class="page-header">
    <h1>Monitoramento de Energia</h1>
    <p>Consumo elétrico, custos e oportunidades de eficiência energética</p>
  </div>

  <div class="kpi-grid" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">
    <div class="kpi-card">
      <div class="kpi-icon cyan"><i class="fas fa-bolt"></i></div>
      <div class="kpi-info">
        <div class="kpi-label">Consumo Abr/26</div>
        <div class="kpi-value">${fmtNum(ultConsumo)}<span style="font-size:13px"> kWh</span></div>
        <div class="kpi-sub" style="color:${varPct>0?'var(--danger)':'var(--secondary)'}">
          ${varPct>0?'▲':'▼'} ${Math.abs(varPct)}% vs mês ant.
        </div>
      </div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon red"><i class="fas fa-chart-line"></i></div>
      <div class="kpi-info">
        <div class="kpi-label">Acima da Meta</div>
        <div class="kpi-value" style="color:var(--danger)">+${acimaMeta}%</div>
        <div class="kpi-sub">Meta: ${fmtNum(en.meta)} kWh/mês</div>
      </div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon amber"><i class="fas fa-money-bill-wave"></i></div>
      <div class="kpi-info">
        <div class="kpi-label">Custo Abr/26</div>
        <div class="kpi-value" style="font-size:16px">${fmtCurrency(ultCusto)}</div>
        <div class="kpi-sub">Tarifa ~R$ 0,50/kWh</div>
      </div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon green"><i class="fas fa-leaf"></i></div>
      <div class="kpi-info">
        <div class="kpi-label">Potencial Economia</div>
        <div class="kpi-value" style="color:var(--secondary);font-size:16px">${fmtCurrency((ultConsumo - en.meta) * 0.5)}</div>
        <div class="kpi-sub">ao atingir a meta</div>
      </div>
    </div>
  </div>

  <div class="grid-2 section">
    <div class="card">
      <div class="card-header">
        <div class="card-title">Histórico de Consumo (kWh)</div>
        <span class="badge red">Meta: ${fmtNum(en.meta)} kWh</span>
      </div>
      <div class="chart-wrap-lg"><canvas id="chartConsumoHist"></canvas></div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Custo Mensal (R$)</div></div>
      <div class="chart-wrap-lg"><canvas id="chartCustoHist"></canvas></div>
    </div>
  </div>

  <div class="grid-2 section">
    <div class="card">
      <div class="card-header"><div class="card-title">Consumo por Setor – Abr/26</div></div>
      <div class="chart-wrap"><canvas id="chartSetorPie"></canvas></div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title card-title-lg">Plano de Ação – Eficiência Energética</div></div>
      <div id="planoEnergia"></div>
    </div>
  </div>`;

  // Histórico consumo
  new Chart(document.getElementById('chartConsumoHist'), {
    type: 'line',
    data: {
      labels: en.meses,
      datasets: [
        { label:'Consumo (kWh)', data: en.consumo, borderColor:'#0891b2', backgroundColor:'rgba(8,145,178,.08)',
          tension:.3, fill:true, pointRadius:5, pointBackgroundColor:'#0891b2' },
        { label:'Meta', data: Array(6).fill(en.meta), borderColor:'#dc2626', borderDash:[5,5], borderWidth:2, pointRadius:0, fill:false }
      ]
    },
    options: { responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ labels:{font:{size:11}} } },
      scales:{ y:{ min:35000, ticks:{font:{size:11}} }, x:{ ticks:{font:{size:11}} } } }
  });

  // Custo mensal
  new Chart(document.getElementById('chartCustoHist'), {
    type: 'bar',
    data: {
      labels: en.meses,
      datasets: [{ label:'Custo (R$)', data: en.custo,
        backgroundColor: en.custo.map(v => v > en.meta * 0.5 ? '#dc2626' : '#059669'),
        borderRadius:5 }]
    },
    options: { responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false} },
      scales:{ y:{ ticks:{font:{size:11}, callback:v=>'R$'+fmtNum(v)} }, x:{ ticks:{font:{size:11}} } } }
  });

  // Consumo por setor
  new Chart(document.getElementById('chartSetorPie'), {
    type: 'doughnut',
    data: {
      labels: en.setores.map(s=>s.nome),
      datasets: [{ data: en.setores.map(s=>s.percentual),
        backgroundColor:['#2563eb','#0891b2','#d97706','#059669','#7c3aed'] }]
    },
    options: { responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ position:'right', labels:{font:{size:11}} } } }
  });

  // Plano de ação
  const acoes = [
    { prioridade:'alta', acao:'Instalar variadores de frequência nos misturadores', economia:'~8% consumo Produção', prazo:'2026-06-30' },
    { prioridade:'alta', acao:'Revisão do sistema de refrigeração (Câmara Fria 2)', economia:'~12% consumo Refrig.', prazo:'2026-05-31' },
    { prioridade:'media', acao:'Substituição de iluminação por LED em todo galpão', economia:'~60% iluminação', prazo:'2026-07-31' },
    { prioridade:'media', acao:'Programa de conscientização – uso racional de energia', economia:'~3-5% geral', prazo:'2026-06-15' },
    { prioridade:'baixa', acao:'Estudo para implantação de energia solar fotovoltaica', economia:'~20-30% total', prazo:'2026-12-31' },
  ];
  const colors = { alta:'red', media:'amber', baixa:'blue' };
  document.getElementById('planoEnergia').innerHTML = acoes.map(a=>`
  <div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--gray-100);align-items:flex-start">
    <span class="badge ${colors[a.prioridade]}" style="flex-shrink:0;margin-top:2px">${a.prioridade}</span>
    <div style="flex:1">
      <div style="font-size:13px;font-weight:600">${a.acao}</div>
      <div style="font-size:11px;color:var(--secondary);margin-top:2px"><i class="fas fa-leaf"></i> ${a.economia}</div>
    </div>
    <div style="font-size:11px;color:var(--gray-400);flex-shrink:0">${fmtDate(a.prazo)}</div>
  </div>`).join('');
}
