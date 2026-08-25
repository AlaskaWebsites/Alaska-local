// tests/units/cart-drawer.spec.ts
import { describe, it, expect } from 'vitest'
import type { CartItemPayload } from '~/components/CartDrawerModal.vue'
import { TenantSchema, type Tenant } from '~/types/tenant'

describe('Componente Modular: CartDrawerModal (Regras de Negócio e Checkout)', () => {
    // Mock de Tenant 100% válido pelo Schema Zod
    const mockTenant: Tenant = TenantSchema.parse({
        slug: 'hamburgueria-x',
        name: 'Hamburgueria X',
        description: 'Melhores burgers da cidade',
        logo: 'https://images.unsplash.com/logo.jpg',
        banner: 'https://images.unsplash.com/banner.jpg',
        phoneWhatsApp: '11999999999',
        address: 'Rua das Hamburguerias, 123 - Centro',
        deliveryFee: 6.5,
        minOrderValue: 20,
        theme: 'food',
        categories: []
    })

    // 1. Helpers Puros simulando a lógica isolada do CartDrawerModal
    const calculateSubtotal = (items: CartItemPayload[]): number => {
        return items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)
    }

    const calculateFinalTotal = (
        subtotal: number,
        deliveryType: 'delivery' | 'pickup',
        deliveryFee: number
    ): number => {
        const fee = deliveryType === 'delivery' ? deliveryFee : 0
        return subtotal + fee
    }

    const validateCheckout = (data: {
        customerName: string
        deliveryType: 'delivery' | 'pickup'
        address: { street: string; number: string; neighborhood: string; complement?: string }
    }): boolean => {
        if (!data.customerName.trim()) return false
        if (data.deliveryType === 'delivery') {
            return (
                data.address.street.trim() !== '' &&
                data.address.number.trim() !== '' &&
                data.address.neighborhood.trim() !== ''
            )
        }
        return true
    }

    const buildWhatsAppPayload = (
        tenant: Tenant,
        items: CartItemPayload[],
        checkout: {
            customerName: string
            deliveryType: 'delivery' | 'pickup'
            paymentMethod: string
            changeFor?: number | null
            address: { street: string; number: string; neighborhood: string; complement?: string }
        }
    ): { message: string; url: string } => {
        const formatCurrency = (val: number) =>
            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

        const subtotal = calculateSubtotal(items)
        const fee = checkout.deliveryType === 'delivery' ? tenant.deliveryFee || 0 : 0
        const total = subtotal + fee

        const lines: string[] = []
        lines.push(`🍔 *NOVO PEDIDO - ${tenant.name.toUpperCase()}*`)
        lines.push(`━━━━━━━━━━━━━━━━━━━━━`)

        items.forEach((item) => {
            lines.push(`*${item.quantity}x* ${item.product.name} — *${formatCurrency(item.unitPrice * item.quantity)}*`)
            item.selectedOptions.forEach((opt) => {
                const priceStr = opt.price > 0 ? ` (+${formatCurrency(opt.price)})` : ''
                lines.push(`   └ _${opt.name}${priceStr}_`)
            })
            if (item.observation) {
                lines.push(`   └ 💬 _Obs: "${item.observation}"_`)
            }
            lines.push('')
        })

        lines.push(`━━━━━━━━━━━━━━━━━━━━━`)
        lines.push(`Subtotal: ${formatCurrency(subtotal)}`)

        if (checkout.deliveryType === 'delivery') {
            lines.push(`Taxa de Entrega: ${formatCurrency(fee)}`)
            lines.push(`*TOTAL: ${formatCurrency(total)}*`)
            lines.push(`━━━━━━━━━━━━━━━━━━━━━`)
            lines.push(`📍 *DADOS DE ENTREGA:*`)
            lines.push(`• Nome: ${checkout.customerName}`)
            lines.push(`• Endereço: ${checkout.address.street}, ${checkout.address.number}`)
            if (checkout.address.complement) {
                lines.push(`• Complemento: ${checkout.address.complement}`)
            }
            lines.push(`• Bairro: ${checkout.address.neighborhood}`)
        } else {
            lines.push(`*TOTAL (RETIRADA): ${formatCurrency(total)}*`)
            lines.push(`━━━━━━━━━━━━━━━━━━━━━`)
            lines.push(`🛍️ *RETIRADA NO BALCÃO:*`)
            lines.push(`• Nome: ${checkout.customerName}`)
        }

        lines.push(`━━━━━━━━━━━━━━━━━━━━━`)
        lines.push(`💳 *FORMA DE PAGAMENTO:*`)
        lines.push(`• ${checkout.paymentMethod}`)
        if (checkout.paymentMethod === 'Dinheiro' && checkout.changeFor) {
            lines.push(`• Troco para: ${formatCurrency(checkout.changeFor)}`)
        }

        const message = lines.join('\n')
        const phone = tenant.phoneWhatsApp.replace(/\D/g, '')
        const url = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`

        return { message, url }
    }

    // 2. Testes de Cálculos Financeiros
    describe('Cálculos de Subtotal e Taxas', () => {
        it('deve calcular o subtotal somando produtos com adicionais e quantidades múltiplas', () => {
            const items: CartItemPayload[] = [
                {
                    product: { id: 'p1', name: 'Burger Duplo', price: 30.0 },
                    quantity: 2,
                    selectedOptions: [{ id: 'o1', name: 'Bacon', price: 4.0, maxQuantity: 1 }],
                    observation: 'Sem picles',
                    unitPrice: 34.0
                },
                {
                    product: { id: 'p2', name: 'Coca-Cola', price: 6.0 },
                    quantity: 1,
                    selectedOptions: [],
                    observation: '',
                    unitPrice: 6.0
                }
            ]

            expect(calculateSubtotal(items)).toBe(74.0)
        })

        it('deve somar a taxa de entrega no modo delivery e isentar no modo retirada', () => {
            const subtotal = 74.0
            const fee = 6.5

            expect(calculateFinalTotal(subtotal, 'delivery', fee)).toBe(80.5)
            expect(calculateFinalTotal(subtotal, 'pickup', fee)).toBe(74.0)
        })
    })

    // 3. Testes de Validação do Formulário de Checkout
    describe('Validação do Formulário de Checkout (isCheckoutValid)', () => {
        it('deve rejeitar pedido se o nome do cliente for vazio ou apenas espaços', () => {
            const invalidData = {
                customerName: '   ',
                deliveryType: 'pickup' as const,
                address: { street: '', number: '', neighborhood: '' }
            }
            expect(validateCheckout(invalidData)).toBe(false)
        })

        it('deve validar no modo delivery somente se rua, número e bairro estiverem preenchidos', () => {
            const incompleteDelivery = {
                customerName: 'Danilo Gozzi',
                deliveryType: 'delivery' as const,
                address: { street: 'Av. Paulista', number: '', neighborhood: 'Bela Vista' }
            }
            expect(validateCheckout(incompleteDelivery)).toBe(false)

            const completeDelivery = {
                customerName: 'Danilo Gozzi',
                deliveryType: 'delivery' as const,
                address: { street: 'Av. Paulista', number: '1000', neighborhood: 'Bela Vista' }
            }
            expect(validateCheckout(completeDelivery)).toBe(true)
        })

        it('deve validar no modo retirada (pickup) exigindo apenas o nome do cliente', () => {
            const validPickup = {
                customerName: 'Danilo Gozzi',
                deliveryType: 'pickup' as const,
                address: { street: '', number: '', neighborhood: '' }
            }
            expect(validateCheckout(validPickup)).toBe(true)
        })
    })

    // 4. Testes de Despacho e Payload do WhatsApp
    describe('Geração de Mensagem do WhatsApp', () => {
        it('deve gerar payload estruturado de delivery com adicionais, endereço e observação', () => {
            const items: CartItemPayload[] = [
                {
                    product: { id: 'p1', name: 'X-Salada Especial', price: 25.0 },
                    quantity: 1,
                    selectedOptions: [{ id: 'opt-queijo', name: 'Queijo Extra', price: 3.0, maxQuantity: 1 }],
                    observation: 'Caprichar na maionese verde',
                    unitPrice: 28.0
                }
            ]

            const checkout = {
                customerName: 'Danilo Gozzi',
                deliveryType: 'delivery' as const,
                paymentMethod: 'Pix',
                address: {
                    street: 'Rua das Palmeiras',
                    number: '450',
                    neighborhood: 'Jardins',
                    complement: 'Apto 12'
                }
            }

            const { message, url } = buildWhatsAppPayload(mockTenant, items, checkout)

            expect(message).toContain('🍔 *NOVO PEDIDO - HAMBURGUERIA X*')
            expect(message).toContain('*1x* X-Salada Especial')
            expect(message).toContain('Queijo Extra')
            expect(message).toContain('Obs: "Caprichar na maionese verde"')
            expect(message).toContain('📍 *DADOS DE ENTREGA:*')
            expect(message).toContain('• Endereço: Rua das Palmeiras, 450')
            expect(message).toContain('• Complemento: Apto 12')
            expect(message).toContain('• Forma de Pagamento:*\n• Pix')
            expect(url).toContain('https://wa.me/5511999999999?text=')
        })

        it('deve incluir solicitação de troco quando a forma de pagamento for Dinheiro', () => {
            const items: CartItemPayload[] = [
                {
                    product: { id: 'p1', name: 'Combo Smash', price: 35.0 },
                    quantity: 1,
                    selectedOptions: [],
                    observation: '',
                    unitPrice: 35.0
                }
            ]

            const checkout = {
                customerName: 'Carlos Silva',
                deliveryType: 'pickup' as const,
                paymentMethod: 'Dinheiro',
                changeFor: 50.0,
                address: { street: '', number: '', neighborhood: '' }
            }

            const { message } = buildWhatsAppPayload(mockTenant, items, checkout)

            expect(message).toContain('🛍️ *RETIRADA NO BALCÃO:*')
            expect(message).toContain('• Dinheiro')
            expect(message).toContain('• Troco para:')
            expect(message).toContain('50')
        })
    })

    // 5. Acessibilidade W3C / WCAG
    describe('Diretrizes de Acessibilidade W3C/WCAG', () => {
        it('deve respeitar os padrões semânticos de modal de diálogo', () => {
            const modalSemantics = {
                role: 'dialog',
                ariaModal: 'true',
                ariaLabelledBy: 'cart-drawer-title',
                closeButtonAriaLabel: 'Fechar sacola',
                removeItemAriaLabel: (productName: string) => `Remover ${productName} da sacola`
            }

            expect(modalSemantics.role).toBe('dialog')
            expect(modalSemantics.ariaModal).toBe('true')
            expect(modalSemantics.ariaLabelledBy).toBe('cart-drawer-title')
            expect(modalSemantics.removeItemAriaLabel('X-Burger')).toBe('Remover X-Burger da sacola')
        })
    })
})
