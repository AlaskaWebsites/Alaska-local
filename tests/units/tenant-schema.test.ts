// tests/unit/tenant-schema.test.ts
import { describe, it, expect } from 'vitest'
import { TenantSchema, ProductSchema } from '~/types/tenant'

describe('Unit: Validação de Schemas Zod (types/tenant.ts)', () => {
    it('deve validar e sanitizar um tenant válido com telefone mascarado', () => {
        const rawTenant = {
            slug: 'adega-do-bairro',
            name: 'Adega do Bairro',
            description: 'Cervejas e destilados',
            phoneWhatsApp: '(11) 98765-4321', // com máscara
            address: 'Rua Central, 50',
            currency: 'R$',
            deliveryFee: 5.0,
            minOrderValue: 15.0,
            openingHours: {
                open: '14:00',
                close: '02:00'
            },
            categories: [
                {
                    id: 'cat-cervejas',
                    name: 'Cervejas Geladas',
                    products: [
                        {
                            id: 'prod-heineken',
                            name: 'Heineken 350ml Lata',
                            price: 6.5,
                            available: true,
                            optionGroups: []
                        }
                    ]
                }
            ]
        }

        const parsed = TenantSchema.parse(rawTenant)

        expect(parsed.slug).toBe('adega-do-bairro')
        expect(parsed.name).toBe('Adega do Bairro')
        expect(parsed.phoneWhatsApp).toBe('11987654321') // sanitizado automaticamente
        expect(parsed.categories[0].products[0].price).toBe(6.5)
    })

    it('deve aplicar valores default para campos opcionais ausentes', () => {
        const minimalTenant = {
            slug: 'barbearia-top',
            name: 'Barbearia Top',
            phoneWhatsApp: '11911112222',
            categories: []
        }

        const parsed = TenantSchema.parse(minimalTenant)

        expect(parsed.currency).toBe('R$')
        expect(parsed.deliveryFee).toBe(0)
        expect(parsed.minOrderValue).toBe(0)
        expect(parsed.description).toBe('')
        expect(parsed.categories).toEqual([])
    })

    it('deve falhar se o produto tiver preço negativo', () => {
        const invalidProduct = {
            id: 'prod-invalido',
            name: 'Produto Inválido',
            price: -10
        }

        expect(() => ProductSchema.parse(invalidProduct)).toThrow()
    })

    it('deve falhar se o formato de horário for inválido', () => {
        const invalidHoursTenant = {
            slug: 'teste-horario',
            name: 'Teste',
            phoneWhatsApp: '11999999999',
            openingHours: {
                open: '8:00 AM', // formato inválido (deve ser HH:mm)
                close: '22:00'
            },
            categories: []
        }

        expect(() => TenantSchema.parse(invalidHoursTenant)).toThrow()
    })
})