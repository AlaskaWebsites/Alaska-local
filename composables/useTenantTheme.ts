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
    // 🍔 1. Alimentação & Food Service (Padrão iFood Red / Laranja)
    food: {
        primaryText: 'text-red-500',
        primaryTextHover: 'hover:text-red-400',
        primaryBg: 'bg-red-600',
        primaryBgHover: 'hover:bg-red-500',
        buttonPrimary: 'bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white',
        primaryBorder: 'border-red-500/40',
        primaryBorderHover: 'hover:border-red-500/60',
        badgeBg: 'bg-red-950/80',
        badgeText: 'text-red-300',
        badgeBorder: 'border-red-800/60',
        glowEffect: 'bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(239,68,68,0.15),transparent)]',
        selectionClass: 'selection:bg-red-500 selection:text-white',
        categoryIndicator: 'bg-red-500',
    },

    // ✂️ 2. Barbearia & Estética (Âmbar Vintage & Ouro)
    barber: {
        primaryText: 'text-amber-400',
        primaryTextHover: 'hover:text-amber-300',
        primaryBg: 'bg-amber-500',
        primaryBgHover: 'hover:bg-amber-400',
        buttonPrimary: 'bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-black',
        primaryBorder: 'border-amber-500/40',
        primaryBorderHover: 'hover:border-amber-500/60',
        badgeBg: 'bg-amber-950/80',
        badgeText: 'text-amber-300',
        badgeBorder: 'border-amber-800/60',
        glowEffect: 'bg-',
        selectionClass: 'selection:bg-amber-500 selection:text-slate-950',
        categoryIndicator: 'bg-amber-500',
    },

    // 🦷 3. Saúde & Clínicas (Ciano & Teal Confiança)
    health: {
        primaryText: 'text-cyan-400',
        primaryTextHover: 'hover:text-cyan-300',
        primaryBg: 'bg-cyan-500',
        primaryBgHover: 'hover:bg-cyan-400',
        buttonPrimary: 'bg-cyan-500 hover:bg-cyan-400 active:scale-[0.98] text-slate-950 font-black',
        primaryBorder: 'border-cyan-500/40',
        primaryBorderHover: 'hover:border-cyan-500/60',
        badgeBg: 'bg-cyan-950/80',
        badgeText: 'text-cyan-300',
        badgeBorder: 'border-cyan-800/60',
        glowEffect: 'bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(6,182,212,0.15),transparent)]',
        selectionClass: 'selection:bg-cyan-500 selection:text-slate-950',
        categoryIndicator: 'bg-cyan-500',
    },

    // 🍷 4. Adegas & Distribuidoras (Roxo & Violeta Neon)
    drinks: {
        primaryText: 'text-purple-400',
        primaryTextHover: 'hover:text-purple-300',
        primaryBg: 'bg-purple-600',
        primaryBgHover: 'hover:bg-purple-500',
        buttonPrimary: 'bg-purple-600 hover:bg-purple-500 active:scale-[0.98] text-white',
        primaryBorder: 'border-purple-500/40',
        primaryBorderHover: 'hover:border-purple-500/60',
        badgeBg: 'bg-purple-950/80',
        badgeText: 'text-purple-300',
        badgeBorder: 'border-purple-800/60',
        glowEffect: 'bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(168,85,247,0.15),transparent)]',
        selectionClass: 'selection:bg-purple-500 selection:text-white',
        categoryIndicator: 'bg-purple-500',
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