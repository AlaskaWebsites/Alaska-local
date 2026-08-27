# 🏔️ Alaska Local — Vitrines Digitais Mobile-First para Negócios Locais

> **One Codebase, Infinite Domains.** Solução digital de alta conversão para estabelecimentos locais (alimentação, adegas, barbearias, clínicas, semijoias, boutiques e profissionais liberais), com cardápio/catálogo interativo, agendamento de serviços, avaliações estilo iFood e checkout estruturado direto para o WhatsApp.

[![Nuxt 3](https://img.shields.io/badge/Nuxt-3.15+-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Vue 3](https://img.shields.io/badge/Vue-3.5+-4FC08D?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-3.0+-FCC72B?logo=vitest&logoColor=white)](https://vitest.dev/)
[![W3C / WCAG](https://img.shields.io/badge/Accessibility-W3C%20%2F%20WCAG-blue)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![License: UNLICENSED](https://img.shields.io/badge/License-UNLICENSED-red.svg)](LICENSE)

---

## 📱 Verticais de Negócio

* 🍔 **Alaska Menu**: Experiência visual rica inspirada no iFood para food service (hamburguerias, pizzarias, adegas 24h, espetarias e cafeterias), com seleção de adicionais, observações e cálculo de taxa de entrega.
* 🛍️ **Alaska Shop**: Vitrines mobile dinâmicas para boutiques de moda, semijoias, calçados e cosméticos com sacola em tempo real e fechamento no WhatsApp.
* 💈 **Alaska Hub**: Solução para prestadores de serviços, barbearias e salões com escolha de profissionais, horários de atendimento e venda híbrida de produtos (pomadas, óleos, kits).
* ⚖️ **Alaska Pro**: Landing pages institucionais One-Page para profissionais liberais (médicos, dentistas, psicólogos, advogados) com agendamento de consultas e avaliações.

---

## 🎨 Demonstrações Ativas

| Estabelecimento | Segmento | Vertical | Tema Visual | Rota |
| :--- | :--- | :--- | :--- | :--- |
| **Bella Donna Boutique** | Moda Feminina & Alfaiataria | `shop` | `drinks` (Violeta & Rosa Chic) | [`/bella-donna`](https://alaskalocal.vercel.app/bella-donna) |
| **Karine Finardi** | Semijoias & Revenda | `shop` | `barber` (Âmbar / Ouro 18k) | [`/karine-finardi`](https://alaskalocal.vercel.app/karine-finardi) |
| **Hamburgueria X** | Burgers Artesanais | `menu` | `food` (Vermelho iFood) | [`/hamburgueria-x`](https://alaskalocal.vercel.app/hamburgueria-x) |
| **Adega & Distribuidora Prime** | Bebidas & 24h | `menu` | `drinks` (Roxo Neon) | [`/adega-prime`](https://alaskalocal.vercel.app/adega-prime) |
| **Barbearia Dom Pedro** | Barbearia & Estética Masculina | `hub` | `barber` (Dourado & Preto) | [`/barbearia-dom-pedro`](https://alaskalocal.vercel.app/barbearia-dom-pedro) |
| **Espetaria do Chef** | Espetinhos & Porções | `menu` | `food` (Laranja Brasa) | [`/espetaria-chef`](https://alaskalocal.vercel.app/espetaria-chef) |
| **Pizzaria Bella Napoli** | Pizzas Artesanais & Forno a Lenha | `menu` | `food` (Verde & Vermelho Itália) | [`/pizzaria-bella-napoli`](https://alaskalocal.vercel.app/pizzaria-bella-napoli) |
| **Doceria Doce Sabor** | Doces Finos & Confeitaria | `menu` | `default` (Rosa Pastel) | [`/doceria-doce-sabor`](https://alaskalocal.vercel.app/doceria-doce-sabor) |

---

## 🚀 Como Executar em Desenvolvimento

```bash
# 1. Clonar o repositório
git clone https://github.com/AlaskaWebsites/Alaska-local.git
cd Alaska-local

# 2. Instalar as dependências
npm install

# 3. Rodar o servidor de desenvolvimento
npm run dev

# 4. Executar os testes automatizados com Vitest
npx vitest run
```

---

## 📖 Documentação do Projeto

### 💼 Comercial & Estratégia de Negócio
* 💼 **[Plano de Negócios & Monetização](docs/commercial/PLANO_DE_NEGOCIO.md)** — Estratégia de precificação (Anual vs Mensal), matriz de verticais, acelerador de caixa, Asaas Pix D+0 e regras de retenção (LTV/CAC).
* 🎯 **[Playbook de Pitch & Scripts WhatsApp](docs/commercial/PITCH_E_SCRIPTS.md)** — Roteiros de prospecção consultiva anti-ban e contorno analítico de objeções.

### 🏗️ Arquitetura & Engenharia
* 💈 **[Módulo de Agendamentos & Venda Híbrida](docs/architecture/modulo-agendamento-e-servicos.md)** — Arquitetura de agendamentos, comparação tecnológica (Google Calendar vs Supabase) e venda híbrida (serviço + produto upsell).
* 🗺️ **[Roadmap Arquitetural e Estratégico](docs/architecture/roadmap.md)** — Evolução técnica em fases (Estágio 1, 2 e 3).
* 🏷️ **[Taxonomia de Categorias de Negócio](docs/architecture/categorias-de-negocio.md)** — Definição das verticais `menu`, `shop`, `hub` e `pro`.
* 🤖 **[Guia de Engenharia para IAs](docs/architecture/guia-engenharia-ia.md)** — Boas práticas de desenvolvimento e arquitetura limpa.
* 🤖 **[Harness e Guia de Agentes (AGENTS.md)](AGENTS.md)** — Diretrizes de contexto e desenvolvimento assistido.
* 📜 **[Regras Globais de Prompt (IA)](docs/prompts/regras-globais-ia.md)** — Diretrizes de geração de código para LLMs.

### 📜 Architecture Decision Records (ADRs)
* 📜 **[ADR 001: Fundação Arquitetural](docs/adrs/001-fase1-fundacao-arquitetural.md)** — Nuxt 3, Vite, SSR, Multi-tenancy e Tailwind CSS.
* 📜 **[ADR 002: Arquitetura NestJS e Validação Zod](docs/adrs/002-arquitetura-nestjs-validacao-zod.md)** — Clean Architecture, Ports & Adapters e Supabase RLS.
* 📜 **[ADR 003: Desacoplamento de Modais e Acessibilidade](docs/adrs/003-desacoplamento-composables-modais-acessibilidade.md)** — Composables, WCAG, `useBodyScrollLock` e acessibilidade.
* 📜 **[ADR 004: Categorização de Negócios e Templates](docs/adrs/004-categorizacao-de-negocios-e-templates.md)** — Schemas Zod de categorias e especialização de templates.
* 📜 **[ADR 005: Autopreenchimento de Endereço via CEP (ViaCEP)](docs/adrs/005-integracao-viacep-autocompletion-endereco.md)** — Validação Zod, resiliência e micro-UX de foco automático no checkout.
* 📜 **[ADR 006: Módulo de Agendamentos e Venda Híbrida](docs/adrs/006-modulo-agendamento-servicos-e-venda-hibrida.md)** — Decisão de integração Google Calendar API + Supabase e suporte a upsell de produtos.

### 🛠️ Operações
* ⚡ **[Runbook de Geração de Demos](docs/operations/RUNBOOK_DEMOS.md)** — Automação CLI para criação rápida de vitrines com `scripts/new-demo.js`.

---

**Mantido com excelência por:** [@AlaskaWebsites](https://github.com/AlaskaWebsites)  
**Licença:** UNLICENSED  
**Última atualização:** 2026-08-27
