// composables/useHaptic.ts
import { ref } from 'vue'

/**
 * Aciona feedback tátil no dispositivo via Vibration API (se suportado pelo navegador e hardware).
 * Retorna true se a vibração foi acionada com sucesso, ou false caso a API não seja suportada/disponível.
 */
export function triggerHaptic(pattern: number | number[] | readonly number[] = 30): boolean {
    if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
        return false
    }

    try {
        return navigator.vibrate(pattern as any)
    } catch {
        return false
    }
}

/**
 * Padrões pré-definidos de vibração para consistência de UX
 */
export const hapticPatterns = {
    /** Toque sutil para seleções rápidas e botões secundários */
    light: 20,
    /** Toque padrão para adicionar ao carrinho ou selecionar opções */
    medium: 35,
    /** Toque mais firme para ações de destaque (ex: abrir sacola, confirmar) */
    heavy: 50,
    /** Vibração em pulso duplo para confirmação de pedido / sucesso */
    success: [30, 50, 30] as const,
    /** Vibração de erro ou bloqueio de validação */
    error: [50, 50, 50] as const,
}

/**
 * Composable reativo para suporte e acionamento de feedback tátil mobile
 */
export function useHaptic() {
    const isSupported = ref(
        typeof navigator !== 'undefined' &&
        typeof navigator.vibrate === 'function'
    )

    const vibrate = (pattern?: number | number[] | readonly number[]) => triggerHaptic(pattern)

    const vibrateLight = () => triggerHaptic(hapticPatterns.light)
    const vibrateMedium = () => triggerHaptic(hapticPatterns.medium)
    const vibrateHeavy = () => triggerHaptic(hapticPatterns.heavy)
    const vibrateSuccess = () => triggerHaptic(hapticPatterns.success)
    const vibrateError = () => triggerHaptic(hapticPatterns.error)

    return {
        isSupported,
        triggerHaptic,
        vibrate,
        vibrateLight,
        vibrateMedium,
        vibrateHeavy,
        vibrateSuccess,
        vibrateError,
        patterns: hapticPatterns,
    }
}
