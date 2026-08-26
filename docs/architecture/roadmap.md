# Roadmap Arquitetural & Evolução Técnica — Alaska Local

Este documento define a evolução técnica e arquitetural do ecossistema **Alaska Local** (Alaska Menu & Alaska Hub), estruturado em estágios de maturidade para evitar engenharia prematura (YAGNI) e priorizar validação de produto e fluxo de caixa.

---

## 🗺️ Visão Geral dos Estágios

```
┌───────────────────────────────────────────────────────┐
│ ESTÁGIO 1: Validação & Tração Inicial (0 a 5 Clientes)│
│ • Nuxt 3 Estático + SSR + Nitro Engine                │
│ • One Codebase, Infinite Domains                      │
│ • Validação Zod Fail-Fast & Temas Dinâmicos           │
│ • Busca em Tempo Real & Normalização                  │
│ • Autopreenchimento de Endereço via CEP (ViaCEP)      │
│ • Feedback Tátil Mobile (Vibration API)               │
│ • Persistência de Sacola com LocalStorage             │
│ • Modais Modulares, Composables & A11y W3C            │
│ • 16 Suítes Vitest (100% dos testes OK)               │
└───────────────────────┬───────────────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────────────┐
│ ESTÁGIO 2: Painel do Lojista & Backend (6 a 15 Clientes)│
│ • NestJS 11 + Clean Architecture (Ports & Adapters)   │
│ • PostgreSQL + Supabase com Row-Level Security (RLS)  │
│ • Painel Nuxt Admin para Lojistas (Pausar itens, etc.)│
│ • Autenticação JWT e RBAC por Tenant                  │
└───────────────────────┬───────────────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────────────┐
│ ESTÁGIO 3: Escala, Automação & Hardware (15+ Clientes)│
│ • Webhooks Pix D+0 (Asaas / OpenPix)                  │
│ • Impressão Térmica ESC/POS (58mm/80mm) via Bluetooth │
│ • Agendamento Integrado ao Google Calendar API        │
│ • Multi-Região Edge CDN & Otimização de Imagens       │
└───────────────────────────────────────────────────────┘
```

---

## 📍 Detalhamento do Estágio 1 (Concluído)

- [x] **Arquitetura Multi-Tenant Dinâmica**:
  - Resolução dinâmica de estabelecimentos via subdomínios, domínios próprios e rota slug (`/hamburgueria-x`, `/barbearia-style`, `/clinica-sorriso`, `/adega-prime`, `/karine-finardi`, `/bella-donna`, etc.).
  - Middleware de servidor `server/middleware/tenant.ts` mapeando hosts para slugs.
- [x] **Blindagem com Schemas Zod (`types/tenant.ts` e `types/cart.ts`)**:
  - `TenantSchema`, `CategorySchema`, `ProductSchema`, `OptionGroupSchema`, `StoreReviewsSchema`, `TenantThemeSchema`, `ViaCepResponseSchema`.
  - Validação fail-fast na leitura de arquivos JSON locais via `import.meta.glob` e nas respostas de APIs externas.
- [x] **Sistema Dinâmico de Temas por Segmento (`composables/useTenantTheme.ts`)**:
  - 🍔 `food`: Vermelho clássico iFood (`red-600`).
  - ✂️ `barber`: Âmbar Dourado Vintage / Ouro 18k (`amber-500`).
  - 🩺 `health`: Ciano/Teal Clínico (`cyan-500`).
  - 🍷 `drinks`: Roxo Uva Nobre (`purple-600`).
- [x] **Busca de Produtos em Tempo Real (`composables/useProductSearch.ts`)**:
  - Filtragem instantânea insensível a acentos (`normalizeSearchText`) e minúsculas/maiúsculas.
  - Componente de busca acessível `components/ProductSearchInput.vue` com botão de limpeza e contagem de resultados.
  - Feedback visual e estado vazio amigável quando nenhum item for encontrado.
- [x] **Autopreenchimento de Endereço via CEP (`composables/useCep.ts`)**:
  - Consulta automática e gratuita ao ViaCEP ao digitar 8 números.
  - Preenchimento instantâneo de Rua, Bairro, Cidade e Estado com máscara visual (`formatCep`).
  - Transição de foco inteligente para o campo de número da residência.
- [x] **Feedback Tátil / Vibração no Mobile (`composables/useHaptic.ts`)**:
  - Toque háptico sutil (`triggerHaptic(30)`) via Vibration API do navegador ao adicionar itens à sacola.
  - Degradação graciosa e SSR-safe para iOS/Safari e desktops.
- [x] **Persistência da Sacola e Perfil com LocalStorage (`composables/useCart.ts`)**:
  - Composable `useCart` multi-tenant que isola chaves de armazenamento por tenant slug (`alaska_cart_<slug>`) usando `useLocalStorage` do VueUse.
  - Preserva a sacola do cliente mesmo após fechar a aba ou recarregar a página.
  - Persistência do perfil do cliente no `CartDrawerModal.vue` com `useLocalStorage('alaska_checkout_profile')`.
- [x] **Modularização de Componentes e Composables Especializados**:
  - `components/ProductCustomizerModal.vue`: Modal de customização de produto com cálculo de opcionais e validação de grupos obrigatórios.
  - `components/CartDrawerModal.vue`: Drawer de finalização de compra, cálculo de frete, campos de entrega e despacho no WhatsApp.
  - `components/StoreReviewsModal.vue`: Modal de avaliações com prova social estilo iFood (5 níveis de serviço, distribuição e badges).
  - `components/StoreInfoModal.vue`: Modal de informações operacionais, horários, formas de pagamento e rota no Google Maps.
  - `components/CategoryTabs.vue`: Abas de navegação fixa com semântica `<nav>`, acessibilidade W3C e suporte a rolagem desktop.
  - `composables/useOpeningHours.ts`: Cálculo de loja aberta/fechada suportando viradas de meia-noite (ex: 18h às 03h).
  - `composables/useShare.ts`: Compartilhamento nativo via Web Share API com fallback para cópia na área de transferência.
  - `composables/useBodyScrollLock.ts`: Trava de rolagem de body SSR-safe com guard `getCurrentInstance()`.
  - `utils/formatters.ts`: Formatação de moedas (`formatCurrency`), telefones (`formatPhone`) e CEPs (`formatCep`).
- [x] **Acessibilidade W3C / WCAG (Hardness & Compliance)**:
  - Suporte completo a leitores de tela com `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `role="search"`, `aria-expanded` e `aria-pressed`.
  - Foco automático com `nameInputRef` e fechamento universal na tecla `Escape` (`ESC`).
- [x] **Suíte de Testes Automatizados no Vitest**:
  - 16 arquivos de testes cobrindo busca em tempo real, consulta de CEP, feedback tátil, persistência de sacola, schemas Zod, temas, middleware de domínios, modais, horários e geração de WhatsApp, com 100% de sucesso.

---

## 📍 Próximos Passos (Estágio 2 — 6 a 15 Clientes)

1. **Back-end NestJS 11 com Clean Architecture**:
   - Isolamento de casos de uso via Ports & Adapters.
   - Schemas e DTOs validados com Zod.
2. **Persistência Supabase / PostgreSQL**:
   - Políticas de Row-Level Security (RLS) por tenant.
   - Sincronização de catálogo em nuvem.
3. **Painel do Lojista (Nuxt Admin)**:
   - Interface mobile-first simplificada para o comerciante pausar produtos esgotados, alterar preços e atualizar horário de funcionamento.
