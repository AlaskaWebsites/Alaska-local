<!-- pages/index.vue -->
<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
    <!-- Efeito de Luz Ambiente Suave no Topo -->
    <div
      class="absolute top-0 inset-x-0 h-96 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.15),transparent)] pointer-events-none">
    </div>

    <!-- 1. Header & Hero Showcase -->
    <header class="relative border-b border-slate-800/80 py-14 px-4 sm:px-6">
      <div class="max-w-4xl mx-auto text-center space-y-4">
        <!-- Badge Superior -->
        <div
          class="inline-flex items-center gap-2 rounded-full bg-emerald-950/80 px-3.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30 shadow-xs backdrop-blur-md">
          <Sparkles class="w-3.5 h-3.5 text-emerald-400" />
          <span>Vitrines Mobile & Pedidos no WhatsApp</span>
        </div>

        <!-- Título Principal -->
        <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Alaska Local — Demonstrações Ativas
        </h1>

        <p class="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
          Selecione um dos modelos abaixo para visualizar a experiência do cardápio digital e catálogo mobile-first em
          tempo real.
        </p>

        <!-- Filtros por Nicho / Vertical -->
        <div class="pt-3 flex flex-wrap justify-center gap-2">
          <button @click="activeFilter = 'todos'" :class="[
            'rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer',
            activeFilter === 'todos'
              ? 'bg-white text-slate-950 font-bold shadow-md'
              : 'bg-slate-900/90 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
          ]">
            Todos os Modelos ({{ tenantsList.length }})
          </button>

          <button @click="activeFilter = 'menu'" :class="[
            'rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer',
            activeFilter === 'menu'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'bg-slate-900/90 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
          ]">
            🍔 Alimentação & Espetos (Alaska Menu)
          </button>

          <button @click="activeFilter = 'hub'" :class="[
            'rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer',
            activeFilter === 'hub'
              ? 'bg-purple-500 text-slate-950 font-bold shadow-md shadow-purple-500/20'
              : 'bg-slate-900/90 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
          ]">
            ✂️ Serviços & Saúde (Alaska Hub)
          </button>
        </div>
      </div>
    </header>

    <!-- 2. Grid de Vitrines / Demonstrações -->
    <main class="relative max-w-5xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink v-for="store in filteredTenants" :key="store.slug" :to="`/${store.slug}`"
          class="group bg-slate-900/80 rounded-3xl border border-slate-800/90 hover:border-emerald-500/50 hover:bg-slate-900 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-emerald-950/30 active:scale-[0.99]">
          <!-- Banner Superior da Loja -->
          <div class="relative h-36 w-full bg-slate-800 overflow-hidden">
            <img v-if="store.banner" :src="store.banner" :alt="store.name"
              class="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
            <div v-else class="w-full h-full bg-slate-800"></div>

            <!-- Logo Flutuante sobreposto -->
            <div
              class="absolute bottom-2.5 left-3.5 h-12 w-12 rounded-2xl border-2 border-slate-800 overflow-hidden bg-slate-900 shadow-md">
              <img v-if="store.logo" :src="store.logo" :alt="store.name" class="w-full h-full object-cover" />
              <div v-else
                class="w-full h-full flex items-center justify-center bg-slate-800 text-emerald-400 font-bold text-sm">
                {{ store.name.charAt(0) }}
              </div>
            </div>

            <!-- Tag de Vertical (Menu vs Hub) -->
            <span :class="[
              'absolute top-3 right-3 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-sm',
              isHubStore(store.slug)
                ? 'bg-purple-950/90 text-purple-300 border border-purple-800/60'
                : 'bg-emerald-950/90 text-emerald-300 border border-emerald-800/60'
            ]">
              {{ isHubStore(store.slug) ? 'Alaska Hub' : 'Alaska Menu' }}
            </span>
          </div>

          <!-- Informações do Estabelecimento -->
          <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <div class="flex items-center justify-between gap-2">
                <h2 class="font-bold text-base text-white group-hover:text-emerald-400 transition-colors truncate">
                  {{ store.name }}
                </h2>

                <!-- Avaliação em Estrelas -->
                <div v-if="store.reviews"
                  class="flex items-center gap-1 text-xs font-bold text-amber-400 shrink-0 bg-slate-950/60 px-2 py-0.5 rounded-md border border-slate-800">
                  <Star class="w-3.5 h-3.5 fill-amber-400" />
                  <span>{{ store.reviews.score.toFixed(1) }}</span>
                </div>
              </div>

              <p class="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                {{ store.description || 'Vitrines online, pedidos somados e atendimento direto no WhatsApp.' }}
              </p>
            </div>

            <!-- Footer do Card com Botão de Ação -->
            <div
              class="pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400">
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