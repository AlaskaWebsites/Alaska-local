# AGENTS.md — Diretrizes de Engenharia e Governança para IA

Este documento é o guia definitivo de arquitetura, padrões e regras de negócio para agentes autônomos e desenvolvedores que atuam no ecossistema **Alaska Local**.

---

## 🧭 1. North Star e Visão do Produto

* **Missão**: Entregar vitrines digitais mobile-first ultrarrápidas para estabelecimentos locais (alimentação, adegas, barbearias, clínicas odontológicas, semijoias, boutiques de moda e prestadores de serviços), integrando busca em tempo real, autopreenchimento de CEP, feedback tátil no mobile, montagem de pedidos, provas sociais estilo iFood e despacho formatado diretamente para o WhatsApp do lojista.
* **Segmentação**:
  * **Alaska Menu**: Food service, hamburguerias, pizzarias, adegas 24h, espetarias e confeitarias.
  * **Alaska Hub**: Boutiques de moda feminina, semijoias finas, barbearias, clínicas médicas/odontológicas e salões de beleza.
* **Modelo de Negócio**: Venda *Done-for-You* (DFY) no plano anual (R$ 720/ano) ou mensal (R$ 350 taxa de setup + R$ 60 a R$ 89/mês), sem taxas sobre as vendas do lojista.

---

## 🏗️ 2. Estrutura do Repositório (One Codebase, Infinite Domains)

```
Alaska-local/
├── components/                     # Componentes Modulares Vue 3
│   ├── CartDrawerModal.vue         # Drawer de checkout e despacho WhatsApp (com ViaCEP e W3C Dialog)
│   ├── CategoryTabs.vue            # Abas horizontais com controles de scroll desktop
│   ├── ProductCustomizerModal.vue  # Modal de adicionais, min/max e cálculo de preço
│   ├── ProductSearchInput.vue      # Input de busca em tempo real (W3C Search Role)
│   ├── StoreInfoModal.vue          # Modal de horários, pagamentos e rota Google Maps
│   └── StoreReviewsModal.vue       # Prova social estilo iFood (5 níveis, notas e badges)
├── composables/                    # Lógica de Negócio e Estado Reativo (Auto-imported)
│   ├── useBodyScrollLock.ts        # Bloqueio reativo de rolagem no body (SSR-Safe)
│   ├── useCart.ts                  # Composable multi-tenant e persistente no localStorage
│   ├── useCep.ts                   # Consulta e autopreenchimento de endereço via ViaCEP com Zod
│   ├── useHaptic.ts                # Feedback tátil mobile via Vibration API (SSR-Safe)
│   ├── useOpeningHours.ts          # Cálculo de loja aberta/fechada (suporte a virada de 24h)
│   ├── useProductSearch.ts         # Filtragem de produtos e normalização sem acentos
│   ├── useShare.ts                 # Web Share API + fallback Clipboard toast
│   ├── useTenant.ts                # Leitura e resolução de tenant via rota ou host
│   └── useTenantTheme.ts           # Resolução reativa de paleta visual por segmento
├── data/                           # Catálogos Locais JSON (Estágio 1 - 0 a 5 clientes)
│   ├── adega-prime.json            # Template Menu (Adega 24h & Bebidas)
│   ├── barbearia-style.json        # Template Hub (Barbearia & Estética Masculina)
│   ├── bella-donna.json            # Template Hub (Boutique de Moda Feminina)
│   ├── cafe-central.json           # Template Hub (Cafeteria & Bistrô)
│   ├── clinica-sorriso.json        # Template Hub (Odontologia & Saúde)
│   ├── espetaria-brasa.json        # Template Menu (Espetaria & Churrasco)
│   ├── hamburgueria-x.json         # Template Menu (Hamburgueria Artesanal)
│   ├── karine-finardi.json         # Template Hub (Semijoias & Revenda)
│   └── restaurante-bella-italia.json # Template Menu (Restaurante Italiano)
├── pages/                          # Roteamento Baseado em Arquivos do Nuxt 3
│   ├── index.vue                   # Showcase com filtros de nicho e 9 lojas ativas
│   └── [slug].vue                  # Vitrine dinâmica multi-tenant do lojista
├── public/                         # Assets Estáticos Públicos
│   └── tenants/                    # Logos e fotos organizados por slug
├── server/                         # Middlewares e Endpoints do Servidor Nitro
│   └── middleware/tenant.ts        # Resolução de subdomínios e domínios próprios
├── types/                          # Contratos Canônicos de Tipagem TypeScript & Zod
│   ├── cart.ts                     # Interfaces CartItem, CheckoutFormData, Address, ViaCepResponseSchema
│   ├── index.ts                    # Barrel file centralizador de exportações
│   └── tenant.ts                   # Schemas Zod: TenantSchema, ProductSchema, StoreReviewsSchema
├── utils/                          # Utilitários Puros
│   ├── formatters.ts               # formatCurrency, formatPhone, formatCep, sanitizeDigits
│   └── whatsapp.ts                 # generateWhatsAppOrderUrl (com suporte a CEP e compatibilidade)
└── tests/units/                    # Suíte de Testes Automatizados no Vitest (16 suítes)
```

---

## 🛡️ 3. Regras Globais de Engenharia (Invioláveis)

1. **Tipos e Interfaces**:
   * **NUNCA** crie interfaces locais duplicadas em arquivos `.vue`. Sempre importe de `~/types`:
     ```ts
     import type { Tenant, Product, Category, CartItem, CheckoutFormData, Address, ViaCepResponse } from '~/types'
     ```
2. **Feedback Tátil Mobile (`useHaptic`)**:
   * Ações táteis no mobile (como adicionar produtos à sacola) disparam `triggerHaptic(30)` via Vibration API com degradação graciosa para navegadores sem suporte.
3. **Consulta de CEP (`useCep`)**:
   * A busca deve sanitizar a entrada (`sanitizeDigits`), validar os 8 dígitos e validar a resposta pública do ViaCEP via `ViaCepResponseSchema` com Zod.
4. **Busca de Produtos (`useProductSearch`)**:
   * A busca deve ser insensível a acentos (`normalizeSearchText`), minúsculas/maiúsculas e filtrar produtos dentro de categorias, ocultando automaticamente categorias sem correspondências.
5. **Acessibilidade W3C/WCAG**:
   * Todos os modais devem conter `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `useBodyScrollLock` e listener para a tecla `Escape`.
   * A busca deve conter `role="search"` e labels acessíveis.
6. **Resolução de Temas**:
   * Utilize sempre `themeClasses` fornecido por `useTenantTheme(tenant)` para classes utilitárias de cores, fundos, bordas e `focusRing`.
7. **Verificação de Testes**:
   * Antes de considerar qualquer tarefa pronta, execute `npx vitest run`. Todas as 16 suítes de teste devem passar sem exceções.

---
