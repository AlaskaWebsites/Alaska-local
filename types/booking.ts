// types/booking.ts
import { z } from 'zod'

export const ProfessionalSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string().optional().default('Profissional'),
  avatar: z.string().optional(),
  available: z.boolean().default(true),
})

export const BookingServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().default(''),
  price: z.number().min(0),
  durationMinutes: z.number().min(5).default(30),
  professionalIds: z.array(z.string()).optional().default([]),
})

export const BookingSlotSchema = z.object({
  time: z.string().regex(/^\d{2}:\d{2}$/),
  available: z.boolean().default(true),
  reason: z.enum(['available', 'booked', 'past', 'closed']).optional().default('available'),
})

export const BookingDaySchema = z.object({
  dateStr: z.string(), // DD/MM/YYYY
  isoDate: z.string(), // YYYY-MM-DD
  dayNumber: z.number(),
  monthName: z.string(),
  monthShort: z.string(),
  year: z.number(),
  displayDate: z.string(), // DD/MM
  weekDay: z.string(), // Hoje, Amanhã, Seg, Ter...
  isToday: z.boolean().default(false),
  isTomorrow: z.boolean().default(false),
  isClosed: z.boolean().default(false),
})

export const BookingAppointmentPayloadSchema = z.object({
  tenantName: z.string(),
  customerName: z.string().min(2),
  customerPhone: z.string().min(10),
  date: z.string(),
  time: z.string(),
  professional: ProfessionalSchema.optional(),
  services: z.array(BookingServiceSchema).min(1),
  totalDurationMinutes: z.number().min(0),
  totalPrice: z.number().min(0),
  paymentMethod: z.string().default('Pix'),
  notes: z.string().optional(),
})

export type Professional = z.infer<typeof ProfessionalSchema>
export type BookingService = z.infer<typeof BookingServiceSchema>
export type BookingSlot = z.infer<typeof BookingSlotSchema>
export type BookingDay = z.infer<typeof BookingDaySchema>
export type BookingAppointmentPayload = z.infer<typeof BookingAppointmentPayloadSchema>
