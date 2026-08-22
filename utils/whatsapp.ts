// utils/whatsapp.ts
import type { CartState } from '../types/cart'
import type { Tenant } from '../types/tenant'

export function generateWhatsAppOrderUrl(tenant: Tenant, cart: CartState): string {
  const lines: string[] = []

  lines.push(`🍔 *NOVO PEDIDO - ${tenant.name.toUpperCase()}*`)
  lines.push(`━━━━━━━━━━━━━━━━━━━━━`)

  // Itens do Pedido
  cart.items.forEach((item, index) => {
    lines.push(`*${item.quantity}x* ${item.product.name} — *R$ ${(item.unitPrice * item.quantity).toFixed(2)}*`)
    
    if (item.selectedOptions && item.selectedOptions.length > 0) {
      item.selectedOptions.forEach(opt => {
        const optPrice = opt.price > 0 ? ` (+R$ ${opt.price.toFixed(2)})` : ''
        lines.push(`   └ _${opt.name}${optPrice}_`)
      })
    }
    
    if (item.observation) {
      lines.push(`   └ 💬 Obs: "${item.observation}"`)
    }
    lines.push('')
  })

  lines.push(`━━━━━━━━━━━━━━━━━━━━━`)
  lines.push(`Subtotal: R$ ${cart.subtotal.toFixed(2)}`)

  if (cart.deliveryType === 'delivery') {
    lines.push(`Taxa de Entrega: R$ ${cart.deliveryFee.toFixed(2)}`)
    lines.push(`*TOTAL: R$ ${cart.total.toFixed(2)}*`)
    lines.push(`━━━━━━━━━━━━━━━━━━━━━`)
    lines.push(`📍 *DADOS DE ENTREGA:*`)
    lines.push(`• Nome: ${cart.customerName}`)
    lines.push(`• Endereço: ${cart.address.street}, ${cart.address.number}`)
    if (cart.address.complement) lines.push(`• Compl: ${cart.address.complement}`)
    lines.push(`• Bairro: ${cart.address.neighborhood}`)
  } else {
    lines.push(`*TOTAL (RETIRADA): R$ ${cart.total.toFixed(2)}*`)
    lines.push(`━━━━━━━━━━━━━━━━━━━━━`)
    lines.push(`🛍️ *RETIRADA NO BALCÃO:*`)
    lines.push(`• Nome do Cliente: ${cart.customerName}`)
  }

  lines.push(`━━━━━━━━━━━━━━━━━━━━━`)
  lines.push(`💳 *FORMA DE PAGAMENTO:*`)
  lines.push(`• ${cart.paymentMethod}`)
  if (cart.changeFor) {
    lines.push(`• Troco para: R$ ${cart.changeFor.toFixed(2)}`)
  }

  const message = lines.join('\n')
  const phone = tenant.phoneWhatsApp.replace(/\D/g, '')

  return `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`
}