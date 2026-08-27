// types/tenant.ts
import { z } from 'zod'

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

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().default(''),
  price: z.number().min(0),
  image: z.string().optional(),
  available: z.boolean().default(true),
  optionGroups: z.array(OptionGroupSchema).optional().default([]),
})

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().optional(),
  products: z.array(ProductSchema).default([]),
})

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

export const StoreReviewsDistributionSchema = z.object({
  stars5: z.number().default(0),
  stars4: z.number().default(0),
  stars3: z.number().default(0),
  stars2: z.number().default(0),
  stars1: z.number().default(0),
})

export const StoreReviewCommentSchema = z.object({
  id: z.string(),
  author: z.string(),
  score: z.number(),
  date: z.string(),
  text: z.string(),
  orderItems: z.array(z.string()).optional(),
})

export const StoreReviewsSchema = z.object({
  score: z.number().min(1).max(5),
  totalCount: z.number().min(0),
  serviceLevel: z.enum(['super', 'excelente', 'muito_bom', 'bom', 'regular']).default('super'),
  badges: z.array(z.string()).optional().default([]),
  distribution: StoreReviewsDistributionSchema.optional(),
  comments: z.array(StoreReviewCommentSchema).optional().default([]),
})

export const TenantThemeSchema = z.enum(['food', 'barber', 'health', 'drinks']).default('food')

export const BusinessCategorySchema = z.enum(['menu', 'shop', 'hub', 'pro']).default('menu')

export const TenantSchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string().optional().default(''),
  logo: z.string().optional(),
  banner: z.string().optional(),
  phoneWhatsApp: z.string(),
  address: z.string().optional().default(''),
  currency: z.string().default('BRL'),
  deliveryFee: z.number().default(0),
  minOrderValue: z.number().default(0),
  template: z.enum(['menu', 'hub', 'booking', 'pro']).default('menu'),
  businessCategory: BusinessCategorySchema.optional(),
  theme: TenantThemeSchema.optional().default('food'),
  reviews: StoreReviewsSchema.optional(),
  links: z.array(LinkSchema).optional(),
  services: z.array(ServiceSchema).optional(),
  openingHours: z.object({
    open: z.string(),
    close: z.string(),
  }).optional(),
  categories: z.array(CategorySchema).optional().default([]),
})

export type Tenant = z.infer<typeof TenantSchema>
export type Product = z.infer<typeof ProductSchema>
export type Category = z.infer<typeof CategorySchema>
export type OptionGroup = z.infer<typeof OptionGroupSchema>
export type Option = z.infer<typeof OptionSchema>
export type ProductOption = Option
export type Link = z.infer<typeof LinkSchema>
export type Service = z.infer<typeof ServiceSchema>
export type StoreReviews = z.infer<typeof StoreReviewsSchema>
export type TenantTheme = z.infer<typeof TenantThemeSchema>
export type BusinessCategory = z.infer<typeof BusinessCategorySchema>
