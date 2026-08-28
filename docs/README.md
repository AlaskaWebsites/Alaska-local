# 📚 Documentação Técnica — Ecossistema Alaska Local

Bem-vindo à documentação técnica e arquitetural do **Alaska Local**. Este repositório centraliza os guias de engenharia, registros de decisões de arquitetura (ADRs), padrões de acessibilidade, sistema de design e estratégias comerciais.

---

## 🏛️ Registros de Decisões de Arquitetura (ADRs)

Os ADRs registram o contexto, alternativas consideradas e justificativas técnicas para decisões fundamentais do projeto:

- [ADR 001: Fundação Arquitetural da Fase 1](./adrs/001-fase1-fundacao-arquitetural.md) — One Codebase, Nuxt 3, Tailwind CSS e Multi-Tenancy dinâmico.
- [ADR 002: Arquitetura NestJS e Validação com Zod](./adrs/002-arquitetura-nestjs-validacao-zod.md) — Backend limpo, Ports & Adapters, Supabase/PostgreSQL com RLS.
- [ADR 003: Desacoplamento de Composables, Modais e Acessibilidade](./adrs/003-desacoplamento-composables-modais-acessibilidade.md) — Separação de responsabilidades e padrões W3C/WCAG.
- [ADR 004: Categorização de Negócios e Templates Canônicos](./adrs/004-categorizacao-de-negocios-e-templates.md) — Categorias `menu`, `shop`, `hub` e `pro`.
- [ADR 005: Integração ViaCEP e Autopreenchimento de Endereço](./adrs/005-integracao-viacep-autocompletion-endereco.md) — Micro-UX de endereço com busca de CEP e foco automático.
- [ADR 006: Módulo de Agendamento de Serviços e Venda Híbrida](./adrs/006-modulo-agendamento-servicos-e-venda-hibrida.md) — Agendamento de horários para barbearias e clínicas com upsell.
- [ADR 007: Cálculo de Horários Noturnos e Badges Dinâmicos](./adrs/007-calculo-horario-noturno-e-badges-dinamicos.md) — Algoritmo de virada de meia-noite e micro-UX de status de atendimento.
- [ADR 008: Resiliência de Imagens e Placeholders SVG Temáticos](./adrs/008-resiliencia-de-imagens-e-placeholders-svg-tematicos.md) — Fallback gracioso com Data URI SVG em memória sem layout shifts.
- [ADR 009: Protocolo de Despacho de Pedidos Estruturados via WhatsApp](./adrs/009-protocolo-despacho-whatsapp-e-venda-hibrida.md) — Sanitização E.164 (+55), formato markdown determinístico e Pix D+0.
- [ADR 010: Motor de Busca Client-Side Zero Latência e Normalização Unicode](./adrs/010-busca-client-side-zero-latencia-e-normalizacao-unicode.md) — Pesquisa reativa instantânea ignorando acentos e cedilhas.
- [ADR 011: Persistência de Carrinho com Namespacing no LocalStorage](./adrs/011-persistencia-carrinho-namespaced-localstorage.md) — Isolamento de sacola por tenant e segurança contra erros de SSR.
- [ADR 012: Arquitetura de Pagamentos Pix no Estágio 1](./adrs/012-arquitetura-pagamentos-pix-estagio-1.md) — Geração de BR Code EMV, CRC-16, teste de 1 centavo e sinal de agendamento.

---

## 📐 Guias de Arquitetura & Engenharia

- [Categorias de Negócio e Verticais](./architecture/categorias-de-negocio.md) — Alaska Menu, Alaska Shop, Alaska Hub e Alaska Pro.
- [Design System & Temas Dinâmicos](./architecture/design-system-e-temas.md) — Paletas de cores, Tailwind tokens e padrões visuais.
- [Padrões de Acessibilidade & Micro-UX](./architecture/padroes-de-acessibilidade-e-ux.md) — W3C/WCAG 2.1 AA, trava de scroll, atalho ESC e resposta tátil.
- [Módulo de Agendamento e Serviços](./architecture/modulo-agendamento-e-servicos.md) — Slot picker, escolha de profissionais e regras de duração.
- [Estratégia de Testes & Qualidade](./architecture/estrategia-de-testes-e-qualidade.md) — Vitest test harness, cobertura unitária e execução.
- [Engenharia Orientada a Agentes de IA](./architecture/engenharia-orientada-a-agentes-ia.md) — Padrão Spec -> Zod -> Vitest -> Composable -> UI.
- [Roadmap de Evolução](./architecture/roadmap.md) — Fases de desenvolvimento, expansão e próximas funcionalidades.

---

## 💼 Estratégia Comercial & Operações

- [Plano de Negócio & Precificação](./commercial/PLANO_DE_NEGOCIO.md) — Modelos de receita, acelerador de caixa Anual e mensalidade Asaas.
- [Pitch de Vendas & Scripts de Prospecção](./commercial/PITCH_E_SCRIPTS.md) — Abordagem consultiva Done-for-You e scripts WhatsApp anti-ban.
- [Runbook de Demos](./operations/RUNBOOK_DEMOS.md) — Geração rápida de demonstrações personalizadas em menos de 10 minutos via CLI.
