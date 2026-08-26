// utils/whatsapp.ts
import type { Tenant, CartItem, CheckoutFormData } from '~/types'
import { formatCurrency } from './formatters'

export interface WhatsAppOrderPayload {
    tenant: Tenant
    items: CartItem[]
    formData: CheckoutFormData
}

export function formatWhatsAppOrderMessage({ tenant, items, formData }: WhatsAppOrderPayload): string {
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

export function generateWhatsAppOrderUrl(payload: WhatsAppOrderPayload): string {
    const phone = payload.tenant.phoneWhatsApp.replace(/\D/g, '')
    const cleanPhone = phone.startsWith('55') ? phone : `55${phone}`
    const message = formatWhatsAppOrderMessage(payload)
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}
