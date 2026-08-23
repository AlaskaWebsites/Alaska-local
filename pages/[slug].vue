<!-- pages/[slug].vue -->
<template>
  <div v-if="tenant" class="min-h-screen bg-slate-50 pb-32">
    <!-- Header com Banner Full e Conteúdo Centralizado -->
    <header class="relative bg-white border-b border-slate-100 shadow-xs">
      <!-- Banner Full Width -->
      <div class="h-44 md:h-52 w-full overflow-hidden bg-slate-900">
        <img v-if="tenant.banner" :src="tenant.banner" :alt="tenant.name"
          class="w-full h-full object-cover opacity-90" />
        <div v-else class="w-full h-full bg-gradient-to-r from-slate-800 to-slate-900"></div>
      </div>

      <!-- Container Centralizado (Alinhado com o Catálogo no Desktop e Mobile) -->
      <div class="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">

          <!-- Bloco Esquerdo: Logo + Informações -->
          <div class="flex items-start gap-4">
            <!-- Logo com Moldura -->
            <div
              class="relative -mt-10 md:-mt-12 shrink-0 z-10 w-20 h-20 md:w-24 md:h-24 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-white">
              <img v-if="tenant.logo" :src="tenant.logo" :alt="tenant.name" class="w-full h-full object-cover" />
              <div v-else
                class="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl">
                {{ tenant.name.charAt(0) }}
              </div>
            </div>

            <!-- Título, Status, Descrição e Detalhes -->
            <div class="flex-1 min-w-0 pt-1.5 space-y-1.5">
              <div class="flex flex-wrap items-center gap-2.5">
                <h1 class="font-extrabold text-xl sm:text-2xl text-slate-900 leading-tight">{{ tenant.name }}</h1>
                <span
                  :class="isOpen ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border shrink-0">
                  {{ isOpen ? '🟢 Aberto' : '🕒 Fechado' }}
                </span>
              </div>

              <p v-if="tenant.description"
                class="text-xs sm:text-sm text-slate-500 line-clamp-2 max-w-2xl leading-relaxed">
                {{ tenant.description }}
              </p>

              <!-- Metadados Agrupados (Horário, Mínimo e Endereço juntos) -->
              <div class="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-slate-500 pt-0.5">
                <div v-if="tenant.openingHours" class="flex items-center gap-1.5">
                  <Clock class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{{ tenant.openingHours.open }} - {{ tenant.openingHours.close }}</span>
                </div>
                <div v-if="tenant.minOrderValue" class="flex items-center gap-1.5">
                  <span class="text-slate-300">•</span>
                  <span>Mín: {{ formatCurrency(tenant.minOrderValue) }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="text-slate-300">•</span>
                  <MapPin class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span class="truncate max-w-xs sm:max-w-md">{{ tenant.address || 'Atendimento Local' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Bloco Direito: Botão Falar no WhatsApp -->
          <div class="shrink-0 flex items-center md:self-center pt-2 md:pt-0">
            <a :href="`https://wa.me/55${tenant.phoneWhatsApp.replace(/\D/g, '')}`" target="_blank"
              class="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors border border-emerald-200/80 shadow-2xs">
              <Phone class="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>

        </div>
      </div>
    </header>

    <!-- Barra Fixa de Categorias com Navegação Rápida (Centralizada) -->
    <CategoryTabs :categories="tenant.categories" />

    <!-- Catálogo de Produtos (Centralizado em 2 Colunas no Desktop) -->
    <main class="max-w-5xl mx-auto px-4 sm:px-6 mt-6 space-y-8">
      <section v-for="category in tenant.categories" :key="category.id" :id="category.id"
        class="space-y-3 scroll-mt-20">
        <div class="flex items-center gap-2">
          <span class="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
          <h2 class="text-base font-bold text-slate-900 tracking-tight">{{ category.name }}</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div v-for="product in category.products" :key="product.id" @click="openProductModal(product)"
            class="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center justify-between gap-3.5 active:scale-[0.99] transition-transform cursor-pointer hover:border-slate-200 hover:shadow-sm">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-slate-900 text-sm truncate">{{ product.name }}</h3>
                <span v-if="!product.available"
                  class="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-bold shrink-0">
                  Esgotado
                </span>
              </div>
              <p class="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{{ product.description }}</p>

              <div class="flex items-center gap-2 mt-2.5">
                <span class="font-extrabold text-sm text-slate-900">
                  {{ formatCurrency(product.price) }}
                </span>
                <span v-if="product.optionGroups?.length"
                  class="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  Montar
                </span>
              </div>
            </div>

            <img v-if="product.image" :src="product.image" :alt="product.name"
              class="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-100" />
          </div>
        </div>
      </section>
    </main>

    <!-- Modal de Customização do Produto (Full Screen no Mobile, Pop-up no Desktop) -->
    <div v-if="selectedProduct"
      class="fixed inset-0 z-50 bg-white sm:bg-slate-900/60 sm:backdrop-blur-xs flex flex-col sm:items-center sm:justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      @click="closeProductModal">
      <div
        class="bg-white w-full h-full sm:h-auto sm:max-h-[85vh] sm:max-w-lg flex flex-col overflow-hidden sm:rounded-2xl sm:shadow-floating"
        @click.stop>
        <!-- Header Modal -->
        <div class="relative h-56 sm:h-48 w-full bg-slate-100 shrink-0">
          <img v-if="selectedProduct.image" :src="selectedProduct.image" :alt="selectedProduct.name"
            class="w-full h-full object-cover" />
          <button @click="closeProductModal"
            class="absolute top-4 right-4 bg-slate-900/60 hover:bg-slate-900/80 text-white p-2 rounded-full transition-colors backdrop-blur-xs z-10 shadow-md"
            aria-label="Fechar">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Conteúdo Rolável -->
        <div class="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          <div>
            <h3 class="text-xl font-bold text-slate-900 leading-tight">{{ selectedProduct.name }}</h3>
            <p class="text-xs text-slate-500 mt-1.5 leading-relaxed">{{ selectedProduct.description }}</p>
            <span class="text-lg font-extrabold text-slate-900 mt-2 block">
              {{ formatCurrency(selectedProduct.price) }}
            </span>
          </div>

          <!-- Grupos de Opcionais -->
          <div v-for="group in selectedProduct.optionGroups" :key="group.id"
            class="border-t border-slate-100 pt-4 space-y-2.5">
            <div class="flex items-center justify-between">
              <h4 class="font-bold text-xs text-slate-900">
                {{ group.title }}
                <span v-if="group.required" class="text-red-500 font-bold">*</span>
              </h4>
              <span class="text-[11px] text-slate-400 font-medium">
                {{ group.max === 1 ? 'Escolha 1' : `Até ${group.max}` }}
              </span>
            </div>

            <div class="space-y-2">
              <label v-for="option in group.options" :key="option.id"
                class="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                :class="isOptionSelected(group.id, option.id) ? 'border-emerald-500 bg-emerald-50/40' : ''">
                <div class="flex items-center gap-2.5">
                  <input :type="group.max === 1 ? 'radio' : 'checkbox'" :name="group.id"
                    :checked="isOptionSelected(group.id, option.id)" @change="toggleOption(group, option)"
                    class="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
                  <span class="text-xs font-medium text-slate-800">{{ option.name }}</span>
                </div>
                <span v-if="option.price > 0" class="text-xs font-bold text-slate-700">
                  + {{ formatCurrency(option.price) }}
                </span>
              </label>
            </div>
          </div>

          <!-- Observação -->
          <div class="border-t border-slate-100 pt-4">
            <label class="block text-xs font-bold text-slate-700 mb-1.5">Alguma observação?</label>
            <textarea v-model="productObservation" rows="2"
              placeholder="Ex: Ponto da carne bem passado, tirar a cebola, etc."
              class="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"></textarea>
          </div>
        </div>

        <!-- Footer Modal -->
        <div class="p-4 pb-6 sm:pb-4 border-t border-slate-100 bg-white flex items-center gap-3 shrink-0 shadow-lg">
          <div class="flex items-center border border-slate-200 rounded-xl p-1 shrink-0 bg-slate-50">
            <button @click="productQuantity > 1 ? productQuantity-- : null"
              class="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 active:scale-95 transition-transform"
              :disabled="productQuantity <= 1">
              <Minus class="w-4 h-4" />
            </button>
            <span class="w-8 text-center font-bold text-sm text-slate-900">{{ productQuantity }}</span>
            <button @click="productQuantity++"
              class="p-1.5 text-slate-600 hover:text-slate-900 active:scale-95 transition-transform">
              <Plus class="w-4 h-4" />
            </button>
          </div>

          <button @click="addToCart" :disabled="!isProductConfigValid"
            class="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-40 text-white py-3.5 px-4 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-between">
            <span>Adicionar</span>
            <span class="font-extrabold text-sm">{{ formatCurrency(calculateProductTotal() * productQuantity) }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Barra Fixa Inferior com Resumo da Sacola -->
    <div v-if="cart.items.length > 0"
      class="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-floating z-40">
      <div class="max-w-5xl mx-auto flex items-center justify-between">
        <div>
          <span class="text-xs text-slate-500 block">
            {{ totalItemsCount }} {{ totalItemsCount === 1 ? 'item' : 'itens' }}
          </span>
          <span class="text-lg font-extrabold text-slate-900">{{ formatCurrency(cartSubtotal) }}</span>
        </div>
        <button @click="isCartDrawerOpen = true"
          class="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all text-xs">
          <ShoppingCart class="w-4 h-4" />
          <span>Ver Sacola</span>
        </button>
      </div>
    </div>

    <!-- Drawer de Finalização do Carrinho -->
    <div v-if="isCartDrawerOpen"
      class="fixed inset-0 z-50 bg-white sm:bg-slate-900/60 sm:backdrop-blur-xs flex flex-col sm:items-center sm:justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      @click="isCartDrawerOpen = false">
      <div
        class="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-lg flex flex-col overflow-hidden sm:rounded-2xl sm:shadow-floating"
        @click.stop>
        <div class="p-4 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <ShoppingCart class="w-5 h-5 text-emerald-600" />
            <h3 class="font-bold text-base text-slate-900">Sua Sacola</h3>
          </div>
          <button @click="isCartDrawerOpen = false" class="text-slate-400 hover:text-slate-600">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
          <!-- Itens -->
          <div class="space-y-2.5">
            <div v-for="(item, index) in cart.items" :key="index"
              class="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-2">
              <div class="flex-1">
                <div class="flex items-center gap-1.5">
                  <span class="font-bold text-emerald-700">{{ item.quantity }}x</span>
                  <span class="font-bold text-slate-900">{{ item.product.name }}</span>
                </div>
                <div v-if="item.selectedOptions.length" class="text-[11px] text-slate-500 mt-0.5 space-y-0.5">
                  <p v-for="opt in item.selectedOptions" :key="opt.id">
                    + {{ opt.name }} {{ opt.price > 0 ? `(${formatCurrency(opt.price)})` : '' }}
                  </p>
                </div>
                <p v-if="item.observation" class="text-[11px] text-slate-400 italic mt-0.5">
                  Obs: "{{ item.observation }}"
                </p>
                <span class="font-bold text-xs text-slate-900 mt-1 block">
                  {{ formatCurrency(item.unitPrice * item.quantity) }}
                </span>
              </div>

              <button @click="removeCartItem(index)" class="text-red-500 hover:text-red-700 p-1" title="Remover item">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Tipo de Pedido -->
          <div class="border-t border-slate-100 pt-3">
            <label class="block font-bold text-slate-800 mb-1.5">Tipo de Pedido:</label>
            <div class="grid grid-cols-2 gap-2">
              <button @click="checkoutData.deliveryType = 'delivery'"
                :class="checkoutData.deliveryType === 'delivery' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 text-slate-700 font-medium'"
                class="py-2.5 rounded-xl transition-colors">
                🛵 Entrega (Delivery)
              </button>
              <button @click="checkoutData.deliveryType = 'pickup'"
                :class="checkoutData.deliveryType === 'pickup' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 text-slate-700 font-medium'"
                class="py-2.5 rounded-xl transition-colors">
                🛍️ Retirada no Balcão
              </button>
            </div>
          </div>

          <!-- Dados do Cliente -->
          <div class="border-t border-slate-100 pt-3 space-y-2.5">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Seu Nome *</label>
              <input v-model="checkoutData.customerName" type="text" placeholder="Ex: João da Silva"
                class="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            </div>

            <div v-if="checkoutData.deliveryType === 'delivery'" class="space-y-2">
              <div class="grid grid-cols-3 gap-2">
                <div class="col-span-2">
                  <label class="block font-bold text-slate-700 mb-1">Rua / Logradouro *</label>
                  <input v-model="checkoutData.address.street" type="text" placeholder="Ex: Av. Brasil"
                    class="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Número *</label>
                  <input v-model="checkoutData.address.number" type="text" placeholder="123"
                    class="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Bairro *</label>
                  <input v-model="checkoutData.address.neighborhood" type="text" placeholder="Centro"
                    class="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Complemento</label>
                  <input v-model="checkoutData.address.complement" type="text" placeholder="Apto 42"
                    class="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                </div>
              </div>
            </div>

            <!-- Pagamento -->
            <div class="pt-1">
              <label class="block font-bold text-slate-700 mb-1">Forma de Pagamento *</label>
              <select v-model="checkoutData.paymentMethod"
                class="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium">
                <option value="Pix">Pix (Chave informada no pedido)</option>
                <option value="Cartão de Crédito">Cartão de Crédito (na entrega)</option>
                <option value="Cartão de Débito">Cartão de Débito (na entrega)</option>
                <option value="Dinheiro">Dinheiro</option>
              </select>

              <div v-if="checkoutData.paymentMethod === 'Dinheiro'" class="mt-2">
                <label class="block font-bold text-slate-700 mb-1">Precisa de troco para quanto?</label>
                <input v-model.number="checkoutData.changeFor" type="number" placeholder="Ex: 50 ou 100"
                  class="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
              </div>
            </div>
          </div>

          <!-- Totalização -->
          <div class="border-t border-slate-100 pt-3 space-y-1 text-xs">
            <div class="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>{{ formatCurrency(cartSubtotal) }}</span>
            </div>
            <div v-if="checkoutData.deliveryType === 'delivery'" class="flex justify-between text-slate-600">
              <span>Taxa de Entrega:</span>
              <span>{{ formatCurrency(tenant.deliveryFee || 0) }}</span>
            </div>
            <div class="flex justify-between font-extrabold text-sm text-slate-900 pt-1.5 border-t border-slate-100">
              <span>Total:</span>
              <span class="text-emerald-600">{{ formatCurrency(cartFinalTotal) }}</span>
            </div>
          </div>
        </div>

        <!-- Botão WhatsApp -->
        <div class="p-4 pb-6 sm:pb-4 border-t border-slate-100 bg-white">
          <button @click="sendWhatsAppOrder" :disabled="!isCheckoutValid"
            class="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-40 text-white font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 text-xs transition-all">
            <span>Enviar Pedido pelo WhatsApp</span>
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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

// 1. Carregamento Seguro e Compatível com SSR
const { data: tenant } = await useAsyncData(`tenant-${slug}`, async () => {
  try {
    const files = import.meta.glob('~/data/*.json', { eager: true }) as Record<string, { default: any }>
    const fileKeys = Object.keys(files)

    const matchedKey = fileKeys.find(key => key.endsWith(`/${slug}.json`))
    if (matchedKey && files[matchedKey]) {
      return TenantSchema.parse(files[matchedKey].default)
    }

    const fallbackKey = fileKeys.find(key => key.includes('hamburgueria-x.json')) || fileKeys[0]
    if (fallbackKey && files[fallbackKey]) {
      return TenantSchema.parse(files[fallbackKey].default)
    }

    throw new Error('Nenhum arquivo de demonstração encontrado.')
  } catch (err) {
    console.error(`Erro ao carregar tenant [${slug}]:`, err)
    throw createError({ statusCode: 404, statusMessage: 'Estabelecimento não encontrado' })
  }
})

// 2. SEO & OpenGraph Dinâmico
useSeoMeta({
  title: () => tenant.value ? `${tenant.value.name} — Cardápio Digital & Pedidos` : 'Alaska Local',
  description: () => tenant.value?.description || 'Faça seu pedido online de forma rápida pelo WhatsApp.',
  ogTitle: () => tenant.value?.name,
  ogDescription: () => tenant.value?.description,
  ogImage: () => tenant.value?.banner || tenant.value?.logo,
  ogType: 'website',
  twitterCard: 'summary_large_image'
})

// 3. Estado de Produto Selecionado
const selectedProduct = ref<Product | null>(null)
const selectedOptions = ref<Map<string, Option[]>>(new Map())
const productObservation = ref('')
const productQuantity = ref(1)

// 4. Estado do Carrinho
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

// 5. Computeds
function parseTimeToMinutes(timeStr?: string): number {
  if (!timeStr) return 0
  const [hStr, mStr] = timeStr.split(':')
  const hours = parseInt(hStr || '0', 10)
  const minutes = parseInt(mStr || '0', 10)
  return hours * 60 + minutes
}

const isOpen = computed(() => {
  const hours = tenant.value?.openingHours
  if (!hours?.open || !hours?.close) return true

  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  const openMin = parseTimeToMinutes(hours.open)
  const closeMin = parseTimeToMinutes(hours.close)

  if (closeMin >= openMin) {
    return currentMinutes >= openMin && currentMinutes <= closeMin
  }

  return currentMinutes >= openMin || currentMinutes <= closeMin
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

// 6. Formatação
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// 7. Modal
function openProductModal(product: Product) {
  if (!product.available) return
  selectedProduct.value = product
  selectedOptions.value = new Map()
  productObservation.value = ''
  productQuantity.value = 1

  product.optionGroups?.forEach(group => {
    const firstOption = group.options[0]
    if (group.required && group.max === 1 && firstOption) {
      selectedOptions.value.set(group.id, [firstOption])
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

// 8. Despacho WhatsApp
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