# Sprint 3 — App Flutter (Cliente / GERENTE)

## O que foi entregue

App móvel Flutter para o GERENTE do estande, com integração REST e atualização
assíncrona de estado via WebSocket.

### Telas

| # | Rota | Descrição |
|---|------|-----------|
| 01 | `/login` | Autenticação JWT com role guard |
| 02 | `/tables` | Mapa de mesas com atualização em tempo real |
| 03 | `/tables/:id/open-session` | Abrir atendimento + busca/cadastro de cliente |
| 04 | `/tables/:id/menu` | Cardápio com stepper e carrinho local |
| 05 | `/tables/:id/confirm` | Revisão e confirmação do pedido |
| 06 | `/tables/:id/account` | Conta ativa com status de itens em tempo real |

## Como rodar

### Pré-requisitos

- Flutter SDK 3.x
- Backend rodando em `localhost:3000`
- Gateway WebSocket rodando em `localhost:3001`
- Emulador Android ou dispositivo físico

### Passos

```bash
cd flutter/app-cliente
flutter pub get
flutter run
```

> O app usa `10.0.2.2` como host padrão — endereço do `localhost` no emulador Android.
> Para dispositivo físico, editar `lib/config.dart` com o IP da máquina na rede local.

## Atualização assíncrona de estado

Implementada via WebSocket (`socket_io_client`) conectado ao Gateway na porta 3001.

| Evento | Ouvido em | Efeito |
|--------|-----------|--------|
| `table_session_opened` | `TablesProvider` | Recarrega lista de mesas |
| `table_session_closed` | `TablesProvider` | Recarrega lista de mesas |
| `order_item_status_changed` | `OrderProvider` | Atualiza status do item na lista |
| `order_created` | `OrderProvider` | Adiciona novo pedido à lista |

Fallback manual: o ícone de sino na tela de mesas recarrega via `GET /tables`.
