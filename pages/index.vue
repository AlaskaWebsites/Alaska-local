<!-- pages/index.vue -->
<template>
  <div class="min-h-screen bg-[#f5f5f5] text-slate-800 selection:bg-slate-900 selection:text-white">
    <!-- 1. Header & Hero Showcase -->
    <header class="bg-white border-b border-slate-200/80 py-12 px-4 sm:px-6">
      <div class="max-w-4xl mx-auto text-center space-y-4">
        <!-- Badge Superior -->
        <div
          class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-bold text-slate-700 border border-slate-200/80 shadow-xs">
          <Sparkles class="w-3.5 h-3.5 text-slate-700" aria-hidden="true" />
          <span>Vitrines Mobile & Pedidos no WhatsApp</span>
        </div>

        <!-- Título Principal -->
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Alaska Local — Demonstrações Ativas
        </h1>

        <p class="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Selecione um dos modelos abaixo para visualizar a experiência do cardápio digital e catálogo mobile-first em
          tempo real.
        </p>

        <!-- Filtros em Pílulas Segmentadas -->
        <div class="flex flex-wrap items-center justify-center gap-2 pt-2" role="tablist"
          aria-label="Filtro de modelos de demonstração">
          <button role="tab" :aria-selected="activeFilter === 'todos'" aria-controls="showcase-grid"
            @click="activeFilter = 'todos'" :class="[
              'rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer shadow-xs',
              activeFilter === 'todos'
                ? 'bg-slate-900 text-white font-bold shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
            ]">
            Todos os Modelos ({{ tenantsList.length }})
          </button>

          <button role="tab" :aria-selected="activeFilter === 'menu'" aria-controls="showcase-grid"
            @click="activeFilter = 'menu'" :class="[
              'rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer shadow-xs',
              activeFilter === 'menu'
                ? 'bg-red-600 text-white font-bold shadow-sm shadow-red-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
            ]">
            🍔 Alimentação & Espetos (Alaska Menu)
          </button>

          <button role="tab" :aria-selected="activeFilter === 'hub'" aria-controls="showcase-grid"
            @click="activeFilter = 'hub'" :class="[
              'rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer shadow-xs',
              activeFilter === 'hub'
                ? 'bg-purple-700 text-white font-bold shadow-sm shadow-purple-700/20'
                : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
            ]">
            ✂️ Serviços & Saúde (Alaska Hub)
          </button>
        </div>
      </div>
    </header>

    <!-- 2. Grid de Vitrines / Demonstrações -->
    <main class="max-w-5xl mx-auto px-4 py-12">
      <div id="showcase-grid" role="region" aria-label="Lista de demonstrações de lojas"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink v-for="store in filteredTenants" :key="store.slug" :to="`/${store.slug}`"
          :aria-label="`Acessar demonstração de ${store.name}. ${isHubStore(store.slug) ? 'Serviços e agendamentos' : 'Cardápio e pedidos'}${store.reviews ? `. Avaliação ${store.reviews.score.toFixed(1)} de 5 estrelas` : ''}`"
          class="group bg-white rounded-2xl border border-slate-200 hover:shadow-md shadow-sm transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer active:scale-[0.99]"
          :class="getStoreBorderHover(store.theme)">
          <!-- Banner Superior da Loja -->
          <div class="relative h-36 w-full bg-slate-100 overflow-hidden">
            <img v-if="store.banner" :src="store.banner" :alt="`Banner de ${store.name}`"
              class="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
            <div v-else class="w-full h-full bg-slate-200" aria-hidden="true"></div>

            <!-- Logo Sobreposto -->
            <div
              class="absolute bottom-2.5 left-3.5 h-12 w-12 rounded-xl border-2 border-white overflow-hidden bg-white shadow-sm">
              <img v-if="store.logo" :src="store.logo" :alt="`Logotipo de ${store.name}`"
                class="w-full h-full object-cover" />
              <div v-else
                class="w-full h-full flex items-center justify-center bg-slate-100 text-slate-700 font-bold text-sm"
                aria-hidden="true">
                {{ store.name.charAt(0) }}
              </div>
            </div>

            <!-- Tag de Vertical (Menu vs Hub) -->
            <span :class="[
              'absolute top-3 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs backdrop-blur-md',
              isHubStore(store.slug)
                ? 'bg-purple-900/90 text-purple-100 border border-purple-700/50'
                : 'bg-slate-900/85 text-white border border-slate-700/50'
            ]">
              {{ isHubStore(store.slug) ? 'Alaska Hub' : 'Alaska Menu' }}
            </span>
          </div>

          <!-- Conteúdo e Informações do Card -->
          <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <div class="flex items-center justify-between gap-2">
                <h2 class="font-bold text-base text-slate-900 transition-colors truncate"
                  :class="getStoreTitleHover(store.theme)">
                  {{ store.name }}
                </h2>

                <!-- Avaliação em Estrelas -->
                <div v-if="store.reviews" :aria-label="`Avaliação ${store.reviews.score.toFixed(1)} estrelas`"
                  class="flex items-center gap-1 text-xs font-bold text-slate-800 shrink-0 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                  <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                  <span>{{ store.reviews.score.toFixed(1) }}</span>
                </div>
              </div>

              <p class="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                {{ store.description || 'Vitrines online, pedidos somados e atendimento direto no WhatsApp.' }}
              </p>
            </div>

            <!-- Footer do Card com Botão de Ação -->
            <div
              class="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
              <span class="text-[11px] text-slate-400 font-normal">Ver Cardápio / Serviços</span>
              <span
                class="inline-flex items-center gap-1 font-bold text-slate-900 group-hover:translate-x-1 transition-transform"
                aria-hidden="true">
                Acessar
                <ChevronRight class="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900" />
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Sparkles, Star, ChevronRight } from 'lucide-vue-next'
import { TenantSchema, type Tenant } from '~/types/tenant'

const activeFilter = ref<'todos' | 'menu' | 'hub'>('todos')

// 1. Carregamento de Todos os Arquivos JSON de Tenants
const files = import.meta.glob('~/data/*.json', { eager: true }) as Record<string, { default: any }>
const tenantsList = computed<Tenant[]>(() => {
  const list: Tenant[] = []
  Object.values(files).forEach((mod) => {
    try {
      const parsed = TenantSchema.parse(mod.default || mod)
      list.push(parsed)
    } catch (e) {
      console.error('Erro ao validar tenant:', e)
    }
  })
  return list
})

function isHubStore(slug: string): boolean {
  return slug === 'barbearia-style' || slug === 'clinica-sorriso'
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
      return 'hover:border-amber-300'
    case 'health':
      return 'hover:border-teal-300'
    case 'drinks':
      return 'hover:border-purple-300'
    default:
      return 'hover:border-red-300'
  }
}

const filteredTenants = computed(() => {
  if (activeFilter.value === 'menu') {
    return tenantsList.value.filter((t) => !isHubStore(t.slug))
  }
  if (activeFilter.value === 'hub') {
    return tenantsList.value.filter((t) => isHubStore(t.slug))
  }
  return tenantsList.value
})

useHead({
  title: 'Alaska Local — Vitrines e Cardápios Digitais',
  meta: [
    {
      name: 'description',
      content: 'Soluções digitais locais para food service, adegas, delivery e prestadores de serviços.'
    }
  ]
})
</script>
