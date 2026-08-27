<!-- components/CartDrawerModal.vue -->
<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      class="fixed inset-0 z-50 flex justify-end"
    >
      <!-- Overlay Backdrop -->
      <div
        class="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        @click="emit('close')"
        aria-hidden="true"
      ></div>

      <!-- Drawer Content Panel -->
      <div
        class="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden z-10 animate-in slide-in-from-right duration-300"
      >
        <!-- Header do Drawer -->
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div class="flex items-center gap-2">
            <ShoppingCart class="w-5 h-5 text-slate-800" aria-hidden="true" />
            <h2 id="cart-drawer-title" class="font-bold text-base text-slate-900">
              Sua Sacola
            </h2>
            <span
              v-if="items.length > 0"
              class="text-xs px-2 py-0.5 rounded-full font-bold"
              :class="[themeClasses.badgeBg, themeClasses.badgeText]"
            >
              {{ totalItemsCount }} {{ totalItemsCount === 1 ? 'item' : 'itens' }}
            </span>
          </div>

          <button
            @click="emit('close')"
            class="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            aria-label="Fechar sacola"
            title="Fechar sacola"
          >
            <X class="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <!-- Conteúdo Rolável -->
        <div class="flex-1 overflow-y-auto p-4 space-y-6">
          <!-- Lista de Itens do Pedido -->
          <div v-if="items.length > 0" class="space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">
              Itens Selecionados
            </h3>

            <div
              v-for="(item, index) in items"
              :key="index"
              class="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start justify-between gap-3"
            >
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-black text-xs px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                    {{ item.quantity }}x
                  </span>
                  <h4 class="font-bold text-xs text-slate-900 truncate">
                    {{ item.product.name }}
                  </h4>
                </div>

                <!-- Opcionais / Adicionais Escolhidos -->
                <div v-if="getCartItemOptions(item).length > 0" class="mt-1 space-y-0.5 pl-6">
                  <p
                    v-for="opt in getCartItemOptions(item)"
                    :key="opt.id"
                    class="text-[11px] text-slate-500 flex items-center justify-between"
                  >
                    <span>+ {{ opt.name }}</span>
                    <span v-if="opt.price > 0" class="text-slate-400 font-medium">
                      {{ formatCurrency(opt.price) }}
                    </span>
                  </p>
                </div>

                <!-- Observação do Item -->
                <p v-if="getCartItemNotes(item)" class="text-[11px] text-slate-400 italic mt-1 pl-6">
                  "{{ getCartItemNotes(item) }}"
                </p>

                <p class="font-bold text-xs mt-2 pl-6" :class="themeClasses.primaryText">
                  {{ formatCurrency(item.unitPrice * item.quantity) }}
                </p>
              </div>

              <!-- Botão Remover Item -->
              <button
                @click="emit('remove-item', index)"
                class="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                :aria-label="`Remover ${item.product.name} da sacola`"
                title="Remover item"
              >
                <Trash2 class="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <!-- Estado Vazio da Sacola -->
          <div v-else class="text-center py-12 space-y-3">
            <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <ShoppingBag class="w-6 h-6" aria-hidden="true" />
            </div>
            <p class="text-sm font-bold text-slate-700">Sua sacola está vazia</p>
            <p class="text-xs text-slate-400 max-w-xs mx-auto">
              Adicione produtos deliciosos do cardápio para fazer seu pedido pelo WhatsApp.
            </p>
          </div>

          <!-- Formulário de Dados para o Pedido -->
          <div v-if="items.length > 0" class="space-y-4 pt-2 border-t border-slate-100">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">
              Dados para o Pedido
            </h3>

            <!-- 1. Tipo de Entrega (Delivery vs Retirada) -->
            <div class="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl" role="radiogroup" aria-label="Tipo de Entrega">
              <button
                type="button"
                role="radio"
                :aria-checked="form.deliveryType === 'delivery'"
                @click="form.deliveryType = 'delivery'"
                :class="[
                  'py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                  form.deliveryType === 'delivery'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                ]"
              >
                <Truck class="w-3.5 h-3.5" aria-hidden="true" />
                <span>Entrega</span>
              </button>

              <button
                type="button"
                role="radio"
                :aria-checked="form.deliveryType === 'takeaway' || (form.deliveryType as string) === 'pickup'"
                @click="form.deliveryType = 'takeaway'"
                :class="[
                  'py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                  form.deliveryType === 'takeaway' || (form.deliveryType as string) === 'pickup'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                ]"
              >
                <Store class="w-3.5 h-3.5" aria-hidden="true" />
                <span>Retirada</span>
              </button>
            </div>

            <!-- 2. Nome do Cliente -->
            <div class="space-y-1">
              <label for="checkout-name" class="text-xs font-bold text-slate-700">
                Seu Nome *
              </label>
              <input
                id="checkout-name"
                ref="nameInputRef"
                v-model="form.customerName"
                type="text"
                placeholder="Como podemos te chamar?"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none transition-all"
                :class="themeClasses.focusRing"
                required
              />
            </div>

            <!-- 3. Telefone / WhatsApp do Cliente -->
            <div class="space-y-1">
              <label for="checkout-phone" class="text-xs font-bold text-slate-700">
                WhatsApp de Contato (Opcional)
              </label>
              <input
                id="checkout-phone"
                v-model="form.customerPhone"
                type="tel"
                placeholder="(11) 99999-9999"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none transition-all"
                :class="themeClasses.focusRing"
              />
            </div>

            <!-- 4. Endereço Completo com Busca de CEP (Apenas se for Entrega) -->
            <div v-if="form.deliveryType === 'delivery'" class="space-y-2.5 pt-2 border-t border-dashed border-slate-200">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-700 block">Endereço de Entrega *</span>
                <span v-if="isLoadingCep" class="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                  <Loader2 class="w-3 h-3 animate-spin text-slate-600" aria-hidden="true" />
                  <span>Buscando CEP...</span>
                </span>
              </div>

              <!-- Campo de CEP com Busca Automática -->
              <div class="space-y-1">
                <div class="relative flex items-center">
                  <input
                    id="checkout-cep"
                    v-model="formAddress.cep"
                    @input="onCepInput"
                    @blur="onCepBlur"
                    type="text"
                    inputmode="numeric"
                    maxlength="9"
                    placeholder="CEP (ex: 07901-020)"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none transition-all"
                    :class="[themeClasses.focusRing, cepError ? 'border-red-400 bg-red-50/40' : '']"
                  />
                  <div v-if="isLoadingCep" class="absolute right-3 text-slate-400 pointer-events-none">
                    <Loader2 class="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  </div>
                  <div v-else-if="formAddress.street && !cepError" class="absolute right-3 text-emerald-600 pointer-events-none">
                    <Check class="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                </div>
                <p v-if="cepError" class="text-[11px] text-red-500 font-medium pl-1">
                  {{ cepError }}
                </p>
              </div>

              <!-- Rua e Número -->
              <div class="grid grid-cols-3 gap-2">
                <div class="col-span-2 space-y-1">
                  <input
                    id="checkout-street"
                    v-model="formAddress.street"
                    type="text"
                    placeholder="Rua / Avenida *"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none transition-all"
                    :class="themeClasses.focusRing"
                    required
                  />
                </div>
                <div class="space-y-1">
                  <input
                    id="checkout-number"
                    ref="numberInputRef"
                    v-model="formAddress.number"
                    type="text"
                    placeholder="Nº *"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none transition-all"
                    :class="themeClasses.focusRing"
                    required
                  />
                </div>
              </div>

              <!-- Bairro e Complemento -->
              <div class="grid grid-cols-2 gap-2">
                <input
                  id="checkout-neighborhood"
                  v-model="formAddress.neighborhood"
                  type="text"
                  placeholder="Bairro *"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none transition-all"
                  :class="themeClasses.focusRing"
                  required
                />
                <input
                  id="checkout-complement"
                  v-model="formAddress.complement"
                  type="text"
                  placeholder="Complemento (Apto, Bloco)"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none transition-all"
                  :class="themeClasses.focusRing"
                />
              </div>
            </div>

            <!-- 5. Forma de Pagamento -->
            <div class="space-y-1 pt-2 border-t border-dashed border-slate-200">
              <label for="checkout-payment" class="text-xs font-bold text-slate-700">
                Forma de Pagamento
              </label>
              <select
                id="checkout-payment"
                v-model="form.paymentMethod"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none transition-all cursor-pointer"
                :class="themeClasses.focusRing"
              >
                <option value="Pix">⚡ Pix (Chave / QR Code no WhatsApp)</option>
                <option value="Cartão de Crédito">💳 Cartão de Crédito (na entrega)</option>
                <option value="Cartão de Débito">💳 Cartão de Débito (na entrega)</option>
                <option value="Dinheiro">💵 Dinheiro</option>
              </select>
            </div>

            <!-- Troco para Dinheiro -->
            <div v-if="form.paymentMethod === 'Dinheiro'" class="space-y-1">
              <label for="checkout-change" class="text-xs font-bold text-slate-700">
                Troco para quanto? (Opcional)
              </label>
              <input
                id="checkout-change"
                v-model.number="form.changeFor"
                type="number"
                placeholder="Ex: 50 ou 100"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none transition-all"
                :class="themeClasses.focusRing"
              />
            </div>

            <!-- 6. Observações Gerais do Pedido -->
            <div class="space-y-1">
              <label for="checkout-notes" class="text-xs font-bold text-slate-700">
                Observações para a Cozinha / Entrega
              </label>
              <textarea
                id="checkout-notes"
                v-model="form.notes"
                rows="2"
                placeholder="Ex: Tocar o interfone, deixar na portaria..."
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none transition-all resize-none"
                :class="themeClasses.focusRing"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Footer com Valores e Botão de Enviar WhatsApp -->
        <div v-if="items.length > 0" class="p-4 border-t border-slate-100 bg-slate-50/80 space-y-3 shrink-0">
          <div class="space-y-1.5 text-xs text-slate-600">
            <div class="flex justify-between">
              <span>Subtotal dos itens</span>
              <span class="font-bold text-slate-900">{{ formatCurrency(subtotal) }}</span>
            </div>

            <div v-if="form.deliveryType === 'delivery'" class="flex justify-between">
              <span>Taxa de entrega</span>
              <span class="font-bold text-slate-900">
                {{ deliveryFee > 0 ? formatCurrency(deliveryFee) : 'Grátis' }}
              </span>
            </div>

            <div class="flex justify-between text-sm font-black pt-1.5 border-t border-slate-200 text-slate-900">
              <span>Total do Pedido</span>
              <span :class="themeClasses.primaryText">{{ formatCurrency(orderTotal) }}</span>
            </div>
          </div>

          <!-- Botão de Despacho para o WhatsApp -->
          <button
            @click="sendOrderViaWhatsApp"
            :disabled="!isFormValid"
            class="w-full py-3.5 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
            :class="themeClasses.buttonPrimary"
            aria-label="Finalizar e enviar pedido formatado para o WhatsApp"
          >
            <Send class="w-4 h-4" aria-hidden="true" />
            <span>Enviar Pedido pelo WhatsApp ({{ formatCurrency(orderTotal) }})</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { ShoppingCart, X, Trash2, ShoppingBag, Truck, Store, Send, Loader2, Check } from 'lucide-vue-next'
import { useTenantTheme } from '~/composables/useTenantTheme'
import { useBodyScrollLock } from '~/composables/useBodyScrollLock'
import { useCep } from '~/composables/useCep'
import { formatCurrency, formatCep, sanitizeDigits } from '~/utils/formatters'
import { generateWhatsAppOrderUrl } from '~/utils/whatsapp'
import type { Tenant, CartItem, CheckoutFormData } from '~/types'

const props = defineProps<{
  isOpen: boolean
  tenant?: Tenant
  items: CartItem[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'remove-item', index: number): void
  (e: 'clear-cart'): void
}>()

// 1. Tema Visual Dinâmico
const { themeClasses } = useTenantTheme(computed(() => props.tenant))

// 2. Trava de Rolagem Acessível no Body
const isModalOpen = computed(() => props.isOpen)
useBodyScrollLock(isModalOpen)

// 3. Foco Automático no Primeiro Campo e Referência do Número
const nameInputRef = ref<HTMLInputElement | null>(null)
const numberInputRef = ref<HTMLInputElement | null>(null)

watch(
  () => props.isOpen,
  async (open) => {
    if (open) {
      await nextTick()
      nameInputRef.value?.focus()
    }
  }
)

// 4. Fechamento via Tecla ESC
if (import.meta.client) {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && props.isOpen) {
      emit('close')
    }
  })
}

// 5. Estado do Formulário com Persistência dos Dados do Cliente via LocalStorage
const form = useLocalStorage<CheckoutFormData>('alaska_checkout_profile', {
  customerName: '',
  customerPhone: '',
  deliveryType: 'delivery',
  paymentMethod: 'Pix',
  changeFor: null,
  notes: '',
  address: {
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    complement: ''
  }
}, {
  mergeDefaults: true
})

// Garantia defensiva de inicialização de address para perfis pré-existentes no localStorage
const formAddress = computed(() => {
  if (!form.value.address) {
    form.value.address = {
      cep: '',
      street: '',
      number: '',
      neighborhood: '',
      complement: ''
    }
  }
  return form.value.address
})

// Helpers para compatibilidade total entre itens do carrinho (options vs selectedOptions, notes vs observation)
function getCartItemOptions(item: any): any[] {
  return item.options || item.selectedOptions || []
}

function getCartItemNotes(item: any): string {
  return item.notes || item.observation || ''
}

// 6. Consulta Automática de CEP (ViaCEP)
const { isLoadingCep, cepError, lookupCep } = useCep()

async function triggerCepSearch(rawCep?: string) {
  if (!rawCep) return
  const clean = sanitizeDigits(rawCep)
  if (clean.length === 8) {
    const address = await lookupCep(clean)
    if (address) {
      formAddress.value.street = address.street
      formAddress.value.neighborhood = address.neighborhood
      formAddress.value.city = address.city
      formAddress.value.state = address.state
      formAddress.value.cep = address.cep

      // Micro-UX: Move o cursor automaticamente para o campo de número da residência
      await nextTick()
      numberInputRef.value?.focus()
    }
  }
}

function onCepInput(e: Event) {
  const target = e.target as HTMLInputElement
  const formatted = formatCep(target.value)
  formAddress.value.cep = formatted

  const clean = sanitizeDigits(formatted)
  if (clean.length === 8) {
    triggerCepSearch(clean)
  }
}

function onCepBlur() {
  if (formAddress.value.cep) {
    triggerCepSearch(formAddress.value.cep)
  }
}

// 7. Cálculos de Totais
const totalItemsCount = computed(() => {
  return props.items.reduce((acc, item) => acc + item.quantity, 0)
})

const subtotal = computed(() => {
  return props.items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)
})

const deliveryFee = computed(() => {
  if (form.value.deliveryType === 'takeaway' || (form.value.deliveryType as string) === 'pickup') return 0
  return props.tenant?.deliveryFee || 0
})

const orderTotal = computed(() => {
  return subtotal.value + deliveryFee.value
})

// 8. Validação do Formulário
const isFormValid = computed(() => {
  if (!form.value.customerName?.trim()) return false
  if (props.items.length === 0) return false

  if (form.value.deliveryType === 'delivery') {
    if (!formAddress.value.street?.trim()) return false
    if (!formAddress.value.number?.trim()) return false
    if (!formAddress.value.neighborhood?.trim()) return false
  }

  return true
})

// 9. Despacho para o WhatsApp
function sendOrderViaWhatsApp() {
  if (!isFormValid.value || !props.tenant) return

  const url = generateWhatsAppOrderUrl({
    tenant: props.tenant,
    items: props.items,
    formData: form.value
  })

  emit('clear-cart')
  emit('close')

  if (import.meta.client) {
    window.open(url, '_blank')
  }
}
</script>
