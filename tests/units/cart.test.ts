// tests/units/cart.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '~/composables/useCart'
import type { CartItem } from '~/types/cart'
import { ProductSchema } from '~/types/tenant'

describe('Unit: Composable de Carrinho (composables/useCart.ts)', () => {
    beforeEach(() => {
        // Inicializa uma instância limpa do Pinia para cada teste
        setActivePinia(createPinia())
    })

    const mockProduct = ProductSchema.parse({
        id: 'prod-1',
        name: 'Burger Duplo Angus',
        price: 30.0,
        available: true,
        optionGroups: []
    })

    const mockItem: CartItem = {
        product: mockProduct,
        quantity: 1,
        unitPrice: 30.0,
        selectedOptions: []
    }

    it('deve iniciar com o carrinho vazio e totais zerados', () => {
        const cart = useCartStore()
        expect(cart.items.length).toBe(0)
        expect(cart.totalItems).toBe(0)
        expect(cart.subtotal).toBe(0)
        expect(cart.total).toBe(0)
    })

    it('deve adicionar itens e calcular subtotal e totalItems corretamente', () => {
        const cart = useCartStore()
        cart.addItem(mockItem)
        cart.addItem({
            product: { ...mockProduct, id: 'prod-2', name: 'Batata Rústica' },
            quantity: 2,
            unitPrice: 20.0,
            selectedOptions: []
        })

        expect(cart.items.length).toBe(2)
        expect(cart.totalItems).toBe(3) // 1 burger + 2 batatas
        expect(cart.subtotal).toBe(70.0) // (30 * 1) + (20 * 2)
    })

    it('deve somar a taxa de entrega no modo Delivery e zerar no modo Retirada (Pickup)', () => {
        const cart = useCartStore()
        cart.deliveryFee = 7.0
        cart.addItem(mockItem) // subtotal 30.0

        // Modo Delivery: 30 + 7 = 37
        cart.deliveryType = 'delivery'
        expect(cart.total).toBe(37.0)

        // Modo Retirada: 30 (taxa ignorada)
        cart.deliveryType = 'pickup'
        expect(cart.total).toBe(30.0)
    })

    it('deve remover o item se a quantidade for atualizada para zero ou menor', () => {
        const cart = useCartStore()
        cart.addItem(mockItem)
        expect(cart.items.length).toBe(1)

        // Reduz quantidade para zero
        cart.updateQuantity(0, 0)
        expect(cart.items.length).toBe(0)
    })

    it('deve limpar todos os itens e resetar campos ao chamar clearCart()', () => {
        const cart = useCartStore()
        cart.addItem(mockItem)
        cart.customerName = 'Danilo'
        cart.changeFor = 50.0

        cart.clearCart()
        expect(cart.items.length).toBe(0)
        expect(cart.customerName).toBe('')
        expect(cart.changeFor).toBeNull()
    })
})