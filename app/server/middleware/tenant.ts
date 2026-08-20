export default defineEventHandler((event) => {
  const host = getRequestHost(event)
  if (!host.includes('alaska-websites.com.br') && !host.includes('localhost')) {
    event.context.tenantSlug = getSlugByCustomDomain(host)
  }
})

function getSlugByCustomDomain(host: string): string {
  // Implementação temporária para Fase 1
  // Na Fase 2, isso virá do banco de dados
  const domainToSlugMap: Record<string, string> = {
    'pizzariadoze.com.br': 'pizzariadoze',
    'hamburgueria-x.com.br': 'hamburgueria-x'
  }
  
  // Remove www. se presente
  const cleanHost = host.replace(/^www\./, '')
  return domainToSlugMap[cleanHost] || cleanHost.split('.')[0]
}
