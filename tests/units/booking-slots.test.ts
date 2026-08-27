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
import type { BookingAppointmentPayload, BookingService } from '~/types/booking'

describe('Unit: Lógica de Agendamentos e Geração de Slots (useBookingSlots.ts)', () => {
  describe('1. Conversões de Tempo (timeToMinutes e minutesToTime)', () => {
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
      expect(slots[slots.length - 1].time).toBe('11:30')
      expect(slots.every((s) => s.available)).toBe(true)
    })

    it('deve gerar slots de 45 em 45 minutos corretamente', () => {
      const slots = generateTimeSlots('14:00', '16:00', 45)
      // 14:00 (840), 14:45 (885), 15:30 (930)
      expect(slots.length).toBe(3)
      expect(slots.map((s) => s.time)).toEqual(['14:00', '14:45', '15:30'])
    })

    it('deve retornar array vazio se o horário de fechamento for menor ou igual ao de abertura', () => {
      expect(generateTimeSlots('18:00', '18:00')).toEqual([])
      expect(generateTimeSlots('20:00', '10:00')).toEqual([])
    })
  })

  describe('3. Cálculos de Totais e Duração', () => {
    const mockServices: BookingService[] = [
      { id: 's1', name: 'Corte', price: 45, durationMinutes: 40 },
      { id: 's2', name: 'Barba', price: 35, durationMinutes: 30 },
    ]

    it('deve somar a duração total de múltiplos serviços', () => {
      expect(calculateTotalDuration(mockServices)).toBe(70)
    })

    it('deve somar o valor total de múltiplos serviços', () => {
      expect(calculateTotalPrice(mockServices)).toBe(80)
    })
  })

  describe('4. Formatação de Mensagem de Agendamento para WhatsApp', () => {
    const mockPayload: BookingAppointmentPayload = {
      tenantName: 'Barbearia Style',
      customerName: 'Danilo Gozzi',
      customerPhone: '(11) 99999-9999',
      date: '30/08/2026',
      time: '15:30',
      professional: {
        id: 'p1',
        name: 'Lucas Mendes',
        role: 'Barbeiro Master',
      },
      services: [
        { id: 's1', name: 'Corte Degradê Navalhado', price: 45, durationMinutes: 40 },
        { id: 's2', name: 'Barba Terapia', price: 35, durationMinutes: 30 },
      ],
      totalDurationMinutes: 70,
      totalPrice: 80,
      paymentMethod: 'Pix',
      notes: 'Toalha quente caprichada',
    }

    it('deve gerar a mensagem estruturada com todos os dados do agendamento', () => {
      const message = formatBookingWhatsAppMessage(mockPayload)

      expect(message).toContain('💈 *NOVO AGENDAMENTO — BARBEARIA STYLE*')
      expect(message).toContain('• Data: 30/08/2026')
      expect(message).toContain('• Horário: 15:30')
      expect(message).toContain('• Profissional: Lucas Mendes (Barbeiro Master)')
      expect(message).toContain('• Corte Degradê Navalhado (40 min)')
      expect(message).toContain('• Barba Terapia (30 min)')
      expect(message).toContain('⏱️ Duração Estimada: 70 minutos')
      expect(message).toContain('*VALOR TOTAL:')
      expect(message).toContain('👤 *CLIENTE:* Danilo Gozzi')
      expect(message).toContain('📱 *WHATSAPP:* (11) 99999-9999')
      expect(message).toContain('💳 *PAGAMENTO:* Pix')
      expect(message).toContain('💬 *OBSERVAÇÕES:* "Toalha quente caprichada"')
    })
  })
})
