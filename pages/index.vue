<!-- pages/index.vue -->
<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 pb-16 selection:bg-emerald-500 selection:text-white">
    <!-- Hero Section -->
    <header
      class="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-slate-900 text-white pt-16 pb-20 px-4 text-center">
      <div
        class="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]">
      </div>

      <div class="relative max-w-3xl mx-auto space-y-4">
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <Sparkles class="w-3.5 h-3.5" />
          Plataforma Multi-Tenant • Estágio 1
        </span>

        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Alaska <span class="text-emerald-400">Local</span>
        </h1>

        <p class="text-base sm:text-lg text-emerald-100/80 max-w-xl mx-auto leading-relaxed">
          Vitrines digitais mobile-first, cardápios interativos com fechamento no WhatsApp e otimização para o comércio
          local.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-emerald-200/70">
          <span class="flex items-center gap-1">
            <CheckCircle2 class="w-4 h-4 text-emerald-400" /> Sem taxas por pedido
          </span>
          <span class="flex items-center gap-1">
            <CheckCircle2 class="w-4 h-4 text-emerald-400" /> Domínio próprio
          </span>
          <span class="flex items-center gap-1">
            <CheckCircle2 class="w-4 h-4 text-emerald-400" /> Zero custo de infra
          </span>
        </div>
      </div>
    </header>

    <!-- Seção de Demonstrações -->
    <main class="max-w-5xl mx-auto px-4 -mt-10 relative z-10 space-y-8">
      <div class="text-center">
        <h2
          class="text-xl sm:text-2xl font-bold text-slate-900 bg-white/90 backdrop-blur-md inline-block px-6 py-2 rounded-2xl shadow-sm border border-slate-100">
          Vitrines & Demonstrações Disponíveis
        </h2>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- 1. Alaska Menu: Food & Hamburgueria -->
        <div
          class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all flex flex-col group">
          <div class="bg-amber-500 p-4 text-white flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Utensils class="w-5 h-5" />
              <h3 class="font-bold text-base">Alaska Menu</h3>
            </div>
            <span
              class="text-[10px] bg-amber-600/60 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Burger</span>
          </div>

          <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <h4 class="font-bold text-slate-900 text-sm">Hamburgueria X</h4>
              <p class="text-xs text-slate-500 mt-1">
                Burgers artesanais, smashs, opcionais obrigatórios de ponto de carne, adicionais lucrativos e combos.
              </p>
            </div>

            <NuxtLink to="/hamburgueria-x"
              class="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white text-center py-2.5 px-4 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all group-hover:bg-amber-600">
              <span>Abrir Cardápio</span>
              <ArrowRight class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>

        <!-- 2. Alaska Menu: Restaurante & Pizzaria -->
        <div
          class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all flex flex-col group">
          <div class="bg-red-500 p-4 text-white flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Utensils class="w-5 h-5" />
              <h3 class="font-bold text-base">Alaska Menu</h3>
            </div>
            <span
              class="text-[10px] bg-red-600/60 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Italian</span>
          </div>

          <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <h4 class="font-bold text-slate-900 text-sm">Restaurante Bella Italia</h4>
              <p class="text-xs text-slate-500 mt-1">
                Pizzas tradicionais, massas frescas, sobremesas e seleção de vinhos com entrega e retirada.
              </p>
            </div>

            <NuxtLink to="/restaurante-bella-italia"
              class="w-full bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white text-center py-2.5 px-4 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all group-hover:bg-red-600">
              <span>Abrir Restaurante</span>
              <ArrowRight class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>

        <!-- 3. Alaska Menu: Café & Confeitaria -->
        <div
          class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all flex flex-col group">
          <div class="bg-emerald-600 p-4 text-white flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Coffee class="w-5 h-5" />
              <h3 class="font-bold text-base">Alaska Menu</h3>
            </div>
            <span
              class="text-[10px] bg-emerald-700/60 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Cafeteria</span>
          </div>

          <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <h4 class="font-bold text-slate-900 text-sm">Café Central</h4>
              <p class="text-xs text-slate-500 mt-1">
                Cafés especiais, doces artesanais, salgados e pedidos express para retirada no balcão.
              </p>
            </div>

            <NuxtLink to="/cafe-central"
              class="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-center py-2.5 px-4 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all group-hover:bg-emerald-700">
              <span>Abrir Cafeteria</span>
              <ArrowRight class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>

        <!-- 4. Alaska Hub: Barbearia & Estética -->
        <div
          class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all flex flex-col group">
          <div class="bg-slate-800 p-4 text-white flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Scissors class="w-5 h-5 text-amber-400" />
              <h3 class="font-bold text-base">Alaska Hub</h3>
            </div>
            <span
              class="text-[10px] bg-slate-700 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider text-amber-400">Serviços</span>
          </div>

          <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <h4 class="font-bold text-slate-900 text-sm">Barbearia Style</h4>
              <p class="text-xs text-slate-500 mt-1">
                Catálogo de serviços (corte, barba, pigmentação), tabela de preços e chamada direta para WhatsApp.
              </p>
            </div>

            <NuxtLink to="/barbearia-style"
              class="w-full bg-slate-800 hover:bg-slate-900 active:scale-[0.98] text-white text-center py-2.5 px-4 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all">
              <span>Abrir Barbearia</span>
              <ArrowRight class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>

        <!-- 5. Alaska Hub: Saúde & Clínica -->
        <div
          class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all flex flex-col group md:col-span-2 lg:col-span-1">
          <div class="bg-cyan-600 p-4 text-white flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Calendar class="w-5 h-5" />
              <h3 class="font-bold text-base">Alaska Hub</h3>
            </div>
            <span
              class="text-[10px] bg-cyan-700/60 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Clínica</span>
          </div>

          <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <h4 class="font-bold text-slate-900 text-sm">Clínica Sorriso</h4>
              <p class="text-xs text-slate-500 mt-1">
                Procedimentos odontológicos, avaliações, convênios aceitos e agendamento de consultas.
              </p>
            </div>

            <NuxtLink to="/clinica-sorriso"
              class="w-full bg-cyan-600 hover:bg-cyan-700 active:scale-[0.98] text-white text-center py-2.5 px-4 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all">
              <span>Abrir Clínica</span>
              <ArrowRight class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Resumo da Arquitetura -->
      <section class="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
        <div class="flex items-center gap-2 mb-4">
          <ShieldCheck class="w-6 h-6 text-emerald-600" />
          <h3 class="text-lg font-bold text-slate-900">Fundação Técnica • Estágio 1 (Modo Sem Backend)</h3>
        </div>

        <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <strong class="text-slate-900 block mb-1">⚡ One Codebase, Infinite Domains</strong>
            Resolução dinâmica de múltiplos lojistas por slug ou domínio próprio no Nuxt 3.
          </div>
          <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <strong class="text-slate-900 block mb-1">🛡️ Validação Estrita Zod</strong>
            Schemas blindados que impedem falhas em tempo de execução ao ler os JSONs locais.
          </div>
          <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <strong class="text-slate-900 block mb-1">💬 Despacho Nativo WhatsApp</strong>
            Fechamento de pedidos somados e formatados via URL Scheme (<code class="text-emerald-700">wa.me</code>) sem
            risco de banimento.
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  Sparkles,
  Utensils,
  Coffee,
  Scissors,
  Calendar,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-vue-next'

useHead({
  title: 'Alaska Local — Vitrines e Cardápios Digitais',
  meta: [
    { name: 'description', content: 'Soluções digitais locais para food service, delivery e prestadores de serviços.' }
  ]
})
</script>