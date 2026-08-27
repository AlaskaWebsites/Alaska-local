// composables/useBookingSlots.ts
import { ref, computed } from 'vue'
import type { BookingService, Professional, BookingSlot, BookingAppointmentPayload } from '~/types/booking'
import { formatCurrency } from '~/utils/formatters'

/**
 * Converte horário HH:mm em minutos a partir da meia-noite.
 */
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Converte minutos a partir da meia-noite em string formatada HH:mm.
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

/**
 * Gera slots de horários entre o horário de abertura e fechamento.
 */
export function generateTimeSlots(
  openTime: string,
  closeTime: string,
  intervalMinutes: number = 30
): BookingSlot[] {
  const start = timeToMinutes(openTime)
  const end = timeToMinutes(closeTime)
  const slots: BookingSlot[] = []

  // Tratamento de horários diurnos normais
  if (end > start) {
    for (let current = start; current < end; current += intervalMinutes) {
      slots.push({
        time: minutesToTime(current),
        available: true,
      })
    }
  }

  return slots
}

/**
 * Calcula a duração total somando os serviços selecionados.
 */
export function calculateTotalDuration(services: BookingService[]): number {
  return services.reduce((acc, s) => acc + s.durationMinutes, 0)
}

/**
 * Calcula o valor total somando os serviços selecionados.
 */
export function calculateTotalPrice(services: BookingService[]): number {
  return services.reduce((acc, s) => acc + s.price, 0)
}

/**
 * Formata a mensagem de agendamento estruturada para despacho no WhatsApp.
 */
export function formatBookingWhatsAppMessage(payload: BookingAppointmentPayload): string {
  const lines: string[] = []

  lines.push(`💈 *NOVO AGENDAMENTO — ${payload.tenantName.toUpperCase()}*`)
  lines.push(`━━━━━━━━━━━━━━━━━━━━━`)
  lines.push(`📅 *DATA & HORÁRIO:*`)
  lines.push(`• Data: ${payload.date}`)
  lines.push(`• Horário: ${payload.time}`)

  if (payload.professional) {
    lines.push(`• Profissional: ${payload.professional.name} (${payload.professional.role || 'Especialista'})`)
  } else {
    lines.push(`• Profissional: Qualquer disponível`)
  }

  lines.push(``)
  lines.push(`✂️ *SERVIÇOS ESCOLHIDOS:*`)
  payload.services.forEach((service) => {
    lines.push(`• ${service.name} (${service.durationMinutes} min) — ${formatCurrency(service.price)}`)
  })

  lines.push(``)
  lines.push(`━━━━━━━━━━━━━━━━━━━━━`)
  lines.push(`⏱️ Duração Estimada: ${payload.totalDurationMinutes} minutos`)
  lines.push(`*VALOR TOTAL: ${formatCurrency(payload.totalPrice)}*`)
  lines.push(`━━━━━━━━━━━━━━━━━━━━━`)
  lines.push(`👤 *CLIENTE:* ${payload.customerName}`)
  lines.push(`📱 *WHATSAPP:* ${payload.customerPhone}`)
  lines.push(`💳 *PAGAMENTO:* ${payload.paymentMethod}`)

  if (payload.notes) {
    lines.push(`💬 *OBSERVAÇÕES:* "${payload.notes}"`)
  }

  return lines.join('\n')
}

/**
 * Composable reativo para gestão de agendamento na interface
 */
export function useBookingSlots() {
  const selectedServices = ref<BookingService[]>([])
  const selectedProfessional = ref<Professional | null>(null)
  const selectedDate = ref<string>('')
  const selectedTime = ref<string>('')

  const totalDuration = computed(() => calculateTotalDuration(selectedServices.value))
  const totalPrice = computed(() => calculateTotalPrice(selectedServices.value))

  function toggleService(service: BookingService) {
    const index = selectedServices.value.findIndex((s) => s.id === service.id)
    if (index >= 0) {
      selectedServices.value.splice(index, 1)
    } else {
      selectedServices.value.push(service)
    }
  }

  function clearBooking() {
    selectedServices.value = []
    selectedProfessional.value = null
    selectedDate.value = ''
    selectedTime.value = ''
  }

  return {
    selectedServices,
    selectedProfessional,
    selectedDate,
    selectedTime,
    totalDuration,
    totalPrice,
    toggleService,
    clearBooking,
    generateTimeSlots,
    formatBookingWhatsAppMessage,
  }
}
