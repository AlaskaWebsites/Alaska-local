import * as QRCode from 'qrcode'

export interface GeneratePixPayloadOptions {
  key: string
  name: string
  city: string
  amount?: number
  txid?: string
}

export function generatePixPayload(options: GeneratePixPayloadOptions): string {
  const key = (options.key || '').trim()
  const name = sanitizeText(options.name || 'Alaska Local', 25) || 'Alaska Local'
  const city = sanitizeText(options.city || 'SAO PAULO', 15) || 'SAO PAULO'
  const txid = sanitizeText(options.txid || '***', 25) || '***'

  const tag00 = formatTlv(0, '01')
  const gui = formatTlv(0, 'br.gov.bcb.pix')
  const keyTag = formatTlv(1, key)
  const tag26 = formatTlv(26, `${gui}${keyTag}`)
  const tag52 = formatTlv(52, '0000')
  const tag53 = formatTlv(53, '986')

  let tag54 = ''
  if (typeof options.amount === 'number' && options.amount > 0) {
    tag54 = formatTlv(54, options.amount.toFixed(2))
  }

  const tag58 = formatTlv(58, 'BR')
  const tag59 = formatTlv(59, name)
  const tag60 = formatTlv(60, city)
  const tag62 = formatTlv(62, formatTlv(5, txid))

  const raw = `${tag00}${tag26}${tag52}${tag53}${tag54}${tag58}${tag59}${tag60}${tag62}6304`
  const crc = crc16(raw)
  return `${raw}${crc}`
}

export async function generatePixQrCodeDataUrl(payload: string): Promise<string> {
  try {
    return await QRCode.toDataURL(payload, {
      margin: 1,
      width: 320,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
  } catch {
    return ''
  }
}

function sanitizeText(text: string, maxLen: number): string {
  return (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .slice(0, maxLen)
    .trim()
}

function formatTlv(tag: number, val: string): string {
  const t = tag.toString().padStart(2, '0')
  const len = new TextEncoder().encode(val).length.toString().padStart(2, '0')
  return `${t}${len}${val}`
}

function crc16(payload: string): string {
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
