// tests/units/booking-slots.test.ts
import { describe, it, expect } from 'vitest'
import {
  timeToMinutes,
  minutesToTime,
  generateTimeSlots,
  calculateTotalDuration,
  calculateTotalPrice,
  formatBookingWhatsAppMessage,
} from '~/composables/useBookingSlots'
import type { BookingService, BookingAppointmentPayload } from '~/types/booking'

describe('Unit: Lógica de Agendamentos e Geração de Slots (useBookingSlots.ts)', () => {
  describe('1. Conversão de Horários e Minutos', () => {
    it('deve converter corretamente HH:mm para minutos a partir da meia-noite', () => {
      expect(timeToMinutes('00:00')).toBe(0)
      expect(timeToMinutes('09:00')).toBe(540)
      expect(timeToMinutes('14:30')).toBe(870)
      expect(timeToMinutes('23:59')).toBe(1439)
    })

    it('deve converter minutos para formato HH:mm com zero à esquerda', () => {
      expect(minutesToTime(0)).toBe('00:00')
      expect(minutesToTime(540)).toBe('09:00')
      expect(minutesToTime(870)).toBe('14:30')
      expect(minutesToTime(1439)).toBe('23:59')
    })
  })

  describe('2. Geração de Slots de Horários (generateTimeSlots)', () => {
    it('deve gerar slots de 30 em 30 minutos entre 09:00 e 12:00', () => {
      const slots = generateTimeSlots('09:00', '12:00', 30)
      expect(slots.length).toBe(6) // 09:00, 09:30, 10:00, 10:30, 11:00, 11:30
      expect(slots[0].time).toBe('09:00')
      expect(slots[1].time).toBe('09:30')
      expect(slots[5].time).toBe('11:30')
      expect(slots.every((s) => s.available)).toBe(true)
    })

    it('deve gerar slots de 45 em 45 minutos corretamente', () => {
      const slots = generateTimeSlots('14:00', '16:00', 45)
      expect(slots.length).toBe(3) // 14:00, 14:45, 15:30
      expect(slots[0].time).toBe('14:00')
      expect(slots[1].time).toBe('14:45')
      expect(slots[2].time).toBe('15:30')
    })

    it('deve retornar array vazio se o horário de fechamento for menor ou igual ao de abertura', () => {
      expect(generateTimeSlots('18:00', '18:00')).toEqual([])
      expect(generateTimeSlots('20:00', '10:00')).toEqual([])
    })
  })

  describe('3. Cálculos de Duração e Valor Total', () => {
    const mockServices: BookingService[] = [
      { id: 's1', name: 'Corte Fade', price: 45.0, durationMinutes: 40, professionalIds: [] },
      { id: 's2', name: 'Barboterapia', price: 35.0, durationMinutes: 30, professionalIds: [] },
      { id: 's3', name: 'Sobrancelha', price: 15.0, durationMinutes: 10, professionalIds: [] },
    ]

    it('deve somar a duração total de múltiplos serviços', () => {
      expect(calculateTotalDuration(mockServices)).toBe(80) // 40 + 30 + 10
      expect(calculateTotalDuration([mockServices[0]])).toBe(40)
      expect(calculateTotalDuration([])).toBe(0)
    })

    it('deve somar o valor total de múltiplos serviços', () => {
      expect(calculateTotalPrice(mockServices)).toBe(95.0) // 45 + 35 + 15
      expect(calculateTotalPrice([mockServices[0]])).toBe(45.0)
      expect(calculateTotalPrice([])).toBe(0)
    })
  })

  describe('4. Formatação de Mensagem de Agendamento para WhatsApp', () => {
    it('deve gerar a mensagem estruturada com todos os dados do agendamento', () => {
      const payload: BookingAppointmentPayload = {
        tenantName: 'Barbearia Style',
        phoneWhatsApp: '11999998888',
        services: [
          { id: 's1', name: 'Corte Degradê Navalhado', price: 45.0, durationMinutes: 40, professionalIds: [] },
          { id: 's2', name: 'Barba Terapia', price: 35.0, durationMinutes: 30, professionalIds: [] },
        ],
        professional: { id: 'p1', name: 'Lucas Mendes', role: 'Barbeiro Master', available: true, specialties: [] },
        date: '30/08/2026',
        time: '15:30',
        customerName: 'Danilo Gozzi',
        customerPhone: '(11) 99999-9999',
        notes: 'Toalha quente caprichada',
        paymentMethod: 'Pix',
        totalPrice: 80.0,
        totalDurationMinutes: 70,
      }

      const message = formatBookingWhatsAppMessage(payload)

      expect(message).toContain('💈 *NOVO AGENDAMENTO — BARBEARIA STYLE*')
      expect(message).toContain('• Data: 30/08/2026')
      expect(message).toContain('• Horário: 15:30')
      expect(message).toContain('• Profissional: Lucas Mendes (Barbeiro Master)')
      expect(message).toContain('• Corte Degradê Navalhado (40 min) — R$ 45,00')
      expect(message).toContain('• Barba Terapia (30 min) — R$ 35,00')
      expect(message).toContain('⏱️ Duração Estimada: 70 minutos')
      expect(message).toContain('*VALOR TOTAL: R$ 80,00*')
      expect(message).toContain('👤 *CLIENTE:* Danilo Gozzi')
      expect(message).toContain('💬 *OBSERVAÇÕES:* "Toalha quente caprichada"')
    })
  })
})
