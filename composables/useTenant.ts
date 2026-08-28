// composables/useTenant.ts
import { computed, isRef, type Ref } from 'vue'
import { useRoute, useAsyncData, useRuntimeConfig } from '#app'
import { TenantSchema, type Tenant } from '~/types/tenant'

/**
 * Composable reativo e SSR-safe para resolução de Tenant pelo slug da rota ou customizado.
 * Adota estratégia híbrida: tenta buscar do backend NestJS primeiro e faz fallback gracioso
 * para os arquivos JSON locais em ~/data/*.json caso o backend esteja indisponível.
 */
export function useTenant(customSlug?: string | Ref<string | null | undefined>) {
    const route = useRoute()
    const config = useRuntimeConfig()
    const apiBaseUrl = config.public?.apiBaseUrl

    const slug = computed(() => {
        if (customSlug !== undefined && customSlug !== null) {
            const val = isRef(customSlug) ? customSlug.value : customSlug
            if (val) return String(val).toLowerCase()
        }
        return (route?.params?.slug as string)?.toLowerCase() || 'hamburgueria-x'
    })

    const { data: tenant, pending, error, refresh } = useAsyncData<Tenant | null>(
        `tenant-${slug.value}`,
        async () => {
            // 1. Estratégia API-First: Tenta buscar do backend NestJS se houver baseURL configurada
            if (apiBaseUrl) {
                try {
                    const res = await $fetch<{ success: boolean; data: unknown }>(
                        `${apiBaseUrl}/tenants/${slug.value}`,
                        { timeout: 2500 }
                    )
                    if (res && res.success && res.data) {
                        return TenantSchema.parse(res.data)
                    }
                } catch {
                    // Falha silenciosa na API: prossegue para o fallback local JSON
                }
            }

            // 2. Fallback Gracioso: Carrega do arquivo JSON local em data/
            try {
                const files = import.meta.glob('~/data/*.json', { eager: true }) as Record<
                    string,
                    { default?: Tenant; [key: string]: unknown }
                >

                for (const path in files) {
                    const fileContent = files[path]
                    const rawData = (fileContent?.default || fileContent) as Partial<Tenant>
                    if (rawData && rawData.slug && rawData.slug.toLowerCase() === slug.value) {
                        return TenantSchema.parse(rawData)
                    }
                }

                // Fallback secundário por nome do arquivo
                for (const path in files) {
                    const fileName = path.split('/').pop()?.replace('.json', '').toLowerCase()
                    if (fileName === slug.value) {
                        const fileContent = files[path]
                        const rawData = (fileContent?.default || fileContent) as Partial<Tenant>
                        return TenantSchema.parse(rawData)
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
