import { describe, it, expect } from 'vitest'
import { generatePixPayload, generatePixQrCodeDataUrl } from '~/utils/pix'

describe('Unit: Geração de Pix BR Code e QR Code', () => {
  it('deve gerar payload BR Code oficial válido', () => {
    const payload = generatePixPayload({
      key: '11999998888',
      name: 'Karine Finardi',
      city: 'FRANCISCO MORATO',
      amount: 149.90,
      txid: 'PEDIDO123'
    })

    expect(payload).toContain('000201')
    expect(payload).toContain('br.gov.bcb.pix')
    expect(payload).toContain('11999998888')
    expect(payload).toContain('KARINE FINARDI')
    expect(payload).toContain('5406149.90')
    expect(payload.length).toBeGreaterThan(60)
  })

  it('deve gerar imagem QR Code em Data URL a partir do payload Pix', async () => {
    const payload = generatePixPayload({
      key: '11988887777',
      name: 'Adega Prime',
      city: 'SAO PAULO',
      amount: 50.00
    })

    const dataUrl = await generatePixQrCodeDataUrl(payload)
    expect(dataUrl).toContain('data:image/png;base64,')
    expect(dataUrl.length).toBeGreaterThan(100)
  })
})
