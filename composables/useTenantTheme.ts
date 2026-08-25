// composables/useTenantTheme.ts
import { computed, isRef, type Ref } from 'vue'
import type { Tenant, TenantTheme } from '~/types/tenant'

export interface ThemeColors {
    // Cores de texto
    primaryText: string
    primaryTextHover: string

    // Cores de fundo e botões principais
    primaryBg: string
    primaryBgHover: string
    buttonPrimary: string

    // Bordas e contornos
    primaryBorder: string
    primaryBorderHover: string

    // Checkbox e Opção Selecionada no Modal
    accentClass: string
    selectedOptionClass: string

    // Badges e Tags
    badgeBg: string
    badgeText: string
    badgeBorder: string

    // Efeitos visuais (Glow e Seleção)
    glowEffect: string
    selectionClass: string

    // Indicador de Categoria
    categoryIndicator: string
}

export const THEME_PRESETS: Record<TenantTheme, ThemeColors> = {
    // 🍔 1. Alimentação & Food Service (iFood Red)
    food: {
        primaryText: 'text-red-600',
        primaryTextHover: 'hover:text-red-500',
        primaryBg: 'bg-red-600',
        primaryBgHover: 'hover:bg-red-500',
        buttonPrimary: 'bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white',
        primaryBorder: 'border-red-500',
        primaryBorderHover: 'hover:border-red-500',
        accentClass: 'accent-red-600',
        selectedOptionClass: 'border-red-500 bg-red-50/60',
        badgeBg: 'bg-red-50',
        badgeText: 'text-red-700',
        badgeBorder: 'border-red-200',
        glowEffect: 'bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(239,68,68,0.15),transparent)]',
        selectionClass: 'selection:bg-red-600 selection:text-white',
        categoryIndicator: 'bg-red-600',
    },

    // ✂️ 2. Barbearia, Salões & Serviços (Âmbar Vintage & Ouro)
    barber: {
        primaryText: 'text-amber-500',
        primaryTextHover: 'hover:text-amber-400',
        primaryBg: 'bg-amber-500',
        primaryBgHover: 'hover:bg-amber-400',
        buttonPrimary: 'bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-black',
        primaryBorder: 'border-amber-500',
        primaryBorderHover: 'hover:border-amber-500',
        accentClass: 'accent-amber-500',
        selectedOptionClass: 'border-amber-500 bg-amber-50/60',
        badgeBg: 'bg-amber-50',
        badgeText: 'text-amber-800',
        badgeBorder: 'border-amber-200',
        glowEffect: 'bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(245,158,11,0.15),transparent)]',
        selectionClass: 'selection:bg-amber-500 selection:text-slate-950',
        categoryIndicator: 'bg-amber-500',
    },

    // 🦷 3. Saúde, Odonto & Clínicas (Teal Médico & Verde-Água Confiança)
    health: {
        primaryText: 'text-teal-600',
        primaryTextHover: 'hover:text-teal-500',
        primaryBg: 'bg-teal-600',
        primaryBgHover: 'hover:bg-teal-500',
        buttonPrimary: 'bg-teal-600 hover:bg-teal-500 active:scale-[0.98] text-white font-bold',
        primaryBorder: 'border-teal-500',
        primaryBorderHover: 'hover:border-teal-500',
        accentClass: 'accent-teal-600',
        selectedOptionClass: 'border-teal-500 bg-teal-50/60',
        badgeBg: 'bg-teal-50',
        badgeText: 'text-teal-800',
        badgeBorder: 'border-teal-200',
        glowEffect: 'bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(13,148,136,0.15),transparent)]',
        selectionClass: 'selection:bg-teal-600 selection:text-white',
        categoryIndicator: 'bg-teal-600',
    },

    // 🍷 4. Adegas & Distribuidoras (Roxo & Violeta Neon)
    drinks: {
        primaryText: 'text-purple-600',
        primaryTextHover: 'hover:text-purple-500',
        primaryBg: 'bg-purple-600',
        primaryBgHover: 'hover:bg-purple-500',
        buttonPrimary: 'bg-purple-600 hover:bg-purple-500 active:scale-[0.98] text-white',
        primaryBorder: 'border-purple-500',
        primaryBorderHover: 'hover:border-purple-500',
        accentClass: 'accent-purple-600',
        selectedOptionClass: 'border-purple-500 bg-purple-50/60',
        badgeBg: 'bg-purple-50',
        badgeText: 'text-purple-800',
        badgeBorder: 'border-purple-200',
        glowEffect: 'bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(168,85,247,0.15),transparent)]',
        selectionClass: 'selection:bg-purple-600 selection:text-white',
        categoryIndicator: 'bg-purple-600',
    },
}

export function useTenantTheme(
    tenantOrTheme?: Ref<Tenant | TenantTheme | null | undefined> | Tenant | TenantTheme | null
) {
    const currentTheme = computed<TenantTheme>(() => {
        const raw = isRef(tenantOrTheme) ? tenantOrTheme.value : tenantOrTheme

        if (!raw) return 'food'

        if (typeof raw === 'string') {
            return (raw as TenantTheme) in THEME_PRESETS ? (raw as TenantTheme) : 'food'
        }

        if (typeof raw === 'object' && 'theme' in raw && raw.theme) {
            return (raw.theme as TenantTheme) in THEME_PRESETS ? raw.theme : 'food'
        }

        return 'food'
    })

    const themeClasses = computed<ThemeColors>(() => {
        return THEME_PRESETS[currentTheme.value] || THEME_PRESETS.food
    })

    return {
        theme: currentTheme,
        themeClasses,
    }
}
