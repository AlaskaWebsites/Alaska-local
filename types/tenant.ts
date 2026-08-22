// types/tenant.ts
import { z } from 'zod'

// 1. Opcionais e Adicionais
export const OptionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().min(0).default(0),
  maxQuantity: z.number().min(1).default(1)
})

export const OptionGroupSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  required: z.boolean().default(false),
  min: z.number().min(0).default(0),
  max: z.number().min(1).default(1),
  options: z.array(OptionSchema).default([])
})

// 2. Produtos e Categorias
export const ProductSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().nullish().default(''),
  price: z.number().min(0),
  image: z.string().nullish().default(''),
  available: z.boolean().default(true),
  optionGroups: z.array(OptionGroupSchema).optional().default([])
})

export const CategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  icon: z.string().optional(),
  products: z.array(ProductSchema).default([])
})

// 3. Horário de Funcionamento
export const OpeningHoursSchema = z.object({
  open: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Formato deve ser HH:mm'),
  close: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Formato deve ser HH:mm')
})

// 4. Schema Principal do Tenant (com sanitização de WhatsApp)
export const TenantSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().nullish().default(''),
  logo: z.string().nullish().default(''),
  banner: z.string().nullish().default(''),
  phoneWhatsApp: z.string()
    .min(10, 'WhatsApp deve conter DDD + Número')
    .transform(val => val.replace(/\D/g, '')), // Garante só dígitos
  address: z.string().nullish().default(''),
  currency: z.string().default('R$'),
  deliveryFee: z.number().min(0).default(0),
  minOrderValue: z.number().min(0).default(0),
  openingHours: OpeningHoursSchema.optional(),
  categories: z.array(CategorySchema).default([])
})

// Inferência de Tipos TypeScript Puros
export type Tenant = z.infer<typeof TenantSchema>
export type TenantInput = z.input<typeof TenantSchema>
export type Product = z.infer<typeof ProductSchema>
export type Category = z.infer<typeof CategorySchema>
export type OptionGroup = z.infer<typeof OptionGroupSchema>
export type Option = z.infer<typeof OptionSchema>
export type OpeningHours = z.infer<typeof OpeningHoursSchema>