<!-- pages/[slug].vue -->
<template>
  <div v-if="tenant" class="min-h-screen bg-gray-50 pb-28">
    <!-- Header com banner e logo -->
    <header class="relative bg-white border-b border-gray-100 shadow-sm">
      <div class="h-44 w-full overflow-hidden bg-gray-900">
        <img v-if="tenant.banner" :src="tenant.banner" :alt="tenant.name"
          class="w-full h-full object-cover opacity-85" />
        <div v-else class="w-full h-full bg-gradient-to-r from-emerald-600 to-teal-700"></div>
      </div>

      <div class="px-4 pb-4 pt-3 flex items-start gap-3">
        <img v-if="tenant.logo" :src="tenant.logo" :alt="tenant.name"
          class="w-16 h-16 rounded-2xl border-2 border-white shadow-md -mt-8 object-cover bg-white shrink-0" />
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <h1 class="font-bold text-lg text-gray-900 leading-tight">{{ tenant.name }}</h1>
            <span :class="isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'"
              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold shrink-0">
              {{ isOpen ? '🟢 Aberto' : '🕒 Fechado' }}
            </span>
          </div>
          <p v-if="tenant.description" class="text-xs text-gray-500 line-clamp-1 mt-0.5">
            {{ tenant.description }}
          </p>

          <div class="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-gray-500 mt-2">
            <div v-if="tenant.openingHours" class="flex items-center gap-1">
              <Clock class="w-3.5 h-3.5 text-gray-400" />
              <span>{{ tenant.openingHours.open }} - {{ tenant.openingHours.close }}</span>
            </div>
            <div v-if="tenant.minOrderValue" class="flex items-center gap-1">
              <span>• Mín: {{ formatCurrency(tenant.minOrderValue) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Informações extras (Endereço e WhatsApp) -->
      <div
        class="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
        <div class="flex items-center gap-1.5 truncate max-w-[70%]">
          <MapPin class="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span class="truncate">{{ tenant.address || 'Atendimento local' }}</span>
        </div>
        <a :href="`https://wa.me/55${tenant.phoneWhatsApp.replace(/\D/g, '')}`" target="_blank"
          class="flex items-center gap-1 text-emerald-600 font-semibold hover:underline">
          <Phone class="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </a>
      </div>
    </header>

    <!-- Categorias e Catálogo -->
    <main class="container mx-auto px-4 mt-5 space-y-6">
      <section v-for="category in tenant.categories" :key="category.id" class="space-y-3">
        <h2 class="text-base font-bold text-gray-900 flex items-center gap-2">
          <span class="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
          {{ category.name }}
        </h2>

        <div class="grid grid-cols-1 gap-3">
          <div v-for="product in category.products" :key="product.id" @click="openProductModal(product)"
            class="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-sm flex items-center justify-between gap-3 active:scale-[0.99] transition-transform cursor-pointer hover:border-gray-200">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="font-semibold text-gray-900 text-sm truncate">{{ product.name }}</h3>
                <span v-if="!product.available"
                  class="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-medium shrink-0">
                  Esgotado
                </span>
              </div>
              <p class="text-xs text-gray-500 line-clamp-2 mt-1">{{ product.description }}</p>

              <div class="flex items-center gap-2 mt-2">
                <span class="font-bold text-sm text-gray-900">
                  {{ formatCurrency(product.price) }}
                </span>
                <span v-if="product.optionGroups?.length"
                  class="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                  Personalizável
                </span>
              </div>
            </div>

            <img v-if="product.image" :src="product.image" :alt="product.name"
              class="w-20 h-20 rounded-xl object-cover shrink-0 bg-gray-100" />
          </div>
        </div>
      </section>
    </main>

    <!-- Modal de Customização do Produto -->
    <div v-if="selectedProduct"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      @click="closeProductModal">
      <div
        class="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
        @click.stop>
        <!-- Header Modal -->
        <div class="relative h-44 w-full bg-gray-100 shrink-0">
          <img v-if="selectedProduct.image" :src="selectedProduct.image" :alt="selectedProduct.name"
            class="w-full h-full object-cover" />
          <button @click="closeProductModal"
            class="absolute top-3 right-3 bg-black/40 text-white hover:bg-black/60 p-1.5 rounded-full transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Conteúdo com Scroll -->
        <div class="p-4 overflow-y-auto flex-1 space-y-4">
          <div>
            <h3 class="text-lg font-bold text-gray-900 leading-tight">{{ selectedProduct.name }}</h3>
            <p class="text-xs text-gray-500 mt-1">{{ selectedProduct.description }}</p>
            <span class="text-sm font-bold text-gray-900 mt-1 block">
              {{ formatCurrency(selectedProduct.price) }}
            </span>
          </div>

          <!-- Grupos de Opcionais -->
          <div v-for="group in selectedProduct.optionGroups" :key="group.id" class="border-t pt-3 space-y-2">
            <div class="flex items-center justify-between">
              <h4 class="font-semibold text-sm text-gray-900">
                {{ group.title }}
                <span v-if="group.required" class="text-red-500 font-bold">*</span>
              </h4>
              <span class="text-[11px] text-gray-400">
                {{ group.max === 1 ? 'Escolha 1' : `Até ${group.max}` }}
              </span>
            </div>

            <div class="space-y-1.5">
              <label v-for="option in group.options" :key="option.id"
                class="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                :class="isOptionSelected(group.id, option.id) ? 'border-emerald-500 bg-emerald-50/40' : ''">
                <div class="flex items-center gap-2.5">
                  <input :type="group.max === 1 ? 'radio' : 'checkbox'" :name="group.id"
                    :checked="isOptionSelected(group.id, option.id)" @change="toggleOption(group, option)"
                    class="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
                  <span class="text-sm text-gray-800">{{ option.name }}</span>
                </div>
                <span v-if="option.price > 0" class="text-xs font-semibold text-gray-700">
                  + {{ formatCurrency(option.price) }}
                </span>
              </label>
            </div>
          </div>

          <!-- Observação -->
          <div class="border-t pt-3">
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">Alguma observação?</label>
            <textarea v-model="productObservation" rows="2"
              placeholder="Ex: Ponto da carne bem passado, tirar a cebola, etc."
              class="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"></textarea>
          </div>
        </div>

        <!-- Footer Modal: Quantidade e Botão Adicionar -->
        <div class="p-4 border-t border-gray-100 bg-white flex items-center gap-3">
          <div class="flex items-center border border-gray-200 rounded-xl p-1 shrink-0">
            <button @click="productQuantity > 1 ? productQuantity-- : null"
              class="p-1 text-gray-500 hover:text-gray-900 disabled:opacity-30" :disabled="productQuantity <= 1">
              <Minus class="w-4 h-4" />
            </button>
            <span class="w-8 text-center font-bold text-sm text-gray-900">{{ productQuantity }}</span>
            <button @click="productQuantity++" class="p-1 text-gray-500 hover:text-gray-900">
              <Plus class="w-4 h-4" />
            </button>
          </div>

          <button @click="addToCart" :disabled="!isProductConfigValid"
            class="flex-1 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-50 text-white py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-between">
            <span>Adicionar</span>
            <span>{{ formatCurrency(calculateProductTotal() * productQuantity) }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Barra Flutuante Inferior com Resumo da Sacola -->
    <div v-if="cart.items.length > 0"
      class="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-xl z-40">
      <div class="max-w-md mx-auto flex items-center justify-between">
        <div>
          <span class="text-xs text-gray-500 block">
            {{ totalItemsCount }} {{ totalItemsCount === 1 ? 'item' : 'itens' }}
          </span>
          <span class="text-lg font-bold text-gray-900">{{ formatCurrency(cartSubtotal) }}</span>
        </div>
        <button @click="isCartDrawerOpen = true"
          class="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all text-sm">
          <ShoppingCart class="w-4 h-4" />
          <span>Ver Sacola</span>
        </button>
      </div>
    </div>

    <!-- Drawer / Modal de Finalização do Carrinho -->
    <div v-if="isCartDrawerOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      @click="isCartDrawerOpen = false">
      <div
        class="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        @click.stop>
        <!-- Header Carrinho -->
        <div class="p-4 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <ShoppingCart class="w-5 h-5 text-emerald-600" />
            <h3 class="font-bold text-base text-gray-900">Sua Sacola</h3>
          </div>
          <button @click="isCartDrawerOpen = false" class="text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Lista de Itens e Formulário -->
        <div class="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
          <!-- Itens Adicionados -->
          <div class="space-y-2.5">
            <div v-for="(item, index) in cart.items" :key="index"
              class="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex items-start justify-between gap-2">
              <div class="flex-1">
                <div class="flex items-center gap-1.5">
                  <span class="font-bold text-emerald-700">{{ item.quantity }}x</span>
                  <span class="font-semibold text-gray-900 text-xs">{{ item.product.name }}</span>
                </div>
                <div v-if="item.selectedOptions.length" class="text-[11px] text-gray-500 mt-0.5 space-y-0.5">
                  <p v-for="opt in item.selectedOptions" :key="opt.id">
                    + {{ opt.name }} {{ opt.price > 0 ? `(${formatCurrency(opt.price)})` : '' }}
                  </p>
                </div>
                <p v-if="item.observation" class="text-[11px] text-gray-400 italic mt-0.5">
                  Obs: "{{ item.observation }}"
                </p>
                <span class="font-bold text-xs text-gray-900 mt-1 block">
                  {{ formatCurrency(item.unitPrice * item.quantity) }}
                </span>
              </div>

              <button @click="removeCartItem(index)" class="text-red-500 hover:text-red-700 p-1" title="Remover item">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Tipo de Entrega -->
          <div class="border-t pt-3">
            <label class="block font-semibold text-gray-800 mb-1.5">Tipo de Pedido:</label>
            <div class="grid grid-cols-2 gap-2">
              <button @click="checkoutData.deliveryType = 'delivery'"
                :class="checkoutData.deliveryType === 'delivery' ? 'bg-emerald-500 text-white font-bold' : 'bg-gray-100 text-gray-700'"
                class="py-2.5 rounded-xl text-xs transition-colors">
                🛵 Entrega (Delivery)
              </button>
              <button @click="checkoutData.deliveryType = 'pickup'"
                :class="checkoutData.deliveryType === 'pickup' ? 'bg-emerald-500 text-white font-bold' : 'bg-gray-100 text-gray-700'"
                class="py-2.5 rounded-xl text-xs transition-colors">
                🛍️ Retirada no Balcão
              </button>
            </div>
          </div>

          <!-- Dados do Cliente -->
          <div class="border-t pt-3 space-y-2">
            <div>
              <label class="block font-semibold text-gray-700 mb-1">Seu Nome *</label>
              <input v-model="checkoutData.customerName" type="text" placeholder="Ex: João da Silva"
                class="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            </div>

            <!-- Endereço se for Entrega -->
            <div v-if="checkoutData.deliveryType === 'delivery'" class="space-y-2 pt-1">
              <div class="grid grid-cols-3 gap-2">
                <div class="col-span-2">
                  <label class="block font-semibold text-gray-700 mb-1">Rua / Logradouro *</label>
                  <input v-model="checkoutData.address.street" type="text" placeholder="Ex: Av. Brasil"
                    class="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">Número *</label>
                  <input v-model="checkoutData.address.number" type="text" placeholder="123"
                    class="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">Bairro *</label>
                  <input v-model="checkoutData.address.neighborhood" type="text" placeholder="Centro"
                    class="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">Complemento</label>
                  <input v-model="checkoutData.address.complement" type="text" placeholder="Apto 42"
                    class="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                </div>
              </div>
            </div>

            <!-- Forma de Pagamento -->
            <div class="pt-2">
              <label class="block font-semibold text-gray-700 mb-1">Forma de Pagamento *</label>
              <select v-model="checkoutData.paymentMethod"
                class="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white">
                <option value="Pix">Pix (Chave informada no pedido)</option>
                <option value="Cartão de Crédito">Cartão de Crédito (na entrega)</option>
                <option value="Cartão de Débito">Cartão de Débito (na entrega)</option>
                <option value="Dinheiro">Dinheiro</option>
              </select>

              <div v-if="checkoutData.paymentMethod === 'Dinheiro'" class="mt-2">
                <label class="block font-semibold text-gray-700 mb-1">Precisa de troco para quanto?</label>
                <input v-model.number="checkoutData.changeFor" type="number" placeholder="Ex: 50 ou 100"
                  class="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
              </div>
            </div>
          </div>

          <!-- Resumo Financeiro -->
          <div class="border-t pt-3 space-y-1 text-xs">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>{{ formatCurrency(cartSubtotal) }}</span>
            </div>
            <div v-if="checkoutData.deliveryType === 'delivery'" class="flex justify-between text-gray-600">
              <span>Taxa de Entrega:</span>
              <span>{{ formatCurrency(tenant.deliveryFee || 0) }}</span>
            </div>
            <div class="flex justify-between font-bold text-sm text-gray-900 pt-1 border-t">
              <span>Total a Pagar:</span>
              <span class="text-emerald-600">{{ formatCurrency(cartFinalTotal) }}</span>
            </div>
          </div>
        </div>

        <!-- Botão Disparar no WhatsApp -->
        <div class="p-4 border-t border-gray-100 bg-white">
          <button @click="sendWhatsAppOrder" :disabled="!isCheckoutValid"
            class="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-40 text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm transition-all">
            <span>Enviar Pedido pelo WhatsApp</span>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Phone, MapPin, Clock, X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-vue-next'
import type { Tenant, Product, OptionGroup, Option } from '~/types/tenant'
import { TenantSchema } from '~/types/tenant'

const route = useRoute()
const slug = (route.params.slug as string) || 'hamburgueria-x'

// 1. Carregamento Seguro e Compatível com SSR via import.meta.glob (À Prova de Falhas na Vercel)
const { data: tenant } = await useAsyncData(`tenant-${slug}`, async () => {
  try {
    const files = import.meta.glob('~/data/*.json', { eager: true }) as Record<string, { default: any }>
    const matchedKey = Object.keys(files).find(key => key.endsWith(`/${slug}.json`))

    if (matchedKey && files[matchedKey]) {
      return TenantSchema.parse(files[matchedKey].default)
    }

    // Fallback gracioso caso o slug não exista
    const fallbackKey = Object.keys(files).find(key => key.includes('hamburgueria-x.json')) || Object.keys(files)[0]
    return TenantSchema.parse(files[fallbackKey].default)
  } catch (err) {
    console.error(`Erro ao carregar tenant [${slug}]:`, err)
    throw createError({ statusCode: 404, statusMessage: 'Estabelecimento não encontrado' })
  }
})

// 2. SEO & OpenGraph Dinâmico (Gera Preview Rico no WhatsApp ao Compartilhar o Link)
useSeoMeta({
  title: () => tenant.value ? `${tenant.value.name} — Cardápio Digital & Pedidos` : 'Alaska Local',
  description: () => tenant.value?.description || 'Faça seu pedido online de forma rápida pelo WhatsApp.',
  ogTitle: () => tenant.value?.name,
  ogDescription: () => tenant.value?.description,
  ogImage: () => tenant.value?.banner || tenant.value?.logo,
  ogType: 'website',
  twitterCard: 'summary_large_image'
})

// 3. Estado de Produto Selecionado para Modal
const selectedProduct = ref<Product | null>(null)
const selectedOptions = ref<Map<string, Option[]>>(new Map())
const productObservation = ref('')
const productQuantity = ref(1)

// 4. Estado do Carrinho e Checkout
interface CartItemState {
  product: Product
  quantity: number
  selectedOptions: Option[]
  observation: string
  unitPrice: number
}

const cart = ref<{ items: CartItemState[] }>({ items: [] })
const isCartDrawerOpen = ref(false)

const checkoutData = ref({
  deliveryType: 'delivery' as 'delivery' | 'pickup',
  customerName: '',
  paymentMethod: 'Pix',
  changeFor: null as number | null,
  address: {
    street: '',
    number: '',
    neighborhood: '',
    complement: ''
  }
})

// 5. Computeds de Controle
const isOpen = computed(() => {
  if (!tenant.value?.openingHours) return true
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  const [openH, openM] = tenant.value.openingHours.open.split(':').map(Number)
  const [closeH, closeM] = tenant.value.openingHours.close.split(':').map(Number)

  const openMin = openH * 60 + openM
  const closeMin = closeH * 60 + closeM

  return currentMinutes >= openMin && currentMinutes <= closeMin
})

const totalItemsCount = computed(() => {
  return cart.value.items.reduce((acc, item) => acc + item.quantity, 0)
})

const cartSubtotal = computed(() => {
  return cart.value.items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0)
})

const cartFinalTotal = computed(() => {
  const fee = checkoutData.value.deliveryType === 'delivery' ? (tenant.value?.deliveryFee || 0) : 0
  return cartSubtotal.value + fee
})

const isProductConfigValid = computed(() => {
  if (!selectedProduct.value) return false
  for (const group of selectedProduct.value.optionGroups || []) {
    const selected = selectedOptions.value.get(group.id) || []
    if (group.required && selected.length < (group.min || 1)) {
      return false
    }
  }
  return true
})

const isCheckoutValid = computed(() => {
  if (!checkoutData.value.customerName.trim()) return false
  if (checkoutData.value.deliveryType === 'delivery') {
    return (
      checkoutData.value.address.street.trim() !== '' &&
      checkoutData.value.address.number.trim() !== '' &&
      checkoutData.value.address.neighborhood.trim() !== ''
    )
  }
  return true
})

// 6. Funções de Formatação
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// 7. Manipulação do Modal de Produto
function openProductModal(product: Product) {
  if (!product.available) return
  selectedProduct.value = product
  selectedOptions.value = new Map()
  productObservation.value = ''
  productQuantity.value = 1

  // Pré-selecionar opções obrigatórias simples de 1 escolha
  product.optionGroups?.forEach(group => {
    if (group.required && group.max === 1 && group.options.length > 0) {
      selectedOptions.value.set(group.id, [group.options[0]])
    }
  })
}

function closeProductModal() {
  selectedProduct.value = null
  selectedOptions.value = new Map()
}

function isOptionSelected(groupId: string, optionId: string): boolean {
  const options = selectedOptions.value.get(groupId) || []
  return options.some(o => o.id === optionId)
}

function toggleOption(group: OptionGroup, option: Option) {
  const current = selectedOptions.value.get(group.id) || []
  const exists = current.some(o => o.id === option.id)

  if (group.max === 1) {
    selectedOptions.value.set(group.id, [option])
  } else {
    if (exists) {
      selectedOptions.value.set(group.id, current.filter(o => o.id !== option.id))
    } else if (current.length < group.max) {
      selectedOptions.value.set(group.id, [...current, option])
    }
  }
}

function calculateProductTotal(): number {
  if (!selectedProduct.value) return 0
  let total = selectedProduct.value.price
  selectedOptions.value.forEach(options => {
    options.forEach(opt => {
      total += opt.price
    })
  })
  return total
}

function addToCart() {
  if (!selectedProduct.value || !isProductConfigValid.value) return

  const allSelectedOptions: Option[] = []
  selectedOptions.value.forEach(opts => allSelectedOptions.push(...opts))

  cart.value.items.push({
    product: selectedProduct.value,
    quantity: productQuantity.value,
    selectedOptions: allSelectedOptions,
    observation: productObservation.value.trim(),
    unitPrice: calculateProductTotal()
  })

  closeProductModal()
}

function removeCartItem(index: number) {
  cart.value.items.splice(index, 1)
  if (cart.value.items.length === 0) {
    isCartDrawerOpen.value = false
  }
}

// 8. Disparo Formatado para o WhatsApp
function sendWhatsAppOrder() {
  if (!tenant.value || !isCheckoutValid.value) return

  const lines: string[] = []
  lines.push(`🍔 *NOVO PEDIDO - ${tenant.value.name.toUpperCase()}*`)
  lines.push(`━━━━━━━━━━━━━━━━━━━━━`)

  cart.value.items.forEach((item) => {
    lines.push(`*${item.quantity}x* ${item.product.name} — *${formatCurrency(item.unitPrice * item.quantity)}*`)
    item.selectedOptions.forEach(opt => {
      const priceStr = opt.price > 0 ? ` (+${formatCurrency(opt.price)})` : ''
      lines.push(`   └ _${opt.name}${priceStr}_`)
    })
    if (item.observation) {
      lines.push(`   └ 💬 _Obs: "${item.observation}"_`)
    }
    lines.push('')
  })

  lines.push(`━━━━━━━━━━━━━━━━━━━━━`)
  lines.push(`Subtotal: ${formatCurrency(cartSubtotal.value)}`)

  if (checkoutData.value.deliveryType === 'delivery') {
    lines.push(`Taxa de Entrega: ${formatCurrency(tenant.value.deliveryFee || 0)}`)
    lines.push(`*TOTAL: ${formatCurrency(cartFinalTotal.value)}*`)
    lines.push(`━━━━━━━━━━━━━━━━━━━━━`)
    lines.push(`📍 *DADOS DE ENTREGA:*`)
    lines.push(`• Nome: ${checkoutData.value.customerName}`)
    lines.push(`• Endereço: ${checkoutData.value.address.street}, ${checkoutData.value.address.number}`)
    if (checkoutData.value.address.complement) {
      lines.push(`• Complemento: ${checkoutData.value.address.complement}`)
    }
    lines.push(`• Bairro: ${checkoutData.value.address.neighborhood}`)
  } else {
    lines.push(`*TOTAL (RETIRADA): ${formatCurrency(cartFinalTotal.value)}*`)
    lines.push(`━━━━━━━━━━━━━━━━━━━━━`)
    lines.push(`🛍️ *RETIRADA NO BALCÃO:*`)
    lines.push(`• Nome: ${checkoutData.value.customerName}`)
  }

  lines.push(`━━━━━━━━━━━━━━━━━━━━━`)
  lines.push(`💳 *FORMA DE PAGAMENTO:*`)
  lines.push(`• ${checkoutData.value.paymentMethod}`)
  if (checkoutData.value.paymentMethod === 'Dinheiro' && checkoutData.value.changeFor) {
    lines.push(`• Troco para: ${formatCurrency(checkoutData.value.changeFor)}`)
  }

  const message = lines.join('\n')
  const phone = tenant.value.phoneWhatsApp.replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`

  window.open(whatsappUrl, '_blank')
}
</script>