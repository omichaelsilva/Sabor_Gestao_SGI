# Proposta Técnica — Sabor Gestão × NovaEra Alimentos

**Versão:** 1.0  
**Data:** Maio de 2026  
**Elaborado por:** Sabor Gestão Empresa Júnior  
**Cliente:** NovaEra Alimentos

---

## 1. Contexto e Diagnóstico

A NovaEra Alimentos, indústria de médio porte com 120 colaboradores, apresenta um conjunto de problemas operacionais que comprometem sua produtividade, segurança e competitividade. A Sabor Gestão realizou o levantamento e categorizou os 15 problemas identificados em 5 eixos:

| Eixo | Problemas |
|------|-----------|
| **Gestão de Estoque** | Planilhas manuais, erros frequentes, perda de matéria-prima |
| **Manutenção** | Equipamentos parando sem aviso, sem histórico de manutenções |
| **Energia** | Alto consumo elétrico, sem indicadores de eficiência |
| **Segurança** | 9 acidentes, 2 afastamentos, EPIs não utilizados, sinalização inadequada |
| **Operacional** | Processos lentos, falta de KPIs, comunicação falha, atrasos nas entregas |

---

## 2. Proposta de Solução: NOVA360

A Sabor Gestão propõe o **NOVA360 — Sistema Integrado de Gestão Industrial**, uma plataforma digital que centraliza as operações da empresa em um único ambiente, eliminando planilhas e sistemas isolados.

### 2.1 Módulos do Sistema

#### Módulo 1: Controle de Estoque
- Cadastro de itens com estoque mínimo/máximo configurável
- Alertas automáticos de reabastecimento
- Controle de validade de insumos (eliminando perdas)
- Movimentações (entrada, saída, ajuste de inventário)
- Rastreabilidade por lote
- **Problemas resolvidos:** controle por planilhas, erros de estoque, perda de matéria-prima

#### Módulo 2: Manutenção Preditiva
- Cadastro de equipamentos com histórico de manutenção
- Agendamento preventivo com alertas de vencimento
- Calendário de manutenções (30/60/90 dias)
- Indicadores de criticidade (crítico/importante)
- Registro de ordens de serviço
- **Problemas resolvidos:** paradas não programadas, sem histórico, sem previsibilidade

#### Módulo 3: Segurança do Trabalho
- Checklist digital de EPIs por colaborador (clicável)
- Registro de acidentes e incidentes com análise de causa raiz
- Taxa de conformidade de EPIs em tempo real
- Contador de "dias sem acidente"
- Relatório por setor para identificar áreas de risco
- **Problemas resolvidos:** 9 acidentes registrados, 2 afastamentos, EPIs sem controle

#### Módulo 4: Monitoramento de Energia
- Histórico de consumo mensal em kWh e R$
- Comparativo com meta estabelecida
- Distribuição por setor (identificar gargalos)
- Plano de ação com oportunidades de economia
- Projeção de retorno para investimentos em eficiência
- **Problemas resolvidos:** alto consumo elétrico, sem indicadores

#### Módulo 5: Comunicação Interna
- Canal de mensagens entre setores (Produção, Qualidade, Manutenção etc.)
- Sistema de prioridade (Alta/Média/Baixa)
- Notificações de mensagens não lidas
- Histórico rastreável de comunicações
- **Problemas resolvidos:** comunicação falha entre setores, perda de informações

#### Módulo 6: Gestão de Documentos
- Repositório digital centralizado
- Controle de versão e validade de certificados
- Alertas para documentos prestes a vencer (60 dias)
- Categorização (Qualidade, Segurança, Legal, Manutenção)
- **Problemas resolvidos:** perda de registros documentais, documentos vencidos (ex.: ISO 22000)

#### Módulo 7: Controle de Entregas
- Acompanhamento de pedidos por status (Produção → Separando → Entregue)
- Alertas de atrasos
- Rastreamento por transportadora
- **Problemas resolvidos:** atrasos nas entregas, falta de visibilidade logística

#### Módulo 8: Dashboard de KPIs
- Visão consolidada em tempo real de todos os módulos
- Indicadores críticos em destaque
- Gráficos de tendência (energia, acidentes, estoque)
- **Problemas resolvidos:** falta de indicadores para tomada de decisão

---

## 3. Arquitetura Técnica

```
┌─────────────────────────────────────────────┐
│              NOVA360 – Frontend             │
│  HTML5 + CSS3 + JavaScript (Vanilla)        │
│  Chart.js para visualizações de dados       │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│           Camada de Dados (Client-side)     │
│  localStorage → JSON persistente no browser │
│  CRUD genérico: create/read/update/delete   │
└─────────────────────────────────────────────┘

Módulos: dashboard | estoque | manutencao | seguranca
         energia  | comunicacao | documentos | entregas
```

### Por que esta arquitetura?

- **Zero instalação:** Funciona diretamente no navegador, sem servidor
- **Dados locais:** Informações salvas automaticamente no dispositivo
- **Portabilidade:** Pode ser hospedado em qualquer servidor web ou intranet
- **Escalabilidade:** Código modular facilita migração para backend (Node.js/Python) com banco de dados relacional

### Evolução sugerida (Fase 2)

```
Frontend (React) ──► API REST (Node.js + Express)
                          │
                     PostgreSQL
                          │
              Notificações: WebSocket / E-mail
              BI: Power BI ou Metabase
              Mobile: PWA / React Native
```

---

## 4. Benefícios Esperados

| Benefício | Estimativa |
|-----------|-----------|
| Redução de perdas de matéria-prima | 30–50% |
| Redução de paradas não planejadas | 60–70% |
| Redução de acidentes de trabalho | 40–60% |
| Redução do consumo de energia | 10–20% |
| Redução de atrasos nas entregas | 50–70% |
| Eliminação de documentos vencidos | ~100% |
| Tempo de resposta na comunicação | -80% |

---

## 5. Plano de Implementação

| Fase | Prazo | Entregas |
|------|-------|----------|
| **Fase 1 – MVP** | Meses 1–2 | Sistema base (estoque + manutenção + segurança) |
| **Fase 2 – Integração** | Meses 3–4 | Energia + comunicação + documentos |
| **Fase 3 – Otimização** | Meses 5–6 | Dashboard KPI + relatórios + treinamento |
| **Fase 4 – Expansão** | Mês 7+ | Backend dedicado, mobile, integrações ERP |

---

## 6. Tecnologias Utilizadas

| Tecnologia | Finalidade |
|-----------|-----------|
| HTML5 / CSS3 | Estrutura e estilização da interface |
| JavaScript (ES6+) | Lógica de negócio e interatividade |
| Chart.js | Gráficos e visualizações de dados |
| localStorage API | Persistência de dados no cliente |
| Font Awesome 6 | Ícones e iconografia |

---

*Sabor Gestão Empresa Júnior — Consultoria em Tecnologia e Inovação*  
*Ciência da Computação / Engenharia de Software*
