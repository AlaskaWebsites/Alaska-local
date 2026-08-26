// composables/useProductSearch.ts
import { ref, computed, isRef, type Ref } from 'vue'
import type { Category, Product } from '~/types'

/**
 * Remove acentos, diacríticos e converte para minúsculas para busca insensível a caracteres especiais.
 * Ex: "Degradê / Pão" -> "degrade / pao"
 */
export function normalizeSearchText(text?: string): string {
    if (!text) return ''
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
}

/**
 * Verifica se um produto corresponde ao termo de busca no nome, descrição ou opcionais.
 */
export function isProductMatchingQuery(product: Product, query: string): boolean {
    const q = normalizeSearchText(query)
    if (!q) return true

    const nameNorm = normalizeSearchText(product.name)
    const descNorm = normalizeSearchText(product.description)

    if (nameNorm.includes(q) || descNorm.includes(q)) {
        return true
    }

    // Busca também nos grupos e nomes dos opcionais
    if (product.optionGroups && product.optionGroups.length > 0) {
        for (const group of product.optionGroups) {
            if (normalizeSearchText(group.title).includes(q)) {
                return true
            }
            for (const option of group.options) {
                if (normalizeSearchText(option.name).includes(q)) {
                    return true
                }
            }
        }
    }

    return false
}

/**
 * Filtra categorias e produtos preservando a estrutura apenas para os itens correspondentes.
 */
export function filterCategoriesByQuery(categories: Category[], query: string): Category[] {
    const normalizedQuery = normalizeSearchText(query)
    if (!normalizedQuery) return categories

    const result: Category[] = []

    for (const category of categories) {
        const matchingProducts = category.products.filter((product) =>
            isProductMatchingQuery(product, normalizedQuery)
        )

        if (matchingProducts.length > 0) {
            result.push({
                ...category,
                products: matchingProducts,
            })
        }
    }

    return result
}

/**
 * Conta o total de produtos em uma lista de categorias.
 */
export function countTotalProducts(categories: Category[]): number {
    return categories.reduce((total, category) => total + category.products.length, 0)
}

/**
 * Composable Reativo para Busca de Produtos em Tempo Real
 */
export function useProductSearch(
    categoriesSource?: Ref<Category[] | undefined | null> | Category[] | null
) {
    const searchQuery = ref('')

    const isSearching = computed(() => searchQuery.value.trim().length > 0)

    const filteredCategories = computed<Category[]>(() => {
        const raw = isRef(categoriesSource) ? categoriesSource.value : categoriesSource
        if (!raw || raw.length === 0) return []

        if (!isSearching.value) return raw

        return filterCategoriesByQuery(raw, searchQuery.value)
    })

    const totalResultsCount = computed(() => {
        return countTotalProducts(filteredCategories.value)
    })

    const hasResults = computed(() => {
        return totalResultsCount.value > 0
    })

    function clearSearch() {
        searchQuery.value = ''
    }

    return {
        searchQuery,
        isSearching,
        filteredCategories,
        totalResultsCount,
        hasResults,
        clearSearch,
        normalizeSearchText,
        filterCategoriesByQuery,
        isProductMatchingQuery,
        countTotalProducts,
    }
}
