// tests/units/pix.test.ts
import { describe, it, expect } from 'vitest'
import {
  crc16Ccitt,
  sanitizeEmvString,
  generatePixPayload,
  getTenantPixConfig
} from '~/utils/pix'
import { TenantSchema, type Tenant } from '~/types/tenant'

describe('Unit: Utilitário de Geração de Pix e BR Code EMV (utils/pix.ts)', () => {
  describe('crc16Ccitt', () => {
    it('deve calcular o checksum CRC-16 CCITT padrão BACEN corretamente', () => {
      // Exemplo padrão com payload de teste
      const sample = '00020126330014br.gov.bcb.pix01111199999888852040000530398654040.015802BR5914Karine Finardi6009SAO PAULO62110507TESTE016304'
      const crc = crc16Ccitt(sample)
      expect(crc).toBe('322F')
    })
  })

  describe('sanitizeEmvString', () => {
    it('deve remover acentos e limitar comprimento', () => {
      expect(sanitizeEmvString('Boutique Élégance & Cia', 25)).toBe('Boutique Elegance  Cia')
      expect(sanitizeEmvString('São Paulo', 15)).toBe('Sao Paulo')
    })
  })

  describe('generatePixPayload', () => {
    it('deve gerar payload BR Code completo para valor normal', () => {
      const payload = generatePixPayload({
        key: '11999998888',
        beneficiary: 'Karine Finardi',
        city: 'SAO PAULO',
        amount: 89.90,
        txid: 'PEDIDO123'
      })

      expect(payload).toContain('000201')
      expect(payload).toContain('br.gov.bcb.pix')
      expect(payload).toContain('11999998888')
      expect(payload).toContain('540589.90')
      expect(payload).toContain('5802BR')
      expect(payload).toContain('Karine Finardi')
      expect(payload).toContain('6304')
      expect(payload.length).toBeGreaterThan(50)
    })

    it('deve suportar geração de Pix de 1 centavo (R$ 0,01) para modo de teste', () => {
      const payload = generatePixPayload({
        key: '11999998888',
        beneficiary: 'Alaska Local',
        city: 'SAO PAULO',
        amount: 0.01,
        txid: 'TESTE01'
      })

      expect(payload).toContain('54040.01')
      expect(payload).toContain('TESTE01')
    })
  })

  describe('getTenantPixConfig', () => {
    it('deve extrair configuração de objeto pix explícito no tenant', () => {
      const tenant: Partial<Tenant> = {
        slug: 'loja-teste',
        name: 'Loja Teste',
        pix: {
          key: '11987654321',
          keyType: 'phone',
          beneficiary: 'Loja Teste ME',
          city: 'SAO PAULO',
          allowTestCent: true,
          depositPercentage: 50
        }
      }

      const config = getTenantPixConfig(tenant)
      expect(config).not.toBeNull()
      expect(config?.key).toBe('11987654321')
      expect(config?.beneficiary).toBe('Loja Teste ME')
      expect(config?.depositPercentage).toBe(50)
    })

    it('deve usar fallback do WhatsApp do tenant quando pix não estiver configurado', () => {
      const tenant: Partial<Tenant> = {
        slug: 'hamburgueria-x',
        name: 'Hamburgueria X',
        phoneWhatsApp: '(11) 97777-6666'
      }

      const config = getTenantPixConfig(tenant)
      expect(config).not.toBeNull()
      expect(config?.key).toBe('11977776666')
      expect(config?.keyType).toBe('phone')
    })
  })
})
