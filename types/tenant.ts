// types/tenant.ts
import { z } from 'zod'

// 1. Opcionais e Variações de Produtos
export const OptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().default(0),
  maxQuantity: z.number().default(1),
})

export const OptionGroupSchema = z.object({
  id: z.string(),
  title: z.string(),
  required: z.boolean().default(false),
  min: z.number().default(0),
  max: z.number().default(1),
  options: z.array(OptionSchema),
})

// 2. Produtos do Catálogo
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().default(''),
  price: z.number().min(0, 'Preço não pode ser negativo'),
  image: z.string().optional().default(''),
  available: z.boolean().default(true),
  optionGroups: z.array(OptionGroupSchema).optional().default([]),
})

// 3. Categorias de Produtos
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().optional(),
  products: z.array(ProductSchema),
})

// 4. Horários de Funcionamento
export const OpeningHoursSchema = z.object({
  open: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de horário inválido, use HH:mm'),
  close: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de horário inválido, use HH:mm'),
})

// 5. Avaliações (iFood Style)
export const ReviewItemSchema = z.object({
  id: z.string(),
  author: z.string(),
  rating: z.number().min(1).max(5),
  date: z.string(),
  comment: z.string(),
  itemsOrdered: z.array(z.string()).optional(),
})

export const ServiceBadgeSchema = z.object({
  icon: z.enum(['star', 'chat-alert', 'check-doc']),
  label: z.string(),
  status: z.enum(['success', 'warning', 'neutral']),
})

export const ServiceQualitySchema = z.object({
  level: z.number().min(1).max(5),
  experienceLabel: z.string(),
  description: z.string(),
  badges: z.array(ServiceBadgeSchema),
})

export const StoreReviewsSchema = z.object({
  score: z.number().min(0).max(5),
  totalReviews: z.number(),
  serviceQuality: ServiceQualitySchema,
  distribution: z.object({
    5: z.number(),
    4: z.number(),
    3: z.number(),
    2: z.number(),
    1: z.number(),
  }),
  comments: z.array(ReviewItemSchema),
})

// 6. Schema Central do Estabelecimento (Tenant)
export const TenantSchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string().optional().default(''),
  logo: z.string().optional().default(''),
  banner: z.string().optional().default(''),
  phoneWhatsApp: z.string().transform((val) => val.replace(/\D/g, '')), // Remove não-dígitos
  address: z.string().optional().default(''),
  currency: z.string().default('R$'),
  deliveryFee: z.number().default(0),
  minOrderValue: z.number().default(0),
  openingHours: OpeningHoursSchema.optional(),
  categories: z.array(CategorySchema),
  reviews: StoreReviewsSchema.optional(),
})

// Tipos TypeScript inferidos automaticamente
export type Option = z.infer<typeof OptionSchema>
export type OptionGroup = z.infer<typeof OptionGroupSchema>
export type Product = z.infer<typeof ProductSchema>
export type Category = z.infer<typeof CategorySchema>
export type OpeningHours = z.infer<typeof OpeningHoursSchema>
export type ReviewItem = z.infer<typeof ReviewItemSchema>
export type ServiceBadge = z.infer<typeof ServiceBadgeSchema>
export type ServiceQuality = z.infer<typeof ServiceQualitySchema>
export type StoreReviews = z.infer<typeof StoreReviewsSchema>
export type Tenant = z.infer<typeof TenantSchema>