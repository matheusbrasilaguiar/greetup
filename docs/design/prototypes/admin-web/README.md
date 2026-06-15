# Protótipo — Admin Web

**Persona:** administração / back-office (organização do evento e configuração).
**Plataforma:** React + Next.js (web, largura base 1280px).
**Arquivo:** [`Admin Web.html`](./Admin%20Web.html) — abra no navegador. Mockup estático de alta fidelidade.

## Telas (12)

Agrupadas por área, como na sidebar.

### Evento ao vivo
| Tela | Descrição |
|---|---|
| **Painel operacional** | Visão de tempo real do estande · atualização contínua. |
| **Mapa de mesas** | 12 mesas · estado ao vivo · clique abre detalhe. |
| **Pedidos** | Gestão de pedidos do evento · filtrar, reatribuir estação, cancelar. |

### Configuração
| Tela | Descrição |
|---|---|
| **Produtos** | Catálogo de itens · ativar/editar para o evento ou criar cardápio. |
| **Clientes** | Base de clientes cadastrada pelos gerentes · detalhe + histórico. |
| **Mesas do estande** | Capacidade, estação atribuída e posição no layout. |
| **Usuários do sistema** | Equipe · gerentes, cozinha, garçons, admin · convites. |

### Relatórios
| Tela | Descrição |
|---|---|
| **Consumo de bebidas** | Base para pagamento ao fornecedor e reposição. |
| **Clientes atendidos** | Lista completa de clientes recebidos no estande. |
| **Gerentes (performance)** | Desempenho dos gerentes de vendas · bônus e dimensionamento. |
| **Resumo do evento** | Resultado consolidado · exportável para apresentação. |

## Notas de implementação

- Navegação principal: **sidebar** bordô profundo com grupos rotulados (ver [`components.md` §5.2](../../design-system/components.md#52-web--sidebar-admin)).
- Telas de relatório são orientadas a **tabela densa** — use `body-sm` (13px) e cabeçalho de tabela em mono uppercase.
- Cabeçalho de tela = eyebrow (mono, contexto) + `h1` (título) + sub (`body`, `ink/700`).
- Cartões de estatística (`stat`): label mono · valor Sora 600 grande · delta em `bordeaux/700`.
- Largura de design 1280px; construir responsivo a partir daí, colapsando a sidebar abaixo de ~980px.
