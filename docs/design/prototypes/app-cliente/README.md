# Protótipo — App Cliente (Gerente)

**Persona:** gerente de vendas operando no estande durante o evento.
**Plataforma:** Flutter (mobile).
**Arquivo:** [`App Cliente.html`](./App%20Cliente.html) — abra no navegador. Mockup estático de alta fidelidade; é a referência visual 1:1 das telas.

## Fluxo (7 telas)

| № | Tela | Descrição |
|---|---|---|
| 01 | **Login** | Acesso controlado, sem cadastro (conta provisionada pela Admin). |
| 02 | **Home · Mapa de mesas** | Grade de mesas do estande. Verde = livre · bordô = ocupada · destaque = a minha. |
| 03 | **Abrir mesa · Cadastrar** | Buscar cliente existente ou criar. Campos com `*` obrigatórios. |
| 04 | **Cardápio** | Tabs por categoria · stepper de quantidade · observação por item. |
| 05 | **Confirmar pedido** | Revisão do pedido com observações destacadas. |
| 06 | **Conta ativa** | Status dos itens em tempo real · banner de "pronto". |
| 07 | **Fechar conta** | Bottom sheet com resumo + alerta de confirmação. |

## Notas de implementação

- Navegação principal: **bottom bar** (ver [`components.md` §5.1](../../design-system/components.md#51-mobile--bottom-bar-app-cliente--app-prestador)).
- Estados de mesa e de pedido seguem os tokens de status ([`colors.md` §3](../../design-system/colors.md#3-status-operacionais)).
- Mapa de mesas é a tela mais densa — respeite o alvo mínimo de toque de 44px nas células.
- Todo número operacional (mesa, horário, nº do pedido) em JetBrains Mono.
