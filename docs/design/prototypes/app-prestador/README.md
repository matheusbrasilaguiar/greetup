# Protótipo — App Prestador (Operador)

**Persona:** operador de cozinha e garçom no evento.
**Plataforma:** Flutter (mobile + display compartilhado).
**Arquivo:** [`App Prestador.html`](./App%20Prestador.html) — abra no navegador. Mockup estático de alta fidelidade.

## Fluxo (6 telas)

| № | Tela | Descrição |
|---|---|---|
| 01 | **Login** | Acesso por e-mail operacional. |
| 02 | **Início de turno** | Função pré-designada (cozinha ou garçom) — sem escolha do usuário. |
| 03 | **Garçom · Itens prontos** | Lista agrupada por mesa, checkbox por item entregue. |
| 04 | **Notificação push** | Notificação de sistema — compacta, com vibração + som. |
| 05 | **Cozinha · Kanban operacional** | 4 colunas: pendente → preparo → pronto → entregue. |
| 06 | **Garçom · Display compartilhado** | 3 colunas: pronto → em rota → entregue. Tela de parede/tablet. |

## Notas de implementação

- **Dois modos** dentro do mesmo app, definidos pela função do turno (tela 02). Não exponha troca de papel ao usuário.
- O Kanban (05) e o Display (06) são **densos e ao vivo** — atualizam em tempo real. Use os badges de status como linguagem única de estado.
- A notificação (04) é do SO, não um componente in-app: defina título + corpo curtos, em tom sereno ("Novo pedido · Mesa 12").
- Display compartilhado (06) é visto a distância: aumente a escala tipográfica acima da escala de produto padrão, mantendo as cores de status.
