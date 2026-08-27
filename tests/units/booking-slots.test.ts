// tests/units/booking-slots.test.ts
import { describe, it, expect } from 'vitest'
import {
  timeToMinutes,
  minutesToTime,
  generateBookingDays,
  generateTimeSlots,
  getMockBookedSlotsForDate,
  calculateTotalDuration,
  calculateTotalPrice,
  formatBookingWhatsAppMessage,
} from '~/composables/useBookingSlots'
import type { BookingAppointmentPayload, BookingService } from '~/types/booking'

describe('Unit: Lógica de Agendamentos, Calendário e Slots (useBookingSlots.ts)', () => {
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

  describe('2. Geração Automática de Dias do Mês (generateBookingDays)', () => {
    it('deve gerar 30 dias contínuos a partir de uma data de referência', () => {
      const refDate = new Date(2026, 7, 27) // 27/08/2026
      const days = generateBookingDays(refDate, 30, [0])

      expect(days.length).toBe(30)
      expect(days[0].dateStr).toBe('27/08/2026')
      expect(days[0].isToday).toBe(true)
      expect(days[0].weekDay).toBe('Hoje')

      expect(days[1].dateStr).toBe('28/08/2026')
      expect(days[1].weekDay).toBe('Amanhã')

      // O último dia deve estar em Setembro
      expect(days[days.length - 1].monthName).toBe('Setembro')
    })

    it('deve identificar e marcar domingos como dias fechados', () => {
      const refDate = new Date(2026, 7, 27) // Quinta-feira
      const days = generateBookingDays(refDate, 7, [0]) // Domingo é dia 30/08

      const sunday = days.find((d) => d.dateStr === '30/08/2026')
      expect(sunday).toBeDefined()
      expect(sunday?.isClosed).toBe(true)
      expect(sunday?.weekDay).toBe('Dom')
    })
  })

  describe('3. Geração de Slots de Horários com Bloqueios (generateTimeSlots)', () => {
    it('deve gerar slots de 30 em 30 minutos entre 09:00 e 12:00', () => {
      const slots = generateTimeSlots('09:00', '12:00', 30)
      expect(slots.length).toBe(6) // 09:00, 09:30, 10:00, 10:30, 11:00, 11:30
      expect(slots[0].time).toBe('09:00')
      expect(slots[slots.length - 1].time).toBe('11:30')
      expect(slots.every((s) => s.available)).toBe(true)
    })

    it('deve bloquear slots que constam na lista de bookedSlots', () => {
      const slots = generateTimeSlots('14:00', '17:00', 30, {
        bookedSlots: ['15:00', '16:00'],
      })

      const slot15 = slots.find((s) => s.time === '15:00')
      const slot16 = slots.find((s) => s.time === '16:00')
      const slot14 = slots.find((s) => s.time === '14:00')

      expect(slot15?.available).toBe(false)
      expect(slot15?.reason).toBe('booked')

      expect(slot16?.available).toBe(false)
      expect(slot16?.reason).toBe('booked')

      expect(slot14?.available).toBe(true)
      expect(slot14?.reason).toBe('available')
    })

    it('deve bloquear horários passados quando o dia selecionado for hoje', () => {
      // Simula referência às 10:15 no dia 27/08/2026
      const refDate = new Date(2026, 7, 27, 10, 15)
      const slots = generateTimeSlots('09:00', '12:00', 30, {
        selectedDateStr: '27/08/2026',
        referenceDate: refDate,
      })

      // 09:00, 09:30 e 10:00 já passaram
      const pastSlot = slots.find((s) => s.time === '09:30')
      const futureSlot = slots.find((s) => s.time === '10:30')

      expect(pastSlot?.available).toBe(false)
      expect(pastSlot?.reason).toBe('past')

      expect(futureSlot?.available).toBe(true)
      expect(futureSlot?.reason).toBe('available')
    })

    it('deve retornar array vazio se o horário de fechamento for menor ou igual ao de abertura', () => {
      expect(generateTimeSlots('18:00', '18:00')).toEqual([])
      expect(generateTimeSlots('20:00', '10:00')).toEqual([])
    })
  })

  describe('4. Mock Determinístico de Ocupação (getMockBookedSlotsForDate)', () => {
    it('deve retornar lista consistente de horários ocupados para a data', () => {
      const mock1 = getMockBookedSlotsForDate('27/08/2026')
      const mock2 = getMockBookedSlotsForDate('27/08/2026')

      expect(mock1).toEqual(mock2)
      expect(mock1.length).toBeGreaterThan(0)
    })
  })

  describe('5. Cálculos de Totais e Duração', () => {
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

  describe('6. Formatação de Mensagem de Agendamento para WhatsApp', () => {
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
