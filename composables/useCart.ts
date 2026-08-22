// composables/useCart.ts
import { defineStore } from 'pinia'
import type { CartItem, DeliveryType, PaymentMethod, Address } from '../types/cart'

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [] as CartItem[],
        deliveryType: 'delivery' as DeliveryType,
        deliveryFee: 0,
        customerName: '',
        customerPhone: '',
        address: {
            street: '',
            number: '',
            neighborhood: '',
            complement: ''
        } as Address,
        paymentMethod: 'Pix' as PaymentMethod,
        changeFor: null as number | null
    }),

    getters: {
        totalItems: (state): number =>
            state.items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0),

        subtotal: (state): number =>
            state.items.reduce((acc: number, item: CartItem) => acc + (item.unitPrice * item.quantity), 0),

        total: (state): number => {
            const fee = state.deliveryType === 'delivery' ? state.deliveryFee : 0
            const sub = state.items.reduce((acc: number, item: CartItem) => acc + (item.unitPrice * item.quantity), 0)
            return sub + fee
        }
    },

    actions: {
        addItem(item: CartItem) {
            this.items.push(item)
        },
        removeItem(index: number) {
            this.items.splice(index, 1)
        },
        updateQuantity(index: number, quantity: number) {
            if (quantity <= 0) {
                this.removeItem(index)
            } else {
                this.items[index].quantity = quantity
            }
        },
        clearCart() {
            this.items = []
            this.customerName = ''
            this.customerPhone = ''
            this.changeFor = null
        }
    }
})