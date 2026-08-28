# Roadmap Arquitetural & Evolução Técnica — Ecossistema Alaska Local

> **Status:** Estágio 1 (Frontend & Backend Core) — 100% Concluído & Validado  
> **Versão:** 1.0.0 (Gold Release Estágio 1)  
> **Data de Fechamento:** 2026-08-28  

---

## 🗺️ Visão Geral dos Estágios de Maturidade

```
┌───────────────────────────────────────────────────────────────────┐
│ ✅ ESTÁGIO 1: Validação, Tração Inicial & MVP Pronto (CONCLUÍDO)   │
│ • Frontend Nuxt 3 (SSR + Nitro + Tailwind CSS + Lucide Icons)     │
│ • One Codebase, Infinite Domains (Wildcard & Custom Domains)      │
│ • 4 Verticais Canônicas: Alaska Menu, Shop, Hub e Pro             │
│ • Busca em Tempo Real Client-Side com Normalização Unicode NFD    │
│ • Autopreenchimento de Endereço via CEP (ViaCEP)                  │
│ • Sacola Persistente por Tenant com LocalStorage Namespacing       │
│ • Módulo de Agendamento de Serviços & Venda Híbrida               │
│ • Pagamentos Pix BR Code EMV, CRC-16, Modo Teste R$ 0,01 & Sinal  │
│ • Resiliência de Imagens com Fallbacks SVG Dinâmicos por Tema     │
│ • Acessibilidade Total W3C/WCAG 2.1 AA (BodyScrollLock, ESC)      │
│ • Backend Core NestJS 11 + Clean Architecture + Zod + Vitest      │
│ • 100% de Cobertura de Testes Unitários no Vitest                 │
└─────────────────────────────────┬─────────────────────────────────┘
                                  │
                                  ▼
┌───────────────────────────────────────────────────────────────────┐
│ 🚀 ESTÁGIO 2: Painel do Lojista, Supabase RLS & Automação         │
│ • Integração PostgreSQL / Supabase com Row-Level Security (RLS)   │
│ • Painel Administrativo Nuxt Admin para Lojistas (Pausar itens)   │
│ • Autenticação JWT e RBAC por Tenant                              │
│ • Webhooks Asaas (Pix D+0) e Filas Assíncronas com BullMQ/Redis   │
└─────────────────────────────────┬─────────────────────────────────┘
                                  │
                                  ▼
┌───────────────────────────────────────────────────────────────────┐
│ 🌐 ESTÁGIO 3: Micro-SaaS, Escala & Hardware Local (15+ Clientes)  │
│ • Impressão Térmica ESC/POS (58mm/80mm) via Web Bluetooth / USB   │
│ • Agendamento Sincronizado ao Google Calendar API                 │
│ • Pipeline de Agentes de IA Autônomos (OCR de Cardápios & Lead Bot│
│ • PWA Offline com Service Workers                                 │
└───────────────────────────────────────────────────────────────────┘
```

---

## 🏆 Entregas Consolidadas do Estágio 1

### 1. Frontend & Vitrine Digital Multi-Tenant (`Alaska-local`)
- [x] **One Codebase, Infinite Domains:** Uma única base de código Nuxt 3 atendendo centenas de estabelecimentos via slug (`/[slug]`), subdomínios (`[slug].alaska.app`) e domínios próprios (`www.cliente.com.br`) através de middleware de servidor.
- [x] **4 Verticais de Negócio Ativas:**
  - 🍔 **Alaska Menu:** Hamburguerias, Pizzarias, Adegas 24h e Delivery (`theme: food / amber`).
  - 🛍️ **Alaska Shop:** Boutiques de Moda, Semijoias e Calçados (`theme: rose / shop`).
  - 💈 **Alaska Hub:** Barbearias, Salões de Beleza e Estúdios (`theme: violet / barber`).
  - ⚖️ **Alaska Pro:** Clínicas Odontológicas, Médicos e Profissionais Liberais (`theme: blue / health`).
- [x] **Sistema de Pagamentos Pix no Estágio 1 (`utils/pix.ts`):**
  - Geração de BR Code EMV padrão oficial do Banco Central com checksum CRC-16 CCITT.
  - Modo interativo de teste com Pix de R$ 0,01 (`allowTestCent`) para validação bancária real.
  - Sinal de reserva para agendamentos (evita *no-show*).
  - Despacho formatado no WhatsApp (`utils/whatsapp.ts`).
- [x] **Módulo de Agendamentos & Venda Híbrida (`BookingModal.vue` e `useBookingSlots.ts`):**
  - Seleção de múltiplos serviços, escolha de profissionais, carrossel de 30 dias e slots de horários.
- [x] **Motor de Busca Zero Latência (`useProductSearch.ts`):**
  - Busca em tempo real sem chamadas de rede com normalização Unicode NFD (ignora acentos e cedilhas).
- [x] **Consulta de CEP Instantânea (`useCep.ts`):**
  - Integração ViaCEP com preenchimento automático e transição inteligente de foco para o número da residência.
- [x] **Resiliência de Imagens (`utils/images.ts`):**
  - Fallback gracioso com Data URI SVG em memória no tema da loja, prevenindo CLS e links quebrados.
- [x] **Acessibilidade W3C/WCAG 2.1 AA:**
  - Trava de rolagem (`useBodyScrollLock`), atalho universal `Escape`, semântica de landmarks (`<main>`, `<header>`, `<nav>`) e suporte a leitores de tela.
- [x] **CLI de Demonstrações em 10 Minutos (`scripts/new-demo.js`):**
  - Geração instantânea de lojas para qualquer vertical a partir de templates canônicos.
- [x] **Qualidade & Testes:**
  - 100% de sucesso em todas as suítes unitárias no Vitest.
  - 12 Registros de Decisões de Arquitetura (ADRs) documentados em `docs/adrs/`.

---

### 2. Backend & Motor de Arquitetura Limpa (`alaska-local-backend`)
- [x] **Clean Architecture (Ports & Adapters):** Isolamento total do Core (`src/core/`) sem acoplamento a decorators ou frameworks.
- [x] **Entidades Puras de Domínio:** `Tenant`, `Product`, `Order`, `Booking`.
- [x] **Value Objects Imutáveis:** `Money` (cálculos precisos em centavos), `PixKey`, `Address`.
- [x] **Casos de Uso Consolidados:**
  - `GetTenantBySlugUseCase`
  - `ResolveTenantByDomainUseCase`
  - `CalculatePixPayloadUseCase`
  - `CreateOrderUseCase`
- [x] **Validação Fail-Fast Universal com Zod:**
  - `ZodValidationPipe` e validação estrita de variáveis de ambiente (`env.schema.ts`).
- [x] **Repositórios e Mocks In-Memory com Seed:**
  - Repositório `InMemoryTenantRepository` com dados iniciais das 6 lojas de demonstração.
- [x] **Docker Compose & PostgreSQL com RLS:**
  - `docker-compose.yml` e `init.sql` com tabelas relacionais e políticas de isolamento multi-tenant.
- [x] **Qualidade & Testes no Backend:**
  - Suítes de testes unitários com Vitest + SWC cobrindo entidades, value objects e casos de uso.
  - 5 ADRs e 4 guias de arquitetura em `docs/`.

---

## 🎯 Próximo Marco: Estágio 2 (6 a 15 Clientes Ativos)

1. Conexão do repositório backend ao Supabase / PostgreSQL em produção.
2. Painel Web simplificado do lojista (Nuxt Admin) para controle de estoque e horários.
3. Webhooks automáticos do Asaas para conciliação bancária Pix D+0.
