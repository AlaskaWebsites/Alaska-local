// utils/images.ts

export type ImageCategory = 'food' | 'barber' | 'health' | 'drinks' | 'shop' | 'general'

/**
 * Banco de imagens de fallback confiáveis e de alta qualidade por categoria de negócio
 */
export const DEFAULT_FALLBACK_IMAGES: Record<ImageCategory, string> = {
  food: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop&q=80',
  drinks: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=600&fit=crop&q=80',
  barber: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=600&fit=crop&q=80',
  health: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&h=600&fit=crop&q=80',
  shop: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=600&fit=crop&q=80',
  general: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=600&fit=crop&q=80',
}

/**
 * Retorna a URL de fallback adequada para a categoria ou tema fornecido
 */
export function getFallbackImageUrl(categoryOrTheme?: string): string {
  if (!categoryOrTheme) return DEFAULT_FALLBACK_IMAGES.general

  const key = categoryOrTheme.toLowerCase() as ImageCategory
  return DEFAULT_FALLBACK_IMAGES[key] || DEFAULT_FALLBACK_IMAGES.general
}

/**
 * Manipulador de erro para tags <img> nativas.
 * Substitui o src que falhou pelo fallback e evita loop infinito de erros.
 */
export function handleImageError(
  event: Event,
  categoryOrTheme?: string,
  customFallbackUrl?: string
): void {
  const target = event.target as HTMLImageElement
  if (!target) return

  // Previne loop infinito caso a própria imagem de fallback também falhe
  if (target.dataset.hasFallbackError === 'true') {
    return
  }

  const fallbackUrl = customFallbackUrl || getFallbackImageUrl(categoryOrTheme)

  if (target.src !== fallbackUrl) {
    target.dataset.hasFallbackError = 'true'
    target.src = fallbackUrl
  }
}
