<!-- pages/[slug].vue -->
<template>
  <div v-if="tenant" class="min-h-screen bg-[#f5f5f5] text-slate-800 pb-36 overflow-x-hidden w-full max-w-full" :class="themeClasses.selectionClass">

    <!-- Toast Feedback de Link Copiado -->
    <div v-if="isCopied" role="status" aria-live="polite"
      class="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full font-black text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 border"
      :class="[themeClasses.primaryBg, 'text-white', themeClasses.primaryBorder]">
      <Check class="w-4 h-4 text-white" aria-hidden="true" />
      <span>Link do cardápio copiado!</span>
    </div>

    <!-- 1. Banner de Fundo -->
    <div class="relative h-48 sm:h-64 w-full overflow-hidden bg-slate-100">
      <img v-if="tenant.banner" :src="tenant.banner" :alt="`Banner de ${tenant.name}`"
        class="w-full h-full object-cover" />
      <div v-else class="w-full h-full bg-slate-200"></div>

      <!-- Botão Voltar para a Home -->
      <NuxtLink to="/"
        class="absolute top-4 left-4 bg-white/90 hover:bg-white text-slate-800 p-2.5 rounded-full backdrop-blur-md border border-slate-200/80 transition-all z-10 shadow-md cursor-pointer"
        aria-label="Voltar para a página inicial com todas as lojas" title="Voltar ao início">
        <ArrowLeft class="w-5 h-5" aria-hidden="true" />
      </NuxtLink>

      <!-- Botão Nativo de Compartilhar -->
      <button @click="shareStore"
        class="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-800 p-2.5 rounded-full backdrop-blur-md border border-slate-200/80 transition-all z-10 shadow-md cursor-pointer flex items-center justify-center"
        :aria-label="isCopied ? 'Link copiado para a área de transferência' : 'Compartilhar cardápio da loja'"
        :title="isCopied ? 'Link copiado!' : 'Compartilhar'">
        <Check v-if="isCopied" class="w-5 h-5 animate-in zoom-in-50 duration-200" :class="themeClasses.primaryText"
          aria-hidden="true" />
        <Share2 v-else class="w-5 h-5 text-slate-800" aria-hidden="true" />
      </button>
    </div>

    <!-- 2. Card Flutuante de Identidade do Estabelecimento -->
    <header class="max-w-4xl mx-auto px-4 -mt-16 relative z-20">
      <div
        class="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <!-- Logo Circular Flutuante -->
        <div
          class="relative -mt-14 sm:-mt-10 shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-white">
          <img v-if="tenant.logo" :src="tenant.logo" :alt="`Logotipo de ${tenant.name}`"
            class="w-full h-full object-cover" />
          <div v-else class="w-full h-full bg-slate-100 flex items-center justify-center font-bold text-xl"
            :class="themeClasses.primaryText" aria-hidden="true">
            {{ tenant.name.charAt(0) }}
          </div>
        </div>

        <!-- Dados do Estabelecimento -->
        <div class="flex-1 min-w-0 w-full space-y-2.5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
            <div class="min-w-0">
              <h1 class="font-extrabold text-xl sm:text-2xl text-slate-900 leading-tight truncate">
                {{ tenant.name }}
              </h1>
              <p v-if="tenant.description" class="text-xs sm:text-sm text-slate-500 line-clamp-2 mt-0.5 break-words">
                {{ tenant.description }}
              </p>
            </div>

            <!-- Status Aberto/Fechado -->
            <span role="status"
              :class="isOpen ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'"
              class="inline-flex items-center self-center sm:self-auto px-3 py-1 rounded-full text-xs font-bold border shrink-0">
              {{ isOpen ? '🟢 Aberto agora' : '🕒 Fechado' }}
            </span>
          </div>

          <!-- Linha de Metadados -->
          <div
            class="flex flex-wrap items-center justify-center sm:justify-start gap-y-2 gap-x-3 text-xs text-slate-500 pt-1 min-w-0">
            <!-- Selo de Avaliações -->
            <button v-if="tenant.reviews" @click="isReviewsOpen = true" aria-haspopup="dialog"
              :aria-expanded="isReviewsOpen"
              :aria-label="`Abrir avaliações da loja. Nota média ${tenant.reviews.score.toFixed(1)} baseada em ${tenant.reviews.totalReviews} avaliações`"
              class="flex items-center gap-1 font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 active:scale-95 px-2.5 py-1 rounded-lg cursor-pointer transition-all shadow-2xs shrink-0"
              title="Ver detalhes das avaliações">
              <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
              <span>{{ tenant.reviews.score.toFixed(1) }}</span>
              <span class="text-slate-500 font-medium">({{ tenant.reviews.totalReviews }})</span>
              <ChevronRight class="w-3 h-3 text-slate-400 ml-0.5" aria-hidden="true" />
            </button>

            <!-- Selo de Informações -->
            <button @click="isInfoOpen = true" aria-haspopup="dialog" :aria-expanded="isInfoOpen"
              aria-label="Abrir informações operacionais, horários e formas de pagamento da loja"
              class="flex items-center gap-1 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 active:scale-95 px-2.5 py-1 rounded-lg cursor-pointer transition-all shadow-2xs shrink-0"
              title="Ver informações da loja">
              <Info class="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
              <span>Informações</span>
              <ChevronRight class="w-3 h-3 text-slate-400 ml-0.5" aria-hidden="true" />
            </button>

            <div class="flex items-center gap-1 shrink-0">
              <span>🛵 Entrega • 30-45 min</span>
            </div>

            <div class="flex items-center gap-1 shrink-0">
              <span class="text-slate-300" aria-hidden="true">•</span>
              <span>Taxa: {{ tenant.deliveryFee ? formatCurrency(tenant.deliveryFee) : 'Grátis' }}</span>
            </div>

            <div v-if="tenant.minOrderValue" class="flex items-center gap-1 shrink-0">
              <span class="text-slate-300" aria-hidden="true">•</span>
              <span>Mín: {{ formatCurrency(tenant.minOrderValue) }}</span>
            </div>
          </div>

          <!-- Endereço e WhatsApp -->
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 border-t border-slate-100 text-xs min-w-0 w-full">
            <div class="flex items-center justify-center sm:justify-start gap-1.5 text-slate-500 min-w-0 w-full truncate">
              <MapPin class="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              <span class="truncate block min-w-0">{{ tenant.address || 'Atendimento e entrega local' }}</span>
            </div>

            <a :href="`https://wa.me/55${tenant.phoneWhatsApp.replace(/\D/g, '')}`" target="_blank"
              aria-label="Abrir conversa no WhatsApp com o estabelecimento para tirar dúvidas"
              class="inline-flex items-center justify-center gap-1.5 font-bold hover:underline shrink-0"
              :class="themeClasses.primaryText">
              <Phone class="w-3.5 h-3.5" />
              <span>Dúvidas no WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </header>

    <!-- 3. Banner de Vantagem / Promoção -->
    <div class="max-w-4xl mx-auto px-4 mt-5">
      <div
        class="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex items-center justify-between text-xs font-medium shadow-2xs">
        <div class="flex items-center gap-2.5 text-slate-700">
          <span class="text-base" aria-hidden="true">🛵</span>
          <span>Peça pelo canal oficial com <strong>preço original de balcão</strong> e sem taxas extras!</span>
        </div>
        <span class="font-bold shrink-0 text-[11px] hidden sm:inline" :class="themeClasses.primaryText"
          aria-hidden="true">Aproveite ›</span>
      </div>
    </div>

    <!-- 4. Campo de Busca de Produtos em Tempo Real -->
    <div class="max-w-4xl mx-auto px-4 mt-6">
      <ProductSearchInput v-model="searchQuery" :theme="tenant.theme" @clear="clearSearch" />
    </div>

    <!-- Feedback de Busca Ativa com Contagem de Resultados -->
    <div v-if="isSearching && hasResults"
      class="max-w-4xl mx-auto px-4 mt-3 flex items-center justify-between text-xs text-slate-600 animate-in fade-in duration-150">
      <span>
        Encontrado{{ totalResultsCount === 1 ? '' : 's' }} <strong>{{ totalResultsCount }}</strong> produto{{ totalResultsCount === 1 ? '' : 's' }} para "<strong class="text-slate-900">{{ searchQuery }}</strong>"
      </span>
      <button @click="clearSearch" class="font-bold text-xs hover:underline cursor-pointer"
        :class="themeClasses.primaryText">
        Ver catálogo completo
      </button>
    </div>

    <!-- Estado Vazio quando a Busca não encontra resultados -->
    <div v-if="isSearching && !hasResults"
      class="max-w-4xl mx-auto px-4 py-16 text-center space-y-3.5 animate-in fade-in duration-200" role="status">
      <div class="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
        <Search class="w-6 h-6" aria-hidden="true" />
      </div>
      <h3 class="font-bold text-base text-slate-900">Nenhum produto encontrado</h3>
      <p class="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
        Não encontramos nenhum item correspondente a "<strong class="text-slate-800">{{ searchQuery }}</strong>". Tente buscar por outros termos ou ingredientes.
      </p>
      <button @click="clearSearch" class="px-5 py-2.5 rounded-2xl text-xs font-bold text-white transition-all cursor-pointer shadow-sm active:scale-95"
        :class="themeClasses.buttonPrimary">
        Limpar busca e ver tudo
      </button>
    </div>

    <!-- 5. Seção Destaques & Mais Pedidos (Ocultada quando em busca ativa para focar nos resultados) -->
    <section v-if="!isSearching && featuredProducts.length > 0" class="max-w-4xl mx-auto px-4 mt-8 space-y-3.5"
      aria-labelledby="featured-title">
      <div class="flex items-center justify-between">
        <h2 id="featured-title" class="text-base font-bold text-slate-900 flex items-center gap-2">
          <Flame class="w-4 h-4 text-amber-500 fill-amber-500" aria-hidden="true" />
          <span>Destaques & Mais Pedidos</span>
        </h2>

        <!-- Controles de Navegação Desktop -->
        <div class="flex items-center gap-1.5">
          <span class="text-xs text-slate-400 font-medium sm:hidden">Deslize para o lado ›</span>

          <div class="hidden sm:flex items-center gap-1.5">
            <button @click="scrollCarousel('left')"
              class="p-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-2xs active:scale-95 transition-all cursor-pointer"
              title="Anterior" aria-label="Rolar carrossel de destaques para a esquerda">
              <ChevronLeft class="w-4 h-4" aria-hidden="true" />
            </button>
            <button @click="scrollCarousel('right')"
              class="p-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-2xs active:scale-95 transition-all cursor-pointer"
              title="Próximo" aria-label="Rolar carrossel de destaques para a direita">
              <ChevronRight class="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <!-- Carrossel -->
      <div ref="carouselRef" tabindex="0" role="region" aria-label="Carrossel de produtos em destaque"
        class="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 focus:outline-none">
        <article v-for="product in featuredProducts" :key="product.id" @click="openProductModal(product)"
          class="shrink-0 w-40 sm:w-48 bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs hover:shadow-md active:scale-[0.98] transition-all cursor-pointer flex flex-col justify-between group"
          :aria-label="`${product.name}, por ${formatCurrency(product.price)}`">
          <div class="relative w-full h-32 sm:h-36 rounded-xl overflow-hidden bg-slate-100 mb-2.5">
            <img v-if="product.image" :src="product.image" :alt="product.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <span
              class="absolute top-1.5 left-1.5 bg-amber-500 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shadow-2xs">
              Mais pedido
            </span>
          </div>

          <div class="space-y-1">
            <span class="font-extrabold text-sm block" :class="themeClasses.primaryText">
              {{ formatCurrency(product.price) }}
            </span>
            <h3 class="font-bold text-xs text-slate-900 line-clamp-2 leading-tight">
              {{ product.name }}
            </h3>
          </div>
        </article>
      </div>
    </section>

    <!-- 6. Barra Fixa de Categorias (Alimentada reativamente pelas categorias filtradas) -->
    <CategoryTabs v-if="filteredCategories.length > 0" :categories="filteredCategories" :theme="tenant.theme" class="mt-6" />

    <!-- 7. Catálogo Completo de Produtos -->
    <main v-if="filteredCategories.length > 0" class="max-w-4xl mx-auto px-4 mt-8 space-y-10" aria-label="Catálogo de produtos">
      <section v-for="category in filteredCategories" :key="category.id" :id="category.id" class="space-y-4 scroll-mt-24"
        :aria-labelledby="`cat-title-${category.id}`">
        <div class="flex items-center gap-2">
          <span class="w-1.5 h-4 rounded-full" :class="themeClasses.categoryIndicator" aria-hidden="true"></span>
          <h2 :id="`cat-title-${category.id}`" class="text-base font-bold text-slate-900 tracking-tight">
            {{ category.name }}
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <article v-for="product in category.products" :key="product.id" @click="openProductModal(product)"
            class="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md flex items-center justify-between gap-3.5 active:scale-[0.99] transition-all cursor-pointer"
            :aria-label="`${product.name}, por ${formatCurrency(product.price)}`">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-slate-900 text-sm truncate">{{ product.name }}</h3>
                <span v-if="!product.available"
                  class="text-[10px] bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded font-bold shrink-0">
                  Esgotado
                </span>
              </div>
              <p class="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{{ product.description }}</p>

              <div class="flex items-center gap-2 mt-3">
                <span class="font-extrabold text-sm" :class="themeClasses.primaryText">
                  {{ formatCurrency(product.price) }}
                </span>
                <span v-if="product.optionGroups?.length" class="text-[10px] px-2 py-0.5 rounded-full font-bold border"
                  :class="[themeClasses.badgeBg, themeClasses.badgeText, themeClasses.badgeBorder]">
                  Montar
                </span>
              </div>
            </div>

            <img v-if="product.image" :src="product.image" :alt="product.name"
              class="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-100" />
          </article>
        </div>
      </section>
    </main>

    <!-- 8. Modal de Customização do Produto -->
    <ProductCustomizerModal :product="selectedProduct" :tenant="tenant" :is-open="!!selectedProduct"
      @close="closeProductModal" @add-to-cart="handleAddProductToCart" />

    <!-- 9. Barra Fixa Inferior da Sacola -->
    <div v-if="cartItems.length > 0" role="region" aria-label="Resumo da sacola de compras"
      class="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl z-40">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <div>
          <span class="text-xs text-slate-500 block" aria-live="polite">
            {{ totalItemsCount }} {{ totalItemsCount === 1 ? 'item' : 'itens' }}
          </span>
          <span class="text-lg font-black" :class="themeClasses.primaryText">{{ formatCurrency(cartSubtotal) }}</span>
        </div>
        <button @click="isCartDrawerOpen = true" aria-haspopup="dialog" :aria-expanded="isCartDrawerOpen"
          :aria-label="`Ver sacola com ${totalItemsCount} ${totalItemsCount === 1 ? 'item' : 'itens'} no total de ${formatCurrency(cartSubtotal)}`"
          class="font-black px-5 py-3 rounded-2xl shadow-md flex items-center gap-2 transition-all text-xs cursor-pointer"
          :class="themeClasses.buttonPrimary">
          <ShoppingCart class="w-4 h-4" aria-hidden="true" />
          <span>Ver Sacola</span>
        </button>
      </div>
    </div>

    <!-- 10. Drawer Modular de Finalização do Carrinho -->
    <CartDrawerModal :is-open="isCartDrawerOpen" :tenant="tenant" :items="cartItems" @close="isCartDrawerOpen = false"
      @remove-item="removeCartItem" @clear-cart="clearCart" />

    <!-- 11. Modais da Loja -->
    <StoreReviewsModal v-if="tenant.reviews" :reviews="tenant.reviews" :theme="tenant.theme" :is-open="isReviewsOpen"
      @close="isReviewsOpen = false" />

    <StoreInfoModal :tenant="tenant" :is-open="isInfoOpen" @close="isInfoOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTenant } from '~/composables/useTenant'
import { useTenantTheme } from '~/composables/useTenantTheme'
import { useOpeningHours } from '~/composables/useOpeningHours'
import { useShare } from '~/composables/useShare'
import { useProductSearch } from '~/composables/useProductSearch'
import { useCart } from '~/composables/useCart'
import { formatCurrency } from '~/utils/formatters'
import ProductSearchInput from '~/components/ProductSearchInput.vue'
import {
  Phone,
  MapPin,
  ShoppingCart,
  Star,
  Info,
  ArrowLeft,
  Flame,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  Search
} from 'lucide-vue-next'
import type { Product, CartItem } from '~/types'

// 1. Carregamento Seguro e Resolução SSR do Tenant
const { tenant } = await useTenant()

// 2. Tema Dinâmico por Segmento
const { themeClasses } = useTenantTheme(tenant)

// 3. Horário de Funcionamento (Aberto / Fechado)
const { isOpen } = useOpeningHours(tenant)

// 4. Compartilhamento e Toast
const { isCopied, shareStore } = useShare(tenant)

// 5. Busca Rápida de Produtos em Tempo Real
const {
  searchQuery,
  isSearching,
  filteredCategories,
  totalResultsCount,
  hasResults,
  clearSearch
} = useProductSearch(computed(() => tenant.value?.categories))

// 6. Carrinho Persistente Multi-Tenant via LocalStorage (useCart)
const {
  items: cartItems,
  addItem: handleAddProductToCart,
  removeItem: removeCartItem,
  clearCart,
  totalItemsCount,
  cartSubtotal
} = useCart(tenant)

// 7. SEO & OpenGraph Dinâmico
useSeoMeta({
  title: () => tenant.value ? `${tenant.value.name} — Cardápio Digital & Pedidos` : 'Alaska Local',
  description: () => tenant.value?.description || 'Faça seu pedido online de forma rápida pelo WhatsApp.',
  ogTitle: () => tenant.value?.name,
  ogDescription: () => tenant.value?.description,
  ogImage: () => tenant.value?.banner || tenant.value?.logo,
  ogType: 'website',
  twitterCard: 'summary_large_image'
})

// 8. Estados de Modais
const isReviewsOpen = ref(false)
const isInfoOpen = ref(false)
const selectedProduct = ref<Product | null>(null)
const isCartDrawerOpen = ref(false)

function openProductModal(product: Product) {
  if (!product.available) return
  selectedProduct.value = product
}

function closeProductModal() {
  selectedProduct.value = null
}

// 9. Destaques Dinâmicos
const featuredProducts = computed(() => {
  if (!tenant.value) return []
  const all: Product[] = []
  tenant.value.categories.forEach(category => {
    all.push(...category.products.filter(p => p.available))
  })
  return all.slice(0, 6)
})

// 10. Controle de Rolagem Horizontal
const carouselRef = ref<HTMLElement | null>(null)

function scrollCarousel(direction: 'left' | 'right') {
  if (!carouselRef.value) return
  const scrollAmount = 350
  const delta = direction === 'left' ? -scrollAmount : scrollAmount
  carouselRef.value.scrollLeft += delta
}
</script>
