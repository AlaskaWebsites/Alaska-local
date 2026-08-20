<template>
  <div v-if="pending" class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
      <p class="text-gray-600">Carregando cardápio...</p>
    </div>
  </div>

  <div v-else-if="error" class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Estabelecimento não encontrado</h2>
      <p class="text-gray-600 mb-4">O cardápio que você procura não está disponível.</p>
      <NuxtLink to="/" class="text-brand-500 hover:text-brand-600">
        Voltar para a página inicial
      </NuxtLink>
    </div>
  </div>

  <div v-else-if="tenant" class="min-h-screen bg-gray-50">
    <!-- Header com banner e logo -->
    <div class="relative">
      <img 
        :src="tenant?.banner" 
        :alt="tenant?.name" 
        class="w-full h-48 object-cover"
      >
      <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
        <div class="flex items-center gap-3">
          <img 
            :src="tenant?.logo" 
            :alt="tenant?.name" 
            class="w-16 h-16 rounded-full border-2 border-white object-cover"
          >
          <div>
            <h1 class="text-white text-xl font-bold">{{ tenant?.name }}</h1>
            <p class="text-white/80 text-sm">{{ tenant?.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Informações do estabelecimento -->
    <div class="container mx-auto px-4 py-4">
      <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Phone class="w-4 h-4" />
          <span>{{ formatPhone(tenant?.phoneWhatsApp) }}</span>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <MapPin class="w-4 h-4" />
          <span>{{ tenant?.address }}</span>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <Clock class="w-4 h-4" />
          <span>{{ tenant?.openingHours?.open }} - {{ tenant?.openingHours?.close }}</span>
        </div>
      </div>

      <!-- Categorias e produtos -->
      <div v-for="category in tenant?.categories" :key="category.id" class="mb-6">
        <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span>{{ category.name }}</span>
        </h2>
        
        <div class="space-y-3">
          <div 
            v-for="product in category.products" 
            :key="product.id"
            class="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
            @click="openProductModal(product)"
          >
            <div class="flex gap-4">
              <img 
                :src="product.image" 
                :alt="product.name" 
                class="w-24 h-24 rounded-lg object-cover"
              >
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900">{{ product.name }}</h3>
                <p class="text-sm text-gray-600 mb-2">{{ product.description }}</p>
                <div class="flex items-center justify-between">
                  <span class="font-bold text-brand-600">{{ formatCurrency(product.price) }}</span>
                  <span 
                    v-if="!product.available" 
                    class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded"
                  >
                    Indisponível
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de produto -->
    <div 
      v-if="selectedProduct" 
      class="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
      @click="closeProductModal"
    >
      <div 
        class="bg-white rounded-t-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold">{{ selectedProduct.name }}</h3>
            <button @click="closeProductModal" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>
          
          <img 
            :src="selectedProduct.image" 
            :alt="selectedProduct.name" 
            class="w-full h-48 object-cover rounded-lg mb-4"
          >
          
          <p class="text-gray-600 mb-4">{{ selectedProduct.description }}</p>
          
          <!-- Opções do produto -->
          <div 
            v-for="group in selectedProduct.optionGroups" 
            :key="group.id"
            class="mb-4"
          >
            <h4 class="font-semibold mb-2">
              {{ group.title }}
              <span v-if="group.required" class="text-red-500">*</span>
            </h4>
            
            <div class="space-y-2">
              <div 
                v-for="option in group.options" 
                :key="option.id"
                class="flex items-center justify-between p-3 border rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    :id="option.id"
                    :checked="isOptionSelected(group.id, option.id)"
                    @change="toggleOption(group.id, option.id, group.max)"
                    class="w-5 h-5 text-brand-500"
                  >
                  <label :for="option.id" class="flex-1">{{ option.name }}</label>
                </div>
                <span class="text-sm text-gray-600">
                  {{ option.price > 0 ? formatCurrency(option.price) : '' }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Botão adicionar ao carrinho -->
          <button 
            @click="addToCart"
            class="w-full bg-brand-500 text-white py-3 rounded-lg font-semibold hover:bg-brand-600 transition-colors"
          >
            Adicionar - {{ formatCurrency(calculateProductTotal()) }}
          </button>
        </div>
      </div>
    </div>

    <!-- Carrinho flutuante -->
    <div 
      v-if="cart.items.length > 0"
      class="fixed bottom-4 left-4 right-4 max-w-md mx-auto"
    >
      <button 
        @click="openCart"
        class="w-full bg-brand-500 text-white py-4 rounded-lg shadow-lg flex items-center justify-between px-6"
      >
        <div class="flex items-center gap-2">
          <ShoppingCart class="w-5 h-5" />
          <span>{{ cart.items.length }} item(s)</span>
        </div>
        <span class="font-bold">{{ formatCurrency(cart.total) }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Phone, MapPin, Clock, X, ShoppingCart } from '@lucide/vue'
import type { Tenant, Product, OptionGroup, Option } from '~/types/tenant'
import { TenantSchema } from '~/types/tenant'

const route = useRoute()
const slug = route.params.slug as string

// Carregar dados do tenant com SSR
const { data: tenant, pending, error } = await useAsyncData(
  `tenant-${slug}`,
  async () => {
    try {
      const data = await import(`~/data/${slug}.json`)
      const validatedTenant = TenantSchema.parse(data.default)
      return validatedTenant
    } catch (err) {
      throw createError({
        statusCode: 404,
        message: 'Estabelecimento não encontrado'
      })
    }
  }
)

const selectedProduct = ref<Product | null>(null)
const selectedOptions = ref<Map<string, Set<string>>>(new Map())

// Carrinho
const cart = ref({
  items: [] as Array<{
    product: Product
    options: Map<string, Set<string>>
    total: number
  }>,
  total: 0
})

// Tratamento de erro 404
if (error.value) {
  throw createError({
    statusCode: 404,
    message: 'Estabelecimento não encontrado'
  })
}

// Recuperar carrinho do localStorage apenas no cliente
onMounted(() => {
  if (import.meta.client) {
    const savedCart = localStorage.getItem('alaska-cart')
    if (savedCart) {
      try {
        cart.value = JSON.parse(savedCart)
      } catch (e) {
        console.error('Erro ao recuperar carrinho:', e)
      }
    }
  }
})

// Salvar carrinho no localStorage
watch(cart, (newCart) => {
  if (import.meta.client) {
    localStorage.setItem('alaska-cart', JSON.stringify(newCart))
  }
}, { deep: true })

// Funções de formatação
function formatCurrency(value: number): string {
  try {
    // Mapeamento de símbolos comuns para códigos ISO
    const currencyMap: Record<string, string> = {
      'R$': 'BRL',
      'US$': 'USD',
      '€': 'EUR',
      '£': 'GBP'
    }
    
    // Obter código de moeda válido
    let currencyCode = tenant.value?.currency || 'BRL'
    if (currencyMap[currencyCode]) {
      currencyCode = currencyMap[currencyCode]
    }
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currencyCode
    }).format(value)
  } catch (error) {
    console.error('Erro ao formatar moeda:', error)
    // Fallback seguro
    return `R$ ${value.toFixed(2)}`
  }
}

function formatPhone(phone: string): string {
  return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')
}

// Modal de produto
function openProductModal(product: Product) {
  selectedProduct.value = product
  selectedOptions.value = new Map()
  document.body.style.overflow = 'hidden'
}

function closeProductModal() {
  selectedProduct.value = null
  selectedOptions.value = new Map()
  document.body.style.overflow = ''
}

// Gestão de opções
function isOptionSelected(groupId: string, optionId: string): boolean {
  return selectedOptions.value.get(groupId)?.has(optionId) || false
}

function toggleOption(groupId: string, optionId: string, max: number) {
  const groupOptions = selectedOptions.value.get(groupId) || new Set()
  
  if (groupOptions.has(optionId)) {
    groupOptions.delete(optionId)
  } else if (groupOptions.size < max) {
    groupOptions.add(optionId)
  }
  
  selectedOptions.value.set(groupId, groupOptions)
}

// Cálculo do total do produto
function calculateProductTotal(): number {
  if (!selectedProduct.value) return 0
  
  let total = selectedProduct.value.price
  
  selectedOptions.value.forEach((optionIds, groupId) => {
    const group = selectedProduct.value?.optionGroups.find(g => g.id === groupId)
    if (group) {
      optionIds.forEach(optionId => {
        const option = group.options.find(o => o.id === optionId)
        if (option) {
          total += option.price
        }
      })
    }
  })
  
  return total
}

// Adicionar ao carrinho
function addToCart() {
  if (!selectedProduct.value) return
  
  const cartItem = {
    product: selectedProduct.value,
    options: new Map(selectedOptions.value),
    total: calculateProductTotal()
  }
  
  cart.value.items.push(cartItem)
  cart.value.total += cartItem.total
  
  closeProductModal()
}

// Abrir carrinho
function openCart() {
  // Implementar modal do carrinho
  console.log('Abrir carrinho:', cart.value)
}
</script>
