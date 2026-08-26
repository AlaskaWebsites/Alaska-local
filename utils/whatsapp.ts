// utils/whatsapp.ts
import type { Tenant, CartItem, CheckoutFormData } from '~/types'
import { formatCurrency } from './formatters'

export interface WhatsAppOrderPayload {
    tenant: Tenant
    items: CartItem[]
    formData: CheckoutFormData
}

export function formatWhatsAppOrderMessage(
    payloadOrTenant: WhatsAppOrderPayload | Tenant,
    maybeCart?: any
): string {
    let tenant: Tenant
    let items: any[] = []
    let formData: any

    // Suporte flexível a payload único ({ tenant, items, formData }) ou assinatura (tenant, cart)
    if (payloadOrTenant && 'tenant' in payloadOrTenant && 'formData' in payloadOrTenant) {
        const payload = payloadOrTenant as WhatsAppOrderPayload
        tenant = payload.tenant
        items = payload.items || []
        formData = payload.formData
    } else {
        tenant = payloadOrTenant as Tenant
        const cart = maybeCart || {}
        items = cart.items || []
        formData = {
            customerName: cart.customerName || '',
            customerPhone: cart.customerPhone,
            deliveryType: cart.deliveryType || 'delivery',
            address: cart.address || { street: '', number: '', neighborhood: '' },
            paymentMethod: cart.paymentMethod || 'Pix',
            changeFor: cart.changeFor,
            notes: cart.notes || cart.observation || '',
        }
    }

    const isDelivery = formData.deliveryType === 'delivery'
    const deliveryFee = isDelivery ? (tenant?.deliveryFee || 0) : 0
    const subtotal = items.reduce((acc, item) => {
        const unitPrice = item.unitPrice ?? item.price ?? 0
        const qty = item.quantity || 1
        return acc + unitPrice * qty
    }, 0)
    const total = subtotal + deliveryFee

    let message = `*NOVO PEDIDO - ${tenant?.name ? tenant.name.toUpperCase() : ''}*\n\n`

    message += `*Cliente:* ${formData.customerName}\n`
    if (formData.customerPhone) {
        message += `*Contato:* ${formData.customerPhone}\n`
    }
    message += `*Tipo:* ${isDelivery ? '🛵 Entrega' : '🏪 Retirada no Balcão'}\n`

    if (isDelivery && formData.address) {
        let addrStr = `${formData.address.street || ''}, Nº ${formData.address.number || ''}`
        if (formData.address.complement) {
            addrStr += ` (${formData.address.complement})`
        }
        if (formData.address.neighborhood) {
            addrStr += ` - Bairro ${formData.address.neighborhood}`
        }
        if (formData.address.cep) {
            addrStr += ` - CEP: ${formData.address.cep}`
        }
        message += `*Endereço:* ${addrStr}\n`
    }

    message += `*Pagamento:* ${formData.paymentMethod}\n`
    if ((formData.paymentMethod === 'Dinheiro' || formData.paymentMethod?.includes('Dinheiro')) && formData.changeFor) {
        message += `*Troco para:* ${formatCurrency(formData.changeFor)}\n`
    }

    if (formData.notes) {
        message += `*Observações:* ${formData.notes}\n`
    }

    message += `\n*ITENS DO PEDIDO:*\n`
    items.forEach((item, index) => {
        const itemUnitPrice = item.unitPrice ?? item.price ?? 0
        const itemQty = item.quantity || 1
        const productName = item.product?.name || item.name || ''
        message += `\n${index + 1}. *${itemQty}x ${productName}* - ${formatCurrency(itemUnitPrice * itemQty)}\n`

        const optionsList = item.options || item.selectedOptions
        if (optionsList && optionsList.length > 0) {
            optionsList.forEach((opt: any) => {
                message += `   + ${opt.name}${opt.price > 0 ? ` (${formatCurrency(opt.price)})` : ''}\n`
            })
        }
        const note = item.notes || item.observation
        if (note) {
            message += `   _Obs: ${note}_\n`
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

export function generateWhatsAppOrderUrl(
    payloadOrTenant: WhatsAppOrderPayload | Tenant,
    maybeCart?: any
): string {
    const tenant = (payloadOrTenant && 'tenant' in payloadOrTenant)
        ? (payloadOrTenant as WhatsAppOrderPayload).tenant
        : (payloadOrTenant as Tenant)

    const phone = tenant?.phoneWhatsApp ? tenant.phoneWhatsApp.replace(/\D/g, '') : ''
    const cleanPhone = phone.startsWith('55') ? phone : `55${phone}`
    const message = formatWhatsAppOrderMessage(payloadOrTenant, maybeCart)
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}
