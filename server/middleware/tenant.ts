// server/middleware/tenant.ts
import { defineEventHandler, getRequestHost } from 'h3'

function getSlugByCustomDomain(host: string): string {
  // Mapeamento de domínios próprios para slugs
  const domainToSlugMap: Record<string, string> = {
    'pizzariadoze.com.br': 'pizzariadoze',
    'hamburgueria-x.com.br': 'hamburgueria-x',
    'karinefinardi.com.br': 'karine-finardi',
    'belladonna.com.br': 'bella-donna',
    'barbeariastyle.com.br': 'barbearia-style',
    'clinicasorriso.com.br': 'clinica-sorriso'
  }
  
  // Remove www. se presente
  const cleanHost = host.replace(/^www\./, '')
  return domainToSlugMap[cleanHost] || cleanHost.split('.')[0] || cleanHost
}

export default defineEventHandler((event) => {
  const host = getRequestHost(event)
  const slug = getSlugByCustomDomain(host)
  event.context.tenantSlug = slug
})
