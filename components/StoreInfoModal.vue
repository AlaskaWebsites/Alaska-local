<script setup lang="ts">
import { computed } from "vue";
import {
  X,
  MapPin,
  Clock,
  CreditCard,
  DollarSign,
  Info,
  ExternalLink,
  Navigation,
  ChevronRight,
} from "lucide-vue-next";
import type { Tenant } from "~/types/tenant";

const props = defineProps<{
  tenant: Tenant;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

// Verifica se a loja está aberta no momento
const isOpenNow = computed(() => {
  if (!props.tenant.openingHours) return null;
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const [openHours, openMinutes] = props.tenant.openingHours.open.split(':').map(Number);
  const [closeHours, closeMinutes] = props.tenant.openingHours.close.split(':').map(Number);
  
  const openMinutesTotal = openHours * 60 + openMinutes;
  const closeMinutesTotal = closeHours * 60 + closeMinutes;
  
  // Lida com horários que atravessam meia-noite
  if (closeMinutesTotal < openMinutesTotal) {
    return currentMinutes >= openMinutesTotal || currentMinutes < closeMinutesTotal;
  }
  
  return currentMinutes >= openMinutesTotal && currentMinutes < closeMinutesTotal;
});

// Formata o horário de funcionamento para exibição
const formatOpeningHours = computed(() => {
  if (!props.tenant.openingHours) return null;
  return `${props.tenant.openingHours.open} às ${props.tenant.openingHours.close}`;
});
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-sm transition-opacity">
      <div
        class="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white p-5 shadow-2xl text-slate-800">
        <!-- Header do Modal -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 class="text-lg font-bold text-slate-900">Informações da Loja</h2>
          <button @click="emit('close')"
            class="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- 1. Cabeçalho com Nome e Categoria -->
        <section class="mt-4">
          <div class="flex items-start gap-3">
            <div v-if="tenant.logo" class="h-14 w-14 shrink-0 rounded-full overflow-hidden border-2 border-slate-100">
              <img :src="tenant.logo" :alt="tenant.name" class="h-full w-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-base text-slate-900 leading-tight">{{ tenant.name }}</h3>
              <div class="flex items-center gap-2 mt-1 text-xs text-slate-500">
                <span v-if="tenant.category">{{ tenant.category }}</span>
                <span v-if="tenant.distance" class="text-slate-300">•</span>
                <span v-if="tenant.distance">{{ tenant.distance }}</span>
                <span v-if="tenant.priceRange" class="text-slate-300">•</span>
                <span v-if="tenant.priceRange">{{ tenant.priceRange }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. Descrição -->
        <section v-if="tenant.description" class="mt-5">
          <h4 class="text-sm font-bold text-slate-900 mb-2">Sobre</h4>
          <p class="text-xs text-slate-600 leading-relaxed">{{ tenant.description }}</p>
        </section>

        <!-- 3. Horário de Funcionamento -->
        <section v-if="tenant.openingHours" class="mt-5">
          <h4 class="text-sm font-bold text-slate-900 mb-2">Horário de funcionamento</h4>
          
          <div class="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Clock class="h-4 w-4 text-slate-500" />
                <span class="text-xs font-medium text-slate-700">Hoje</span>
              </div>
              <span :class="[
                'text-xs font-bold px-2 py-1 rounded-full',
                isOpenNow ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              ]">
                {{ isOpenNow ? 'Aberto agora' : 'Fechado' }}
              </span>
            </div>
            
            <div class="mt-2 text-xs text-slate-600">
              {{ formatOpeningHours }}
            </div>
          </div>
        </section>

        <!-- 4. Formas de Pagamento -->
        <section class="mt-5">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-sm font-bold text-slate-900">Formas de pagamento</h4>
            <button class="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700">
              Ver mais
              <ChevronRight class="h-3 w-3" />
            </button>
          </div>

          <div class="space-y-3">
            <!-- Pagamento Online -->
            <div class="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3">
              <div class="flex items-center gap-2 mb-2">
                <CreditCard class="h-4 w-4 text-slate-500" />
                <span class="text-xs font-medium text-slate-700">Online pelo site</span>
              </div>
              
              <div v-if="tenant.paymentMethods && tenant.paymentMethods.length > 0" class="flex flex-wrap gap-2">
                <span v-for="method in tenant.paymentMethods" :key="method"
                  class="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded-full text-slate-600">
                  {{ method }}
                </span>
              </div>
              <div v-else class="text-[10px] text-slate-400">
                Pix, Cartão de Crédito, Débito
              </div>
            </div>

            <!-- Pagamento na Entrega -->
            <div class="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3">
              <div class="flex items-center gap-2 mb-2">
                <DollarSign class="h-4 w-4 text-slate-500" />
                <span class="text-xs font-medium text-slate-700">Na entrega</span>
              </div>
              
              <div class="text-[10px] text-slate-400">
                Dinheiro, Pix, Cartão
              </div>
            </div>
          </div>
        </section>

        <!-- 5. Endereço -->
        <section v-if="tenant.address" class="mt-5">
          <h4 class="text-sm font-bold text-slate-900 mb-2">Endereço</h4>
          
          <div class="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3">
            <div class="flex items-start gap-2">
              <MapPin class="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
              <span class="text-xs text-slate-600 leading-relaxed">{{ tenant.address }}</span>
            </div>
            
            <button class="mt-2 flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium">
              <Navigation class="h-3 w-3" />
              Ver no mapa
              <ExternalLink class="h-3 w-3" />
            </button>
          </div>
        </section>

        <!-- 6. Informações Adicionais -->
        <section class="mt-5">
          <div class="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 rounded-xl p-3">
            <Info class="h-4 w-4" />
            <span>Informações verificadas pelo Alaska Local</span>
          </div>
        </section>
      </div>
    </div>
  </Teleport>
</template>
