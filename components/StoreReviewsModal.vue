<!-- components/StoreReviewsModal.vue -->
<script setup lang="ts">
import { ref, computed } from "vue";
import {
  Star,
  X,
  MessageSquareWarning,
  FileCheck2,
  Info,
  ChevronRight,
  Sparkles,
} from "lucide-vue-next";
import type { StoreReviews } from "~/types/tenant";

const props = defineProps<{
  reviews: StoreReviews;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const activeFilter = ref<"todos" | "recentes">("todos");

// Array de estrelas de 5 a 1
const starLevels: number[] = Array.of(5, 4, 3, 2, 1);

// Helper para obter a porcentagem da distribuição com segurança de tipos
const getDistributionPercentage = (star: number): number => {
  const dist = props.reviews.distribution as Record<number, number>;
  return dist[star] ?? 0;
};

// Lista reativa de comentários de acordo com o filtro selecionado
const displayedComments = computed(() => {
  if (!props.reviews.comments) return [];
  if (activeFilter.value === "recentes") {
    return [...props.reviews.comments].reverse();
  }
  return props.reviews.comments;
});
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-md transition-opacity"
      @click="emit('close')">
      <div
        class="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl text-slate-100"
        @click.stop>
        <!-- Header do Modal -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-3.5">
          <h2 class="text-lg font-extrabold text-white">Avaliações da Loja</h2>
          <button @click="emit('close')"
            class="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer">
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- 1. Qualidade do Serviço -->
        <section class="mt-5">
          <h3 class="text-sm font-bold text-slate-300 mb-2.5">Qualidade do serviço</h3>

          <div class="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-sm">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 font-bold text-white text-sm">
                <span
                  class="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-xs text-amber-400">★</span>
                {{ reviews.serviceQuality.experienceLabel }}
              </div>
              <ChevronRight class="h-4 w-4 text-slate-500" />
            </div>

            <p class="mt-1.5 text-xs text-slate-400 leading-relaxed">
              {{ reviews.serviceQuality.description }}
            </p>

            <!-- Barra Segmentada de Níveis -->
            <div class="mt-4 grid grid-cols-5 gap-1.5">
              <div v-for="lvl in 5" :key="lvl" :class="[
                'h-2 rounded-full transition-all',
                lvl <= reviews.serviceQuality.level ? 'bg-emerald-500 shadow-xs shadow-emerald-500/30' : 'bg-slate-800',
              ]" />
            </div>

            <div class="mt-2 flex justify-between text-[11px] font-medium text-slate-500">
              <span>Nível 1</span>
              <span>Nível 2</span>
              <span class="font-bold text-slate-200">Nível 3</span>
              <span>Nível 4</span>
              <span class="flex items-center gap-0.5 text-amber-400 font-semibold">
                <Sparkles class="h-3 w-3" /> Super
              </span>
            </div>

            <!-- Badges de Desempenho -->
            <div class="mt-5 grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-4 text-center">
              <div class="flex flex-col items-center">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
                  <Star class="h-4 w-4 fill-emerald-400" />
                </div>
                <span class="mt-2 text-[11px] font-medium text-slate-300 leading-tight">
                  Avaliações excelentes
                </span>
              </div>

              <div class="flex flex-col items-center">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-400">
                  <MessageSquareWarning class="h-4 w-4" />
                </div>
                <span class="mt-2 text-[11px] font-medium text-slate-300 leading-tight">
                  Poucas reclamações
                </span>
              </div>

              <div class="flex flex-col items-center">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
                  <FileCheck2 class="h-4 w-4" />
                </div>
                <span class="mt-2 text-[11px] font-medium text-slate-300 leading-tight">
                  Zero cancelamentos
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. Resumo das Avaliações (Score e Distribuição) -->
        <section class="mt-6">
          <div class="flex items-center justify-between mb-2.5">
            <h3 class="text-sm font-bold text-slate-300">Resumo</h3>
            <button class="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200">
              Como funcionam as avaliações
              <Info class="h-3 w-3" />
            </button>
          </div>

          <div class="flex items-center gap-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-sm">
            <!-- Nota Grande -->
            <div class="text-center">
              <div class="flex items-center justify-center gap-1.5 text-3xl font-black text-white">
                {{ reviews.score.toFixed(1) }}
                <Star class="h-6 w-6 fill-amber-400 text-amber-400" />
              </div>
              <span class="text-xs text-slate-500 font-medium">{{ reviews.totalReviews }} avaliações</span>
            </div>

            <!-- Barras Horizontais de Distribuição -->
            <div class="flex-1 space-y-1.5">
              <div v-for="star in starLevels" :key="star" class="flex items-center gap-2 text-xs text-slate-400">
                <span class="w-3 text-right font-medium">{{ star }}</span>
                <Star class="h-3 w-3 fill-amber-400 text-amber-400" />
                <div class="h-1.5 flex-1 rounded-full bg-slate-800 overflow-hidden">
                  <div class="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    :style="`inline-size: ${getDistributionPercentage(star)}%`" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 3. Lista de Comentários -->
        <section class="mt-6">
          <h3 class="text-sm font-bold text-slate-300 mb-3">Comentários</h3>

          <!-- Filtros em Pílula -->
          <div class="flex gap-2 mb-4">
            <button @click="activeFilter = 'todos'" :class="[
              'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
              activeFilter === 'todos'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200',
            ]">
              Comentários
            </button>
            <button @click="activeFilter = 'recentes'" :class="[
              'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
              activeFilter === 'recentes'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200',
            ]">
              Recentes
            </button>
          </div>

          <!-- Cards de Comentário -->
          <div class="space-y-3">
            <div v-for="item in displayedComments" :key="item.id"
              class="rounded-2xl border border-slate-800/90 bg-slate-950/70 p-4">
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs text-white">{{ item.author }}</span>
                <span class="text-[11px] text-slate-500">{{ item.date }}</span>
              </div>

              <div class="flex gap-0.5 mt-1.5">
                <Star v-for="i in 5" :key="i" :class="[
                  'h-3 w-3',
                  i <= item.rating
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-slate-800 text-slate-800',
                ]" />
              </div>

              <p class="mt-2 text-xs text-slate-300 leading-relaxed">
                {{ item.comment }}
              </p>

              <div v-if="item.itemsOrdered && item.itemsOrdered.length > 0" class="mt-2.5 text-[11px] text-slate-500">
                <span class="font-medium text-slate-400">Itens pedidos:</span>
                {{ item.itemsOrdered.join(", ") }}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </Teleport>
</template>