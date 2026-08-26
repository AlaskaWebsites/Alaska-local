// tests/units/cart.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { ref } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { useCart, useCartStore } from '~/composables/useCart'
import type { CartItem, Product } from '~/types'

const mockProduct: Product = {
    id: 'prod-burger',
    name: 'Burger Angus',
    description: 'Delicioso hambúrguer artesanal',
    price: 25.0,
    available: true,
    optionGroups: [],
}

const mockCartItem: CartItem = {
    product: mockProduct,
    quantity: 2,
    selectedOptions: {},
    options: [{ id: 'opt-bacon', name: 'Bacon Extra', price: 4.0, maxQuantity: 1 }],
    notes: 'Sem cebola',
    unitPrice: 29.0, // 25 + 4
}

describe('Unit: Gerenciamento e Persistência de Sacola (useCart & useCartStore)', () => {
    describe('1. Composable Multi-Tenant com LocalStorage (useCart)', () => {
        it('deve gerar storageKey isolada por tenant slug', () => {
            const cart1 = useCart('hamburgueria-x')
            expect(cart1.storageKey.value).toBe('alaska_cart_hamburgueria-x')

            const tenantRef = ref({ slug: 'barbearia-style', name: 'Barbearia' } as any)
            const cart2 = useCart(tenantRef)
            expect(cart2.storageKey.value).toBe('alaska_cart_barbearia-style')
        })

        it('deve adicionar item à sacola e recalcular totais', () => {
            const cart = useCart('loja-teste-1')
            cart.clearCart()

            expect(cart.isEmpty.value).toBe(true)
            expect(cart.totalItemsCount.value).toBe(0)
            expect(cart.cartSubtotal.value).toBe(0)

            cart.addItem(mockCartItem)

            expect(cart.items.value).toHaveLength(1)
            expect(cart.totalItemsCount.value).toBe(2)
            expect(cart.cartSubtotal.value).toBe(58.0) // 29 * 2
            expect(cart.isEmpty.value).toBe(false)
        })

        it('deve atualizar quantidade do item ou remover se quantidade for zero', () => {
            const cart = useCart('loja-teste-2')
            cart.clearCart()
            cart.addItem({ ...mockCartItem, quantity: 1 })

            // Atualiza para 3
            cart.updateItemQuantity(0, 3)
            expect(cart.totalItemsCount.value).toBe(3)
            expect(cart.cartSubtotal.value).toBe(87.0) // 29 * 3

            // Atualiza para 0 (deve remover)
            cart.updateItemQuantity(0, 0)
            expect(cart.items.value).toHaveLength(0)
            expect(cart.isEmpty.value).toBe(true)
        })

        it('deve remover item por índice e limpar sacola', () => {
            const cart = useCart('loja-teste-3')
            cart.clearCart()
            cart.addItem({ ...mockCartItem, quantity: 1 })
            cart.addItem({ ...mockCartItem, quantity: 2 })

            expect(cart.items.value).toHaveLength(2)

            cart.removeItem(0)
            expect(cart.items.value).toHaveLength(1)

            cart.clearCart()
            expect(cart.items.value).toHaveLength(0)
            expect(cart.isEmpty.value).toBe(true)
        })
    })

    describe('2. Pinia Store (useCartStore)', () => {
        beforeEach(() => {
            setActivePinia(createPinia())
        })

        it('deve inicializar com estado padrão vazio', () => {
            const store = useCartStore()
            expect(store.items).toHaveLength(0)
            expect(store.totalItems).toBe(0)
            expect(store.subtotal).toBe(0)
            expect(store.total).toBe(0)
        })

        it('deve calcular subtotal e total com taxa de entrega', () => {
            const store = useCartStore()
            store.deliveryFee = 5.0
            store.deliveryType = 'delivery'

            store.addItem(mockCartItem)

            expect(store.totalItems).toBe(2)
            expect(store.subtotal).toBe(58.0)
            expect(store.total).toBe(63.0) // 58 + 5
        })

        it('não deve cobrar taxa de entrega se for retirada', () => {
            const store = useCartStore()
            store.deliveryFee = 5.0
            store.deliveryType = 'takeaway'

            store.addItem(mockCartItem)

            expect(store.total).toBe(58.0)
        })

        it('deve limpar carrinho com clearCart', () => {
            const store = useCartStore()
            store.addItem(mockCartItem)
            store.customerName = 'João'

            store.clearCart()

            expect(store.items).toHaveLength(0)
            expect(store.customerName).toBe('')
        })
    })
})
