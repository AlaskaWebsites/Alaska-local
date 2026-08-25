# 🏔️ Alaska Local — Vitrines Digitais Mobile-First para Negócios Locais

> **One Codebase, Infinite Domains.** Solução digital de alta conversão para estabelecimentos locais (alimentação, adegas, barbearias, clínicas e serviços), com cardápio interativo, avaliações estilo iFood e despacho formatado direto para o WhatsApp.

[![Nuxt 3](https://img.shields.io/badge/Nuxt-3.15+-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Vue 3](https://img.shields.io/badge/Vue-3.5+-4FC08D?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zod](https://img.shields.io/badge/Zod-3.23+-3E67B1?logo=zod&logoColor=white)](https://zod.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-3.0+-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)

---

## 📱 Verticais de Negócio

* 🍔 **Alaska Menu**: Experiência visual rica inspirada no iFood para food service (hamburguerias, pizzarias, adegas 24h, espetarias e cafeterias), com seleção de adicionais, observações e cálculo de taxa de entrega.
* ✂️ **Alaska Hub**: Páginas institucionais de alta conversão para prestadores de serviços, barbearias com escolha de profissionais e clínicas com agendamento direto.

---

## 🎨 Demonstrações Ativas

| Estabelecimento | Segmento | Tema Visual | Rota |
| :--- | :--- | :--- | :--- |
| **Hamburgueria X** | Burgers Artesanais | `food` (Vermelho iFood) | [`/hamburgueria-x`](https://alaskalocal.vercel.app/hamburgueria-x) |
| **Adega & Distribuidora Prime** | Bebidas & 24h | `drinks` (Roxo Neon) | [`/adega-prime`](https://alaskalocal.vercel.app/adega-prime) |
| **Barbearia Style** | Barbearia & Estética | `barber` (Âmbar Vintage) | [`/barbearia-style`](https://alaskalocal.vercel.app/barbearia-style) |
| **Clínica Sorriso** | Odontologia & Saúde | `health` (Teal Clínico) | [`/clinica-sorriso`](https://alaskalocal.vercel.app/clinica-sorriso) |
| **Espetaria & Jantinha Brasa** | Churrasco & Espetos | `food` (Vermelho) | [`/espetaria-brasa`](https://alaskalocal.vercel.app/espetaria-brasa) |
| **Restaurante Bella Italia** | Pizzaria & Massas | `food` (Vermelho) | [`/restaurante-bella-italia`](https://alaskalocal.vercel.app/restaurante-bella-italia) |
| **Café Central** | Cafeteria Artesanal | `food` (Vermelho) | [`/cafe-central`](https://alaskalocal.vercel.app/cafe-central) |

---

## 🏛️ Destaques de Engenharia & Arquitetura

1. **Modularização de Componentes**: Modais isolados com `<Teleport to="body">` (`CartDrawerModal.vue`, `ProductCustomizerModal.vue`, `StoreReviewsModal.vue`, `StoreInfoModal.vue`).
2. **Acessibilidade W3C / WCAG**: Padrão ARIA completo (`role="dialog"`, `aria-modal="true"`), atalho `Escape`, foco automático e trava de rolagem de fundo com `useBodyScrollLock`.
3. **Design Tokens Dinâmicos**: Composable `useTenantTheme` aplicando paletas de cores, botões, badges e anéis de foco (`focusRing`) em tempo de execução.
4. **Tipagem Centralizada**: Schemas Zod e interfaces unificadas em `types/index.ts` (`Tenant`, `Product`, `CartItem`, `CheckoutFormData`).
5. **Qualidade Garantida**: 13 suítes com 61+ testes unitários no Vitest cobrindo 100% dos fluxos críticos de negócio e formatações de WhatsApp.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
* Node.js `>= 18.0.0`
* npm ou pnpm

### Instalação e Execução
```bash
# 1. Clonar o repositório
git clone https://github.com/AlaskaWebsites/Alaska-local.git
cd Alaska-local

# 2. Instalar dependências
npm install

# 3. Executar o servidor de desenvolvimento
npm run dev

# 4. Executar os testes automatizados
npx vitest run
```

---

## 📖 Documentação do Projeto

* 🗺️ [Roadmap Arquitetural e Estratégico](docs/architecture/roadmap.md)
* 📜 [ADR 001: Fundação Arquitetural](docs/adrs/001-fase1-fundacao-arquitetural.md)
* 📜 [ADR 002: Arquitetura NestJS e Validação Zod](docs/adrs/002-arquitetura-nestjs-validacao-zod.md)
* 📜 [ADR 003: Desacoplamento de Modais e Acessibilidade](docs/adrs/003-desacoplamento-composables-modais-acessibilidade.md)
* 💼 [Plano Comercial e de Negócios](docs/commercial/PLANO_DE_NEGOCIO.md.md)
* 🤖 [Regras Globais para LLMs e Agentes de IA](docs/prompts/regras-globais-ia.md)
* 🤖 [Harness e Guia de Agentes (AGENTS.md)](AGENTS.md)
