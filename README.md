# 🏔️ Alaska Local — Vitrines Digitais & Cardápios Mobile-First

> **Vitrines digitais de alta conversão, agendamentos online e checkout estruturado direto no WhatsApp para comércios locais e profissionais liberais.**  
> **One Codebase, Infinite Domains • 0% de Comissões • Padrão iFood & Dark Modern**

---

## 📱 Visão Geral do Projeto

O **Alaska Local** é uma plataforma *B2B Local* desenvolvida em **Nuxt 3, Vue 3 e Tailwind CSS**, projetada para resolver a principal dor do pequeno e médio varejo: **vender pelo WhatsApp sem a fricção e as taxas abusivas dos marketplaces (iFood cobra até 27%) e sem a lentidão dos e-commerces tradicionais**.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ECOSSISTEMA ALASKA LOCAL                          │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ 🍔 ALASKA MENU                       │ 🛍️ ALASKA SHOP                       │
│ Food service, pizzarias, adegas 24h, │ Boutiques de moda, semijoias,        │
│ hamburguerias e delivery de comida.  │ calçados, cosméticos e acessórios.   │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ 💈 ALASKA HUB                        │ ⚖️ ALASKA PRO                        │
│ Barbearias, salões de beleza,        │ Clínicas odontológicas, médicos,     │
│ estúdios de estética e tatuagem.     │ psicólogos e profissionais liberais. │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## ✨ Principais Funcionalidades & Micro-UX

1. **One Codebase, Infinite Domains:**
   - Uma única aplicação serve centenas de lojas através de rotas dinâmicas (`/[slug]`), subdomínios (`[slug].alaska.app`) e domínios próprios (`www.cliente.com.br`) resolvidos via middleware.
2. **Busca em Tempo Real Zero Latência (`useProductSearch`):**
   - Filtragem instantânea client-side com normalização Unicode NFD (pesquisar `"acai"` encontra `"Açaí"`).
3. **Autopreenchimento de Endereço via CEP (`useCep`):**
   - Integração com a API do ViaCEP com máscara em tempo real e foco automático no campo de número.
4. **Horários Noturnos & Badges Dinâmicos (`useOpeningHours`):**
   - Tratamento de turnos que viram a meia-noite (ex: 18h às 3h) com status dinâmico (*"Aberto até às 03:00"*, *"Fechado • Abre hoje às 18:00"*).
5. **Módulo de Agendamentos & Venda Híbrida (`BookingModal` & `useBookingSlots`):**
   - Slot picker de 30/45/60 min para barbearias e clínicas, escolha de profissionais e sinal via Pix.
6. **Pagamentos Pix no Estágio 1 (`utils/pix.ts`):**
   - Geração de BR Code EMV oficial do Banco Central com CRC-16 CCITT, chave com botão Copiar, e **modo teste com Pix de R$ 0,01**.
7. **Prova Social no Padrão iFood (`StoreReviewsModal`):**
   - Score de 1 a 5 estrelas, distribuição percentual em barras e avaliações com tags de itens elogiados.
8. **Resiliência Visual (`utils/images.ts`):**
   - Fallback gracioso com Data URI SVG em memória gerado na paleta de cores do tema da loja (zero CLS).
9. **Acessibilidade W3C/WCAG 2.1 AA:**
   - Trava de rolagem (`useBodyScrollLock`), atalho universal `Escape`, semântica de landmarks (`<main>`, `<header>`) e suporte a leitores de tela.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js 18+ (recomendado Node 20+)
- npm ou pnpm

### Instalação & Execução
```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento Nuxt 3
npm run dev

# Acesse a vitrine central em: http://localhost:3000
# Acesse lojas de exemplo:
# • http://localhost:3000/hamburgueria-x (Alaska Menu)
# • http://localhost:3000/karine-finardi (Alaska Shop - Semijoias)
# • http://localhost:3000/barbearia-style (Alaska Hub - Barbearia)
# • http://localhost:3000/clinica-sorriso (Alaska Pro - Clínica)
# • http://localhost:3000/adega-prime (Alaska Menu - Adega 24h)
```

---

## 🧪 Testes Unitários & Engenharia de Qualidade

O projeto possui **160 testes unitários automatizados** rodando via **Vitest** cobrindo 100% dos fluxos de negócio:

```bash
# Executar toda a suíte de testes unitários
npm run test

# Executar em modo interativo (Watch)
npm run test:watch
```

---

## ⚡ CLI de Demonstrações Comerciais (Show, Don't Tell)

Gere a vitrine digital completa de um novo cliente em menos de 10 segundos:

```bash
# Uso: node scripts/new-demo.js <slug> "<Nome do Negócio>" "<WhatsApp>" [vertical]
# Verticais: shop, menu, hub, pro, adega, pizza

# Exemplo 1: Loja de Semijoias
node scripts/new-demo.js joias-luxo "Joias de Luxo" "11987654321" shop

# Exemplo 2: Barbearia
node scripts/new-demo.js navalha-de-ouro "Barbearia Navalha de Ouro" "11977778888" hub
```

---

## 📚 Documentação Técnica & Arquitetural

A documentação detalhada está organizada na pasta [`docs/`](./docs/README.md):

* **[Índice Geral de Documentação](./docs/README.md)**
* **[Registros de Decisões de Arquitetura (ADRs 001 a 012)](./docs/adrs/)**
* **[Guias de Design System & Temas](./docs/architecture/design-system-e-temas.md)**
* **[Padrões de Acessibilidade & Micro-UX](./docs/architecture/padroes-de-acessibilidade-e-ux.md)**
* **[Estratégia de Testes Vitest](./docs/architecture/estrategia-de-testes-e-qualidade.md)**
* **[Plano de Negócios & Precificação](./docs/commercial/PLANO_DE_NEGOCIO.md)**
* **[Pitch de Vendas & Scripts WhatsApp](./docs/commercial/PITCH_E_SCRIPTS.md)**
* **[Roadmap de Evolução](./docs/architecture/roadmap.md)**
