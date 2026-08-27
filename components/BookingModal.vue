<!-- components/BookingModal.vue -->
<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col sm:items-center sm:justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      @click="emit('close')"
    >
      <div
        class="bg-white text-slate-800 w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-lg flex flex-col overflow-hidden sm:rounded-3xl sm:border sm:border-slate-200 sm:shadow-2xl"
        @click.stop
      >
        <!-- Header do Modal -->
        <div class="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div class="flex items-center gap-2">
            <Calendar class="w-5 h-5 text-slate-800" aria-hidden="true" />
            <h2 id="booking-modal-title" class="font-bold text-base text-slate-900">
              Agendar Horário / Consulta
            </h2>
          </div>
          <button
            @click="emit('close')"
            class="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            aria-label="Fechar agendamento"
            title="Fechar agendamento"
          >
            <X class="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <!-- Conteúdo Rolável -->
        <div class="p-4 sm:p-5 overflow-y-auto flex-1 space-y-6 text-xs">
          <!-- 1. Seleção de Serviços -->
          <section aria-labelledby="booking-services-title" class="space-y-3">
            <div class="flex items-center justify-between">
              <h3 id="booking-services-title" class="font-bold text-xs uppercase tracking-wider text-slate-500">
                1. Escolha o(s) Serviço(s) *
              </h3>
              <span v-if="selectedServices.length > 0" class="font-bold text-[11px]" :class="themeClasses.primaryText">
                {{ selectedServices.length }} selecionado{{ selectedServices.length > 1 ? 's' : '' }} ({{ totalDuration }} min)
              </span>
            </div>

            <div class="space-y-2" role="group" aria-label="Lista de serviços disponíveis">
              <label
                v-for="service in availableServices"
                :key="service.id"
                class="flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer"
                :class="isServiceSelected(service.id) ? themeClasses.selectedOptionClass : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'"
              >
                <div class="flex-1 pr-3">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-sm text-slate-900">{{ service.name }}</span>
                    <span class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-200/70 text-slate-700">
                      {{ service.durationMinutes }} min
                    </span>
                  </div>
                  <p v-if="service.description" class="text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {{ service.description }}
                  </p>
                  <span class="font-extrabold text-xs mt-1.5 block" :class="themeClasses.primaryText">
                    {{ formatCurrency(service.price) }}
                  </span>
                </div>

                <input
                  type="checkbox"
                  :checked="isServiceSelected(service.id)"
                  @change="toggleService(service)"
                  class="w-5 h-5 rounded border-slate-300 shrink-0 cursor-pointer"
                  :class="themeClasses.accentClass"
                  :aria-label="`Selecionar serviço ${service.name}`"
                />
              </label>
            </div>
          </section>

          <!-- 2. Seleção de Profissional (Opcional) -->
          <section v-if="professionalsList.length > 0" aria-labelledby="booking-prof-title" class="space-y-3 pt-2 border-t border-slate-100">
            <h3 id="booking-prof-title" class="font-bold text-xs uppercase tracking-wider text-slate-500">
              2. Preferência de Profissional
            </h3>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Escolher profissional">
              <button
                type="button"
                role="radio"
                :aria-checked="selectedProfessional === null"
                @click="selectedProfessional = null"
                class="p-2.5 rounded-2xl border text-center transition-all cursor-pointer"
                :class="selectedProfessional === null ? themeClasses.selectedOptionClass : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'"
              >
                <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mx-auto text-slate-700 font-bold mb-1.5">
                  ★
                </div>
                <span class="font-bold block text-slate-900 truncate">Qualquer um</span>
                <span class="text-[10px] text-slate-500 block truncate">Disponível</span>
              </button>

              <button
                v-for="prof in professionalsList"
                :key="prof.id"
                type="button"
                role="radio"
                :aria-checked="selectedProfessional?.id === prof.id"
                @click="selectedProfessional = prof"
                class="p-2.5 rounded-2xl border text-center transition-all cursor-pointer"
                :class="selectedProfessional?.id === prof.id ? themeClasses.selectedOptionClass : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'"
              >
                <div class="w-8 h-8 rounded-full bg-slate-200 overflow-hidden mx-auto mb-1.5 border border-white shadow-2xs">
                  <img v-if="prof.avatar" :src="prof.avatar" :alt="prof.name" class="w-full h-full object-cover" />
                  <span v-else class="w-full h-full flex items-center justify-center font-bold text-slate-700">
                    {{ prof.name.charAt(0) }}
                  </span>
                </div>
                <span class="font-bold block text-slate-900 truncate">{{ prof.name }}</span>
                <span class="text-[10px] text-slate-500 block truncate">{{ prof.role || 'Especialista' }}</span>
              </button>
            </div>
          </section>

          <!-- 3. Seleção de Data & Horário (Slot Picker) -->
          <section aria-labelledby="booking-datetime-title" class="space-y-3 pt-2 border-t border-slate-100">
            <h3 id="booking-datetime-title" class="font-bold text-xs uppercase tracking-wider text-slate-500">
              3. Data & Horário Desejado *
            </h3>

            <!-- Seletor de Dias em Pílula -->
            <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar" role="tablist" aria-label="Selecione o dia">
              <button
                v-for="day in availableDays"
                :key="day.dateStr"
                type="button"
                role="tab"
                :aria-selected="selectedDate === day.dateStr"
                @click="selectedDate = day.dateStr"
                class="px-3.5 py-2 rounded-2xl border text-center shrink-0 transition-all cursor-pointer shadow-2xs"
                :class="selectedDate === day.dateStr ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'"
              >
                <span class="text-[10px] font-bold block opacity-80 uppercase">{{ day.weekDay }}</span>
                <span class="font-black text-xs block">{{ day.displayDate }}</span>
              </button>
            </div>

            <!-- Grade de Horários (Slots Dinâmicos) -->
            <div v-if="timeSlots.length > 0" class="space-y-1.5 pt-1">
              <span class="text-[11px] font-bold text-slate-600 block">Horários Disponíveis:</span>
              <div class="grid grid-cols-4 sm:grid-cols-6 gap-2" role="group" aria-label="Horários disponíveis">
                <button
                  v-for="slot in timeSlots"
                  :key="slot.time"
                  type="button"
                  @click="selectedTime = slot.time"
                  class="py-2 px-1 text-center font-bold text-xs rounded-xl border transition-all cursor-pointer shadow-2xs"
                  :class="selectedTime === slot.time
                    ? [themeClasses.primaryBg, 'text-white border-transparent shadow-xs scale-102']
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'"
                  :aria-label="`Selecionar horário ${slot.time}`"
                >
                  {{ slot.time }}
                </button>
              </div>
            </div>
            <div v-else class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs">
              Nenhum horário livre para agendamento online hoje. Escolha outro dia ou consulte pelo WhatsApp.
            </div>
          </section>

          <!-- 4. Dados do Cliente -->
          <section aria-labelledby="booking-client-title" class="space-y-3 pt-2 border-t border-slate-100">
            <h3 id="booking-client-title" class="font-bold text-xs uppercase tracking-wider text-slate-500">
              4. Seus Dados
            </h3>

            <div class="space-y-2.5">
              <div class="space-y-1">
                <label for="booking-name" class="font-bold text-slate-700 block">Seu Nome Completo *</label>
                <input
                  id="booking-name"
                  v-model="customerName"
                  type="text"
                  placeholder="Como o profissional deve te chamar?"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none transition-all"
                  :class="themeClasses.focusRing"
                  required
                />
              </div>

              <div class="space-y-1">
                <label for="booking-phone" class="font-bold text-slate-700 block">WhatsApp para Confirmação *</label>
                <input
                  id="booking-phone"
                  v-model="customerPhone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none transition-all"
                  :class="themeClasses.focusRing"
                  required
                />
              </div>

              <div class="space-y-1">
                <label for="booking-notes" class="font-bold text-slate-700 block">Observações / Procedimento Desejado (Opcional)</label>
                <textarea
                  id="booking-notes"
                  v-model="notes"
                  rows="2"
                  placeholder="Ex: Primeira vez, corte específico, sensibilidade..."
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none transition-all resize-none"
                  :class="themeClasses.focusRing"
                ></textarea>
              </div>
            </div>
          </section>
        </div>

        <!-- Footer do Modal com Resumo e Envio WhatsApp -->
        <div class="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/90 space-y-3 shrink-0">
          <div class="flex items-center justify-between text-xs font-bold text-slate-700">
            <div>
              <span class="text-slate-500 block text-[11px]">Duração & Horário</span>
              <span class="text-slate-900 font-extrabold">
                {{ selectedTime ? `${selectedTime} (${totalDuration} min)` : 'Selecione um horário' }}
              </span>
            </div>
            <div class="text-right">
              <span class="text-slate-500 block text-[11px]">Total Estimado</span>
              <span class="text-sm font-black" :class="themeClasses.primaryText">
                {{ formatCurrency(totalPrice) }}
              </span>
            </div>
          </div>

          <button
            @click="submitBooking"
            :disabled="!isBookingValid"
            class="w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99]"
            :class="themeClasses.buttonPrimary"
            aria-label="Confirmar e agendar horário pelo WhatsApp"
          >
            <Send class="w-4 h-4" aria-hidden="true" />
            <span>Confirmar Agendamento no WhatsApp ({{ formatCurrency(totalPrice) }})</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { Calendar, X, Send } from 'lucide-vue-next'
import { useTenantTheme } from '~/composables/useTenantTheme'
import { useBodyScrollLock } from '~/composables/useBodyScrollLock'
import { useBookingSlots } from '~/composables/useBookingSlots'
import { formatCurrency } from '~/utils/formatters'
import type { Tenant, BookingService, Professional } from '~/types'

const props = defineProps<{
  isOpen: boolean
  tenant: Tenant
  initialService?: BookingService | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

// 1. Tema Visual Dinâmico & Trava de Rolagem
const { themeClasses } = useTenantTheme(computed(() => props.tenant))
const isModalOpen = computed(() => props.isOpen)
useBodyScrollLock(isModalOpen)

// 2. Fechamento via Tecla ESC
if (import.meta.client) {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && props.isOpen) {
      emit('close')
    }
  })
}

// 3. Composable de Lógica de Agendamento
const {
  selectedServices,
  selectedProfessional,
  selectedDate,
  selectedTime,
  totalDuration,
  totalPrice,
  toggleService,
  generateTimeSlots,
  formatBookingWhatsAppMessage,
} = useBookingSlots()

// 4. Extração de Serviços e Profissionais do Tenant
const availableServices = computed<BookingService[]>(() => {
  const services: BookingService[] = []
  props.tenant.categories?.forEach((cat) => {
    cat.products.forEach((prod) => {
      services.push({
        id: prod.id,
        name: prod.name,
        description: prod.description,
        price: prod.price,
        durationMinutes: (prod as any).durationMinutes || (cat.name.toLowerCase().includes('barba') ? 30 : 40),
      })
    })
  })
  return services
})

const professionalsList = computed<Professional[]>(() => {
  return (props.tenant as any).professionals || []
})

function isServiceSelected(serviceId: string): boolean {
  return selectedServices.value.some((s) => s.id === serviceId)
}

// 5. Inicialização com Serviço Pré-selecionado
watch(
  () => props.isOpen,
  (open) => {
    if (open && props.initialService) {
      if (!isServiceSelected(props.initialService.id)) {
        selectedServices.value = [props.initialService]
      }
    }
  },
  { immediate: true }
)

// 6. Geração de Dias Disponíveis (Hoje + Próximos 5 Dias)
const availableDays = computed(() => {
  const days: { dateStr: string; displayDate: string; weekDay: string }[] = []
  const weekDaysLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const now = new Date()

  for (let i = 0; i < 6; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)

    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    const dateStr = `${day}/${month}/${year}`

    days.push({
      dateStr,
      displayDate: `${day}/${month}`,
      weekDay: i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : weekDaysLabels[d.getDay()],
    })
  }
  return days
})

// Auto-seleciona o primeiro dia disponível
watch(
  availableDays,
  (days) => {
    if (!selectedDate.value && days.length > 0) {
      selectedDate.value = days[0].dateStr
    }
  },
  { immediate: true }
)

// 7. Geração de Slots de Horários baseados em OpeningHours
const timeSlots = computed(() => {
  const open = props.tenant.openingHours?.open || '09:00'
  const close = props.tenant.openingHours?.close || '20:00'
  return generateTimeSlots(open, close, 30)
})

// 8. Persistência de Dados do Cliente
const customerName = useLocalStorage('alaska_booking_name', '')
const customerPhone = useLocalStorage('alaska_booking_phone', '')
const notes = ref('')

// 9. Validação do Formulário de Agendamento
const isBookingValid = computed(() => {
  if (selectedServices.value.length === 0) return false
  if (!selectedDate.value) return false
  if (!selectedTime.value) return false
  if (!customerName.value.trim()) return false
  if (!customerPhone.value.trim()) return false
  return true
})

// 10. Despacho Estruturado para o WhatsApp
function submitBooking() {
  if (!isBookingValid.value || !props.tenant) return

  const message = formatBookingWhatsAppMessage({
    tenantName: props.tenant.name,
    customerName: customerName.value.trim(),
    customerPhone: customerPhone.value.trim(),
    date: selectedDate.value,
    time: selectedTime.value,
    professional: selectedProfessional.value || undefined,
    services: selectedServices.value,
    totalDurationMinutes: totalDuration.value,
    totalPrice: totalPrice.value,
    paymentMethod: 'Pix no Local / Balcão',
    notes: notes.value.trim() || undefined,
  })

  const phone = props.tenant.phoneWhatsApp.replace(/\D/g, '')
  const cleanPhone = phone.startsWith('55') ? phone : `55${phone}`
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`

  emit('close')

  if (import.meta.client) {
    window.open(url, '_blank')
  }
}
</script>
