// utils/whatsapp.ts
import type { Tenant, CartItem, CheckoutFormData, CartState } from '~/types'
import { formatCurrency } from './formatters'

export interface WhatsAppOrderPayload {
    tenant: Tenant
    items: CartItem[]
    formData: CheckoutFormData
}

/**
 * Formata mensagem de pedido estruturada moderna com suporte a CEP e novos schemas
 */
export function formatWhatsAppOrderMessage(payload: WhatsAppOrderPayload): string {
    const { tenant, items, formData } = payload
    const isDelivery = formData.deliveryType === 'delivery'
    const deliveryFee = isDelivery ? tenant.deliveryFee || 0 : 0
    const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)
    const total = subtotal + deliveryFee

    let message = `*NOVO PEDIDO - ${tenant.name.toUpperCase()}*\n\n`

    message += `*Cliente:* ${formData.customerName}\n`
    if (formData.customerPhone) {
        message += `*Contato:* ${formData.customerPhone}\n`
    }
    message += `*Tipo:* ${isDelivery ? '🛵 Entrega' : '🏪 Retirada no Balcão'}\n`

    if (isDelivery) {
        let addrStr = `${formData.address.street}, Nº ${formData.address.number}`
        if (formData.address.complement) {
            addrStr += ` (${formData.address.complement})`
        }
        addrStr += ` - Bairro ${formData.address.neighborhood}`
        if (formData.address.cep) {
            addrStr += ` - CEP: ${formData.address.cep}`
        }
        message += `*Endereço:* ${addrStr}\n`
    }

    message += `*Pagamento:* ${formData.paymentMethod}\n`
    if (formData.paymentMethod === 'Dinheiro' && formData.changeFor) {
        message += `*Troco para:* ${formatCurrency(formData.changeFor)}\n`
    }

    if (formData.notes) {
        message += `*Observações:* ${formData.notes}\n`
    }

    message += `\n*ITENS DO PEDIDO:*\n`
    items.forEach((item, index) => {
        message += `\n${index + 1}. *${item.quantity}x ${item.product.name}* - ${formatCurrency(item.unitPrice * item.quantity)}\n`
        if (item.options && item.options.length > 0) {
            item.options.forEach((opt) => {
                message += `   + ${opt.name}${opt.price > 0 ? ` (${formatCurrency(opt.price)})` : ''}\n`
            })
        }
        if (item.notes) {
            message += `   _Obs: ${item.notes}_\n`
        }
    })

    message += `\n----------------------------\n`
    message += `*Subtotal:* ${formatCurrency(subtotal)}\n`
    if (isDelivery) {
        message += `*Taxa de Entrega:* ${deliveryFee > 0 ? formatCurrency(deliveryFee) : 'Grátis'}\n`
    }
    message += `*TOTAL DO PEDIDO:* ${formatCurrency(total)}\n`
    message += `----------------------------`

    return message
}

/**
 * Formata mensagem de pedido no padrão clássico para compatibilidade retroativa com testes legados (tenant, cart)
 */
export function formatLegacyWhatsAppOrderMessage(tenant: Tenant, cart: CartState | any): string {
    const lines: string[] = []

    lines.push(`🍔 *NOVO PEDIDO - ${tenant.name.toUpperCase()}*`)
    lines.push(`━━━━━━━━━━━━━━━━━━━━━`)

    // Itens do Pedido
    cart.items.forEach((item: any) => {
        const prodName = item.product?.name || item.name || ''
        const unitPrice = item.unitPrice ?? item.price ?? 0
        const qty = item.quantity || 1
        lines.push(`*${qty}x* ${prodName} — *R$ ${(unitPrice * qty).toFixed(2)}*`)

        const options = item.selectedOptions || item.options || []
        if (options.length > 0) {
            options.forEach((opt: any) => {
                const optPrice = opt.price > 0 ? ` (+R$ ${opt.price.toFixed(2)})` : ''
                lines.push(`   └ _${opt.name}${optPrice}_`)
            })
        }

        const obs = item.observation || item.notes
        if (obs) {
            lines.push(`   └ 💬 Obs: "${obs}"`)
        }
        lines.push('')
    })

    lines.push(`━━━━━━━━━━━━━━━━━━━━━`)
    const subtotal = cart.subtotal ?? cart.items.reduce((acc: number, it: any) => acc + (it.unitPrice ?? it.price ?? 0) * (it.quantity || 1), 0)
    lines.push(`Subtotal: R$ ${subtotal.toFixed(2)}`)

    const isDelivery = cart.deliveryType === 'delivery'
    const deliveryFee = isDelivery ? (cart.deliveryFee ?? tenant.deliveryFee ?? 0) : 0
    const total = cart.total ?? (subtotal + deliveryFee)

    if (isDelivery) {
        lines.push(`Taxa de Entrega: R$ ${deliveryFee.toFixed(2)}`)
        lines.push(`*TOTAL: R$ ${total.toFixed(2)}*`)
        lines.push(`━━━━━━━━━━━━━━━━━━━━━`)
        lines.push(`📍 *DADOS DE ENTREGA:*`)
        lines.push(`• Nome: ${cart.customerName || ''}`)
        if (cart.address) {
            lines.push(`• Endereço: ${cart.address.street}, ${cart.address.number}`)
            if (cart.address.complement) lines.push(`• Compl: ${cart.address.complement}`)
            if (cart.address.neighborhood) lines.push(`• Bairro: ${cart.address.neighborhood}`)
            if (cart.address.cep) lines.push(`• CEP: ${cart.address.cep}`)
        }
    } else {
        lines.push(`*TOTAL (RETIRADA): R$ ${total.toFixed(2)}*`)
        lines.push(`━━━━━━━━━━━━━━━━━━━━━`)
        lines.push(`🛍️ *RETIRADA NO BALCÃO:*`)
        lines.push(`• Nome do Cliente: ${cart.customerName || ''}`)
    }

    lines.push(`━━━━━━━━━━━━━━━━━━━━━`)
    lines.push(`💳 *FORMA DE PAGAMENTO:*`)
    lines.push(`• ${cart.paymentMethod || 'Pix'}`)
    if (cart.changeFor) {
        lines.push(`• Troco para: R$ ${Number(cart.changeFor).toFixed(2)}`)
    }

    return lines.join('\n')
}

/**
 * Gera URL scheme wa.me com suporte a sobrecarga (payload ou tenant + cart)
 */
export function generateWhatsAppOrderUrl(
    payloadOrTenant: WhatsAppOrderPayload | Tenant,
    maybeCart?: any
): string {
    // Se for chamado com payload único ({ tenant, items, formData })
    if (payloadOrTenant && 'tenant' in payloadOrTenant && 'formData' in payloadOrTenant) {
        const payload = payloadOrTenant as WhatsAppOrderPayload
        const phone = (payload.tenant?.phoneWhatsApp || '').replace(/\D/g, '')
        const cleanPhone = phone.startsWith('55') ? phone : `55${phone}`
        const message = formatWhatsAppOrderMessage(payload)
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
    }

    // Se for chamado com a assinatura clássica (tenant, cart)
    const tenant = payloadOrTenant as Tenant
    const cart = maybeCart || { items: [] }
    const phone = (tenant?.phoneWhatsApp || '').replace(/\D/g, '')
    const cleanPhone = phone.startsWith('55') ? phone : `55${phone}`
    const message = formatLegacyWhatsAppOrderMessage(tenant, cart)
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}
