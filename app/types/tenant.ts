import { z } from 'zod'

export const OptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().min(0),
  maxQuantity: z.number().default(1)
})

export const OptionGroupSchema = z.object({
  id: z.string(),
  title: z.string(),
  required: z.boolean().default(false),
  min: z.number().default(0),
  max: z.number().default(1),
  options: z.array(OptionSchema)
})

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number().min(0),
  image: z.string().url().optional(),
  available: z.boolean().default(true),
  optionGroups: z.array(OptionGroupSchema).optional().default([])
})

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().optional(),
  products: z.array(ProductSchema)
})

export const LinkSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
  icon: z.string().optional(),
  color: z.string().optional()
})

export const ServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().min(0),
  description: z.string().optional()
})

export const TenantSchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string().optional(),
  logo: z.string().optional(),
  banner: z.string().optional(),
  phoneWhatsApp: z.string().regex(/^\d{10,13}$/), // DDD + Número
  address: z.string().optional(),
  currency: z.string().default('BRL'),
  deliveryFee: z.number().default(0),
  minOrderValue: z.number().default(0),
  template: z.enum(['menu', 'hub', 'booking']).default('menu'),
  links: z.array(LinkSchema).optional(),
  services: z.array(ServiceSchema).optional(),
  openingHours: z.object({
    open: z.string(), // "18:00"
    close: z.string() // "23:30"
  }).optional(),
  categories: z.array(CategorySchema).optional()
})

export type Tenant = z.infer<typeof TenantSchema>
export type Product = z.infer<typeof ProductSchema>
export type Category = z.infer<typeof CategorySchema>
export type OptionGroup = z.infer<typeof OptionGroupSchema>
export type Option = z.infer<typeof OptionSchema>
export type Link = z.infer<typeof LinkSchema>
export type Service = z.infer<typeof ServiceSchema>
