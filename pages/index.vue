<!-- pages/index.vue -->
<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 pb-16">
    <!-- Header e Apresentação -->
    <header class="bg-white border-b border-slate-200 py-12 px-4 sm:px-6">
      <div class="max-w-4xl mx-auto text-center space-y-3">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
          <Sparkles class="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
          <span>Ecossistema Multi-Tenant Alaska Local</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Vitrines Digitais & Cardápios Locais
        </h1>
        <p class="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          Demonstrações interativas de alta conversão para comércios, lojas e prestadores de serviços com fechamento direto no WhatsApp.
        </p>

        <!-- Filtros por Categoria de Negócio (Semântica de Tablist W3C) -->
        <div class="flex flex-wrap items-center justify-center gap-2 pt-4" role="tablist"
          aria-label="Filtrar demonstrações por categoria de negócio">
          <button
            v-for="tab in filterTabs"
            :key="tab.id"
            role="tab"
            :aria-selected="activeCategory === tab.id"
            :aria-controls="'showcase-grid'"
            @click="activeCategory = tab.id"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            :class="[
              activeCategory === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
            ]"
          >
            <span>{{ tab.emoji }}</span>
            <span>{{ tab.label }}</span>
            <span class="text-[11px] px-1.5 py-0.2 rounded-full font-medium"
              :class="activeCategory === tab.id ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'">
              {{ tab.count }}
            </span>
          </button>
        </div>
      </div>
    </header>

    <!-- Grid de Demonstrações -->
    <main class="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
      <div id="showcase-grid" role="region" aria-label="Lista de estabelecimentos disponíveis"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="store in filteredTenants"
          :key="store.slug"
          :to="`/${store.slug}`"
          :aria-label="`Acessar demonstração de ${store.name}. ${getStoreCategoryLabel(resolveCategory(store))}${store.reviews ? `. Avaliação ${store.reviews.score.toFixed(1)} de 5 estrelas` : ''}`"
          class="group bg-white rounded-2xl border border-slate-200 hover:shadow-md shadow-sm transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer active:scale-[0.99]"
          :class="getStoreBorderHover(store.theme)"
        >
          <!-- Banner Superior da Loja -->
          <div class="relative h-36 w-full bg-slate-100 overflow-hidden">
            <img v-if="store.banner" :src="store.banner" :alt="`Banner de ${store.name}`"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

            <!-- Logo da Loja -->
            <div class="absolute bottom-3 left-3 flex items-center gap-2.5">
              <img :src="store.logo || '/logo.png'" :alt="`Logo de ${store.name}`"
                class="w-12 h-12 rounded-xl bg-white p-0.5 shadow-md object-cover border border-white/50" />
            </div>

            <!-- Badge de Categoria de Negócio -->
            <span class="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md"
              :class="getCategoryBadgeClass(resolveCategory(store))">
              {{ getStoreCategoryLabel(resolveCategory(store)) }}
            </span>
          </div>

          <!-- Informações e Corpo do Card -->
          <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <div class="flex items-start justify-between gap-2">
                <h2 class="font-bold text-base text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-1"
                  :class="getStoreTitleHover(store.theme)">
                  {{ store.name }}
                </h2>

                <!-- Avaliação Prova Social -->
                <div v-if="store.reviews" class="flex items-center gap-1 shrink-0 text-xs font-bold text-slate-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                  <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                  <span>{{ store.reviews.score.toFixed(1) }}</span>
                </div>
              </div>

              <p class="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                {{ store.description }}
              </p>
            </div>

            <!-- Botão de Ação -->
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold"
              :class="getStoreTextHover(store.theme)">
              <span>{{ getStoreActionText(resolveCategory(store)) }}</span>
              <ChevronRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Estado Vazio (caso não haja lojas na categoria) -->
      <div v-if="filteredTenants.length === 0" class="text-center py-16 space-y-3">
        <p class="text-base font-bold text-slate-700">Nenhum modelo cadastrado nesta categoria ainda.</p>
        <p class="text-xs text-slate-500">Estamos desenvolvendo novas demonstrações para esta vertical.</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Sparkles, Star, ChevronRight } from 'lucide-vue-next'
import { TenantSchema, type Tenant, type BusinessCategory } from '~/types/tenant'

type FilterCategory = 'all' | BusinessCategory

const activeCategory = ref<FilterCategory>('all')

// 1. Carregamento de Todos os Arquivos JSON de Tenants
const files = import.meta.glob('~/data/*.json', { eager: true }) as Record<string, { default: any }>

const tenantsList = computed<Tenant[]>(() => {
  const list: Tenant[] = []
  for (const path in files) {
    const raw = files[path].default || files[path]
    const parsed = TenantSchema.safeParse(raw)
    if (parsed.success) {
      list.push(parsed.data)
    }
  }
  return list
})

function resolveCategory(tenant: Tenant): BusinessCategory {
  if (tenant.businessCategory) return tenant.businessCategory
  if (tenant.slug === 'bella-donna' || tenant.slug === 'karine-finardi') return 'shop'
  if (tenant.slug === 'barbearia-style' || tenant.slug === 'barbearia-dom-pedro') return 'hub'
  if (tenant.slug === 'clinica-sorriso') return 'pro'
  if (tenant.template === 'hub' || tenant.template === 'booking') return 'hub'
  if (tenant.template === 'pro') return 'pro'
  if (tenant.template === 'shop') return 'shop'
  return 'menu'
}

// 2. Abas de Filtros com Contagem Reativa
const filterTabs = computed(() => {
  const allCount = tenantsList.value.length
  const menuCount = tenantsList.value.filter((t) => resolveCategory(t) === 'menu').length
  const shopCount = tenantsList.value.filter((t) => resolveCategory(t) === 'shop').length
  const hubCount = tenantsList.value.filter((t) => resolveCategory(t) === 'hub').length
  const proCount = tenantsList.value.filter((t) => resolveCategory(t) === 'pro').length

  return [
    { id: 'all' as FilterCategory, label: 'Todos', emoji: '🌟', count: allCount },
    { id: 'menu' as FilterCategory, label: 'Cardápios & Delivery', emoji: '🍔', count: menuCount },
    { id: 'shop' as FilterCategory, label: 'Lojas & Vitrines', emoji: '🛍️', count: shopCount },
    { id: 'hub' as FilterCategory, label: 'Serviços & Agenda', emoji: '💈', count: hubCount },
    { id: 'pro' as FilterCategory, label: 'Profissionais & Pro', emoji: '⚖️', count: proCount },
  ]
})

// 3. Filtragem Reativa do Showcase
const filteredTenants = computed(() => {
  if (activeCategory.value === 'all') {
    return tenantsList.value
  }
  return tenantsList.value.filter((t) => resolveCategory(t) === activeCategory.value)
})

function getStoreCategoryLabel(cat?: string): string {
  switch (cat) {
    case 'shop':
      return '🛍️ Loja & Vitrine'
    case 'hub':
      return '💈 Serviços & Agenda'
    case 'pro':
      return '⚖️ Consultas & Pro'
    default:
      return '🍔 Cardápio & Delivery'
  }
}

function getCategoryBadgeClass(cat?: string): string {
  switch (cat) {
    case 'shop':
      return 'bg-purple-950/80 text-purple-200 border border-purple-800'
    case 'hub':
      return 'bg-amber-950/80 text-amber-200 border border-amber-800'
    case 'pro':
      return 'bg-teal-950/80 text-teal-200 border border-teal-800'
    default:
      return 'bg-red-950/80 text-red-200 border border-red-800'
  }
}

function getStoreActionText(cat?: string): string {
  switch (cat) {
    case 'shop':
      return 'Ver vitrine de peças'
    case 'hub':
      return 'Ver serviços e agendar'
    case 'pro':
      return 'Agendar consulta / avaliação'
    default:
      return 'Acessar cardápio completo'
  }
}

function getStoreTitleHover(theme?: string): string {
  switch (theme) {
    case 'barber':
      return 'group-hover:text-amber-600'
    case 'health':
      return 'group-hover:text-teal-600'
    case 'drinks':
      return 'group-hover:text-purple-600'
    default:
      return 'group-hover:text-red-600'
  }
}

function getStoreBorderHover(theme?: string): string {
  switch (theme) {
    case 'barber':
      return 'hover:border-amber-400'
    case 'health':
      return 'hover:border-teal-400'
    case 'drinks':
      return 'hover:border-purple-400'
    default:
      return 'hover:border-red-400'
  }
}

function getStoreTextHover(theme?: string): string {
  switch (theme) {
    case 'barber':
      return 'text-amber-600'
    case 'health':
      return 'text-teal-600'
    case 'drinks':
      return 'text-purple-600'
    default:
      return 'text-red-600'
  }
}

useHead({
  title: 'Alaska Local — Vitrines, Lojas e Cardápios Digitais',
  meta: [
    {
      name: 'description',
      content: 'Soluções digitais completas para food service, boutiques de moda, semijoias, clínicas e prestadores de serviços locais.'
    }
  ]
})
</script>
