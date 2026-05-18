// ===== CORE APP =====
const MODULES = {
  dashboard:   { title: 'Dashboard',       render: renderDashboard },
  estoque:     { title: 'Controle de Estoque', render: renderEstoque },
  manutencao:  { title: 'Manutenção Preditiva', render: renderManutencao },
  seguranca:   { title: 'Segurança do Trabalho', render: renderSeguranca },
  energia:     { title: 'Monitoramento de Energia', render: renderEnergia },
  comunicacao: { title: 'Comunicação Interna', render: renderComunicacao },
  documentos:  { title: 'Gestão de Documentos', render: renderDocumentos },
  entregas:    { title: 'Controle de Entregas', render: renderEntregas },
};

let currentModule = 'dashboard';

function navigate(mod) {
  if (!MODULES[mod]) return;
  currentModule = mod;
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.module === mod);
  });
  document.getElementById('pageTitle').textContent = MODULES[mod].title;
  const el = document.getElementById('content');
  el.innerHTML = '';
  MODULES[mod].render(el);
  updateBadges();
}

function updateBadges() {
  const b = (id, val) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = val > 0 ? val : '';
  };
  b('badge-estoque', estoqueAbaixoMinimo().length);
  b('badge-manutencao', equipamentosAlerta().length);
  b('badge-seguranca', colaboradoresSemEPI().length);
  b('badge-comunicacao', mensagensNaoLidas().length);
  b('badge-documentos', documentosAlerta().length);
  b('badge-entregas', entregasAtrasadas().length);

  const haNotif = estoqueAbaixoMinimo().length || equipamentosAlerta().length || entregasAtrasadas().length;
  document.getElementById('notifDot').style.display = haNotif ? 'block' : 'none';
}

// ===== MODAL =====
function openModal(title, bodyHtml, footerHtml = '') {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHtml;
  document.getElementById('modalFooter').innerHTML = footerHtml;
  document.getElementById('modalBackdrop').classList.add('open');
}
function closeModal() { document.getElementById('modalBackdrop').classList.remove('open'); }

// ===== TOAST =====
function toast(msg, type = 'success', duration = 3000) {
  const icons = { success:'fa-check-circle', error:'fa-times-circle', warning:'fa-exclamation-triangle', info:'fa-info-circle' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${msg}</span>`;
  document.getElementById('toastWrap').appendChild(t);
  setTimeout(() => t.remove(), duration);
}

// ===== DATE =====
function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('pt-BR');
}
function daysUntil(d) {
  if (!d) return null;
  const diff = new Date(d + 'T00:00:00') - new Date();
  return Math.ceil(diff / 86400000);
}
function todayISO() { return new Date().toISOString().split('T')[0]; }

// ===== CURRENCY =====
function fmtCurrency(v) { return v.toLocaleString('pt-BR', { style:'currency', currency:'BRL' }); }
function fmtNum(v) { return v.toLocaleString('pt-BR'); }

// ===== NAVEGAÇÃO COM FILTRO =====
function irPara(modulo, fn) {
  navigate(modulo);
  if (typeof fn === 'function') fn();
}

function irParaEstoque(filtro) {
  navigate('estoque');
  const el = document.getElementById('filterStatus');
  if (el) { el.value = filtro || ''; filterEstoque(); }
}

function irParaManutencao(filtro) {
  navigate('manutencao');
  if (filtro) {
    const el = document.getElementById('filterEquipStatus');
    if (el) { el.value = filtro; filterEquip(); }
  }
}

function irParaSeguranca(secaoId) {
  navigate('seguranca');
  if (secaoId) {
    setTimeout(() => {
      const el = document.getElementById(secaoId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }
}

function irParaEntregas(filtro) {
  navigate('entregas');
  if (filtro) {
    const el = document.getElementById('filterEntSt');
    if (el) { el.value = filtro; filterEntregas(); }
  }
}

function irParaComunicacao(filtroLida) {
  navigate('comunicacao');
  if (filtroLida !== undefined) {
    const el = document.getElementById('filterMsgLida');
    if (el) { el.value = filtroLida; filterMensagens(); }
  }
}

function irParaDocumentos(filtro) {
  navigate('documentos');
  if (filtro) {
    const el = document.getElementById('filterDocSt');
    if (el) { el.value = filtro; filterDocs(); }
  }
}

// ===== TEMA CLARO / ESCURO =====
function aplicarTema(dark) {
  document.body.classList.toggle('dark', dark);
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
  }
  localStorage.setItem('tema', dark ? 'dark' : 'light');
}

function toggleTema() {
  aplicarTema(!document.body.classList.contains('dark'));
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Tema salvo
  aplicarTema(localStorage.getItem('tema') === 'dark');
  document.getElementById('themeToggle').addEventListener('click', toggleTema);

  // Date in topbar
  document.getElementById('topbarDate').textContent =
    new Date().toLocaleDateString('pt-BR', { weekday:'short', day:'2-digit', month:'short', year:'numeric' });

  // Nav clicks
  document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      navigate(el.dataset.module);
    });
  });

  // Sidebar toggle
  document.getElementById('sidebarToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
  });

  // Modal close
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalBackdrop').addEventListener('click', e => {
    if (e.target === document.getElementById('modalBackdrop')) closeModal();
  });

  // Notif button
  document.getElementById('notifBtn').addEventListener('click', () => {
    const alerts = [];
    estoqueAbaixoMinimo().forEach(i => alerts.push(`Estoque baixo: ${i.nome}`));
    equipamentosAlerta().forEach(e => alerts.push(`Equipamento: ${e.nome} (${e.status})`));
    entregasAtrasadas().forEach(e => alerts.push(`Entrega atrasada: ${e.pedido}`));
    if (!alerts.length) { toast('Nenhum alerta ativo no momento.', 'info'); return; }
    openModal('Alertas Ativos',
      alerts.map(a => `<div class="alert warning"><i class="fas fa-exclamation-triangle"></i> ${a}</div>`).join('')
    );
  });

  navigate('dashboard');
});
