// types/cart.ts
import { z } from 'zod'
import type { Product, Option } from './tenant'

// 1. Enums de Pedido
export const DeliveryTypeEnum = z.enum(['delivery', 'pickup'])
export const PaymentMethodEnum = z.enum(['Pix', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro'])

export type DeliveryType = z.infer<typeof DeliveryTypeEnum>
export type PaymentMethod = z.infer<typeof PaymentMethodEnum>

// 2. Schema de Endereço
export const AddressSchema = z.object({
  street: z.string().default(''),
  number: z.string().default(''),
  neighborhood: z.string().default(''),
  complement: z.string().nullish().default('')
})

export type Address = z.infer<typeof AddressSchema>

// 3. Estrutura do Item do Carrinho
export interface CartItem {
  id?: string
  product: Product
  quantity: number
  unitPrice: number
  selectedOptions?: Option[]
  observation?: string
}

// 4. Estado Global do Carrinho
export interface CartState {
  items: CartItem[]
  deliveryType: DeliveryType
  deliveryFee: number
  customerName: string
  customerPhone?: string
  address: Address
  paymentMethod: PaymentMethod
  changeFor?: number | null
  subtotal: number
  total: number
}