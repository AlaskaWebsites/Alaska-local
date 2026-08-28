// composables/useTenantTheme.ts
import { computed, isRef, type Ref } from 'vue'
import type { Tenant, TenantTheme } from '~/types/tenant'

export interface ThemeColors {
    // Cores de Texto
    primaryText: string
    primaryTextHover: string

    // Cores de Fundo
    primaryBg: string
    primaryBgHover: string
    buttonPrimary: string

    // Bordas
    primaryBorder: string
    primaryBorderHover: string

    // Checkbox e Opção Selecionada no Modal
    accentClass: string
    selectedOptionClass: string
    focusRing: string

    // Badges e Tags
    badgeBg: string
    badgeText: string
    badgeBorder: string

    // Indicador da Categoria
    categoryIndicator: string
}

const RED_THEME: ThemeColors = {
    primaryText: 'text-red-600',
    primaryTextHover: 'hover:text-red-700',
    primaryBg: 'bg-red-600',
    primaryBgHover: 'hover:bg-red-700',
    buttonPrimary: 'bg-red-600 hover:bg-red-700 text-white',
    primaryBorder: 'border-red-600',
    primaryBorderHover: 'hover:border-red-500',
    accentClass: 'accent-red-600',
    selectedOptionClass: 'border-red-500 bg-red-50/60',
    focusRing: 'focus:ring-2 focus:ring-red-500 focus:border-red-500',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-700',
    badgeBorder: 'border-red-200',
    categoryIndicator: 'bg-red-600',
}

export const THEME_PRESETS: Record<TenantTheme, ThemeColors> = {
    default: RED_THEME,
    food: RED_THEME,
    barber: {
        primaryText: 'text-amber-500',
        primaryTextHover: 'hover:text-amber-600',
        primaryBg: 'bg-amber-500',
        primaryBgHover: 'hover:bg-amber-600',
        buttonPrimary: 'bg-amber-500 hover:bg-amber-600 text-white',
        primaryBorder: 'border-amber-500',
        primaryBorderHover: 'hover:border-amber-500',
        accentClass: 'accent-amber-500',
        selectedOptionClass: 'border-amber-500 bg-amber-50/60',
        focusRing: 'focus:ring-2 focus:ring-amber-500 focus:border-amber-500',
        badgeBg: 'bg-amber-50',
        badgeText: 'text-amber-800',
        badgeBorder: 'border-amber-200',
        categoryIndicator: 'bg-amber-500',
    },
    health: {
        primaryText: 'text-teal-600',
        primaryTextHover: 'hover:text-teal-700',
        primaryBg: 'bg-teal-600',
        primaryBgHover: 'hover:bg-teal-700',
        buttonPrimary: 'bg-teal-600 hover:bg-teal-700 text-white',
        primaryBorder: 'border-teal-600',
        primaryBorderHover: 'hover:border-teal-500',
        accentClass: 'accent-teal-600',
        selectedOptionClass: 'border-teal-500 bg-teal-50/60',
        focusRing: 'focus:ring-2 focus:ring-teal-500 focus:border-teal-500',
        badgeBg: 'bg-teal-50',
        badgeText: 'text-teal-800',
        badgeBorder: 'border-teal-200',
        categoryIndicator: 'bg-teal-600',
    },
    drinks: {
        primaryText: 'text-purple-600',
        primaryTextHover: 'hover:text-purple-700',
        primaryBg: 'bg-purple-600',
        primaryBgHover: 'hover:bg-purple-700',
        buttonPrimary: 'bg-purple-600 hover:bg-purple-700 text-white',
        primaryBorder: 'border-purple-600',
        primaryBorderHover: 'hover:border-purple-500',
        accentClass: 'accent-purple-600',
        selectedOptionClass: 'border-purple-500 bg-purple-50/60',
        focusRing: 'focus:ring-2 focus:ring-purple-500 focus:border-purple-500',
        badgeBg: 'bg-purple-50',
        badgeText: 'text-purple-800',
        badgeBorder: 'border-purple-200',
        categoryIndicator: 'bg-purple-600',
    },
}

export function useTenantTheme(
    tenantSource?: Ref<Tenant | TenantTheme | null | undefined> | Tenant | TenantTheme | null
) {
    const activeTheme = computed<TenantTheme>(() => {
        const raw = isRef(tenantSource) ? tenantSource.value : tenantSource
        if (!raw) return 'food'
        if (typeof raw === 'string') return (raw as TenantTheme) || 'food'
        return raw.theme || 'food'
    })

    const themeClasses = computed<ThemeColors>(() => {
        return THEME_PRESETS[activeTheme.value] || THEME_PRESETS.food
    })

    return {
        theme: activeTheme,
        activeTheme,
        themeClasses,
    }
}
