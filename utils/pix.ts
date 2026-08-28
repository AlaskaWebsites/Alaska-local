// utils/pix.ts
import type { Tenant, PixConfig } from '~/types/tenant'

/**
 * Calcula o checksum CRC-16 CCITT (Polinômio 0x1021, Valor Inicial 0xFFFF)
 * Conforme especificação oficial do Banco Central do Brasil para o BR Code / Pix EMV.
 */
export function crc16Ccitt(payload: string): string {
  let crc = 0xffff
  const bytes = new TextEncoder().encode(payload)

  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i] << 8
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff
      } else {
        crc = (crc << 1) & 0xffff
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0')
}

/**
 * Remove acentuação e caracteres especiais para compatibilidade estrita EMV QRCPS-MPM.
 */
export function sanitizeEmvString(text: string, maxLength: number): string {
  if (!text) return ''
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .slice(0, maxLength)
    .trim()
}

/**
 * Formata um campo TLV (Tag-Length-Value) do padrão EMV.
 */
function formatTlv(tag: number, value: string): string {
  const tagStr = tag.toString().padStart(2, '0')
  const lenStr = new TextEncoder().encode(value).length.toString().padStart(2, '0')
  return `${tagStr}${lenStr}${value}`
}

export interface GeneratePixParams {
  key: string
  beneficiary?: string
  city?: string
  amount?: number
  txid?: string
}

/**
 * Gera a string Pix Copia e Cola (BR Code EMV) com valor, favorecido e CRC16.
 */
export function generatePixPayload(params: GeneratePixParams): string {
  const key = (params.key || '').trim()
  if (!key) return ''

  const name = sanitizeEmvString(params.beneficiary || 'Alaska Local', 25) || 'Alaska Local'
  const city = sanitizeEmvString(params.city || 'SAO PAULO', 15) || 'SAO PAULO'
  const txid = sanitizeEmvString(params.txid || '***', 25) || '***'

  // Tag 00: Payload Format Indicator (01)
  const tag00 = formatTlv(0, '01')

  // Tag 26: Merchant Account Information
  const gui = formatTlv(0, 'br.gov.bcb.pix')
  const keyField = formatTlv(1, key)
  const tag26 = formatTlv(26, `${gui}${keyField}`)

  // Tag 52: Merchant Category Code (0000)
  const tag52 = formatTlv(52, '0000')

  // Tag 53: Transaction Currency (986 = BRL)
  const tag53 = formatTlv(53, '986')

  // Tag 54: Transaction Amount (opcional, formatado com 2 casas decimais)
  let tag54 = ''
  if (typeof params.amount === 'number' && params.amount > 0) {
    tag54 = formatTlv(54, params.amount.toFixed(2))
  }

  // Tag 58: Country Code (BR)
  const tag58 = formatTlv(58, 'BR')

  // Tag 59: Merchant Name
  const tag59 = formatTlv(59, name)

  // Tag 60: Merchant City
  const tag60 = formatTlv(60, city)

  // Tag 62: Additional Data Field Template (TXID)
  const txidField = formatTlv(5, txid)
  const tag62 = formatTlv(62, txidField)

  // Tag 63: CRC16 (4 caracteres)
  const rawPayload = `${tag00}${tag26}${tag52}${tag53}${tag54}${tag58}${tag59}${tag60}${tag62}6304`
  const checksum = crc16Ccitt(rawPayload)

  return `${rawPayload}${checksum}`
}

/**
 * Extrai a configuração de Pix do tenant (seja por objeto `pix` ou campos legados planos).
 */
export function getTenantPixConfig(tenant?: Partial<Tenant> | null): PixConfig | null {
  if (!tenant) return null

  if (tenant.pix && tenant.pix.key) {
    return {
      key: tenant.pix.key,
      keyType: tenant.pix.keyType || 'phone',
      beneficiary: tenant.pix.beneficiary || tenant.name,
      city: tenant.pix.city || 'SAO PAULO',
      allowTestCent: tenant.pix.allowTestCent ?? true,
      depositPercentage: tenant.pix.depositPercentage ?? 30
    }
  }

  if (tenant.pixKey) {
    return {
      key: tenant.pixKey,
      keyType: tenant.pixKeyType || 'phone',
      beneficiary: tenant.pixBeneficiary || tenant.name,
      city: tenant.pixCity || 'SAO PAULO',
      allowTestCent: true,
      depositPercentage: 30
    }
  }

  // Fallback: se não configurado explicitamente, usa o WhatsApp do tenant como chave de telefone
  if (tenant.phoneWhatsApp) {
    return {
      key: tenant.phoneWhatsApp.replace(/\D/g, ''),
      keyType: 'phone',
      beneficiary: tenant.name || 'Alaska Local',
      city: 'SAO PAULO',
      allowTestCent: true,
      depositPercentage: 30
    }
  }

  return null
}
