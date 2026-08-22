// types/cart.ts
import type { Product, Option } from './tenant'

export type DeliveryType = 'delivery' | 'pickup'

export type PaymentMethod = 'Pix' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Dinheiro'

export interface Address {
    street: string
    number: string
    neighborhood: string
    complement?: string
}

export interface CartItem {
    id?: string
    product: Product
    quantity: number
    unitPrice: number
    selectedOptions?: Option[]
    observation?: string
}

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