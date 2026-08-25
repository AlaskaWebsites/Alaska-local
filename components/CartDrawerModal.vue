<!-- components/CartDrawerModal.vue -->
<script setup lang="ts">
import { ref, computed, toRef, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useBodyScrollLock } from '~/composables/useBodyScrollLock'
import { useTenantTheme } from '~/composables/useTenantTheme'
import { ShoppingCart, X, Trash2 } from 'lucide-vue-next'
import type { Tenant, Option } from '~/types/tenant'

export interface CartItemPayload {
    product: {
        id: string
        name: string
        price: number
        image?: string
        description?: string
    }
    quantity: number
    selectedOptions: Option[]
    observation: string
    unitPrice: number
}

const props = defineProps<{
    isOpen: boolean
    tenant: Tenant
    items: CartItemPayload[]
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'remove-item', index: number): void
}>()

// 1. Tema Dinâmico por Segmento
const { themeClasses } = useTenantTheme(toRef(props, 'tenant'))

// 2. Trava de Rolagem de Fundo (useBodyScrollLock) e Fechamento no ESC
useBodyScrollLock(toRef(props, 'isOpen'))

const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) {
        emit('close')
    }
}

onMounted(() => {
    if (import.meta.client) {
        window.addEventListener('keydown', handleKeyDown)
    }
})

onUnmounted(() => {
    if (import.meta.client) {
        window.removeEventListener('keydown', handleKeyDown)
    }
})

// 3. Foco Automático no Primeiro Campo (Seu Nome) ao abrir
const nameInputRef = ref<HTMLInputElement | null>(null)

watch(
    () => props.isOpen,
    async (isOpen) => {
        if (isOpen) {
            await nextTick()
            setTimeout(() => {
                nameInputRef.value?.focus({ preventScroll: true })
            }, 150)
        }
    }
)

// 4. Estado Interno do Checkout
const checkoutData = ref({
    deliveryType: 'delivery' as 'delivery' | 'pickup',
    customerName: '',
    paymentMethod: 'Pix',
    changeFor: null as number | null,
    address: {
        street: '',
        number: '',
        neighborhood: '',
        complement: ''
    }
})

// 5. Cálculos Financeiros
function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value)
}

const cartSubtotal = computed(() => {
    return props.items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)
})

const deliveryFee = computed(() => {
    return checkoutData.value.deliveryType === 'delivery' ? props.tenant.deliveryFee || 0 : 0
})

const cartFinalTotal = computed(() => {
    return cartSubtotal.value + deliveryFee.value
})

const isCheckoutValid = computed(() => {
    if (!checkoutData.value.customerName.trim()) return false
    if (checkoutData.value.deliveryType === 'delivery') {
        return (
            checkoutData.value.address.street.trim() !== '' &&
            checkoutData.value.address.number.trim() !== '' &&
            checkoutData.value.address.neighborhood.trim() !== ''
        )
    }
    return true
})

// 6. Despacho Direto via URL Scheme do WhatsApp
function sendWhatsAppOrder() {
    if (!props.tenant || !isCheckoutValid.value) return

    const lines: string[] = []
    lines.push(`🍔 *NOVO PEDIDO - ${props.tenant.name.toUpperCase()}*`)
    lines.push(`━━━━━━━━━━━━━━━━━━━━━`)

    props.items.forEach((item) => {
        lines.push(`*${item.quantity}x* ${item.product.name} — *${formatCurrency(item.unitPrice * item.quantity)}*`)
        item.selectedOptions.forEach((opt) => {
            const priceStr = opt.price > 0 ? ` (+${formatCurrency(opt.price)})` : ''
            lines.push(`   └ _${opt.name}${priceStr}_`)
        })
        if (item.observation) {
            lines.push(`   └ 💬 _Obs: "${item.observation}"_`)
        }
        lines.push('')
    })

    lines.push(`━━━━━━━━━━━━━━━━━━━━━`)
    lines.push(`Subtotal: ${formatCurrency(cartSubtotal.value)}`)

    if (checkoutData.value.deliveryType === 'delivery') {
        lines.push(`Taxa de Entrega: ${formatCurrency(props.tenant.deliveryFee || 0)}`)
        lines.push(`*TOTAL: ${formatCurrency(cartFinalTotal.value)}*`)
        lines.push(`━━━━━━━━━━━━━━━━━━━━━`)
        lines.push(`📍 *DADOS DE ENTREGA:*`)
        lines.push(`• Nome: ${checkoutData.value.customerName}`)
        lines.push(`• Endereço: ${checkoutData.value.address.street}, ${checkoutData.value.address.number}`)
        if (checkoutData.value.address.complement) {
            lines.push(`• Complemento: ${checkoutData.value.address.complement}`)
        }
        lines.push(`• Bairro: ${checkoutData.value.address.neighborhood}`)
    } else {
        lines.push(`*TOTAL (RETIRADA): ${formatCurrency(cartFinalTotal.value)}*`)
        lines.push(`━━━━━━━━━━━━━━━━━━━━━`)
        lines.push(`🛍️ *RETIRADA NO BALCÃO:*`)
        lines.push(`• Nome: ${checkoutData.value.customerName}`)
    }

    lines.push(`━━━━━━━━━━━━━━━━━━━━━`)
    lines.push(`💳 *FORMA DE PAGAMENTO:*`)
    lines.push(`• ${checkoutData.value.paymentMethod}`)
    if (checkoutData.value.paymentMethod === 'Dinheiro' && checkoutData.value.changeFor) {
        lines.push(`• Troco para: ${formatCurrency(checkoutData.value.changeFor)}`)
    }

    const message = lines.join('\n')
    const phone = props.tenant.phoneWhatsApp.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`

    window.open(whatsappUrl, '_blank')
}
</script>

<template>
    <Teleport to="body">
        <div v-if="isOpen"
            class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col sm:items-center sm:justify-center p-0 sm:p-4 animate-in fade-in duration-200"
            @click="emit('close')">
            <div role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title"
                class="bg-white text-slate-800 w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-lg flex flex-col overflow-hidden sm:rounded-3xl sm:border sm:border-slate-200 sm:shadow-2xl"
                @click.stop>
                <!-- Header da Sacola -->
                <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <ShoppingCart class="w-5 h-5" :class="themeClasses.primaryText" aria-hidden="true" />
                        <h3 id="cart-drawer-title" class="font-bold text-base text-slate-900">Sua Sacola</h3>
                    </div>
                    <button @click="emit('close')" class="text-slate-400 hover:text-slate-700 cursor-pointer"
                        aria-label="Fechar sacola">
                        <X class="w-5 h-5" aria-hidden="true" />
                    </button>
                </div>

                <div class="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
                    <!-- Lista de Itens -->
                    <div class="space-y-2.5" role="list" aria-label="Itens na sacola">
                        <div v-for="(item, index) in items" :key="index" role="listitem"
                            class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between gap-2">
                            <div class="flex-1">
                                <div class="flex items-center gap-1.5">
                                    <span class="font-bold" :class="themeClasses.primaryText">{{ item.quantity
                                    }}x</span>
                                    <span class="font-bold text-slate-900">{{ item.product.name }}</span>
                                </div>
                                <div v-if="item.selectedOptions.length"
                                    class="text-[11px] text-slate-500 mt-1 space-y-0.5">
                                    <p v-for="opt in item.selectedOptions" :key="opt.id">
                                        + {{ opt.name }} {{ opt.price > 0 ? `(${formatCurrency(opt.price)})` : '' }}
                                    </p>
                                </div>
                                <p v-if="item.observation" class="text-[11px] text-slate-500 italic mt-1">
                                    Obs: "{{ item.observation }}"
                                </p>
                                <span class="font-bold text-xs mt-2 block" :class="themeClasses.primaryText">
                                    {{ formatCurrency(item.unitPrice * item.quantity) }}
                                </span>
                            </div>

                            <button @click="emit('remove-item', index)"
                                class="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                                :aria-label="`Remover ${item.product.name} da sacola`" title="Remover item">
                                <Trash2 class="w-4 h-4" aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <!-- Tipo de Pedido -->
                    <div class="border-t border-slate-200 pt-3" role="group" aria-label="Tipo de entrega do pedido">
                        <label class="block font-bold text-slate-700 mb-1.5">Tipo de Pedido:</label>
                        <div class="grid grid-cols-2 gap-2">
                            <button @click="checkoutData.deliveryType = 'delivery'"
                                :aria-pressed="checkoutData.deliveryType === 'delivery'"
                                :class="checkoutData.deliveryType === 'delivery' ? [themeClasses.primaryBg, 'text-white font-black'] : 'bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 border border-slate-200'"
                                class="py-2.5 rounded-2xl transition-colors cursor-pointer">
                                🛵 Entrega (Delivery)
                            </button>
                            <button @click="checkoutData.deliveryType = 'pickup'"
                                :aria-pressed="checkoutData.deliveryType === 'pickup'"
                                :class="checkoutData.deliveryType === 'pickup' ? [themeClasses.primaryBg, 'text-white font-black'] : 'bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 border border-slate-200'"
                                class="py-2.5 rounded-2xl transition-colors cursor-pointer">
                                🛍️ Retirada no Balcão
                            </button>
                        </div>
                    </div>

                    <!-- Dados do Cliente -->
                    <div class="border-t border-slate-200 pt-3 space-y-2.5">
                        <div>
                            <label for="checkout-name" class="block font-bold text-slate-700 mb-1">Seu Nome *</label>
                            <input id="checkout-name" ref="nameInputRef" v-model="checkoutData.customerName" type="text"
                                placeholder="Ex: João da Silva" required
                                class="w-full p-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none placeholder:text-slate-400" />
                        </div>

                        <div v-if="checkoutData.deliveryType === 'delivery'" class="space-y-2">
                            <div class="grid grid-cols-3 gap-2">
                                <div class="col-span-2">
                                    <label for="checkout-street" class="block font-bold text-slate-700 mb-1">Rua /
                                        Logradouro *</label>
                                    <input id="checkout-street" v-model="checkoutData.address.street" type="text"
                                        placeholder="Ex: Av. Brasil" required
                                        class="w-full p-2.5 rounded-2xl border border-slate-800 bg-slate-50 text-slate-900 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none placeholder:text-slate-400" />
                                </div>
                                <div>
                                    <label for="checkout-number" class="block font-bold text-slate-700 mb-1">Número
                                        *</label>
                                    <input id="checkout-number" v-model="checkoutData.address.number" type="text"
                                        placeholder="123" required
                                        class="w-full p-2.5 rounded-2xl border border-slate-800 bg-slate-50 text-slate-900 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none placeholder:text-slate-400" />
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <label for="checkout-neighborhood"
                                        class="block font-bold text-slate-700 mb-1">Bairro *</label>
                                    <input id="checkout-neighborhood" v-model="checkoutData.address.neighborhood"
                                        type="text" placeholder="Centro" required
                                        class="w-full p-2.5 rounded-2xl border border-slate-800 bg-slate-50 text-slate-900 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none placeholder:text-slate-400" />
                                </div>
                                <div>
                                    <label for="checkout-complement"
                                        class="block font-bold text-slate-700 mb-1">Complemento</label>
                                    <input id="checkout-complement" v-model="checkoutData.address.complement"
                                        type="text" placeholder="Apto 42"
                                        class="w-full p-2.5 rounded-2xl border border-slate-800 bg-slate-50 text-slate-900 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none placeholder:text-slate-400" />
                                </div>
                            </div>
                        </div>

                        <!-- Forma de Pagamento -->
                        <div class="pt-1">
                            <label for="checkout-payment" class="block font-bold text-slate-700 mb-1">Forma de Pagamento
                                *</label>
                            <select id="checkout-payment" v-model="checkoutData.paymentMethod"
                                class="w-full p-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none font-medium">
                                <option value="Pix">Pix (Chave informada no pedido)</option>
                                <option value="Cartão de Crédito">Cartão de Crédito (na entrega)</option>
                                <option value="Cartão de Débito">Cartão de Débito (na entrega)</option>
                                <option value="Dinheiro">Dinheiro</option>
                            </select>

                            <div v-if="checkoutData.paymentMethod === 'Dinheiro'" class="mt-2">
                                <label for="checkout-change" class="block font-bold text-slate-700 mb-1">
                                    Precisa de troco para quanto?
                                </label>
                                <input id="checkout-change" v-model.number="checkoutData.changeFor" type="number"
                                    placeholder="Ex: 50 ou 100"
                                    class="w-full p-2.5 rounded-2xl border border-slate-800 bg-slate-50 text-slate-900 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none placeholder:text-slate-400" />
                            </div>
                        </div>
                    </div>

                    <!-- Totalização -->
                    <div class="border-t border-slate-200 pt-3 space-y-1 text-xs">
                        <div class="flex justify-between text-slate-500">
                            <span>Subtotal:</span>
                            <span>{{ formatCurrency(cartSubtotal) }}</span>
                        </div>
                        <div v-if="checkoutData.deliveryType === 'delivery'"
                            class="flex justify-between text-slate-500">
                            <span>Taxa de Entrega:</span>
                            <span>{{ formatCurrency(tenant.deliveryFee || 0) }}</span>
                        </div>
                        <div
                            class="flex justify-between font-black text-sm text-slate-900 pt-1.5 border-t border-slate-200">
                            <span>Total:</span>
                            <span :class="themeClasses.primaryText">{{ formatCurrency(cartFinalTotal) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Botão WhatsApp -->
                <div class="p-4 pb-6 sm:pb-4 border-t border-slate-200 bg-white">
                    <button @click="sendWhatsAppOrder" :disabled="!isCheckoutValid"
                        aria-label="Enviar pedido formatado para o WhatsApp do estabelecimento"
                        class="w-full font-black py-3.5 rounded-2xl shadow-md flex items-center justify-center gap-2 text-xs transition-all cursor-pointer disabled:opacity-40"
                        :class="themeClasses.buttonPrimary">
                        <span>Enviar Pedido pelo WhatsApp</span>
                        <svg class="w-4 h-4 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>