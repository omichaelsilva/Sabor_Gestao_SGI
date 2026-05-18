# NOVAERA — Sistema Integrado de Gestão Industrial

<p align="center">
  <img src="Imagens/novaera-logo-01.png" alt="NovaEra Alimentos Logo" width="220"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Zero_Depend%C3%AAncias-00C853?style=for-the-badge"/>
</p>

> Plataforma web de gestão operacional integrada desenvolvida para a **NovaEra Alimentos** em parceria com a **Mind7 Empresa Júnior**, consolidando 8 módulos funcionais em uma única interface. Execução direta no navegador, sem necessidade de servidor ou instalação.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Módulos do Sistema](#módulos-do-sistema)
- [Arquitetura](#arquitetura)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Executar](#como-executar)
- [Roadmap de Evolução](#roadmap-de-evolução)
- [Proposta Técnica](#proposta-técnica)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## Visão Geral

O **NOVA360** é um sistema de gestão industrial desenvolvido como solução estratégica para a NovaEra Alimentos, empresa do setor alimentício com aproximadamente 120 colaboradores. O sistema nasce da necessidade de substituir planilhas manuais e sistemas isolados por uma plataforma centralizada, acessível e de rápida implantação.

### Problema identificado

A empresa operava com 5 eixos críticos de ineficiência operacional:

1. **Estoque**: Perdas por vencimento, falta de rastreabilidade e ausência de alertas
2. **Manutenção**: Equipamentos sem histórico, manutenções corretivas reativas e custosas
3. **Segurança**: Controle manual de EPIs, ausência de métricas de conformidade
4. **Energia**: Consumo sem monitoramento, desperdício invisível
5. **Operações**: Comunicação departamental fragmentada, documentos desatualizados e entregas sem rastreabilidade

### Solução proposta

O NOVA360 endereça cada eixo com um módulo dedicado, proporcionando visibilidade centralizada e alertas inteligentes em tempo real.

---

## Módulos do Sistema

### 1. Dashboard — Central de KPIs

Visão executiva consolidada com indicadores em tempo real de todos os módulos:

- Total de itens em estoque e alertas de estoque mínimo
- Status de equipamentos (operacional / atenção / crítico)
- Índice de conformidade de EPIs
- Consumo energético do mês vs. meta
- Pedidos com entrega atrasada
- Mensagens não lidas e documentos próximos ao vencimento

Cada card é clicável e redireciona ao módulo correspondente com o filtro aplicado.

---

### 2. Estoque — Gestão de Inventário

| Funcionalidade | Descrição |
|---|---|
| Cadastro de itens | Nome, categoria, quantidade, mín/máx, validade |
| Alertas automáticos | Estoque abaixo do mínimo e itens a vencer em 30 dias |
| Filtros dinâmicos | Por categoria, status (normal / crítico / a vencer) |
| Busca em tempo real | Por nome ou código do item |
| Valor total do inventário | Cálculo automático pelo valor unitário |

---

### 3. Manutenção — Gestão Preditiva

| Funcionalidade | Descrição |
|---|---|
| Cadastro de equipamentos | Identificação, criticidade, intervalo de manutenção |
| Histórico de manutenções | Registro de todas as intervenções por equipamento |
| Alertas de vencimento | Manutenções atrasadas ou próximas ao prazo |
| Ordens de serviço | Registro e acompanhamento de intervenções |
| Criticidade | Indicadores visuais (crítico / importante / padrão) |

---

### 4. Segurança — Saúde Ocupacional

| Funcionalidade | Descrição |
|---|---|
| Checklist digital de EPIs | 6 itens por colaborador (capacete, luvas, óculos, protetor auricular, bota, avental) |
| Ranking de conformidade | Score por colaborador (70 pts EPI + 30 pts histórico de acidentes) |
| Registro de acidentes | Causa, gravidade, setor e data de ocorrência |
| Contador de dias sem acidente | Atualizado automaticamente |
| Meta de conformidade | Indicador visual com meta de 80%+ |
| Análise de risco por setor | Distribuição de incidentes por área fabril |

---

### 5. Energia — Monitoramento de Consumo

| Funcionalidade | Descrição |
|---|---|
| Histórico de consumo | 6 meses de kWh e custo (R$) |
| Meta mensal | Comparação com meta de 40.000 kWh |
| Distribuição por setor | Produção, Refrigeração, Utilidades, Administrativo, Iluminação |
| Projeções | Tendência de consumo e plano de eficiência |
| Visualização gráfica | Chart.js com linha de consumo e meta |

---

### 6. Comunicação — Mensageria Interna

| Funcionalidade | Descrição |
|---|---|
| Mensagens interdepartamentais | Envio entre setores com prioridade (alta / média / baixa) |
| Controle de leitura | Status lida / não lida com badge no menu |
| Histórico pesquisável | Busca por remetente, destinatário ou conteúdo |
| Roteamento departamental | Vinculação de mensagens a setores específicos |

---

### 7. Documentos — Repositório Digital

| Funcionalidade | Descrição |
|---|---|
| Repositório centralizado | Certificados, normas, laudos, documentos de conformidade |
| Controle de versão | Versionamento e data de atualização |
| Alertas de vencimento | Documentos a expirar em 60 dias destacados automaticamente |
| Categorização | Qualidade, Segurança, Jurídico, Manutenção |
| Status visual | Vigente / A vencer / Expirado |

---

### 8. Entregas — Rastreamento Logístico

| Funcionalidade | Descrição |
|---|---|
| Pipeline de status | Aguardando → Produção → Separação → Entregue |
| Alertas de atraso | Pedidos com data prevista ultrapassada |
| Rastreamento de transportadora | LogiRápido, TransBrasil |
| Associação com cliente | Produto, quantidade e dados do pedido |
| Projeção vs. entrega real | Comparação entre datas prevista e realizada |

---

## Arquitetura

O NOVA360 segue o padrão **SPA (Single-Page Application)** com arquitetura modular em JavaScript puro:

```
┌─────────────────────────────────────────────────────────────────┐
│                        index.html                               │
│          Estrutura HTML + Sidebar + Topbar + Modal              │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                         app.js (Core)                           │
│   Roteamento de módulos · Modal · Toast · Tema · Navegação      │
└──────┬────────────────────────────────────────┬─────────────────┘
       │                                        │
┌──────▼──────────────┐              ┌──────────▼──────────────┐
│      data.js        │              │    modules/*.js          │
│  Camada de Dados    │              │  dashboard · estoque     │
│  CRUD genérico      │◄────────────►│  manutencao · seguranca  │
│  localStorage API   │              │  energia · comunicacao   │
│  Alertas calculados │              │  documentos · entregas   │
└─────────────────────┘              └─────────────────────────┘
```

### Padrões de Design

- **Módulos isolados**: Cada funcionalidade em arquivo JS independente
- **Camada de dados unificada**: `data.js` centraliza todo acesso ao `localStorage`
- **CRUD genérico**: Funções `create()`, `read()`, `update()`, `delete()` reutilizáveis
- **Alertas calculados**: Lógica de alertas derivada dos dados — sem estado adicional
- **Temas**: CSS custom properties para alternância light/dark sem reload

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|---|---|---|
| HTML5 | — | Estrutura semântica da SPA |
| CSS3 + Custom Properties | — | Design system com suporte a tema claro/escuro |
| JavaScript ES6+ | — | Lógica de aplicação e módulos |
| Chart.js | 4.4.0 | Visualização de dados energéticos |
| Font Awesome | 6.5.0 | Ícones de interface |
| localStorage API | — | Persistência de dados no cliente |

> **Zero dependências de servidor**: nenhum Node.js, Python, banco de dados ou build step necessário.

---

## Estrutura do Projeto

```
Projeto/
├── index.html                      # Ponto de entrada da SPA
├── README.md                       # Documentação do projeto
├── docs/
│   └── proposta_tecnica.md         # Proposta técnica completa
├── assets/
│   ├── css/
│   │   └── style.css               # Design system (variáveis, layout, componentes)
│   └── js/
│       ├── app.js                  # Core: roteamento, modal, toast, tema
│       ├── data.js                 # Camada de dados: CRUD + seed + alertas
│       └── modules/
│           ├── dashboard.js        # Módulo: KPI central
│           ├── estoque.js          # Módulo: gestão de inventário
│           ├── manutencao.js       # Módulo: manutenção preditiva
│           ├── seguranca.js        # Módulo: saúde e segurança ocupacional
│           ├── energia.js          # Módulo: monitoramento energético
│           ├── comunicacao.js      # Módulo: mensageria interna
│           ├── documentos.js       # Módulo: repositório de documentos
│           └── entregas.js         # Módulo: rastreamento logístico
└── Imagens/
    └── novaera-logo-01.png         # Logotipo da NovaEra Alimentos
```

---

## Como Executar

### Opção 1 — Abertura direta (recomendado)

```
1. Faça o download ou clone o repositório
2. Navegue até a pasta do projeto
3. Clique duas vezes no arquivo index.html
4. O sistema abrirá no seu navegador padrão
```

### Opção 2 — Servidor local (opcional)

```bash
# Com Python
python -m http.server 8080

# Com Node.js
npx serve .

# Acesse em: http://localhost:8080
```

> **Nota**: Abrir via servidor local elimina eventuais restrições de CORS em navegadores mais restritivos.

### Dados de exemplo

O sistema é inicializado automaticamente com dados de seed realistas:

- **10 itens de estoque** com variações de nível
- **8 equipamentos** com histórico de manutenção
- **8 colaboradores** com checklist de EPI
- **9 registros de acidentes/incidentes**
- **6 meses de consumo energético**
- **5 mensagens interdepartamentais**
- **8 documentos** com diferentes status de validade
- **6 pedidos de entrega** em variados estágios

### Resetar dados

Para voltar ao estado inicial, execute no console do navegador (F12):

```js
localStorage.clear(); location.reload();
```

---

## Roadmap de Evolução

O NOVA360 foi projetado com evolução faseada:

### Fase 1 — MVP (Meses 1–2) ✅ Concluída
- Módulos: Estoque, Manutenção, Segurança
- Interface responsiva com tema claro/escuro
- Persistência via localStorage

### Fase 2 — Expansão (Meses 3–4) ✅ Concluída
- Módulos: Energia, Comunicação, Documentos, Entregas
- Dashboard KPI centralizado

### Fase 3 — Consolidação (Meses 5–6)
- Relatórios exportáveis (PDF/Excel)
- Treinamento de usuários
- Ajustes baseados em feedback

### Fase 4 — Escalabilidade (Mês 7+)
- Migração para backend Node.js + PostgreSQL
- Aplicativo mobile (PWA / React Native)
- Integrações com ERP e ferramentas de BI (Power BI / Metabase)
- Autenticação multi-usuário com perfis de acesso

---

## Proposta Técnica

A documentação técnica completa do projeto, incluindo análise de problemas, justificativa de arquitetura, benefícios esperados e roadmap detalhado, está disponível em:

📄 [`docs/proposta_tecnica.md`](docs/proposta_tecnica.md)

**Resultados esperados após implantação completa:**

| Indicador | Melhoria Esperada |
|---|---|
| Perdas de materiais | Redução de 30–50% |
| Downtime não planejado | Redução de 60–70% |
| Acidentes de trabalho | Redução de 40–60% |
| Conformidade documental | +90% de documentos vigentes |

---

## Contribuição

Contribuições são bem-vindas. Para contribuir:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/novo-modulo`)
3. Commit suas alterações (`git commit -m 'feat: adiciona módulo de relatórios'`)
4. Faça push para a branch (`git push origin feature/novo-modulo`)
5. Abra um Pull Request

---

## Licença

Este projeto foi desenvolvido como proposta técnica pela **Sabor Gestão Empresa Júnior** para a **NovaEra Alimentos**. Todos os direitos reservados.

---

<p align="center">
  NOVA360 · Sabor Gestão × NovaEra Alimentos · Desenvolvido com JavaScript puro
</p>
