# ADR 014: Monorepo Unificado (Turborepo + Workspaces) e Compartilhamento de Contratos com @alaska/contracts

## Status
Aceito (Accepted)

## Data
2026-08-29

## Contexto

Atualmente, o ecossistema Alaska Local está dividido em dois repositórios independentes no GitHub:
1. `AlaskaWebsites/Alaska-local`: Frontend Nuxt 3 (One Codebase, Infinite Domains).
2. `AlaskaWebsites/alaska-local-backend`: Backend NestJS 11 (Clean Architecture, Supabase/PostgreSQL RLS, BullMQ).

Com a evolução da plataforma para o **Estágio 2 (API-First e Painel do Lojista)**, identificou-se a duplicação de schemas Zod e tipos TypeScript entre os dois projetos:
* `TenantSchema`, `ProductSchema`, `OptionGroupSchema`, `OpeningHoursSchema`, `StoreReviewsSchema` e `PixConfigSchema` existem em `types/tenant.ts` no frontend e nas entidades/DTOs do backend.
* `CartItemSchema` e `CheckoutFormDataSchema` (frontend) refletem a mesma estrutura de `OrderEntity` e `CreateOrderDto` (backend).
* `BookingServiceSchema`, `ProfessionalSchema` e `BookingSlotSchema` refletem `BookingEntity` e `CreateBookingDto`.

### Problemas da Abordagem de Repositórios Separados
1. **Risco de Contract Drift (Deriva de Contratos)**: Alterações feitas em um campo (ex: novos atributos em produtos ou novas regras no Pix) exigem atualizações manuais e sincronizadas em dois repositórios distintos, sob risco de quebra silenciosa em tempo de execução.
2. **Fricção de Versionamento**: Criar um repositório isolado de contratos exigiria publicar pacotes no NPM ou gerenciar tags git com dependências remotas, gerando overhead de commits e atrasos no ciclo de desenvolvimento.
3. **Restrição de Contexto para Agentes de IA / Cursor IDE**: Em repositórios separados, agentes e ferramentas de assistência precisam alternar de contexto, perdendo a visão unificada das mudanças atômicas (Contrato -> API -> UI -> Testes).

---

## Decisão

Decidimos unificar o ecossistema Alaska Local em uma arquitetura de **Monorepo Unificado com Workspaces e Turborepo**, centralizando as definições de domínio no pacote interno compartilhado **`@alaska/contracts`**.

### 1. Estrutura de Diretórios do Monorepo

```
alaska-local/
├── apps/
│   ├── web/                          # Frontend Nuxt 3 (One Codebase, Infinite Domains)
│   │   ├── components/
│   │   ├── composables/
│   │   ├── pages/
│   │   ├── server/
│   │   ├── nuxt.config.ts
│   │   └── package.json
│   │
│   └── api/                          # Backend NestJS 11 (Clean Architecture & RLS)
│       ├── src/
│       │   ├── core/ (Domain, Use Cases, Ports)
│       │   └── infrastructure/ (Postgres, HTTP, Queues, MCP)
│       ├── docker/
│       ├── nest-cli.json
│       └── package.json
│
├── packages/
│   ├── contracts/                    # @alaska/contracts (Single Source of Truth)
│   │   ├── src/
│   │   │   ├── tenant/               # TenantSchema, OpeningHours, PixConfig, Theme
│   │   │   ├── catalog/              # ProductSchema, Category, OptionGroups
│   │   │   ├── order/                # CreateOrderSchema, OrderItem, Status, Delivery
│   │   │   ├── booking/              # CreateBookingSchema, Services, Professionals, Slots
│   │   │   ├── pix/                  # PixQrCodeRequest, PixQrCodeResponse, PixKey
│   │   │   ├── common/               # AddressSchema, CepSchema, MoneyCentsSchema
│   │   │   └── index.ts              # Ponto de entrada unificado
│   │   ├── tsup.config.ts            # Build ultrarrápido (ESM, CJS, .d.ts)
│   │   └── package.json
│   │
│   └── tsconfig/                     # Configurações TypeScript base compartilhadas
│       ├── base.json
│       ├── nuxt.json
│       └── nest.json
│
├── package.json                      # Definição de workspaces raiz
├── pnpm-workspace.yaml               # Configuração pnpm (ou npm workspaces)
└── turbo.json                        # Pipeline de build, lint e testes com cache
```

---

### 2. Especificação do Pacote `@alaska/contracts`

O pacote `@alaska/contracts` será uma biblioteca pura em TypeScript + Zod (zero dependências de frameworks), compilada com `tsup` para suporte híbrido ESM (`import`) e CJS (`require`), com geração automática de tipos (`.d.ts`).

#### Módulos e Exports Canônicos:
1. **`@alaska/contracts/tenant`**:
   * `TenantSchema`, `TenantCategorySchema` (`menu`, `shop`, `hub`, `pro`), `TenantThemeSchema` (11 temas cromáticos), `OpeningHoursSchema`, `PixConfigSchema`, `StoreReviewsSchema`.
   * Tipos inferidos: `Tenant`, `TenantCategory`, `TenantTheme`, `OpeningHours`, `PixConfig`, `StoreReviews`.
2. **`@alaska/contracts/catalog`**:
   * `ProductSchema`, `CategorySchema`, `OptionGroupSchema`, `OptionItemSchema`.
   * Tipos inferidos: `Product`, `Category`, `OptionGroup`, `OptionItem`.
3. **`@alaska/contracts/order`**:
   * `CreateOrderSchema`, `OrderItemSchema`, `DeliveryTypeSchema`, `PaymentMethodSchema`, `OrderStatusSchema`.
   * Tipos inferidos: `CreateOrderDto`, `OrderItem`, `DeliveryType`, `PaymentMethod`, `OrderStatus`.
4. **`@alaska/contracts/booking`**:
   * `CreateBookingSchema`, `BookingServiceSchema`, `ProfessionalSchema`, `BookingSlotSchema`.
   * Tipos inferidos: `CreateBookingDto`, `BookingService`, `Professional`, `BookingSlot`.
5. **`@alaska/contracts/pix`**:
   * `PixQrCodeRequestSchema`, `PixQrCodeResponseSchema`, `PixKeySchema`.
   * Tipos inferidos: `PixQrCodeRequest`, `PixQrCodeResponse`, `PixKey`.
6. **`@alaska/contracts/common`**:
   * `AddressSchema`, `CepSchema`, `PhoneSchema`, `MoneyCentsSchema`.
   * Tipos inferidos: `Address`, `MoneyCents`.

---

### 3. Pipeline de Orquestração com Turborepo (`turbo.json`)

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".output/**", ".next/**", "dist/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

---

### 4. Estratégia de Deploy & CI/CD

1. **Frontend (Vercel)**:
   * A Vercel detecta monorepos nativamente. Basta configurar o **Root Directory** como `apps/web`. A Vercel compilará `@alaska/contracts` automaticamente antes do build do Nuxt 3.
2. **Backend (Docker / VPS / Coolify / Railway)**:
   * Utilização do comando `turbo prune --scope=api --docker` para gerar um subconjunto enxuto contendo apenas os arquivos necessários para o backend e seus pacotes internos, otimizando o cache das camadas Docker.

---

## Consequências

### Positivas
* **End-to-End Type Safety**: Tipagem estrita ponta a ponta. Se um campo mudar no contrato, o compilador TypeScript acusará o erro imediatamente no frontend e no backend.
* **Commits e PRs Atômicos**: Uma funcionalidade completa (contrato + endpoint + UI + testes) é implementada e revisada em um único commit.
* **DX Superior para IA & Agentes**: O Cursor IDE e agentes autônomos operam sobre toda a árvore do projeto com visibilidade total.
* **Zero Overhead de Pacotes**: Uso de links simbólicos locais (`workspace:*`) sem necessidade de publicação no registro NPM.

### Negativas / Mitigações
* **Reorganização Inicial de Pastas**: Exige mover os repositórios atuais para `apps/web` e `apps/api`.
  * *Mitigação*: A migração será executada de forma incremental, mantendo as suítes de teste Vitest como gate de validação para garantir zero regressão.

---

## Plano de Implementação

1. **Fase 1 (Documentação & ADRs)**: Registrar as ADRs no frontend e backend e criar o guia de arquitetura.
2. **Fase 2 (Estruturação do Pacote `@alaska/contracts`)**: Configurar `packages/contracts` com Zod e `tsup`.
3. **Fase 3 (Workspaces e Raiz)**: Criar o `package.json` raiz, `pnpm-workspace.yaml` e `turbo.json`.
4. **Fase 4 (Migração dos Apps)**: Alocar o Nuxt 3 em `apps/web` e o NestJS em `apps/api`, atualizando os imports de tipos para `@alaska/contracts`.
5. **Fase 5 (Test Harness Gate)**: Executar todos os testes no Vitest (`pnpm test`) garantindo 100% de aprovação.
