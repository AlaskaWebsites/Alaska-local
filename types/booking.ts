// types/booking.ts
import { z } from 'zod'

/**
 * 1. Schema de Profissional (Barbeiro, Dentista, Tatuador, etc.)
 */
export const ProfessionalSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Nome do profissional é obrigatório'),
  role: z.string().optional().default('Profissional'),
  avatar: z.string().optional().default(''),
  specialties: z.array(z.string()).optional().default([]),
  available: z.boolean().default(true),
})

/**
 * 2. Schema de Serviço com Duração e Profissionais Habilitados
 */
export const BookingServiceSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Nome do serviço é obrigatório'),
  description: z.string().optional().default(''),
  price: z.number().min(0, 'Preço não pode ser negativo'),
  durationMinutes: z.number().min(5).default(30),
  professionalIds: z.array(z.string()).optional().default([]),
  category: z.string().optional().default('Geral'),
})

/**
 * 3. Schema de Slot de Horário Disponível
 */
export const BookingSlotSchema = z.object({
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Horário deve estar no formato HH:mm'),
  available: z.boolean().default(true),
})

/**
 * 4. Schema de Formulário de Agendamento (Validação Fail-Fast no Checkout)
 */
export const BookingFormDataSchema = z.object({
  customerName: z.string().min(2, 'Nome é obrigatório'),
  customerPhone: z.string().min(10, 'Telefone WhatsApp é obrigatório'),
  serviceIds: z.array(z.string()).min(1, 'Selecione pelo menos um serviço'),
  professionalId: z.string().optional().default(''),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Horário deve estar no formato HH:mm'),
  notes: z.string().optional().default(''),
  paymentMethod: z.enum(['Pix', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro', 'No Local']).default('No Local'),
})

/**
 * 5. Tipos Inferidos do Zod
 */
export type Professional = z.infer<typeof ProfessionalSchema>
export type BookingService = z.infer<typeof BookingServiceSchema>
export type BookingSlot = z.infer<typeof BookingSlotSchema>
export type BookingFormData = z.infer<typeof BookingFormDataSchema>

export interface BookingAppointmentPayload {
  tenantName: string
  phoneWhatsApp: string
  services: BookingService[]
  professional?: Professional | null
  date: string
  time: string
  customerName: string
  customerPhone: string
  notes?: string
  paymentMethod: string
  totalPrice: number
  totalDurationMinutes: number
}
