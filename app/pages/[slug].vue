<template>
  <div v-if="pending" class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
      <p class="text-gray-600">Carregando...</p>
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

  <!-- Template Menu (Cardápio) -->
  <div v-else-if="tenant?.template === 'menu' || !tenant?.template" class="min-h-screen bg-gray-50">
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

    <!-- Modal do Carrinho -->
    <div 
      v-if="showCart"
      class="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
      @click="closeCart"
    >
      <div 
        class="bg-white rounded-t-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold">Seu Pedido</h3>
            <button @click="closeCart" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>

          <!-- Lista de itens -->
          <div class="space-y-4 mb-6">
            <div 
              v-for="(item, index) in cart.items" 
              :key="index"
              class="border-b pb-4"
            >
              <div class="flex justify-between items-start mb-2">
                <div class="flex-1">
                  <h4 class="font-semibold">{{ item.product.name }}</h4>
                  <div v-if="item.options.size > 0" class="text-sm text-gray-600 mt-1">
                    <div v-for="(optionIds, groupId) in item.options" :key="String(groupId)">
                      <span v-for="optionId in Array.from(optionIds)" :key="optionId">
                        {{ getOptionName(String(groupId), optionId) }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <span class="font-bold">{{ formatCurrency(item.total) }}</span>
                  <button 
                    @click="removeFromCart(index)"
                    class="block text-red-500 text-sm mt-1 hover:text-red-700"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Taxa de entrega -->
          <div v-if="tenant?.deliveryFee > 0" class="flex justify-between items-center mb-4 text-gray-600">
            <span>Taxa de entrega</span>
            <span>{{ formatCurrency(tenant.deliveryFee) }}</span>
          </div>

          <!-- Total -->
          <div class="flex justify-between items-center mb-6 text-xl font-bold">
            <span>Total</span>
            <span>{{ formatCurrency(cart.total + (tenant?.deliveryFee || 0)) }}</span>
          </div>

          <!-- Formulário de entrega -->
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-sm font-medium mb-1">Nome completo</label>
              <input 
                v-model="customerName"
                type="text" 
                class="w-full border rounded-lg px-3 py-2"
                placeholder="Seu nome"
              >
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Endereço de entrega</label>
              <textarea 
                v-model="customerAddress"
                class="w-full border rounded-lg px-3 py-2"
                rows="2"
                placeholder="Rua, número, complemento"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Forma de pagamento</label>
              <select 
                v-model="paymentMethod"
                class="w-full border rounded-lg px-3 py-2"
              >
                <option value="pix">Pix</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="cartao">Cartão</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Observações</label>
              <textarea 
                v-model="customerNotes"
                class="w-full border rounded-lg px-3 py-2"
                rows="2"
                placeholder="Sem cebola, troco para X, etc."
              ></textarea>
            </div>
          </div>

          <!-- Botão enviar pedido -->
          <button 
            @click="sendOrderViaWhatsApp"
            class="w-full bg-green-500 text-white py-4 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.08 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Enviar pedido via WhatsApp
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Template Hub (Links) -->
  <div v-else-if="tenant?.template === 'hub'" class="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100">
    <div class="container mx-auto px-4 py-8 max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <img 
          :src="tenant?.logo" 
          :alt="tenant?.name" 
          class="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg object-cover"
        >
        <h1 class="text-2xl font-bold text-gray-900">{{ tenant?.name }}</h1>
        <p class="text-gray-600 mt-2">{{ tenant?.description }}</p>
      </div>

      <!-- Links -->
      <div class="space-y-4">
        <a 
          v-for="link in tenant?.links" 
          :key="link.id"
          :href="link.url"
          target="_blank"
          :class="link.color || 'bg-brand-500'"
          class="block w-full text-white py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 font-semibold"
        >
          <span>{{ link.title }}</span>
        </a>
      </div>

      <!-- Informações -->
      <div class="mt-8 bg-white rounded-xl p-6 shadow-sm">
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

      <!-- Footer -->
      <div class="text-center mt-8 text-gray-500 text-sm">
        <p>Feito com ❤️ pela Alaska Local</p>
      </div>
    </div>
  </div>

  <!-- Template Booking (Agendamento) -->
  <div v-else-if="tenant?.template === 'booking'" class="min-h-screen bg-gray-50">
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

    <div class="container mx-auto px-4 py-6">
      <!-- Serviços -->
      <h2 class="text-lg font-bold text-gray-900 mb-4">Nossos Serviços</h2>
      <div class="space-y-3 mb-6">
        <div 
          v-for="service in tenant?.services" 
          :key="service.id"
          class="bg-white rounded-lg shadow-sm p-4"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900">{{ service.name }}</h3>
              <p class="text-sm text-gray-600 mt-1">{{ service.description }}</p>
            </div>
            <span class="font-bold text-brand-600">{{ formatCurrency(service.price) }}</span>
          </div>
        </div>
      </div>

      <!-- Botão agendar -->
      <a 
        :href="`https://wa.me/${tenant?.phoneWhatsApp.replace(/\D/g, '')}?text=Olá, gostaria de agendar um horário`"
        target="_blank"
        class="block w-full bg-green-500 text-white py-4 rounded-lg font-semibold hover:bg-green-600 transition-colors text-center"
      >
        Agendar via WhatsApp
      </a>

      <!-- Informações -->
      <div class="mt-6 bg-white rounded-lg shadow-sm p-4">
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

// Estado do modal do carrinho
const showCart = ref(false)

// Dados do cliente
const customerName = ref('')
const customerAddress = ref('')
const paymentMethod = ref('pix')
const customerNotes = ref('')

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
    if (currencyCode && currencyMap[currencyCode]) {
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
  showCart.value = true
  document.body.style.overflow = 'hidden'
}

// Fechar carrinho
function closeCart() {
  showCart.value = false
  document.body.style.overflow = ''
}

// Remover item do carrinho
function removeFromCart(index: number) {
  const item = cart.value.items[index]
  if (item) {
    cart.value.total -= item.total
    cart.value.items.splice(index, 1)
  }
}

// Pegar nome da opção
function getOptionName(groupId: string, optionId: string): string {
  const group = tenant.value?.categories
    .flatMap(cat => cat.products)
    .flatMap(prod => prod.optionGroups || [])
    .find(g => g.id === groupId)
  
  const option = group?.options.find(o => o.id === optionId)
  return option?.name || ''
}

// Enviar pedido via WhatsApp
function sendOrderViaWhatsApp() {
  if (!tenant.value) return
  
  // Validar campos obrigatórios
  if (!customerName.value || !customerAddress.value) {
    alert('Por favor, preencha nome e endereço.')
    return
  }

  // Construir mensagem do pedido
  let message = `🍔 *Novo Pedido - ${tenant.value.name}*\n\n`
  message += `👤 *Cliente:* ${customerName.value}\n`
  message += `📍 *Endereço:* ${customerAddress.value}\n`
  message += `💳 *Pagamento:* ${paymentMethod.value}\n\n`
  
  message += `📋 *Itens:*\n`
  cart.value.items.forEach((item, index) => {
    message += `${index + 1}. ${item.product.name}\n`
    
    // Adicionar opções
    if (item.options.size > 0) {
      item.options.forEach((optionIds, groupId) => {
        optionIds.forEach(optionId => {
          message += `   + ${getOptionName(groupId, optionId)}\n`
        })
      })
    }
    
    message += `   ${formatCurrency(item.total)}\n\n`
  })

  // Adicionar taxa de entrega
  if (tenant.value.deliveryFee > 0) {
    message += `🚚 *Taxa de entrega:* ${formatCurrency(tenant.value.deliveryFee)}\n`
  }

  // Total
  const total = cart.value.total + tenant.value.deliveryFee
  message += `💰 *Total:* ${formatCurrency(total)}\n\n`

  // Observações
  if (customerNotes.value) {
    message += `📝 *Observações:* ${customerNotes.value}\n\n`
  }

  message += `Aguardando confirmação! 🙏`

  // Criar URL do WhatsApp
  const phone = tenant.value.phoneWhatsApp.replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`
  
  // Abrir WhatsApp
  window.open(whatsappUrl, '_blank')
  
  // Limpar carrinho após envio
  cart.value.items = []
  cart.value.total = 0
  closeCart()
}
</script>
