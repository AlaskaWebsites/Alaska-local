// composables/useTenant.ts
import { TenantSchema, type Tenant } from '~/types/tenant'

export async function useTenant(customSlug?: string) {
    const route = useRoute()
    const slug = customSlug || (route.params.slug as string) || 'hamburgueria-x'

    const { data: tenant, pending, error } = await useAsyncData(
        `tenant-${slug}`,
        async () => {
            try {
                const files = import.meta.glob('~/data/*.json', { eager: true }) as Record<
                    string,
                    { default: any }
                >
                const fileKeys = Object.keys(files)

                const matchedKey = fileKeys.find((key) => key.endsWith(`/${slug}.json`))
                if (matchedKey && files[matchedKey]) {
                    return TenantSchema.parse(files[matchedKey].default)
                }

                const fallbackKey =
                    fileKeys.find((key) => key.includes('hamburgueria-x.json')) || fileKeys[0]
                if (fallbackKey && files[fallbackKey]) {
                    return TenantSchema.parse(files[fallbackKey].default)
                }

                throw new Error('Nenhum arquivo de demonstração encontrado.')
            } catch (err) {
                console.error(`Erro ao carregar tenant [${slug}]:`, err)
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Estabelecimento não encontrado',
                })
            }
        }
    )

    return {
        tenant,
        slug,
        pending,
        error,
    }
}
