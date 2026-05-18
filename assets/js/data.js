// ===== DATA LAYER =====
const DB_KEY = 'novaera_db';

const SEED = {
  estoque: [
    { id:1, nome:'Farinha de Trigo', categoria:'Matéria-Prima', quantidade:850, unidade:'kg', minimo:500, maximo:2000, localizacao:'Galpão A – Prat. 1', fornecedor:'Moinho Sul', validade:'2026-08-15', custo:2.80 },
    { id:2, nome:'Açúcar Cristal', categoria:'Matéria-Prima', quantidade:320, unidade:'kg', minimo:400, maximo:1500, localizacao:'Galpão A – Prat. 2', fornecedor:'Usina Central', validade:'2027-01-20', custo:3.50 },
    { id:3, nome:'Óleo de Soja', categoria:'Matéria-Prima', quantidade:480, unidade:'L', minimo:300, maximo:1000, localizacao:'Galpão B – Líquidos', fornecedor:'Agroil', validade:'2026-06-30', custo:7.20 },
    { id:4, nome:'Sal Refinado', categoria:'Matéria-Prima', quantidade:180, unidade:'kg', minimo:200, maximo:800, localizacao:'Galpão A – Prat. 3', fornecedor:'Salinas Norte', validade:'2028-12-31', custo:1.20 },
    { id:5, nome:'Fermento Biológico', categoria:'Matéria-Prima', quantidade:45, unidade:'kg', minimo:50, maximo:200, localizacao:'Câmara Fria 1', fornecedor:'BioFerm', validade:'2026-05-28', custo:18.50 },
    { id:6, nome:'Embalagem 500g', categoria:'Embalagem', quantidade:12500, unidade:'un', minimo:5000, maximo:30000, localizacao:'Almoxarifado – Est. 5', fornecedor:'PackSul', validade:null, custo:0.35 },
    { id:7, nome:'Embalagem 1kg', categoria:'Embalagem', quantidade:8200, unidade:'un', minimo:3000, maximo:20000, localizacao:'Almoxarifado – Est. 6', fornecedor:'PackSul', validade:null, custo:0.55 },
    { id:8, nome:'Proteína de Soja', categoria:'Matéria-Prima', quantidade:95, unidade:'kg', minimo:150, maximo:600, localizacao:'Galpão A – Prat. 4', fornecedor:'NutriSoja', validade:'2026-09-15', custo:12.30 },
    { id:9, nome:'Corante Caramelo', categoria:'Aditivo', quantidade:28, unidade:'kg', minimo:30, maximo:100, localizacao:'Sala Aditivos', fornecedor:'ColorFood', validade:'2026-07-10', custo:45.00 },
    { id:10, nome:'Luva Nitrílica M', categoria:'EPI/Consumível', quantidade:120, unidade:'par', minimo:100, maximo:500, localizacao:'Almox. EPI', fornecedor:'SegMax', validade:null, custo:4.80 },
  ],

  equipamentos: [
    { id:1, nome:'Misturador Industrial #1', setor:'Produção', modelo:'MX-500', fabricante:'TechMix', ultimaManutencao:'2026-03-15', proximaManutencao:'2026-06-15', horometro:12450, status:'operacional', criticidade:'critico' },
    { id:2, nome:'Forno Contínuo #1', setor:'Produção', modelo:'FC-3000', fabricante:'FornoBras', ultimaManutencao:'2026-04-01', proximaManutencao:'2026-05-01', horometro:8920, status:'atencao', criticidade:'critico' },
    { id:3, nome:'Esteira Transportadora A', setor:'Produção', modelo:'ET-200', fabricante:'ConveyBelt', ultimaManutencao:'2026-02-20', proximaManutencao:'2026-05-20', horometro:15200, status:'operacional', criticidade:'importante' },
    { id:4, nome:'Câmara Fria 1', setor:'Armazenagem', modelo:'CF-20TN', fabricante:'RefriBras', ultimaManutencao:'2026-04-10', proximaManutencao:'2026-07-10', horometro:0, status:'operacional', criticidade:'critico' },
    { id:5, nome:'Câmara Fria 2', setor:'Armazenagem', modelo:'CF-20TN', fabricante:'RefriBras', ultimaManutencao:'2026-01-15', proximaManutencao:'2026-04-15', horometro:0, status:'vencido', criticidade:'critico' },
    { id:6, nome:'Compressor de Ar', setor:'Utilidades', modelo:'CA-100', fabricante:'AirTech', ultimaManutencao:'2026-03-01', proximaManutencao:'2026-06-01', horometro:6780, status:'operacional', criticidade:'importante' },
    { id:7, nome:'Caldeira #1', setor:'Utilidades', modelo:'CB-500', fabricante:'SteamBras', ultimaManutencao:'2026-04-20', proximaManutencao:'2026-10-20', horometro:22100, status:'operacional', criticidade:'critico' },
    { id:8, nome:'Empilhadeira #1', setor:'Logística', modelo:'EF-3000', fabricante:'LogiLift', ultimaManutencao:'2026-03-28', proximaManutencao:'2026-05-28', horometro:4520, status:'atencao', criticidade:'importante' },
  ],

  colaboradores: [
    { id:1, nome:'Carlos Silva', setor:'Produção', funcao:'Operador de Máquinas', epis:{ capacete:true, luvas:true, oculos:false, protetor:true, bota:true, avental:false } },
    { id:2, nome:'Ana Ferreira', setor:'Produção', funcao:'Operadora de Linha', epis:{ capacete:true, luvas:true, oculos:true, protetor:true, bota:true, avental:true } },
    { id:3, nome:'Roberto Santos', setor:'Logística', funcao:'Op. Empilhadeira', epis:{ capacete:true, luvas:false, oculos:false, protetor:false, bota:true, avental:false } },
    { id:4, nome:'Mariana Costa', setor:'Qualidade', funcao:'Analista de Qualidade', epis:{ capacete:false, luvas:true, oculos:true, protetor:false, bota:true, avental:true } },
    { id:5, nome:'João Oliveira', setor:'Manutenção', funcao:'Técnico Mecânico', epis:{ capacete:true, luvas:true, oculos:true, protetor:true, bota:true, avental:false } },
    { id:6, nome:'Fernanda Lima', setor:'Produção', funcao:'Operadora de Linha', epis:{ capacete:true, luvas:true, oculos:true, protetor:true, bota:true, avental:true } },
    { id:7, nome:'Paulo Rodrigues', setor:'Logística', funcao:'Auxiliar de Estoque', epis:{ capacete:false, luvas:false, oculos:false, protetor:false, bota:true, avental:false } },
    { id:8, nome:'Lucia Mendes', setor:'Produção', funcao:'Operadora de Forno', epis:{ capacete:true, luvas:true, oculos:true, protetor:true, bota:true, avental:true } },
  ],

  acidentes: [
    { id:1, data:'2026-01-15', tipo:'Leve', descricao:'Corte na mão durante manuseio de embalagens', colaborador:'Carlos Silva', setor:'Produção', afastamento:false, causa:'Ausência de luvas' },
    { id:2, data:'2026-01-28', tipo:'Leve', descricao:'Torção no tornozelo – piso molhado', colaborador:'Roberto Santos', setor:'Logística', afastamento:false, causa:'Sinalização inadequada' },
    { id:3, data:'2026-02-10', tipo:'Moderado', descricao:'Lesão na coluna por esforço repetitivo', colaborador:'Paulo Rodrigues', setor:'Logística', afastamento:true, causa:'Postura e excesso de carga' },
    { id:4, data:'2026-02-20', tipo:'Leve', descricao:'Queimadura leve no braço', colaborador:'Lucia Mendes', setor:'Produção', afastamento:false, causa:'Avental inadequado' },
    { id:5, data:'2026-03-05', tipo:'Leve', descricao:'Irritação ocular por particulado', colaborador:'Carlos Silva', setor:'Produção', afastamento:false, causa:'Sem óculos de proteção' },
    { id:6, data:'2026-03-18', tipo:'Moderado', descricao:'Lesão no punho – LER/DORT', colaborador:'Ana Ferreira', setor:'Produção', afastamento:true, causa:'Movimento repetitivo sem pausas' },
    { id:7, data:'2026-04-02', tipo:'Leve', descricao:'Contusão por queda de objeto', colaborador:'João Oliveira', setor:'Manutenção', afastamento:false, causa:'Organização inadequada' },
    { id:8, data:'2026-04-15', tipo:'Leve', descricao:'Queda em área de acesso', colaborador:'Paulo Rodrigues', setor:'Logística', afastamento:false, causa:'Piso escorregadio' },
    { id:9, data:'2026-04-25', tipo:'Leve', descricao:'Esmagamento leve do dedo', colaborador:'Roberto Santos', setor:'Logística', afastamento:false, causa:'Distração na empilhadeira' },
  ],

  mensagens: [
    { id:1, de:'Produção', para:'Manutenção', assunto:'Forno #1 com falha térmica', mensagem:'O forno contínuo #1 está com variação de temperatura acima de ±15°C. Necessário verificar urgente.', data:'2026-05-04', lida:false, prioridade:'alta' },
    { id:2, de:'Qualidade', para:'Produção', assunto:'Lote 2405-B reprovado', mensagem:'O lote 2405-B foi reprovado na análise sensorial. Produção suspensa até laudo laboratorial.', data:'2026-05-04', lida:false, prioridade:'alta' },
    { id:3, de:'Logística', para:'Produção', assunto:'Açúcar abaixo do mínimo', mensagem:'Açúcar cristal abaixo do estoque mínimo (320 kg / mín 400 kg). Solicitar reposição imediata.', data:'2026-05-03', lida:true, prioridade:'media' },
    { id:4, de:'RH', para:'Todos', assunto:'Treinamento de Segurança – 13/05', mensagem:'Na próxima terça (13/05) haverá treinamento obrigatório de EPIs. Todos os colaboradores devem participar.', data:'2026-05-02', lida:true, prioridade:'media' },
    { id:5, de:'Diretoria', para:'Todos', assunto:'Meta de produção de maio', mensagem:'A meta de maio é 15% acima de abril. Acompanhem os indicadores diariamente no sistema.', data:'2026-05-01', lida:true, prioridade:'baixa' },
  ],

  documentos: [
    { id:1, nome:'Manual BPF – Boas Práticas de Fabricação', categoria:'Qualidade', versao:'3.2', dataEmissao:'2026-01-10', dataValidade:'2027-01-10', status:'vigente', responsavel:'Qualidade' },
    { id:2, nome:'PPRA – Prevenção de Riscos Ambientais', categoria:'Segurança', versao:'2.0', dataEmissao:'2025-07-15', dataValidade:'2026-07-15', status:'vigente', responsavel:'SESMT' },
    { id:3, nome:'PCMSO – Controle Médico e Saúde Ocupacional', categoria:'Segurança', versao:'1.5', dataEmissao:'2025-07-15', dataValidade:'2026-07-15', status:'vigente', responsavel:'SESMT' },
    { id:4, nome:'Procedimento de Manutenção Preventiva', categoria:'Manutenção', versao:'2.1', dataEmissao:'2025-11-20', dataValidade:'2026-11-20', status:'vigente', responsavel:'Manutenção' },
    { id:5, nome:'Alvará de Funcionamento', categoria:'Legal', versao:'1.0', dataEmissao:'2026-01-02', dataValidade:'2026-12-31', status:'vigente', responsavel:'Administrativo' },
    { id:6, nome:'Certificado SIF – Serviço de Inspeção Federal', categoria:'Legal', versao:'1.0', dataEmissao:'2025-06-01', dataValidade:'2026-06-01', status:'vencer', responsavel:'Qualidade' },
    { id:7, nome:'ISO 22000 – Segurança Alimentar', categoria:'Qualidade', versao:'1.0', dataEmissao:'2024-03-15', dataValidade:'2025-03-15', status:'vencido', responsavel:'Qualidade' },
    { id:8, nome:'AVCB – Auto de Vistoria Corpo de Bombeiros', categoria:'Segurança', versao:'1.0', dataEmissao:'2025-09-10', dataValidade:'2026-09-10', status:'vigente', responsavel:'SESMT' },
  ],

  entregas: [
    { id:1, pedido:'PED-2025-001', cliente:'Supermercado Família', produto:'Biscoito Integral 500g', quantidade:500, dataPrevisao:'2026-05-03', status:'atrasado', transportadora:'LogiRápido' },
    { id:2, pedido:'PED-2025-002', cliente:'Padaria Central', produto:'Farinha Especial 1kg', quantidade:200, dataPrevisao:'2026-05-07', status:'producao', transportadora:'TransBrasil' },
    { id:3, pedido:'PED-2025-003', cliente:'Rede Mercearias ABC', produto:'Mix Variado', quantidade:1200, dataPrevisao:'2026-05-10', status:'separando', transportadora:'LogiRápido' },
    { id:4, pedido:'PED-2025-004', cliente:'Distribuidora Norte', produto:'Bolacha Recheada', quantidade:800, dataPrevisao:'2026-05-14', status:'aguardando', transportadora:'TransBrasil' },
    { id:5, pedido:'PED-2025-005', cliente:'Supermercado Família', produto:'Biscoito de Polvilho', quantidade:350, dataPrevisao:'2026-05-17', status:'aguardando', transportadora:'LogiRápido' },
    { id:6, pedido:'PED-2025-006', cliente:'Padaria Central', produto:'Mistura para Pão 5kg', quantidade:100, dataPrevisao:'2026-04-30', status:'entregue', transportadora:'TransBrasil' },
  ],

  energia: {
    meses: ['Nov/25','Dez/25','Jan/26','Fev/26','Mar/26','Abr/26'],
    consumo: [42800,45200,43100,41500,44600,46200],
    custo:   [21400,22600,21550,20750,22300,23100],
    meta: 40000,
    setores: [
      { nome:'Produção', percentual:45 },
      { nome:'Refrigeração', percentual:28 },
      { nome:'Utilidades', percentual:15 },
      { nome:'Administrativo', percentual:7 },
      { nome:'Iluminação', percentual:5 },
    ]
  }
};

// ===== Storage helpers =====
function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(SEED));
  } catch { return JSON.parse(JSON.stringify(SEED)); }
}
function saveDB(db) { localStorage.setItem(DB_KEY, JSON.stringify(db)); }
function resetDB() { localStorage.removeItem(DB_KEY); return JSON.parse(JSON.stringify(SEED)); }

let DB = loadDB();
function persist() { saveDB(DB); }

// ===== Generic CRUD =====
function nextId(arr) { return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1; }

function getAll(table) { return DB[table] || []; }
function getById(table, id) { return (DB[table] || []).find(x => x.id === id) || null; }
function create(table, item) { item.id = nextId(DB[table]); DB[table].push(item); persist(); return item; }
function update(table, id, changes) {
  const i = DB[table].findIndex(x => x.id === id);
  if (i < 0) return null;
  DB[table][i] = { ...DB[table][i], ...changes };
  persist(); return DB[table][i];
}
function remove(table, id) {
  const i = DB[table].findIndex(x => x.id === id);
  if (i < 0) return false;
  DB[table].splice(i, 1); persist(); return true;
}

// ===== Computed helpers =====
function estoqueAbaixoMinimo() { return DB.estoque.filter(i => i.quantidade < i.minimo); }
function equipamentosAlerta() { return DB.equipamentos.filter(e => e.status !== 'operacional'); }
function mensagensNaoLidas() { return DB.mensagens.filter(m => !m.lida); }
function documentosAlerta() {
  const hoje = new Date(); const limite = new Date(); limite.setDate(hoje.getDate() + 60);
  return DB.documentos.filter(d => {
    if (d.status === 'vencido') return true;
    if (!d.dataValidade) return false;
    return new Date(d.dataValidade) <= limite;
  });
}
function entregasAtrasadas() { return DB.entregas.filter(e => e.status === 'atrasado'); }
function colaboradoresSemEPI() {
  return DB.colaboradores.filter(c => Object.values(c.epis).some(v => !v));
}
