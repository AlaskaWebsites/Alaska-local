// tests/units/booking-schema.test.ts
import { describe, it, expect } from 'vitest'
import {
  ProfessionalSchema,
  BookingServiceSchema,
  BookingSlotSchema,
  BookingFormDataSchema,
} from '~/types/booking'

describe('Unit: Contratos e Schemas Zod de Agendamento (types/booking.ts)', () => {
  describe('1. Schema de Profissional (ProfessionalSchema)', () => {
    it('deve validar um profissional completo com especialidades', () => {
      const valid = {
        id: 'prof-1',
        name: 'Lucas Mendes',
        role: 'Barbeiro Master',
        avatar: 'https://images.unsplash.com/photo-barber.jpg',
        specialties: ['Degradê Navalhado', 'Barboterapia', 'Pigmentação'],
        available: true,
      }

      const parsed = ProfessionalSchema.parse(valid)
      expect(parsed.id).toBe('prof-1')
      expect(parsed.name).toBe('Lucas Mendes')
      expect(parsed.role).toBe('Barbeiro Master')
      expect(parsed.specialties.length).toBe(3)
    })

    it('deve aplicar valores default para campos opcionais omitidos', () => {
      const minimal = {
        id: 'prof-2',
        name: 'Marcos Silva',
      }

      const parsed = ProfessionalSchema.parse(minimal)
      expect(parsed.role).toBe('Profissional')
      expect(parsed.avatar).toBe('')
      expect(parsed.specialties).toEqual([])
      expect(parsed.available).toBe(true)
    })

    it('deve rejeitar profissional com nome menor que 2 caracteres', () => {
      const invalid = {
        id: 'prof-3',
        name: 'A',
      }

      expect(() => ProfessionalSchema.parse(invalid)).toThrow()
    })
  })

  describe('2. Schema de Serviço de Agendamento (BookingServiceSchema)', () => {
    it('deve validar um serviço com duração e profissionais vinculados', () => {
      const validService = {
        id: 'serv-fade',
        name: 'Corte Degradê Navalhado',
        description: 'Corte moderno com acabamento na navalha e toalha quente',
        price: 45.0,
        durationMinutes: 40,
        professionalIds: ['prof-1', 'prof-2'],
        category: 'Cabelo',
      }

      const parsed = BookingServiceSchema.parse(validService)
      expect(parsed.id).toBe('serv-fade')
      expect(parsed.price).toBe(45.0)
      expect(parsed.durationMinutes).toBe(40)
      expect(parsed.professionalIds).toEqual(['prof-1', 'prof-2'])
    })

    it('deve aplicar defaults de 30 minutos e categoria Geral quando omitidos', () => {
      const minimalService = {
        id: 'serv-barba',
        name: 'Barboterapia Tradicional',
        price: 35.0,
      }

      const parsed = BookingServiceSchema.parse(minimalService)
      expect(parsed.durationMinutes).toBe(30)
      expect(parsed.category).toBe('Geral')
      expect(parsed.description).toBe('')
      expect(parsed.professionalIds).toEqual([])
    })

    it('deve rejeitar serviço com preço negativo', () => {
      const invalid = {
        id: 'serv-invalido',
        name: 'Serviço Inválido',
        price: -15,
      }

      expect(() => BookingServiceSchema.parse(invalid)).toThrow()
    })

    it('deve rejeitar duração menor que 5 minutos', () => {
      const invalidDuration = {
        id: 'serv-rapido',
        name: 'Serviço Ultra Rápido',
        price: 10,
        durationMinutes: 2,
      }

      expect(() => BookingServiceSchema.parse(invalidDuration)).toThrow()
    })
  })

  describe('3. Schema de Slot de Horário (BookingSlotSchema)', () => {
    it('deve validar horários no formato HH:mm', () => {
      expect(BookingSlotSchema.parse({ time: '09:00', available: true }).time).toBe('09:00')
      expect(BookingSlotSchema.parse({ time: '14:30', available: false }).time).toBe('14:30')
      expect(BookingSlotSchema.parse({ time: '23:45' }).available).toBe(true)
    })

    it('deve rejeitar formatos de horários inválidos', () => {
      expect(() => BookingSlotSchema.parse({ time: '9:00 AM' })).toThrow()
      expect(() => BookingSlotSchema.parse({ time: '9h30' })).toThrow()
      expect(() => BookingSlotSchema.parse({ time: 'invalid' })).toThrow()
    })
  })

  describe('4. Schema de Validação de Formulário de Agendamento (BookingFormDataSchema)', () => {
    it('deve validar formulário de agendamento completo e correto', () => {
      const validForm = {
        customerName: 'Danilo Gozzi',
        customerPhone: '11999998888',
        serviceIds: ['serv-fade', 'serv-barba'],
        professionalId: 'prof-1',
        date: '2026-08-30',
        time: '15:30',
        notes: 'Preferencia por navalha descartavel nova',
        paymentMethod: 'Pix',
      }

      const parsed = BookingFormDataSchema.parse(validForm)
      expect(parsed.customerName).toBe('Danilo Gozzi')
      expect(parsed.serviceIds.length).toBe(2)
      expect(parsed.paymentMethod).toBe('Pix')
    })

    it('deve falhar se nenhum serviço for selecionado', () => {
      const formWithoutServices = {
        customerName: 'Danilo Gozzi',
        customerPhone: '11999998888',
        serviceIds: [],
        date: '2026-08-30',
        time: '15:30',
      }

      expect(() => BookingFormDataSchema.parse(formWithoutServices)).toThrow()
    })

    it('deve falhar se a data não estiver no padrão ISO YYYY-MM-DD', () => {
      const formInvalidDate = {
        customerName: 'Danilo Gozzi',
        customerPhone: '11999998888',
        serviceIds: ['serv-1'],
        date: '30/08/2026', // formato brasileiro incompatível com ISO
        time: '15:30',
      }

      expect(() => BookingFormDataSchema.parse(formInvalidDate)).toThrow()
    })
  })
})
