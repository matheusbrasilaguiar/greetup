# Documentação de Projeto para o sistema Greetup

## Plataforma SaaS de Gestão de Hospitalidade Corporativa para Eventos

**Versão 1.0**

Projeto de sistema elaborado pelo aluno Matheus Brasil Aguiar e apresentado ao curso de Engenharia de Software da PUC Minas como parte do Projeto Integrador da disciplina de Laboratório de Desenvolvimento de Aplicações Móveis e Distribuídas, sob orientação dos professores Cleiton Silva Tavares e Cristiano de Macedo Neto. Período: 5º — Noite. 1º Semestre 2026.

11/05/2026

---

## 1. Introdução

O Greetup é uma plataforma SaaS de gestão de hospitalidade corporativa para empresas que participam de feiras e eventos de negócios. Nesses contextos, empresas mantêm estandes onde recebem clientes e parceiros estratégicos, oferecendo serviços de alimentação e bebidas como parte de uma experiência de relacionamento B2B. O sistema digitaliza o fluxo operacional do estande: abertura de mesas, cadastro de visitantes, realização de pedidos e roteamento automático das demandas para as equipes de preparo e entrega, com registro de consumo para controle e fechamento com fornecedores terceirizados.

A adoção de uma arquitetura orientada a eventos (EDA) com middleware de mensageria justifica-se pela natureza assíncrona das interações: múltiplos operadores precisam ser notificados simultaneamente sem acoplamento direto, e o estado dos pedidos deve ser preservado de forma consistente mesmo sob instabilidade de rede, cenário comum em centros de convenções e feiras de grande porte.

---

## 2. Modelos de Usuário e Requisitos

### 2.1 Descrição de Atores

O **Gerente de Evento** é o profissional da empresa anfitriã responsável por conduzir o atendimento aos visitantes no estande. Por meio do aplicativo móvel, cadastra clientes visitantes, abre e gerencia mesas, seleciona itens do cardápio e submete pedidos. Acompanha o status de cada pedido em tempo real, recebendo notificações assíncronas quando os itens estão prontos, e ao encerrar o atendimento fecha a conta e libera a mesa para o próximo ciclo.

O **Operador de Serviço** é composto por dois sub-perfis que operam pelo mesmo aplicativo móvel: a Cozinha, que recebe notificações assíncronas de novos pedidos via MOM e gerencia o ciclo de status de cada item (Pendente → Em Preparo → Pronto); e o Garçom, que visualiza os itens prontos com suas mesas de destino e confirma a entrega ao cliente. Ambos são notificados de novas demandas de forma assíncrona, sem atualização manual da tela.

### 2.2 Modelos de Usuários

As personas a seguir foram construídas com base na análise do domínio e no levantamento de necessidades operacionais do sistema.

| | |
|---|---|
| **Danilo Eduardo de Aguiar - Gerente Comercial (Cliente)** | |
| Descrição | Danilo possui 59 anos e atua como Gerente Comercial em uma empresa do setor de alimentos há 6 anos. Participa de 3 a 5 feiras por ano, sendo responsável por recepcionar clientes estratégicos no estande. Atualmente gerencia os pedidos anotando em papel e repassando verbalmente à equipe de apoio. |
| Dores | Pedidos perdidos ou esquecidos durante atendimentos simultâneos. Impossibilidade de saber se o pedido chegou à cozinha ou quando estará pronto sem interromper a conversa com o cliente. |
| Objetivos | Realizar pedidos rapidamente pelo celular sem perder o fio da conversa comercial. Acompanhar o status em tempo real e ser notificado quando os itens estiverem prontos. |

| | |
|---|---|
| **Carla Moreira - Operadora de Cozinha (Prestadora)** | |
| Descrição | Carla possui 28 anos e trabalha como operadora de cozinha em eventos corporativos há 4 anos. Atua no preparo e entrega de alimentos e bebidas em estandes de feiras. Recebe atualmente os pedidos de forma verbal ou por papel, o que frequentemente gera confusão entre as equipes de comida e bebida. |
| Dores | Pedidos chegando à equipe errada. Dificuldade em priorizar itens quando vários pedidos chegam simultaneamente. Falta de registro do que foi solicitado e do que já foi entregue. |
| Objetivos | — |

### 2.3 Funcionalidades Principais

O sistema é estruturado nos módulos funcionais descritos a seguir:

| Módulo | Descrição | Perfil |
|---|---|---|
| Autenticação e RBAC | Login com controle de acesso por perfil; cada ator acessa somente as operações e interfaces do seu role. | Todos |
| Gestão de Produtos | Cadastro do cardápio com categorização em COMIDA ou BEBIDA; produtos inativos não aparecem no fluxo de pedidos. | Admin |
| Gestão de Mesas | Abertura, ocupação e liberação de mesas; status propagado em tempo real via WebSocket para todos os usuários. | Gerente |
| Gestão de Clientes | Cadastro de visitantes com dados de contato e empresa; base para follow-up comercial pós-evento. | Gerente |
| Realização de Pedidos | Seleção de itens com observações; roteamento automático, COMIDA para cozinha de comida, BEBIDA para cozinha de bebida. | Gerente |
| Painel da Cozinha | Recebimento assíncrono de pedidos via MOM; ciclo de status por item (Pendente → Em Preparo → Pronto); alertas visuais e sonoros. | Operador |
| Painel do Garçom | Visualização de itens prontos com mesa de destino; confirmação de entrega em um único toque. | Operador |
| Relatórios e Dashboard | Dashboard operacional em tempo real; relatórios de consumo por produto, clientes atendidos e produção por gerente; exportação em CSV. | Admin |