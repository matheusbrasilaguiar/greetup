# Relatório de Integração MOM — Sprint 2

## 1. Ferramenta Escolhida: Redis Pub/Sub

O Redis foi escolhido como middleware orientado a mensagens (MOM) por três razões objetivas:

- **Já estava no projeto:** o `docker-compose.yml` do Greetup já incluía o serviço Redis, utilizado originalmente para cache. Nenhuma infraestrutura adicional foi necessária.
- **Latência baixa:** Redis opera em memória, adequado para eventos que precisam de propagação rápida (atualização de status de itens no kitchen display).
- **Integração simples com Node.js:** a biblioteca `ioredis` oferece suporte nativo a Pub/Sub com API Promise-based, sem boilerplate excessivo.

A alternativa considerada foi RabbitMQ (AMQP), mas seu overhead de configuração e a ausência do serviço no compose existente tornaram Redis a escolha mais pragmática para o escopo da Sprint 2.

---

## 2. Padrão Utilizado: Publish/Subscribe com Tópicos de Domínio

Os tópicos seguem a convenção `<agregado>:<evento>`:

| Tópico | Semântica |
|--------|-----------|
| `order:created` | Um novo pedido foi aberto |
| `order.item:status_changed` | Um item avançou no ciclo de preparo |
| `order:closed` | Um pedido foi encerrado |

Essa nomenclatura é agnóstica à tecnologia — os mesmos nomes poderiam ser usados com Kafka ou RabbitMQ sem alteração no domínio.

---

## 3. Arquitetura de Conexões

O Redis **não permite** que uma mesma conexão realize operações de publicação e assinatura simultaneamente. Por isso, o sistema utiliza **duas conexões independentes**:

```
[Use Case] → RedisEventPublisher (conexão PUBLISHER)
                      ↓ redis.publish(tópico, payload)
                   Redis
                      ↓ mensagem recebida
             EventSubscriber (conexão SUBSCRIBER)
                      ↓ console.log / (Sprint 3: WebSocket)
```

- `RedisEventPublisher` — singleton, exportado pelo container DI, injetado nos use cases via porta `EventPublisherPort`.
- `EventSubscriber` — inicializado no boot (`server.js`), mantém conexão dedicada, processa mensagens de forma assíncrona.

---

## 4. Substituição do NullEventPublisher

Durante o desenvolvimento dos módulos Order (PR3), foi utilizado o `NullEventPublisher` — uma implementação no-op da porta `EventPublisherPort`. Isso permitiu implementar e testar os use cases sem depender do Redis estar disponível.

Na Sprint 2 (PR5), o `container.js` foi atualizado para injetar o `RedisEventPublisher` no lugar do stub. A troca foi feita em **uma única linha**, sem modificar nenhum use case — evidência do correto isolamento por porta (Clean Architecture).

---

## 5. Desafio Principal

O principal desafio técnico foi a restrição do Redis que impede pub e sub na mesma conexão. A tentativa inicial de reutilizar a conexão do publisher no subscriber resultou em erro silencioso (mensagens não recebidas). A solução foi instanciar uma segunda conexão `ioredis` exclusiva para o subscriber, conforme documentado na biblioteca.

---

## 6. Demonstração de Assincronicidade

O fluxo abaixo comprova a assincronicidade real:

1. `POST /orders` → `createOrder` use case executa, persiste no banco, chama `eventPublisher.publish("order:created", payload)` e **retorna a resposta HTTP imediatamente**.
2. O Redis recebe a mensagem e a entrega ao `EventSubscriber` em background.
3. O subscriber loga no console **sem nenhuma chamada REST direta** entre publicador e consumidor.

O cliente REST recebe `201 Created` antes mesmo de o subscriber processar a mensagem — esse é o comportamento assíncrono esperado.

---

## 7. Próximos Passos (Sprint 3)

Na Sprint 3, o `EventSubscriber` será estendido para despachar as mensagens recebidas ao **WebSocket Gateway**, que notificará os aplicativos Flutter em tempo real:

- Cozinha (OPERADOR): recebe `order:created` → novo pedido aparece na tela
- Garçom (OPERADOR): recebe `order.item:status_changed` com `status: PRONTO` → alerta para entregar
- Gerente (GERENTE): recebe `order:closed` → dashboard atualizado
