// types/booking.ts
import { z } from 'zod'

// 1. Schema de Profissional / Prestador
export const BookingProfessionalSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string().optional().default('Especialista'),
  avatar: z.string().optional().default(''),
  available: z.boolean().default(true)
})

// 2. Schema de Serviço com Duração e Profissionais Habilitados
export const BookingServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().default(''),
  price: z.number(),
  durationMinutes: z.number().default(30),
  image: z.string().optional(),
  professionalIds: z.array(z.string()).optional().default([])
})

// 3. Schema de Slot de Horário
export const BookingSlotSchema = z.object({
  id: z.string(),
  time: z.string(), // Formato HH:mm
  available: z.boolean().default(true),
  period: z.enum(['morning', 'afternoon', 'night']).default('morning')
})

// 4. Schema de Dia de Agendamento
export const BookingDaySchema = z.object({
  date: z.string(), // Formato YYYY-MM-DD
  dayOfWeek: z.string(), // seg, ter, qua...
  dayNumber: z.number(),
  monthName: z.string(),
  isToday: z.boolean().default(false),
  isTomorrow: z.boolean().optional().default(false),
  available: z.boolean().default(true)
})

// 5. Schema da Requisição / Estado de Agendamento
export const BookingRequestSchema = z.object({
  service: BookingServiceSchema,
  professional: BookingProfessionalSchema.optional(),
  date: z.string(), // YYYY-MM-DD
  time: z.string(), // HH:mm
  customerName: z.string().min(2, 'Nome é obrigatório'),
  customerPhone: z.string().min(10, 'Telefone WhatsApp é obrigatório'),
  notes: z.string().optional().default(''),
  paymentMode: z.enum(['on_service', 'pix_deposit', 'pix_full']).optional().default('on_service'),
  depositAmount: z.number().optional().default(0),
  paymentMethod: z.enum(['local', 'pix']).optional().default('local')
})

export type BookingProfessional = z.infer<typeof BookingProfessionalSchema>
export type BookingService = z.infer<typeof BookingServiceSchema>
export type BookingSlot = z.infer<typeof BookingSlotSchema>
export type BookingDay = z.infer<typeof BookingDaySchema>
export type BookingRequest = z.infer<typeof BookingRequestSchema>
