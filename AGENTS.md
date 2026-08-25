# AGENTS.md — Guia do Desenvolvedor de IA & Harness para LLMs

Este documento é o guia definitivo de arquitetura, padrões e regras de negócio para qualquer **Agente de IA**, **LLM** ou **Engenheiro de Software** atuando no repositório **Alaska Local** (`AlaskaWebsites/Alaska-local`).

---

## 🧭 1. North Star e Visão do Produto

* **Missão**: Entregar vitrines digitais mobile-first ultrarrápidas para estabelecimentos locais (alimentação, adegas, barbearias, clínicas odontológicas e prestadores de serviços), integrando montagem de pedidos, provas sociais estilo iFood e despacho formatado diretamente para o WhatsApp do lojista.
* **Segmentação**:
  * **Alaska Menu**: Food service, hamburguerias, pizzarias, adegas 24h, espetarias e confeitarias.
  * **Alaska Hub**: Barbearias, clínicas médicas/odontológicas e salões de beleza.
* **Modelo de Negócio**: Venda *Done-for-You* (DFY) no plano anual (R$ 720/ano) ou mensal (R$ 350 taxa de setup + R$ 60/mês), sem taxas sobre as vendas do lojista.

---

## 🏗️ 2. Estrutura de Diretórios e Árvore de Componentes

```
Alaska-local/
├── components/                     # Componentes Modulares Vue 3
│   ├── CartDrawerModal.vue         # Drawer de checkout e despacho WhatsApp (W3C Dialog)
│   ├── CategoryTabs.vue            # Abas horizontais de categorias (W3C Tablist)
│   ├── ProductCustomizerModal.vue  # Modal de adicionais, min/max e cálculo de preço
│   ├── StoreInfoModal.vue          # Modal de horários, pagamentos e rota Google Maps
│   └── StoreReviewsModal.vue       # Prova social estilo iFood (5 níveis, notas e badges)
├── composables/                    # Lógica de Negócio e Estado Reativo (Auto-imported)
│   ├── useBodyScrollLock.ts        # Bloqueio reativo de rolagem no body (SSR-Safe)
│   ├── useCart.ts                  # Store do Pinia para carrinho global
│   ├── useOpeningHours.ts          # Cálculo de loja aberta/fechada (suporte a virada de 24h)
│   ├── useShare.ts                 # Web Share API + fallback Clipboard toast
│   ├── useTenant.ts                # Resolução SSR do tenant via import.meta.glob e 404
│   └── useTenantTheme.ts           # 4 temas dinâmicos (food, barber, health, drinks)
├── data/                           # Banco de Dados Estático em JSON (Estágio 1)
│   ├── adega-prime.json            # Tema drinks (Roxo / Violeta)
│   ├── barbearia-style.json        # Tema barber (Âmbar Vintage)
│   ├── cafe-central.json           # Tema food (Vermelho)
│   ├── clinica-sorriso.json        # Tema health (Teal Médico)
│   ├── espetaria-brasa.json        # Tema food (Vermelho)
│   ├── hamburgueria-x.json         # Tema food (Vermelho)
│   └── restaurante-bella-italia.json # Tema food (Vermelho)
├── docs/                           # Documentação Oficial e Única Fonte de Verdade
│   ├── adrs/                       # Architecture Decision Records (001, 002, 003)
│   ├── architecture/               # Roadmap e Guias de Engenharia
│   ├── commercial/                 # Plano de Negócio e Scripts de Vendas
│   ├── operations/                 # Runbooks operacionais e scripts de demo
│   └── prompts/                    # Regras globais de IA e diretrizes de prompt
├── pages/                          # Rotas do Nuxt 3
│   ├── index.vue                   # Showcase com filtro segmentado e cards dinâmicos
│   └── [slug].vue                  # Vitrine dinâmica multi-tenant do estabelecimento
├── server/                         # Middlewares e Endpoints do Servidor Nitro
│   └── middleware/tenant.ts        # Resolução de subdomínios e domínios próprios
├── types/                          # Contratos Canônicos de Tipagem TypeScript & Zod
│   ├── cart.ts                     # Interfaces CartItem, CheckoutFormData, Address, CartState
│   ├── index.ts                    # Barrel file centralizador de exportações
│   └── tenant.ts                   # Schemas Zod: TenantSchema, ProductSchema, StoreReviewsSchema
├── utils/                          # Utilitários Puros
│   ├── formatters.ts               # formatCurrency e formatPhone
│   └── whatsapp.ts                 # generateWhatsAppOrderUrl
└── tests/units/                    # Suíte de Testes Automatizados no Vitest (13 suítes)
```

---

## 📋 3. Regras de Código Obrigatórias para LLMs

1. **Tipos e Interfaces**:
   * **NUNCA** crie interfaces locais duplicadas em arquivos `.vue`. Sempre importe de `~/types`:
     ```ts
     import type { Tenant, Product, CartItem, CheckoutFormData } from '~/types'
     ```
2. **Acessibilidade W3C/WCAG**:
   * Todos os modais devem conter `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `useBodyScrollLock` e listener para a tecla `Escape`.
   * Todos os botões devem ter `aria-label` descritivo quando não contiverem texto textual claro.
3. **Resolução de Temas**:
   * Utilize sempre `themeClasses` fornecido por `useTenantTheme(tenant)` para classes utilitárias de cores, fundos, bordas e `focusRing`.
4. **Validação e Tratamento de Erros**:
   * Utilize `TenantSchema.parse(...)` ou `.safeParse(...)` para validar dados.
   * Em páginas SSR, emita `createError({ statusCode: 404, statusMessage: 'Estabelecimento não encontrado' })` quando o slug for inválido.
5. **Verificação de Testes**:
   * Antes de considerar qualquer tarefa pronta, execute `npx vitest run`. Todos os 61+ testes devem passar sem exceções.

---

## ⚡ 4. Comandos de Operação

```bash
# Iniciar servidor de desenvolvimento local
npm run dev

# Executar suíte completa de testes unitários
npx vitest run

# Gerar build estático para produção
npm run generate

# Executar script CLI para gerar nova demonstração
node scripts/new-demo.js
```
