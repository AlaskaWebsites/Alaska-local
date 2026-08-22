// tests/whatsapp.test.ts
import { describe, it, expect } from 'vitest'
import { generateWhatsAppOrderUrl } from '../utils/whatsapp'
import type { Tenant } from '../types/tenant'
import type { CartState } from '../types/cart'

describe('WhatsApp Order URL Generator', () => {
    const mockTenant: Tenant = {
        slug: 'burger-test',
        name: 'Burger Test',
        phoneWhatsApp: '11999998888',
        currency: 'R$',
        deliveryFee: 5.0,
        minOrderValue: 20.0,
        categories: []
    }

    const mockCart: CartState = {
        items: [
            {
                product: { id: '1', name: 'Cheeseburger', price: 25.0, available: true, optionGroups: [] },
                quantity: 2,
                unitPrice: 25.0,
                selectedOptions: [{ id: 'b1', name: 'Bacon Extra', price: 4.0 }]
            }
        ],
        deliveryType: 'delivery',
        deliveryFee: 5.0,
        customerName: 'Danilo',
        address: { street: 'Rua A', number: '100', neighborhood: 'Centro' },
        paymentMethod: 'Pix',
        subtotal: 50.0,
        total: 55.0
    }

    it('deve gerar a URL com o telefone correto e prefixo 55', () => {
        const url = generateWhatsAppOrderUrl(mockTenant, mockCart)
        expect(url).toContain('https://wa.me/5511999998888')
    })

    it('deve conter o nome do cliente e endereço no payload decodificado', () => {
        const url = generateWhatsAppOrderUrl(mockTenant, mockCart)
        const decodedMessage = decodeURIComponent(url)

        expect(decodedMessage).toContain('Danilo')
        expect(decodedMessage).toContain('Rua A, 100')
        expect(decodedMessage).toContain('Bacon Extra')
        expect(decodedMessage).toContain('TOTAL: R$ 55.00')
    })
})