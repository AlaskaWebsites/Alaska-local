<!-- components/StoreReviewsModal.vue -->
<script setup lang="ts">
import { ref, computed, toRef, onMounted, onUnmounted } from "vue";
import { useBodyScrollLock } from "~/composables/useBodyScrollLock";
import { useTenantTheme } from "~/composables/useTenantTheme";
import {
  Star,
  X,
  MessageSquareWarning,
  FileCheck2,
  Info,
  ChevronRight,
  Sparkles,
} from "lucide-vue-next";
import type { StoreReviews, TenantTheme } from "~/types/tenant";

const props = defineProps<{
  reviews: StoreReviews;
  isOpen: boolean;
  theme?: TenantTheme;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

// 1. Tema Dinâmico por Segmento
const { themeClasses } = useTenantTheme(toRef(props, "theme"));

// 2. Trava de Rolagem de Fundo (Body Scroll Lock)
useBodyScrollLock(toRef(props, "isOpen"));

// 3. Fechamento com Tecla ESC no Desktop
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.isOpen) {
    emit("close");
  }
};

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener("keydown", handleKeyDown);
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener("keydown", handleKeyDown);
  }
});

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
      class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col sm:items-center sm:justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      @click="emit('close')">
      <div role="dialog" aria-modal="true" aria-labelledby="reviews-modal-title"
        class="bg-slate-900 text-slate-100 w-full h-full sm:h-auto sm:max-h-[88vh] sm:max-w-lg flex flex-col overflow-hidden sm:rounded-3xl sm:border sm:border-slate-800 sm:shadow-2xl"
        @click.stop>
        <!-- Header do Modal (Fixo no Topo) -->
        <div class="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <h2 id="reviews-modal-title" class="text-lg font-extrabold text-white">
            Avaliações da Loja
          </h2>
          <button @click="emit('close')"
            class="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            aria-label="Fechar avaliações da loja">
            <X class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <!-- Conteúdo com Rolagem Suave -->
        <div class="p-4 sm:p-5 overflow-y-auto flex-1 space-y-6">
          <!-- 1. Qualidade do Serviço -->
          <section aria-labelledby="service-quality-title">
            <h3 id="service-quality-title" class="text-sm font-bold text-slate-300 mb-2.5">
              Qualidade do serviço
            </h3>

            <div class="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-sm">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 font-bold text-white text-sm">
                  <span
                    class="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-xs text-amber-400"
                    aria-hidden="true">★</span>
                  {{ reviews.serviceQuality.experienceLabel }}
                </div>
                <ChevronRight class="h-4 w-4 text-slate-500" aria-hidden="true" />
              </div>

              <p class="mt-1.5 text-xs text-slate-400 leading-relaxed">
                {{ reviews.serviceQuality.description }}
              </p>

              <!-- Barra Segmentada de Níveis Dinâmica -->
              <div class="mt-4 grid grid-cols-5 gap-1.5" role="progressbar"
                :aria-valuenow="reviews.serviceQuality.level" aria-valuemin="1" aria-valuemax="5"
                :aria-label="`Nível de serviço: ${reviews.serviceQuality.level} de 5`">
                <div v-for="lvl in 5" :key="lvl" :class="[
                  'h-2 rounded-full transition-all',
                  lvl <= reviews.serviceQuality.level ? [themeClasses.primaryBg, 'shadow-xs'] : 'bg-slate-800',
                ]" />
              </div>

              <div class="mt-2 flex justify-between text-[11px] font-medium text-slate-500" aria-hidden="true">
                <span>Nível 1</span>
                <span>Nível 2</span>
                <span class="font-bold text-slate-200">Nível 3</span>
                <span>Nível 4</span>
                <span class="flex items-center gap-0.5 text-amber-400 font-semibold">
                  <Sparkles class="h-3 w-3" /> Super
                </span>
              </div>

              <!-- Badges de Desempenho Dinâmicos -->
              <div class="mt-5 grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-4 text-center">
                <div class="flex flex-col items-center">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full border"
                    :class="[themeClasses.badgeBg, themeClasses.badgeBorder, themeClasses.primaryText]"
                    aria-hidden="true">
                    <Star class="h-4 w-4 fill-current" />
                  </div>
                  <span class="mt-2 text-[11px] font-medium text-slate-300 leading-tight">
                    Avaliações excelentes
                  </span>
                </div>

                <div class="flex flex-col items-center">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-400"
                    aria-hidden="true">
                    <MessageSquareWarning class="h-4 w-4" />
                  </div>
                  <span class="mt-2 text-[11px] font-medium text-slate-300 leading-tight">
                    Poucas reclamações
                  </span>
                </div>

                <div class="flex flex-col items-center">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full border"
                    :class="[themeClasses.badgeBg, themeClasses.badgeBorder, themeClasses.primaryText]"
                    aria-hidden="true">
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
          <section aria-labelledby="reviews-summary-title">
            <div class="flex items-center justify-between mb-2.5">
              <h3 id="reviews-summary-title" class="text-sm font-bold text-slate-300">
                Resumo
              </h3>
              <button class="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
                aria-label="Informações sobre como funcionam as avaliações">
                Como funcionam as avaliações
                <Info class="h-3 w-3" aria-hidden="true" />
              </button>
            </div>

            <div class="flex items-center gap-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-sm"
              :aria-label="`Média ${reviews.score.toFixed(1)} de 5 estrelas baseada em ${reviews.totalReviews} avaliações`">
              <!-- Nota Grande -->
              <div class="text-center">
                <div class="flex items-center justify-center gap-1.5 text-3xl font-black text-white">
                  {{ reviews.score.toFixed(1) }}
                  <Star class="h-6 w-6 fill-amber-400 text-amber-400" aria-hidden="true" />
                </div>
                <span class="text-xs text-slate-500 font-medium">{{ reviews.totalReviews }} avaliações</span>
              </div>

              <!-- Barras Horizontais de Distribuição Dinâmicas -->
              <div class="flex-1 space-y-1.5" role="group" aria-label="Distribuição de estrelas">
                <div v-for="star in starLevels" :key="star" class="flex items-center gap-2 text-xs text-slate-400">
                  <span class="w-3 text-right font-medium" aria-hidden="true">{{ star }}</span>
                  <Star class="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                  <div class="h-1.5 flex-1 rounded-full bg-slate-800 overflow-hidden" role="progressbar"
                    :aria-valuenow="getDistributionPercentage(star)" aria-valuemin="0" aria-valuemax="100"
                    :aria-label="`${star} estrelas: ${getDistributionPercentage(star)}%`">
                    <div class="h-full rounded-full transition-all duration-300" :class="themeClasses.primaryBg"
                      :style="`inline-size: ${getDistributionPercentage(star)}%`" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 3. Lista de Comentários -->
          <section aria-labelledby="comments-title">
            <h3 id="comments-title" class="text-sm font-bold text-slate-300 mb-3">
              Comentários
            </h3>

            <!-- Filtros em Pílula Dinâmicos -->
            <div class="flex gap-2 mb-4" role="tablist" aria-label="Filtro de comentários">
              <button role="tab" :aria-selected="activeFilter === 'todos'" aria-controls="reviews-comments-list"
                @click="activeFilter = 'todos'"
                class="rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer" :class="activeFilter === 'todos'
                  ? [themeClasses.buttonPrimary, 'shadow-sm']
                  : 'border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'">
                Comentários
              </button>
              <button role="tab" :aria-selected="activeFilter === 'recentes'" aria-controls="reviews-comments-list"
                @click="activeFilter = 'recentes'"
                class="rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer" :class="activeFilter === 'recentes'
                  ? [themeClasses.buttonPrimary, 'shadow-sm']
                  : 'border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'">
                Recentes
              </button>
            </div>

            <!-- Cards de Comentário -->
            <div id="reviews-comments-list" class="space-y-3" role="feed" aria-label="Lista de comentários">
              <article v-for="item in displayedComments" :key="item.id"
                class="rounded-2xl border border-slate-800/90 bg-slate-950/70 p-4"
                :aria-label="`Avaliação de ${item.author}, nota ${item.rating} estrelas`">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-xs text-white">{{ item.author }}</span>
                  <span class="text-[11px] text-slate-500">{{ item.date }}</span>
                </div>

                <div class="flex gap-0.5 mt-1.5" :aria-label="`${item.rating} de 5 estrelas`">
                  <Star v-for="i in 5" :key="i" aria-hidden="true" :class="[
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
              </article>
            </div>
          </section>
        </div>
      </div>
    </div>
  </Teleport>
</template>