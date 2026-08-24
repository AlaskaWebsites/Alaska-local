<!-- pages/index.vue -->
<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <!-- 1. Header & Hero Showcase -->
    <header class="bg-white border-b border-slate-100 py-12 px-4 sm:px-6">
      <div class="max-w-4xl mx-auto text-center space-y-3">
        <div
          class="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/60">
          <Sparkles class="w-3.5 h-3.5 text-emerald-600" />
          <span>Vitrines Mobile & Pedidos no WhatsApp</span>
        </div>

        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Alaska Local — Demonstrações Ativas
        </h1>

        <p class="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
          Selecione um dos modelos abaixo para visualizar a experiência do cardápio digital e catálogo mobile-first em
          tempo real.
        </p>

        <!-- Filtros por Nicho / Vertical -->
        <div class="pt-4 flex flex-wrap justify-center gap-2">
          <button @click="activeFilter = 'todos'" :class="[
            'rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer',
            activeFilter === 'todos'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          ]">
            Todos os Modelos ({{ tenantsList.length }})
          </button>
          <button @click="activeFilter = 'menu'" :class="[
            'rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer',
            activeFilter === 'menu'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          ]">
            🍔 Alimentação & Espetos (Alaska Menu)
          </button>
          <button @click="activeFilter = 'hub'" :class="[
            'rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer',
            activeFilter === 'hub'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          ]">
            ✂️ Serviços & Saúde (Alaska Hub)
          </button>
        </div>
      </div>
    </header>

    <!-- 2. Grid de Vitrines / Demonstrações -->
    <main class="max-w-4xl mx-auto px-4 py-10">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <NuxtLink v-for="store in filteredTenants" :key="store.slug" :to="`/${store.slug}`"
          class="group bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all overflow-hidden flex flex-col justify-between cursor-pointer active:scale-[0.99]">
          <!-- Banner Superior da Loja -->
          <div class="relative h-32 w-full bg-slate-100 overflow-hidden">
            <img v-if="store.banner" :src="store.banner" :alt="store.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div v-else class="w-full h-full bg-slate-800"></div>

            <!-- Logo Flutuante sobreposto -->
            <div
              class="absolute bottom-2 left-3 h-12 w-12 rounded-xl border-2 border-white overflow-hidden bg-white shadow-sm">
              <img v-if="store.logo" :src="store.logo" :alt="store.name" class="w-full h-full object-cover" />
              <div v-else
                class="w-full h-full flex items-center justify-center bg-slate-200 text-slate-600 font-bold text-sm">
                {{ store.name.charAt(0) }}
              </div>
            </div>

            <!-- Tag de Vertical (Menu vs Hub) -->
            <span :class="[
              'absolute top-2.5 right-2.5 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs',
              isHubStore(store.slug)
                ? 'bg-purple-100 text-purple-800'
                : 'bg-emerald-100 text-emerald-800'
            ]">
              {{ isHubStore(store.slug) ? 'Alaska Hub' : 'Alaska Menu' }}
            </span>
          </div>

          <!-- Informações do Estabelecimento -->
          <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <div class="flex items-center justify-between gap-1">
                <h2 class="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                  {{ store.name }}
                </h2>
                <div v-if="store.reviews" class="flex items-center gap-0.5 text-xs font-bold text-slate-800 shrink-0">
                  <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{{ store.reviews.score.toFixed(1) }}</span>
                </div>
              </div>

              <p class="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                {{ store.description || 'Vitrines online, pedidos somados e atendimento direto no WhatsApp.' }}
              </p>
            </div>

            <!-- Footer do Card com Botão de Ação -->
            <div
              class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
              <span class="text-[11px] text-slate-400">Ver Cardápio / Serviços</span>
              <span class="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Acessar
                <ChevronRight class="w-3.5 h-3.5" />
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
import type { Tenant } from '~/types/tenant'

useSeoMeta({
  title: 'Alaska Local — Showcase de Demonstrações',
  description: 'Conheça os modelos interativos de vitrines digitais para comércios locais e prestadores de serviço.',
  ogTitle: 'Alaska Local — Showcase de Demonstrações',
  ogDescription: 'Vitrines mobile-first com pedidos no WhatsApp e domínio próprio.',
})

const activeFilter = ref<'todos' | 'menu' | 'hub'>('todos')

// 1. Carregamento Dinâmico de Todos os Arquivos JSON de data/
const tenantFiles = import.meta.glob('~/data/*.json', { eager: true }) as Record<string, { default: Tenant }>

const tenantsList = computed<Tenant[]>(() => {
  return Object.values(tenantFiles).map((file) => file.default || file)
})

// 2. Identificação de Nicho (Hub para serviços/saúde, Menu para alimentação)
const hubSlugs = ['barbearia-style', 'clinica-sorriso']

function isHubStore(slug: string): boolean {
  return hubSlugs.includes(slug)
}

// 3. Filtragem Reativa do Showcase
const filteredTenants = computed(() => {
  if (activeFilter.value === 'menu') {
    return tenantsList.value.filter((store) => !isHubStore(store.slug))
  }
  if (activeFilter.value === 'hub') {
    return tenantsList.value.filter((store) => isHubStore(store.slug))
  }
  return tenantsList.value
})
</script>