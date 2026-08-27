// types/tenant.ts
import { z } from 'zod'

// 1. Opcionais e Variações de Produtos
export const OptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().min(0).default(0),
  maxQuantity: z.number().optional().default(1),
})

export const OptionGroupSchema = z.object({
  id: z.string(),
  title: z.string(),
  required: z.boolean().default(false),
  min: z.number().optional().default(0),
  max: z.number().optional().default(1),
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
  products: z.array(ProductSchema).default([]),
})

// 4. Horários de Funcionamento
export const OpeningHoursSchema = z.object({
  open: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de horário inválido, use HH:mm'),
  close: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de horário inválido, use HH:mm'),
})

// 5. Links e Serviços Institucionais (Alaska Hub & Pro)
export const LinkSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  icon: z.string().optional(),
  color: z.string().optional(),
})

export const ServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().min(0),
  description: z.string().optional(),
})

// 6. Avaliações (iFood Style)
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
  distribution: z.record(z.string(), z.number()).or(
    z.object({
      5: z.number().default(0),
      4: z.number().default(0),
      3: z.number().default(0),
      2: z.number().default(0),
      1: z.number().default(0),
    })
  ),
  comments: z.array(ReviewItemSchema),
})

// 7. Tema e Identidade Cromática por Segmento
export const TenantThemeSchema = z.enum(['food', 'barber', 'health', 'drinks', 'default']).default('food')

// 8. Categorias Canônicas de Negócio
export const BusinessCategorySchema = z.enum(['menu', 'shop', 'hub', 'pro'])

// 9. Schema Central do Estabelecimento (Tenant)
export const TenantSchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string().optional().default(''),
  logo: z.string().optional().default(''),
  banner: z.string().optional().default(''),
  phoneWhatsApp: z.string().transform((val) => val.replace(/\D/g, '')), // Sanitiza removendo caracteres não numéricos
  address: z.string().optional().default(''),
  currency: z.string().default('R$'),
  deliveryFee: z.number().default(0),
  minOrderValue: z.number().default(0),
  template: z.enum(['menu', 'hub', 'booking', 'pro', 'shop']).optional().default('menu'),
  businessCategory: BusinessCategorySchema.optional(),
  theme: TenantThemeSchema.optional().default('food'),
  openingHours: OpeningHoursSchema.optional(),
  categories: z.array(CategorySchema).optional().default([]),
  reviews: StoreReviewsSchema.optional(),
  links: z.array(LinkSchema).optional().default([]),
  services: z.array(ServiceSchema).optional().default([]),
  // Campos adicionais para aba Informações / Showcase
  category: z.string().optional().default(''),
  distance: z.string().optional().default(''),
  priceRange: z.string().optional().default(''),
  paymentMethods: z.array(z.string()).optional().default([]),
})

// Tipos TypeScript inferidos automaticamente
export type Option = z.infer<typeof OptionSchema>
export type OptionGroup = z.infer<typeof OptionGroupSchema>
export type ProductOption = Option
export type Product = z.infer<typeof ProductSchema>
export type Category = z.infer<typeof CategorySchema>
export type OpeningHours = z.infer<typeof OpeningHoursSchema>
export type ReviewItem = z.infer<typeof ReviewItemSchema>
export type ServiceBadge = z.infer<typeof ServiceBadgeSchema>
export type ServiceQuality = z.infer<typeof ServiceQualitySchema>
export type StoreReviews = z.infer<typeof StoreReviewsSchema>
export type TenantTheme = z.infer<typeof TenantThemeSchema>
export type BusinessCategory = z.infer<typeof BusinessCategorySchema>
export type Link = z.infer<typeof LinkSchema>
export type Service = z.infer<typeof ServiceSchema>
export type Tenant = z.infer<typeof TenantSchema>
