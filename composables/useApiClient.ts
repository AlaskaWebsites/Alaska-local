// composables/useApiClient.ts
import { useRuntimeConfig } from '#app'
import { TenantSchema, type Tenant } from '~/types/tenant'

export interface HealthCheckResponse {
  status: string
  service: string
  timestamp: string
  uptime: number
}

export interface ApiTenantResponse {
  success: boolean
  data: Tenant
  meta: {
    isOpen: boolean
  }
}

export interface PixBrCodeResponse {
  success: boolean
  data: {
    pixKey: string
    keyType: string
    beneficiary: string
    amount: number
    copiaECola: string
    isTestMode: boolean
  }
}

/**
 * Cliente HTTP tipado e resiliente para comunicação com o Alaska Local Backend NestJS.
 */
export function useApiClient() {
  const config = useRuntimeConfig()
  const baseUrl = config.public?.apiBaseUrl || 'http://localhost:3333/api/v1'

  async function checkHealth(): Promise<HealthCheckResponse | null> {
    try {
      return await $fetch<HealthCheckResponse>(`${baseUrl}/health`, {
        timeout: 3000
      })
    } catch {
      return null
    }
  }

  async function fetchTenantBySlug(slug: string): Promise<Tenant | null> {
    try {
      const res = await $fetch<ApiTenantResponse>(`${baseUrl}/tenants/${slug}`, {
        timeout: 4000
      })
      if (res && res.success && res.data) {
        return TenantSchema.parse(res.data)
      }
      return null
    } catch {
      return null
    }
  }

  async function resolveTenantByDomain(host: string): Promise<Tenant | null> {
    try {
      const res = await $fetch<ApiTenantResponse>(`${baseUrl}/tenants/resolve`, {
        params: { host },
        timeout: 4000
      })
      if (res && res.success && res.data) {
        return TenantSchema.parse(res.data)
      }
      return null
    } catch {
      return null
    }
  }

  async function generatePixBrCode(params: {
    tenantSlug: string
    amount: number
    txid?: string
    isTestCent?: boolean
  }): Promise<PixBrCodeResponse['data'] | null> {
    try {
      const res = await $fetch<PixBrCodeResponse>(`${baseUrl}/pix/brcode`, {
        method: 'POST',
        body: params,
        timeout: 4000
      })
      return res?.data || null
    } catch {
      return null
    }
  }

  return {
    baseUrl,
    checkHealth,
    fetchTenantBySlug,
    resolveTenantByDomain,
    generatePixBrCode
  }
}
