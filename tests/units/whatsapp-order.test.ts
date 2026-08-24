// tests/units/whatsapp-order.test.ts
import { describe, it, expect } from 'vitest'
import { generateWhatsAppOrderUrl } from '~/utils/whatsapp'
import type { CartState } from '~/types/cart'
import type { Tenant } from '~/types/tenant'
import { ProductSchema, OptionSchema } from '~/types/tenant'

describe('Unit: Geração de URL de Pedido WhatsApp (utils/whatsapp.ts)', () => {
  const mockTenant: Tenant = {
    slug: 'hamburgueria-x',
    name: 'Hamburgueria X',
    description: 'Hamburgueria artesanal',
    logo: '',
    banner: '',
    phoneWhatsApp: '(11) 98765-4321',
    address: 'Rua Teste, 123',
    currency: 'R$',
    deliveryFee: 5.0,
    minOrderValue: 0,
    categories: []
  }

  const mockProduct = ProductSchema.parse({
    id: 'prod-1',
    name: 'Smash Burger Duplo',
    price: 25.0,
    available: true,
    optionGroups: []
  })

  // Helper para extrair a mensagem decodificada da URL
  const extractMessageFromUrl = (url: string): string => {
    const match = url.match(/text=(.*)$/)
    return match && match[1] ? decodeURIComponent(match[1]) : ''
  }

  it('deve gerar URL correta com pedido simples sem opcionais', () => {
    const cart: CartState = {
      items: [
        {
          product: mockProduct,
          quantity: 2,
          unitPrice: 25.0,
          selectedOptions: []
        }
      ],
      deliveryType: 'delivery',
      deliveryFee: 5.0,
      customerName: 'João Silva',
      customerPhone: '11999998888',
      address: {
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        complement: 'Apto 10'
      },
      paymentMethod: 'Pix',
      changeFor: null,
      subtotal: 50.0,
      total: 55.0
    }

    const url = generateWhatsAppOrderUrl(mockTenant, cart)
    const message = extractMessageFromUrl(url)

    expect(url).toContain('wa.me/5511987654321')
    expect(message).toContain('NOVO PEDIDO')
    expect(message).toContain('HAMBURGUERIA X')
    expect(message).toContain('*2x* Smash Burger Duplo')
    expect(message).toContain('R$ 50.00')
    expect(message).toContain('Taxa de Entrega: R$ 5.00')
    expect(message).toContain('TOTAL: R$ 55.00')
    expect(message).toContain('João Silva')
    expect(message).toContain('Rua das Flores, 123')
    expect(message).toContain('Pix')
  })

  it('deve incluir opcionais e seus preços adicionais na mensagem', () => {
    const cart: CartState = {
      items: [
        {
          product: mockProduct,
          quantity: 1,
          unitPrice: 25.0,
          selectedOptions: [
            OptionSchema.parse({ id: 'opt-1', name: 'Bacon Extra', price: 3.0, maxQuantity: 1 }),
            OptionSchema.parse({ id: 'opt-2', name: 'Queijo Cheddar', price: 2.0, maxQuantity: 1 })
          ]
        }
      ],
      deliveryType: 'pickup',
      deliveryFee: 0,
      customerName: 'Maria Santos',
      customerPhone: '11988887777',
      address: {
        street: '',
        number: '',
        neighborhood: '',
        complement: ''
      },
      paymentMethod: 'Dinheiro',
      changeFor: 50.0,
      subtotal: 30.0,
      total: 30.0
    }

    const url = generateWhatsAppOrderUrl(mockTenant, cart)
    const message = extractMessageFromUrl(url)

    expect(message).toContain('Bacon Extra (+R$ 3.00)')
    expect(message).toContain('Queijo Cheddar (+R$ 2.00)')
    expect(message).toContain('RETIRADA NO BALCÃO')
    expect(message).toContain('TOTAL (RETIRADA): R$ 30.00')
    expect(message).toContain('Troco para: R$ 50.00')
  })

  it('deve incluir observações dos itens quando presentes', () => {
    const cart: CartState = {
      items: [
        {
          product: mockProduct,
          quantity: 1,
          unitPrice: 25.0,
          selectedOptions: [],
          observation: 'Ponto da carne bem passado, sem cebola'
        }
      ],
      deliveryType: 'delivery',
      deliveryFee: 5.0,
      customerName: 'Pedro Costa',
      customerPhone: '11977776666',
      address: {
        street: 'Av. Principal',
        number: '456',
        neighborhood: 'Jardins',
        complement: ''
      },
      paymentMethod: 'Cartão de Crédito',
      changeFor: null,
      subtotal: 25.0,
      total: 30.0
    }

    const url = generateWhatsAppOrderUrl(mockTenant, cart)
    const message = extractMessageFromUrl(url)

    expect(message).toContain('Obs: "Ponto da carne bem passado, sem cebola"')
  })

  it('deve sanitizar o telefone do tenant removendo caracteres não-dígitos', () => {
    const tenantWithMaskedPhone: Tenant = {
      ...mockTenant,
      phoneWhatsApp: '(11) 98765-4321'
    }

    const cart: CartState = {
      items: [],
      deliveryType: 'pickup',
      deliveryFee: 0,
      customerName: '',
      customerPhone: '',
      address: { street: '', number: '', neighborhood: '', complement: '' },
      paymentMethod: 'Pix',
      changeFor: null,
      subtotal: 0,
      total: 0
    }

    const url = generateWhatsAppOrderUrl(tenantWithMaskedPhone, cart)

    // Verifica que o telefone foi sanitizado na URL base
    expect(url).toContain('wa.me/5511987654321')
    // A função remove caracteres não-dígitos do telefone antes de usar na URL
  })

  it('deve formatar corretamente endereço sem complemento', () => {
    const cart: CartState = {
      items: [
        {
          product: mockProduct,
          quantity: 1,
          unitPrice: 25.0,
          selectedOptions: []
        }
      ],
      deliveryType: 'delivery',
      deliveryFee: 5.0,
      customerName: 'Ana Lima',
      customerPhone: '11966665555',
      address: {
        street: 'Rua Nova',
        number: '789',
        neighborhood: 'Vila Nova',
        complement: ''
      },
      paymentMethod: 'Pix',
      changeFor: null,
      subtotal: 25.0,
      total: 30.0
    }

    const url = generateWhatsAppOrderUrl(mockTenant, cart)
    const message = extractMessageFromUrl(url)

    expect(message).toContain('Rua Nova, 789')
    expect(message).toContain('Bairro: Vila Nova')
    expect(message).not.toContain('Compl:')
  })

  it('deve lidar com múltiplos itens no pedido', () => {
    const secondProduct = ProductSchema.parse({
      id: 'prod-2',
      name: 'Batata Frita',
      price: 15.0,
      available: true,
      optionGroups: []
    })

    const cart: CartState = {
      items: [
        {
          product: mockProduct,
          quantity: 1,
          unitPrice: 25.0,
          selectedOptions: []
        },
        {
          product: secondProduct,
          quantity: 2,
          unitPrice: 15.0,
          selectedOptions: []
        }
      ],
      deliveryType: 'delivery',
      deliveryFee: 5.0,
      customerName: 'Carlos Oliveira',
      customerPhone: '11955554444',
      address: {
        street: 'Rua Comercial',
        number: '100',
        neighborhood: 'Centro',
        complement: ''
      },
      paymentMethod: 'Pix',
      changeFor: null,
      subtotal: 55.0,
      total: 60.0
    }

    const url = generateWhatsAppOrderUrl(mockTenant, cart)
    const message = extractMessageFromUrl(url)

    expect(message).toContain('*1x* Smash Burger Duplo')
    expect(message).toContain('*2x* Batata Frita')
    expect(message).toContain('Subtotal: R$ 55.00')
    expect(message).toContain('TOTAL: R$ 60.00')
  })
})
