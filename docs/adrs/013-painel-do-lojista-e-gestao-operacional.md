# ADR 013: Painel do Lojista (Merchant Admin) & Gestão Operacional em Tempo Real

- **Status:** Aceito / Em Implementação (Estágio 2 — Item 2)
- **Data:** 2026-08-29
- **Contexto:** Módulos `pages/[slug]/admin.vue`, `composables/useMerchantAdmin.ts`, `types/admin.ts`, `ProductController`, `TenantController`, `IProductRepository`, `ToggleProductAvailabilityUseCase`, `UpdateProductUseCase`, `UpdateTenantHoursUseCase`.

---

## 1. Contexto & Desafio de Negócio

No **Estágio 1**, os catálogos dos estabelecimentos locais foram estruturados em arquivos JSON locais com suporte a leitura via API. No entanto, na operação diária de um estabelecimento real (como hamburgueria no pico da noite, adega com estoque oscilante ou boutique com peças únicas):

1. **Esgotamento Repentino de Produtos:** Quando um ingrediente ou item acaba (ex: queijo coalho, pack Heineken gelado, vestido M), o lojista precisa pausar o produto no cardápio em menos de **3 segundos** pelo celular para evitar pedidos impossíveis de atender.
2. **Reajuste Ágil de Preços:** Variações de custo de fornecedores exigem atualização rápida de preços e descrições.
3. **Gestão de Expediente e Feriados:** Necessidade de alterar horários de funcionamento ou pausar a loja temporariamente (modo "Fechado para Pedidos").

---

## 2. Decisão Arquitetural

Adotamos uma arquitetura modular em 4 pilares:

### A. Endpoints Granulares & RESTful (Clean Architecture)
Em vez de trafegar o catálogo inteiro a cada pequena alteração, o backend NestJS 11 fornece endpoints de mutação atômica:
* `PATCH /api/v1/products/:id/availability`: Alterna a flag booleana `available` (pausar/ativar).
* `PATCH /api/v1/products/:id`: Atualiza preço (`priceCents` com Value Object `Money`), nome e descrição.
* `PATCH /api/v1/tenants/:slug/hours`: Atualiza `openingHours: { open, close }` e status de atendimento.
* `GET /api/v1/products/tenant/:tenantId`: Lista produtos do estabelecimento com seus respectivos opcionais.

### B. Interface Mobile-First Otimizada (`/[slug]/admin`)
* Desenvolvida em Nuxt 3 com Vue 3 e Tailwind CSS, projetada especificamente para telas de 360px a 430px (smartphones dos lojistas).
* **Switches estilo iFood**: Toggle com feedback imediato para ativar/desativar produtos.
* **Optimistic UI**: A interface reflete a mudança no mesmo instante e sincroniza com a API em segundo plano. Em caso de falha de rede, a interface faz o rollback gracioso e notifica o lojista via Toast.

### C. Segurança e Acesso Leve
* Autenticação simplificada via PIN / Chave de Acesso do Lojista (sem necessidade de senhas complexas que causam esquecimento no ambiente de cozinha/salão).

### D. Test Harness Determinístico
* Cada caso de uso é validado por suítes unitárias isoladas no Vitest no backend e no frontend, garantindo zero regressões.

---

## 3. Consequências & Benefícios

* **Autonomia Total do Lojista:** O comerciante gerencia estoque e horários pelo próprio WhatsApp/Celular sem acionar o desenvolvedor.
* **Zero Fricção de Atendimento:** Menos cancelamentos de pedidos por falta de produto.
* **Escalabilidade:** O backend PostgreSQL com RLS persiste as alterações de forma atômica e multi-tenant.
