<!-- components/StoreInfoModal.vue -->
<script setup lang="ts">
import { computed, toRef, onMounted, onUnmounted } from "vue";
import { useBodyScrollLock } from "~/composables/useBodyScrollLock";
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
  ShieldCheck,
  Truck,
} from "lucide-vue-next";
import type { Tenant } from "~/types/tenant";

const props = defineProps<{
  tenant: Tenant;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

// 1. Trava de Rolagem de Fundo (Body Scroll Lock)
useBodyScrollLock(toRef(props, "isOpen"));

// 2. Fechamento com Tecla ESC (Desktop Accessibility)
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

// Formatação monetária
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Verifica se a loja está aberta no momento (com suporte a virada de meia-noite)
const isOpenNow = computed(() => {
  if (!props.tenant.openingHours) return null;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [openHours, openMinutes] = props.tenant.openingHours.open.split(":").map(Number);
  const [closeHours, closeMinutes] = props.tenant.openingHours.close.split(":").map(Number);

  const openMinutesTotal = (openHours || 0) * 60 + (openMinutes || 0);
  const closeMinutesTotal = (closeHours || 0) * 60 + (closeMinutes || 0);

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
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-md transition-opacity"
      @click="emit('close')">
      <div
        class="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl text-slate-100"
        @click.stop>
        <!-- Header do Modal -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-3.5">
          <h2 class="text-lg font-extrabold text-white">Informações da Loja</h2>
          <button @click="emit('close')"
            class="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer">
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- 1. Identidade e Sobre -->
        <section class="mt-5 space-y-3">
          <div class="flex items-center gap-3.5 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <div class="h-16 w-16 rounded-2xl border-2 border-slate-700 bg-slate-900 overflow-hidden shrink-0">
              <img v-if="tenant.logo" :src="tenant.logo" :alt="tenant.name" class="h-full w-full object-cover" />
              <div v-else class="h-full w-full flex items-center justify-center text-emerald-400 font-bold text-lg">
                {{ tenant.name.charAt(0) }}
              </div>
            </div>

            <div class="min-w-0 flex-1">
              <h3 class="text-base font-bold text-white truncate">{{ tenant.name }}</h3>
              <p v-if="tenant.description" class="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                {{ tenant.description }}
              </p>
              <div class="flex items-center gap-2 mt-2 text-[11px] text-emerald-400 font-semibold">
                <ShieldCheck class="w-3.5 h-3.5" />
                <span>Estabelecimento Verificado no Alaska Local</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. Horários de Atendimento -->
        <section class="mt-6">
          <h3 class="text-sm font-bold text-slate-300 mb-2.5 flex items-center gap-2">
            <Clock class="w-4 h-4 text-emerald-400" />
            <span>Horário de Funcionamento</span>
          </h3>

          <div class="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs text-slate-300 font-medium">Status no Momento:</span>
              <span
                :class="isOpenNow ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-amber-950 text-amber-300 border-amber-800'"
                class="px-2.5 py-0.5 rounded-full text-xs font-bold border">
                {{ isOpenNow ? '🟢 Aberto agora' : '🕒 Fechado no momento' }}
              </span>
            </div>

            <div class="flex items-center justify-between border-t border-slate-800/80 pt-2.5 text-xs">
              <span class="text-slate-400">Atendimento Hoje:</span>
              <span class="font-bold text-white">{{ formatOpeningHours || 'Consulte no WhatsApp' }}</span>
            </div>
          </div>
        </section>

        <!-- 3. Formas de Pagamento -->
        <section class="mt-6">
          <h3 class="text-sm font-bold text-slate-300 mb-2.5 flex items-center gap-2">
            <CreditCard class="w-4 h-4 text-emerald-400" />
            <span>Formas de Pagamento</span>
          </h3>

          <div class="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3 text-xs">
            <div class="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-800/80">
              <div class="space-y-0.5">
                <span class="font-bold text-white block">Pix Direto (D+0)</span>
                <span class="text-slate-400 text-[11px]">Chave informada automaticamente no fechamento do pedido</span>
              </div>
              <span class="text-emerald-400 font-bold shrink-0">Instantâneo</span>
            </div>

            <div class="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-800/80">
              <div class="space-y-0.5">
                <span class="font-bold text-white block">Cartões de Crédito & Débito</span>
                <span class="text-slate-400 text-[11px]">Visa, Mastercard, Elo na maquininha do entregador</span>
              </div>
              <span class="text-slate-400 font-medium shrink-0">Na Entrega</span>
            </div>

            <div class="flex items-start justify-between gap-2">
              <div class="space-y-0.5">
                <span class="font-bold text-white block">Dinheiro em Espécie</span>
                <span class="text-slate-400 text-[11px]">Com opção de troco no checkout</span>
              </div>
              <span class="text-slate-400 font-medium shrink-0">Na Entrega</span>
            </div>
          </div>
        </section>

        <!-- 4. Endereço e Localização -->
        <section class="mt-6">
          <h3 class="text-sm font-bold text-slate-300 mb-2.5 flex items-center gap-2">
            <MapPin class="w-4 h-4 text-emerald-400" />
            <span>Endereço & Entrega</span>
          </h3>

          <div class="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3.5 text-xs">
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-1">
                <span class="font-bold text-white block">Endereço da Loja:</span>
                <span class="text-slate-400 leading-relaxed block">
                  {{ tenant.address || 'Atendimento e entrega para a região local.' }}
                </span>
              </div>

              <a v-if="tenant.address"
                :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tenant.address)}`"
                target="_blank"
                class="shrink-0 p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 hover:bg-slate-800 transition-colors flex items-center gap-1.5 font-bold"
                title="Abrir no Google Maps">
                <Navigation class="w-4 h-4" />
                <span class="text-[11px]">Rotas</span>
              </a>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
              <div class="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span class="text-slate-500 text-[11px] block">Taxa de Entrega</span>
                <span class="font-bold text-emerald-400 text-xs">
                  {{ tenant.deliveryFee ? formatCurrency(tenant.deliveryFee) : 'Grátis' }}
                </span>
              </div>

              <div class="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span class="text-slate-500 text-[11px] block">Pedido Mínimo</span>
                <span class="font-bold text-white text-xs">
                  {{ tenant.minOrderValue ? formatCurrency(tenant.minOrderValue) : 'Sem valor mínimo' }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </Teleport>
</template>