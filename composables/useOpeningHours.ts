// composables/useOpeningHours.ts
import { computed, isRef, type Ref } from 'vue'
import type { Tenant } from '~/types/tenant'

export function parseTimeToMinutes(timeStr?: string): number {
    if (!timeStr) return 0
    const parts = timeStr.split(':')
    const hours = parseInt(parts.at(0) || '0', 10)
    const minutes = parseInt(parts.at(1) || '0', 10)
    return hours * 60 + minutes
}

export function isStoreOpenNow(
    hours?: { open: string; close: string },
    currentDate: Date = new Date()
): boolean {
    if (!hours?.open || !hours?.close) return true

    const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes()
    const openMin = parseTimeToMinutes(hours.open)
    const closeMin = parseTimeToMinutes(hours.close)

    if (closeMin >= openMin) {
        return currentMinutes >= openMin && currentMinutes <= closeMin
    }

    return currentMinutes >= openMin || currentMinutes <= closeMin
}

export function useOpeningHours(
    tenantOrHours?: Ref<Tenant | null | undefined> | Tenant | { open: string; close: string } | null
) {
    const isOpen = computed(() => {
        const raw = isRef(tenantOrHours) ? tenantOrHours.value : tenantOrHours
        if (!raw) return true

        if ('openingHours' in raw && raw.openingHours) {
            return isStoreOpenNow(raw.openingHours)
        }

        if ('open' in raw && 'close' in raw) {
            return isStoreOpenNow(raw as { open: string; close: string })
        }

        return true
    })

    return {
        isOpen,
        parseTimeToMinutes,
        isStoreOpenNow,
    }
}
