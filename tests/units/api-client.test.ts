// tests/units/api-client.test.ts
import { describe, it, expect } from 'vitest'
import { TenantSchema, type Tenant } from '~/types/tenant'

describe('Unit: Contrato e Compatibilidade de DTOs API Front/Back', () => {
  it('deve validar contrato de retorno de tenant da API NestJS', () => {
    const apiPayload = {
      id: 'ten-karine-finardi',
      slug: 'karine-finardi',
      name: 'Karine Finardi | Semijoias & Revenda',
      description: 'Semijoias finas',
      phoneWhatsApp: '11999998888',
      address: 'Francisco Morato - SP',
      businessCategory: 'shop',
      theme: 'rose',
      openingHours: { open: '09:00', close: '19:00' },
      pixConfig: {
        key: '11999998888',
        keyType: 'phone',
        beneficiary: 'Karine Finardi',
        city: 'FRANCISCO MORATO'
      },
      categories: [],
      currency: 'R$',
      deliveryFee: 0,
      minOrderValue: 0
    }

    const validated = TenantSchema.parse(apiPayload)
    expect(validated.slug).toBe('karine-finardi')
    expect(validated.businessCategory).toBe('shop')
    expect(validated.theme).toBe('rose')
  })
})
