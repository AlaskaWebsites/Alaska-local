# Roadmap Arquitetural e Estratégico — Alaska Local

Este documento define a evolução técnica e arquitetural do ecossistema **Alaska Local** (dividido em **Alaska Menu** para alimentação/delivery e **Alaska Hub** para serviços/saúde/beleza), estruturado em 3 estágios bem delimitados para maximizar velocidade de validação, conversão comercial e solidez de engenharia.

---

## 🎯 Visão Geral dos Três Estágios

```
┌───────────────────────────────────────────────┐
│ ESTÁGIO 1: MVP Nuxt 3 Estático (CONCLUÍDO)    │
│ • One Codebase, Infinite Domains              │
│ • Validação Zod Fail-Fast & Temas Dinâmicos  │
│ • Modais Modulares, Composables & A11y W3C    │
│ • 13 Suítes Vitest (61+ testes 100% OK)       │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│ ESTÁGIO 2: NestJS + Supabase/PostgreSQL       │
│ • Clean Architecture (Ports & Adapters)       │
│ • Supabase Multi-tenant com RLS               │
│ • Validação Zod Fail-Fast via ConfigModule    │
│ • BullMQ + Redis para filas assíncronas       │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│ ESTÁGIO 3: Micro-SaaS & Operações Avançadas   │
│ • Painel Administrativo de Lojistas           │
│ • Gateway de Pagamento Asaas (Pix D+0)        │
│ • Impressão Térmica ESC/POS (Bluetooth / USB) │
│ • App PWA com Service Worker offline          │
└───────────────────────────────────────────────┘
```

---

## 🟢 ESTÁGIO 1: MVP Nuxt 3 Estático (Validação Rápida & Vitrines) — [CONCLUÍDO]

### Objetivos do Estágio 1
* Criar uma vitrine digital mobile-first ultrarrápida, simulando a experiência do iFood para restaurantes e páginas de alta conversão para serviços.
* Validar a estratégia comercial de vendas *Done-for-You* (R$ 720/ano ou R$ 350 + R$ 60/mês) antes de investir em infraestrutura pesada de backend.

### 🛠️ Entregas Realizadas e Consolidadas
- [x] **Arquitetura Multi-Tenant Frontend (One Codebase, Infinite Domains)**:
  - Resolução dinâmica de estabelecimentos via subdomínios, domínios próprios e rota slug (`/hamburgueria-x`, `/barbearia-style`, `/clinica-sorriso`, `/adega-prime`, etc.).
  - Middleware de servidor `server/middleware/tenant.ts` mapeando hosts para slugs.
- [x] **Blindagem com Schemas Zod (`types/tenant.ts` e `types/cart.ts`)**:
  - `TenantSchema`, `CategorySchema`, `ProductSchema`, `OptionGroupSchema`, `StoreReviewsSchema`, `TenantThemeSchema`.
  - Validação fail-fast na leitura de arquivos JSON locais via `import.meta.glob`.
- [x] **Sistema Dinâmico de Temas por Segmento (`composables/useTenantTheme.ts`)**:
  - 🍔 `food`: Vermelho clássico iFood (`red-600`).
  - ✂️ `barber`: Âmbar Dourado Vintage (`amber-500`) com botões escuros contrastantes.
  - 🦷 `health`: Teal Médico / Verde-Água (`teal-600`) para consultórios e clínicas.
  - 🍷 `drinks`: Roxo / Violeta Neon (`purple-600`) para adegas e conveniência 24h.
  - Tokens dinâmicos de texto, botões, badges, bordas, anéis de foco (`focusRing`) e seleção.
- [x] **Desacoplamento e Modularização de Componentes**:
  - `components/CategoryTabs.vue`: Navegação semântica em abas horizontais (`role="tablist"`).
  - `components/ProductCustomizerModal.vue`: Modal de adicionais, regras de min/max, cálculo de preço em tempo real.
  - `components/CartDrawerModal.vue`: Drawer de checkout desacoplado, validação de campos (delivery vs retirada) e despacho formatado para `wa.me`.
  - `components/StoreReviewsModal.vue`: Modal de prova social estilo iFood com 5 níveis de serviço, notas e comentários reais.
  - `components/StoreInfoModal.vue`: Modal com horários de funcionamento, formas de pagamento e rotas no Google Maps.
- [x] **Camada de Composables & Utilitários**:
  - `composables/useTenant.ts`: Carregamento seguro em SSR e tratamento de 404.
  - `composables/useOpeningHours.ts`: Cálculo de loja aberta/fechada suportando viradas de meia-noite (ex: 18h às 03h).
  - `composables/useShare.ts`: Compartilhamento nativo via Web Share API com fallback para cópia na área de transferência.
  - `composables/useBodyScrollLock.ts`: Trava de rolagem de body SSR-safe com guard `getCurrentInstance()`.
  - `utils/formatters.ts`: Formatação de moedas (`formatCurrency`) e telefones (`formatPhone`).
- [x] **Acessibilidade W3C / WCAG (Hardness & Compliance)**:
  - Suporte completo a leitores de tela com `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-expanded` e `aria-pressed`.
  - Foco automático com `nameInputRef` e fechamento universal na tecla `Escape` (`ESC`).
- [x] **Suíte de Testes Automatizados no Vitest**:
  - 13 arquivos de testes cobrindo schemas, temas, middleware de domínios, modais, horários e geração de WhatsApp, com 100% de sucesso.

---

## 🟡 ESTÁGIO 2: NestJS Backend + Supabase/PostgreSQL com RLS — [EM ANDAMENTO]

### Objetivos do Estágio 2
* Substituir os arquivos JSON estáticos por um banco de dados relacional robusto com isolamento de dados por tenant via Row Level Security (RLS).
* Criar uma API NestJS escalável seguindo Clean Architecture estrita (Ports & Adapters).

### 🛠️ Entregas Planejadas
- [ ] **Configuração do Supabase / PostgreSQL**:
  - Tabela `tenants` (`id`, `slug`, `name`, `theme`, `domain`, `phone`, `settings`).
  - Tabelas `categories`, `products`, `option_groups`, `options`, `reviews`.
  - Habilitar RLS (*Row Level Security*) onde cada consulta filtra obrigatoriamente por `tenant_id`.
- [ ] **Estrutura NestJS com Clean Architecture**:
  - Separação em camadas: `Domain` (Entidades e Regras Puras), `Application` (UseCases e Ports), `Infrastructure` (Prisma/TypeORM/Supabase, Controllers, Repositories).
  - Inversão de dependência utilizando `Symbol` e `useFactory` nos módulos do NestJS.
  - Validação Zod Fail-Fast na inicialização do servidor via `ConfigModule.forRoot({ validate: ... })`.
- [ ] **Filas Assíncronas com BullMQ & Redis**:
  - Configuração do Redis com política `noeviction` e persistência `AOF (Append Only File)`.
  - Fila de notificações para disparo de WhatsApp e e-mails de confirmação.

---

## 🔴 ESTÁGIO 3: Micro-SaaS, Asaas Pix D+0 & Automações — [FUTURO]

### Objetivos do Estágio 3
* Transformar o Alaska Local em uma plataforma de autoatendimento para lojistas com pagamentos automatizados via Pix instantâneo (D+0) e impressão de pedidos na cozinha/balcão.

### 🛠️ Entregas Planejadas
- [ ] **Integração com Gateway Asaas**:
  - Criação de cobranças e QR Code Pix dinâmico com liquidação D+0.
  - Webhooks com validação de assinatura criptográfica para confirmação de pagamento em tempo real.
- [ ] **Impressão Térmica Direta (ESC/POS)**:
  - Comunicação via Web Bluetooth e WebUSB com impressoras térmicas de 58mm e 80mm para comandas de cozinha.
- [ ] **Painel Administrativo do Lojista (Alaska Admin)**:
  - Gerenciamento de cardápio, estoque, adicionais e relatórios de vendas.
  - Ativação e pausa de produtos em tempo real via WebSockets / Supabase Realtime.

---

## 📊 Matriz de Rastreabilidade

| Funcionalidade | Estágio 1 (Atual) | Estágio 2 (Próximo) | Estágio 3 (Final) |
| :--- | :--- | :--- | :--- |
| **Armazenamento de Dados** | JSON em `data/*.json` | Supabase / PostgreSQL RLS | PostgreSQL + Cache Redis |
| **Resolução de Tenant** | Middleware Nuxt local | API NestJS + Headers/Domain | Cache Edge Cloudflare + Redis |
| **Carrinho e Pedidos** | WhatsApp URL Scheme | Persistência em Banco + WhatsApp | Webhooks + Impressão ESC/POS |
| **Pagamentos** | Na entrega / Pix manual | Pix Copia e Cola estático | Asaas Pix D+0 com Webhook |
| **Painel de Controle** | Edição de JSON via CLI | API REST autenticada | Dashboard SaaS Completo |
