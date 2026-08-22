# **🗺️ Roadmap de Engenharia: Alaska Local (Atualização Técnica 2026\)**

Este roadmap foi desenhado para implementar a plataforma multi-tenant de domínio único para lojistas locais, seguindo uma estratégia de evolução gradual que valida o mercado antes de investir em infraestrutura complexa.

## **🎯 Visão Geral do Sistema**

O **Alaska Local** é uma plataforma *Done-for-You* para lojistas locais (restaurantes, hamburguerias, confeitarias, barbearias, salões e clínicas) que oferece presença orgânica no Google Maps, catálogo digital com domínio próprio e pedidos diretos no WhatsApp sem comissões por transação. A plataforma opera em três estágios de evolução técnica.

## **🛠️ Estágio 1: Modo Sem Backend (0 a 5 Clientes Pagantes)**

*O objetivo aqui é validar o mercado com custo de infraestrutura zero, utilizando um front-end estático em Nuxt 3 populado por arquivos JSON locais e motor de pedidos nativo no WhatsApp.*

### **🚀 O que você vai aplicar/aprender:**

* **Nuxt 3 \+ Vue 3 \+ Tailwind CSS:** Criação de templates modulares responsivos com foco mobile-first e carregamento instantâneo.  
* **One Codebase, Infinite Domains:** Rota dinâmica pages/\[slug\].vue lendo dados locais via import.meta.glob (à prova de falhas na Vercel).  
* **Resolução Dinâmica de Domínios:** Middleware no Nuxt 3 para identificar o tenant pelo cabeçalho host.  
* **Validação Fail-Fast com Zod:** Schemas em types/tenant.ts impedindo quebras em tempo de execução.  
* **Despacho Direto via WhatsApp:** Carrinho processa itens, adicionais, taxa de entrega, endereço, troco e gera payload formatado na URL wa.me/55....  
* **OpenGraph Dinâmico (useSeoMeta):** Cards automáticos com foto e nome ao compartilhar o link no WhatsApp.  
* **CLI de Demos (scripts/new-demo.js):** Criação de novas demonstrações para leads em 3 segundos.

### **📋 Checklist de Execução do Estágio 1:**

#### **Engenharia & Código (100% Concluído):**

* \[x\] Criar o projeto Nuxt 3 com TypeScript e Tailwind CSS na raiz.  
* \[x\] Configurar a estrutura de pastas padronizada do front-end:  
  Alaska-local/  
  ├── assets/css/main.css  \# Tailwind CSS e tokens visuais  
  ├── data/                \# Arquivos JSON estáticos (hamburgueria-x, bella-italia, etc.)  
  ├── pages/  
  │   ├── index.vue        \# Hub / Showcase de Demonstrações  
  │   └── \[slug\].vue       \# Vitrine Dinâmica Mobile-First  
  ├── scripts/             \# new-demo.js (CLI de criação de demos)  
  ├── server/middleware/   \# tenant.ts (resolução de domínio e multi-tenancy)  
  ├── types/               \# tenant.ts e cart.ts (Schemas Zod e contratos)  
  ├── utils/               \# whatsapp.ts (formatador de payload wa.me)  
  ├── app.vue              \# Componente raiz (\<NuxtPage /\>)  
  ├── nuxt.config.ts       \# SSR, Tailwind e configurações de build  
  └── vercel.json          \# Deploy serverless edge

* \[x\] Implementar o middleware de resolução de tenant:  
  TypeScript  
  // server/middleware/tenant.ts  
  export default defineEventHandler((event) \=\> {  
    const host \= getRequestHost(event)  
    if (\!host.includes('alaska-websites.com.br') && \!host.includes('localhost')) {  
      event.context.tenantSlug \= getSlugByCustomDomain(host)  
    }  
  })

* \[x\] Criar templates modulares para:  
  * Hub de Links & Vitrine Mobile (pages/index.vue)  
  * Cardápio no WhatsApp (Alaska Menu em pages/\[slug\].vue)  
  * Página de Agendamento e Serviços (Alaska Hub em pages/\[slug\].vue)  
* \[x\] Implementar modal de customização de produto (opcionais obrigatórios, adicionais e observações).  
* \[x\] Implementar carrinho de compras e drawer de checkout com despacho via URL Scheme do WhatsApp.  
* \[x\] Criar 5 Demonstrações Reais em data/:  
  * hamburgueria-x.json (Burgers & Smashs)  
  * restaurante-bella-italia.json (Italiano & Pizzas)  
  * cafe-central.json (Cafeteria & Doces)  
  * barbearia-style.json (Serviços & Estética)  
  * clinica-sorriso.json (Saúde & Agendamento)  
* \[x\] Implementar CLI para criação rápida de demos (scripts/new-demo.js).  
* \[x\] Implementar useSeoMeta dinâmico para preview rico no WhatsApp.  
* \[x\] Hospedar na Vercel ou Cloudflare Pages (custo R$ 0).

#### **Negócio & Validação em Campo (Foco Atual):**

* \[x\] Homologar conta no gateway Asaas para recebimentos via Pix D+0 e assinaturas recorrentes.  
* \[x\] Estruturar precificação (Plano Anual R$ 720 com Setup Isento ou Plano Padrão R$ 350 \+ R$ 60/mês).  
* \[x\] Criar scripts de prospecção fria e playbook de contorno de objeções.  
* \[ \] **Marco de Encerramento do Estágio 1:** Fechar e faturar os primeiros **3 a 5 clientes pagantes** (R$ 2.000 a R$ 5.000 no caixa).

> **Nota:** As regras mestras para agentes automatizados estão centralizadas no arquivo .cursorrules na raiz do repositório. Antes de gerar alterações arquiteturais, agentes e assistentes automatizados devem ler os ADRs em /docs/ e respeitar o .cursorrules.

## **🧠 Estágio 2: Fundação Multi-tenant & Backend NestJS (6 a 15 Clientes Pagantes)**

*Status: 🔒 Bloqueado até a validação comercial dos primeiros 5 clientes pagantes (YAGNI / Sem Complexidade Antecipada).*  
*Aqui você entra na engenharia de software robusta com Clean Architecture, validando a escalabilidade do sistema e substituindo os arquivos JSON por banco de dados relacional.*

### **🚀 O que você vai aplicar/aprender:**

* **Clean Architecture no NestJS 11:** Divisão rigorosa de camadas (Domain, Use Cases, Infrastructure) para garantir que seu código não dependa de frameworks.  
* **PostgreSQL/Supabase com RLS:** Persistência de dados com Row-Level Security para isolamento multi-tenant seguro.  
* **Validação Estrita com Zod:** Fail-fast validation de variáveis de ambiente e dados de entrada (DTOs).  
* **Dockerização de Ambiente:** Configurar o ecossistema local com docker-compose (Redis, PostgreSQL).

### **📋 Checklist de Execução:**

* \[ \] Criar o projeto NestJS 11 com TypeScript estrito.  
* \[ \] Configurar a estrutura de pastas do backend seguindo Clean Architecture:  
  src/  
  ├── core/                        \# Camada Absolutamente Pura (POTO)  
  │   ├── domain/                  \# Regras Corporativas (Enterprise Rules)  
  │   │   ├── entities/            \# Modelos puros (Merchant, Product, Category, Order)  
  │   │   └── value-objects/       \# Objetos imutáveis (Money, Slug, PhoneNumber)  
  │   └── application/             \# Regras da Aplicação (Use Cases)  
  │       ├── use-cases/           \# Orquestração (sem @Injectable)  
  │       └── ports/               \# Interfaces/Contratos (in/out)  
  │  
  ├── infrastructure/              \# NestJS, PostgreSQL, Redis, etc.  
  │   ├── adapters/                \# Implementações concretas das Portas  
  │   │   ├── persistence/         \# PostgreSQL/Supabase com RLS  
  │   │   └── messaging/           \# BullMQ Adapter  
  │   └── framework/               \# Camada de integração de frameworks  
  │       └── nestjs/              \# Acoplamento exclusivo NestJS 11  
  │           ├── config/          \# Validação Zod  
  │           ├── http/            \# Controllers/DTOs  
  │           └── modules/         \# Configuração de Custom Providers  
  └── main.ts

* \[ \] Escrever o arquivo docker-compose.yml para subir PostgreSQL e Redis localmente.  
* \[ \] Implementar a validação estrita de variáveis de ambiente usando Zod no NestJS (ConfigModule).  
* \[ \] Implementar Custom Providers para injeção de dependência manual (useFactory \+ Symbol).  
* \[ \] Criar entidades de domínio: Merchant, Product, Category, Order.  
* \[ \] Implementar Use Cases: CreateMerchantUseCase, GetPublicMenuUseCase, UpdateMenuUseCase, CreateOrderUseCase.  
* \[ \] Configurar PostgreSQL/Supabase com Row-Level Security para isolamento multi-tenant.  
* \[ \] Criar testes unitários com Vitest para a camada de use-cases.  
* \[ \] Implementar Painel Administrativo (Nuxt Admin) para lojistas gerenciarem seus catálogos.

## **⚡ Estágio 3: Micro-SaaS Completo & Automações Avançadas (15+ Clientes Pagantes)**

*Status: 🔒 Futuro.*  
*Esta é a camada que transforma a plataforma em um produto SaaS completo com automações avançadas.*

### **🚀 O que você vai aplicar/aprender:**

* **Integração de Pagamentos:** Webhooks do Asaas / OpenPix para liquidação instantânea de Pix (\< 1.5s).  
* **Impressão Térmica:** Web Bluetooth API para impressoras térmicas (58mm/80mm) sem drivers corporativos pesados.  
* **Módulo de Agendamento:** Integração bidirecional com Google Calendar para barbearias, salões e clínicas.  
* **BullMQ \+ Redis:** Filas assíncronas para processamento de webhooks e jobs em background.

### **📋 Checklist de Execução:**

* \[ \] Instalar @nestjs/bullmq e bullmq no backend.  
* \[ \] Criar filas para processamento de webhooks de pagamento.  
* \[ \] Implementar Producer (endpoint que recebe webhook e cria job na fila).  
* \[ \] Implementar Consumer (worker que processa o job e atualiza o status do pedido).  
* \[ \] Configurar políticas de resiliência: retentativas automáticas com backoff exponencial.  
* \[ \] Integrar com Asaas / OpenPix para confirmação de pagamento em até 1,5 segundos.  
* \[ \] Implementar Web Bluetooth API para impressão térmica de cupom fiscal em ESC/POS.  
* \[ \] Criar módulo de agendamento online com sincronização com Google Calendar.  
* \[ \] Implementar dashboard administrativo avançado com métricas e relatórios.

## **🧪 Qualidade, Testes e DevOps de Produção**

*Garantir a integridade da aplicação com testes automatizados e publicar o sistema com robustez de nível enterprise.*

### **🚀 O que você vai aplicar/aprender:**

* **Testes com Vitest:** Testar a lógica de negócios e o fluxo das filas de forma rápida e moderna.  
* **Deploy Multi-Cloud:** Vercel (Front) \+ Render/Supabase (Back) \+ Redis Cloud (Database/Fila).

### **📋 Checklist de Execução:**

* \[ \] Configurar o **Vitest** no backend e criar testes unitários para a camada de use-cases.  
* \[ \] Criar um banco de dados PostgreSQL gratuito no **Supabase**.  
* \[ \] Criar uma instância Redis gratuita no **Redis Cloud**.  
* \[ \] Realizar o deploy do front-end na **Vercel** apontando para o seu repositório.  
* \[ \] Realizar o deploy do backend NestJS no **Render** (configurando as variáveis de ambiente com validação Zod).  
* \[ \] Configurar domínios customizados para clientes (CNAME no Vercel).  
* \[ \] Testar o fluxo de ponta a ponta em produção pública.  
* \[ \] **GitFlow Simplificado:** Configurar o repositório com proteção de branch. A branch main será conectada ao gatilho de deploy automático em produção (Vercel/Render). A branch develop servirá para testes de integração contínua. Todo novo código deve ser desenvolvido em sub-branches (ex: feature/tenant-resolution) e mesclado na develop via Pull Request.

## **Como inicializar o Nuxt 3 localmente (instrução)**

Para gerar o scaffold do Nuxt 3 no diretório atual (Estágio 1), rode:

Bash  
npx nuxi@latest init .

Isto criará o package.json e a estrutura básica; em seguida rode npm install.

## **Como inicializar o NestJS localmente (instrução)**

Para gerar o scaffold do NestJS no diretório atual (Estágio 2), rode:

Bash  
npx @nestjs/cli new . \--package-manager npm \--skip-install

Isto criará o package.json e a estrutura de src; em seguida rode npm install.