// composables/useCart.ts
import { computed, isRef, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { triggerHaptic } from './useHaptic'
import type { CartItem, DeliveryType, PaymentMethod, Address, Tenant } from '~/types'

/**
 * Composable multi-tenant para gerenciamento e persistência reativa da sacola de compras.
 * Os itens são isolados e persistidos no localStorage com chave prefixada pelo slug do tenant.
 * Ex: `alaska_cart_hamburgueria-x`
 */
export function useCart(tenantSource?: Ref<Tenant | string | null | undefined> | Tenant | string | null) {
    const tenantSlug = computed(() => {
        const raw = isRef(tenantSource) ? tenantSource.value : tenantSource
        if (!raw) return 'default'
        if (typeof raw === 'string') return raw
        return raw.slug || 'default'
    })

    const storageKey = computed(() => `alaska_cart_${tenantSlug.value}`)

    // Armazenamento reativo e persistente no localStorage via VueUse (SSR-safe)
    const items = useLocalStorage<CartItem[]>(storageKey.value, [], {
        mergeDefaults: true,
        listenToStorageChanges: true,
    })

    function addItem(item: CartItem) {
        // Feedback tátil sutil no mobile ao adicionar item à sacola
        triggerHaptic(30)
        items.value.push(item)
    }

    function removeItem(index: number) {
        if (index >= 0 && index < items.value.length) {
            items.value.splice(index, 1)
        }
    }

    function updateItemQuantity(index: number, quantity: number) {
        if (index < 0 || index >= items.value.length) return
        if (quantity <= 0) {
            removeItem(index)
        } else {
            items.value[index].quantity = quantity
        }
    }

    function clearCart() {
        items.value = []
    }

    const totalItemsCount = computed(() => {
        return items.value.reduce((acc, item) => acc + item.quantity, 0)
    })

    const cartSubtotal = computed(() => {
        return items.value.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)
    })

    const isEmpty = computed(() => items.value.length === 0)

    return {
        items,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        totalItemsCount,
        cartSubtotal,
        isEmpty,
        storageKey,
    }
}

/**
 * Store Pinia (Legado / Compatibilidade Global)
 */
export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [] as CartItem[],
        deliveryType: 'delivery' as DeliveryType,
        deliveryFee: 0,
        customerName: '',
        customerPhone: '',
        address: {
            street: '',
            number: '',
            neighborhood: '',
            complement: '',
        } as Address,
        paymentMethod: 'Pix' as PaymentMethod,
        changeFor: null as number | null,
    }),

    getters: {
        totalItems: (state): number =>
            state.items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0),

        subtotal: (state): number =>
            state.items.reduce((acc: number, item: CartItem) => acc + item.unitPrice * item.quantity, 0),

        total: (state): number => {
            const fee = state.deliveryType === 'delivery' ? state.deliveryFee : 0
            const sub = state.items.reduce((acc: number, item: CartItem) => acc + item.unitPrice * item.quantity, 0)
            return sub + fee
        },
    },

    actions: {
        addItem(item: CartItem) {
            triggerHaptic(30)
            this.items.push(item)
        },
        removeItem(index: number) {
            this.items.splice(index, 1)
        },
        clearCart() {
            this.items = []
            this.customerName = ''
            this.customerPhone = ''
            this.changeFor = null
        },
    },
})
