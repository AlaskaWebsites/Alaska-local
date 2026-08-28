// composables/useTenant.ts
import { computed, isRef, type Ref } from 'vue'
import { TenantSchema, type Tenant } from '~/types/tenant'

/**
 * Composable reativo e SSR-safe para resolução de Tenant pelo slug da rota ou customizado.
 * Retorna referências reativas síncronas com tipagem estrita Ref<Tenant | null>.
 */
export function useTenant(customSlug?: string | Ref<string | null | undefined>) {
    const route = useRoute()

    // Resolve o slug reativamente
    const slug = computed(() => {
        if (customSlug) {
            const val = isRef(customSlug) ? customSlug.value : customSlug
            if (val) return String(val).toLowerCase()
        }
        return (route?.params?.slug as string)?.toLowerCase() || 'hamburgueria-x'
    })

    const { data: tenant, pending, error, refresh } = useAsyncData<Tenant | null>(
        `tenant-${slug.value}`,
        async () => {
            try {
                const files = import.meta.glob('~/data/*.json', { eager: true }) as Record<
                    string,
                    { default: any }
                >
                const targetSlug = slug.value

                // Busca direta pelo slug correspondente
                for (const key in files) {
                    if (key.endsWith(`/${targetSlug}.json`)) {
                        const raw = files[key].default || files[key]
                        const parsed = TenantSchema.safeParse(raw)
                        if (parsed.success) {
                            return parsed.data
                        }
                    }
                }

                // Fallback de segurança para hamburgueria-x ou primeiro catálogo
                for (const key in files) {
                    if (key.includes('hamburgueria-x.json')) {
                        const raw = files[key].default || files[key]
                        const parsed = TenantSchema.safeParse(raw)
                        if (parsed.success) {
                            return parsed.data
                        }
                    }
                }

                return null
            } catch (err) {
                console.error(`Erro ao carregar tenant [${slug.value}]:`, err)
                return null
            }
        },
        {
            watch: [slug],
        }
    )

    return {
        tenant: tenant as Ref<Tenant | null>,
        slug,
        pending,
        error,
        refresh,
    }
}
