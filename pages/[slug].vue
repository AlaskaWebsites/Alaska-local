<!-- pages/[slug].vue -->
<template>
  <div v-if="tenant"
    class="min-h-screen bg-slate-950 text-slate-100 pb-36 selection:bg-emerald-500 selection:text-slate-950">
    <!-- 1. Banner de Fundo -->
    <div class="relative h-48 sm:h-64 w-full overflow-hidden bg-slate-900">
      <img v-if="tenant.banner" :src="tenant.banner" :alt="`Banner de ${tenant.name}`"
        class="w-full h-full object-cover opacity-75" />
      <div v-else class="w-full h-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"></div>

      <!-- Botão Voltar para a Home -->
      <NuxtLink to="/"
        class="absolute top-4 left-4 bg-slate-950/70 hover:bg-slate-900 text-white p-2.5 rounded-full backdrop-blur-md border border-slate-700/60 transition-all z-10 shadow-lg cursor-pointer"
        aria-label="Voltar para a página inicial com todas as lojas" title="Voltar ao início">
        <ArrowLeft class="w-5 h-5" aria-hidden="true" />
      </NuxtLink>
    </div>

    <!-- 2. Card Flutuante de Identidade do Restaurante -->
    <header class="max-w-4xl mx-auto px-4 -mt-16 relative z-20">
      <div
        class="bg-slate-900/95 backdrop-blur-md rounded-3xl p-5 shadow-2xl border border-slate-800 text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <!-- Logo Circular -->
        <div
          class="relative -mt-14 sm:-mt-10 shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-slate-800 shadow-xl overflow-hidden bg-slate-950">
          <img v-if="tenant.logo" :src="tenant.logo" :alt="`Logotipo de ${tenant.name}`"
            class="w-full h-full object-cover" />
          <div v-else
            class="w-full h-full bg-slate-800 flex items-center justify-center text-emerald-400 font-bold text-xl"
            aria-hidden="true">
            {{ tenant.name.charAt(0) }}
          </div>
        </div>

        <!-- Dados do Estabelecimento -->
        <div class="flex-1 min-w-0 space-y-2.5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 class="font-extrabold text-xl sm:text-2xl text-white leading-tight">
                {{ tenant.name }}
              </h1>
              <p v-if="tenant.description" class="text-xs sm:text-sm text-slate-400 line-clamp-1 mt-0.5">
                {{ tenant.description }}
              </p>
            </div>

            <!-- Status Aberto/Fechado -->
            <span role="status"
              :class="isOpen ? 'bg-emerald-950/90 text-emerald-300 border-emerald-800/60' : 'bg-amber-950/90 text-amber-300 border-amber-800/60'"
              class="inline-flex items-center self-center sm:self-auto px-3 py-1 rounded-full text-xs font-bold border shrink-0 backdrop-blur-xs">
              {{ isOpen ? '🟢 Aberto agora' : '🕒 Fechado' }}
            </span>
          </div>

          <!-- Linha de Metadados -->
          <div
            class="flex flex-wrap items-center justify-center sm:justify-start gap-y-2 gap-x-3 text-xs text-slate-400 pt-1">
            <!-- Selo de Avaliações -->
            <button v-if="tenant.reviews" @click="isReviewsOpen = true" aria-haspopup="dialog"
              :aria-expanded="isReviewsOpen"
              :aria-label="`Abrir avaliações da loja. Nota média ${tenant.reviews.score.toFixed(1)} baseada em ${tenant.reviews.totalReviews} avaliações`"
              class="flex items-center gap-1 font-bold text-slate-200 bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 active:scale-95 px-2.5 py-1 rounded-lg cursor-pointer transition-all shadow-xs"
              title="Ver detalhes das avaliações">
              <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
              <span>{{ tenant.reviews.score.toFixed(1) }}</span>
              <span class="text-slate-400 font-medium">({{ tenant.reviews.totalReviews }})</span>
              <ChevronRight class="w-3 h-3 text-slate-500 ml-0.5" aria-hidden="true" />
            </button>

            <!-- Selo de Informações -->
            <button @click="isInfoOpen = true" aria-haspopup="dialog" :aria-expanded="isInfoOpen"
              aria-label="Abrir informações operacionais, horários e formas de pagamento da loja"
              class="flex items-center gap-1 font-medium text-slate-300 bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 active:scale-95 px-2.5 py-1 rounded-lg cursor-pointer transition-all shadow-xs"
              title="Ver informações da loja">
              <Info class="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span>Informações</span>
              <ChevronRight class="w-3 h-3 text-slate-500 ml-0.5" aria-hidden="true" />
            </button>

            <div class="flex items-center gap-1">
              <span>🛵 Entrega • 30-45 min</span>
            </div>

            <div class="flex items-center gap-1">
              <span class="text-slate-600" aria-hidden="true">•</span>
              <span>Taxa: {{ tenant.deliveryFee ? formatCurrency(tenant.deliveryFee) : 'Grátis' }}</span>
            </div>

            <div v-if="tenant.minOrderValue" class="flex items-center gap-1">
              <span class="text-slate-600" aria-hidden="true">•</span>
              <span>Mín: {{ formatCurrency(tenant.minOrderValue) }}</span>
            </div>
          </div>

          <!-- Endereço e WhatsApp -->
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 border-t border-slate-800 text-xs">
            <div class="flex items-center justify-center sm:justify-start gap-1.5 text-slate-400 truncate">
              <MapPin class="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
              <span class="truncate">{{ tenant.address || 'Atendimento e entrega local' }}</span>
            </div>

            <a :href="`https://wa.me/55${tenant.phoneWhatsApp.replace(/\D/g, '')}`" target="_blank"
              aria-label="Abrir conversa no WhatsApp com o estabelecimento para tirar dúvidas"
              class="inline-flex items-center justify-center gap-1.5 text-emerald-400 font-bold hover:underline">
              <Phone class="w-3.5 h-3.5" aria-hidden="true" />
              <span>Dúvidas no WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </header>

    <!-- 3. Banner de Vantagem / Promoção -->
    <div class="max-w-4xl mx-auto px-4 mt-5">
      <div
        class="bg-gradient-to-r from-emerald-950/70 via-teal-950/50 to-emerald-950/70 border border-emerald-500/30 rounded-2xl p-3.5 flex items-center justify-between text-xs text-emerald-300 font-medium shadow-sm">
        <div class="flex items-center gap-2.5">
          <span class="text-base" aria-hidden="true">🛵</span>
          <span>Peça pelo canal oficial com <strong>preço original de balcão</strong> e sem taxas extras!</span>
        </div>
        <span class="text-emerald-400 font-bold shrink-0 text-[11px] hidden sm:inline" aria-hidden="true">Aproveite
          ›</span>
      </div>
    </div>

    <!-- 4. Seção Destaques & Mais Pedidos -->
    <section v-if="featuredProducts.length > 0" class="max-w-4xl mx-auto px-4 mt-8 space-y-3.5"
      aria-labelledby="featured-title">
      <div class="flex items-center justify-between">
        <h2 id="featured-title" class="text-base font-bold text-white flex items-center gap-2">
          <Flame class="w-4 h-4 text-amber-500 fill-amber-500" aria-hidden="true" />
          <span>Destaques & Mais Pedidos</span>
        </h2>

        <!-- Controles de Navegação Desktop -->
        <div class="flex items-center gap-1.5">
          <span class="text-xs text-slate-500 font-medium sm:hidden">Deslize para o lado ›</span>

          <div class="hidden sm:flex items-center gap-1.5">
            <button @click="scrollCarousel('left')"
              class="p-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 shadow-sm active:scale-95 transition-all cursor-pointer"
              title="Anterior" aria-label="Rolar carrossel de destaques para a esquerda">
              <ChevronLeft class="w-4 h-4" aria-hidden="true" />
            </button>
            <button @click="scrollCarousel('right')"
              class="p-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 shadow-sm active:scale-95 transition-all cursor-pointer"
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
          class="shrink-0 w-40 sm:w-48 bg-slate-900 rounded-2xl p-3 border border-slate-800/90 shadow-md active:scale-[0.98] transition-all cursor-pointer hover:border-emerald-500/40 hover:bg-slate-850 flex flex-col justify-between group"
          :aria-label="`${product.name}, por ${formatCurrency(product.price)}`">
          <div class="relative w-full h-32 sm:h-36 rounded-xl overflow-hidden bg-slate-800 mb-2.5">
            <img v-if="product.image" :src="product.image" :alt="product.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100" />
            <span
              class="absolute top-1.5 left-1.5 bg-amber-500 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shadow-sm">
              Mais pedido
            </span>
          </div>

          <div class="space-y-1">
            <span class="font-extrabold text-sm text-emerald-400 block">
              {{ formatCurrency(product.price) }}
            </span>
            <h3 class="font-bold text-xs text-white line-clamp-2 leading-tight">
              {{ product.name }}
            </h3>
          </div>
        </article>
      </div>
    </section>

    <!-- 5. Barra Fixa de Categorias -->
    <CategoryTabs :categories="tenant.categories" class="mt-8" />

    <!-- 6. Catálogo Completo de Produtos -->
    <main class="max-w-4xl mx-auto px-4 mt-8 space-y-10" aria-label="Catálogo de produtos">
      <section v-for="category in tenant.categories" :key="category.id" :id="category.id" class="space-y-4 scroll-mt-24"
        :aria-labelledby="`cat-title-${category.id}`">
        <div class="flex items-center gap-2">
          <span class="w-1.5 h-4 bg-emerald-500 rounded-full" aria-hidden="true"></span>
          <h2 :id="`cat-title-${category.id}`" class="text-base font-bold text-white tracking-tight">{{ category.name }}
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <article v-for="product in category.products" :key="product.id" @click="openProductModal(product)"
            class="bg-slate-900/90 rounded-2xl p-4 border border-slate-800/90 shadow-md flex items-center justify-between gap-3.5 active:scale-[0.99] transition-all cursor-pointer hover:border-emerald-500/40 hover:bg-slate-850"
            :aria-label="`${product.name}, por ${formatCurrency(product.price)}`">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-white text-sm truncate">{{ product.name }}</h3>
                <span v-if="!product.available"
                  class="text-[10px] bg-red-950/80 text-red-400 border border-red-800/60 px-1.5 py-0.5 rounded font-bold shrink-0">
                  Esgotado
                </span>
              </div>
              <p class="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">{{ product.description }}</p>

              <div class="flex items-center gap-2 mt-3">
                <span class="font-extrabold text-sm text-emerald-400">
                  {{ formatCurrency(product.price) }}
                </span>
                <span v-if="product.optionGroups?.length"
                  class="text-[10px] text-emerald-300 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full font-bold">
                  Montar
                </span>
              </div>
            </div>

            <img v-if="product.image" :src="product.image" :alt="product.name"
              class="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-800 opacity-90" />
          </article>
        </div>
      </section>
    </main>

    <!-- 7. Modal de Customização do Produto -->
    <div v-if="selectedProduct"
      class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col sm:items-center sm:justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      @click="closeProductModal">
      <div role="dialog" aria-modal="true" aria-labelledby="product-modal-title"
        class="bg-slate-900 text-slate-100 w-full h-full sm:h-auto sm:max-h-[88vh] sm:max-w-lg flex flex-col overflow-hidden sm:rounded-3xl sm:border sm:border-slate-800 sm:shadow-2xl"
        @click.stop>
        <!-- Header da Foto -->
        <div class="relative h-60 sm:h-52 w-full bg-slate-800 shrink-0">
          <img v-if="selectedProduct.image" :src="selectedProduct.image" :alt="selectedProduct.name"
            class="w-full h-full object-cover" />

          <!-- Botão Fechar -->
          <button @click="closeProductModal"
            class="absolute top-4 right-4 bg-slate-950/80 hover:bg-slate-900 text-white p-2 rounded-full transition-colors backdrop-blur-md z-10 shadow-md border border-slate-700 cursor-pointer"
            aria-label="Fechar modal de montagem do produto">
            <X class="w-5 h-5" aria-hidden="true" />
          </button>

          <!-- Badge do Restaurante -->
          <div
            class="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md rounded-full py-1 px-3 shadow-md flex items-center gap-2 border border-slate-700 text-[11px]">
            <img v-if="tenant.logo" :src="tenant.logo" :alt="tenant.name" class="w-4 h-4 rounded-full object-cover" />
            <span class="font-bold text-white truncate max-w-[130px]">{{ tenant.name }}</span>
            <span class="text-slate-600" aria-hidden="true">•</span>
            <span class="flex items-center gap-0.5 font-bold text-amber-400">
              <Star class="w-3 h-3 fill-amber-400 text-amber-400" aria-hidden="true" />
              {{ tenant.reviews ? tenant.reviews.score.toFixed(1) : '4.9' }}
            </span>
          </div>
        </div>

        <!-- Conteúdo do Modal -->
        <div class="p-4 sm:p-5 overflow-y-auto flex-1 space-y-5">
          <!-- Título, Descrição e Preço -->
          <div class="space-y-1.5">
            <h3 id="product-modal-title" class="text-xl font-extrabold text-white leading-tight">{{ selectedProduct.name
            }}</h3>
            <p class="text-xs text-slate-400 leading-relaxed">{{ selectedProduct.description }}</p>
            <div class="flex items-center justify-between pt-1">
              <span class="text-xs font-semibold text-slate-500">Serve até 1 ou 2 pessoas</span>
              <span class="text-xl font-black text-emerald-400">
                {{ formatCurrency(selectedProduct.price) }}
              </span>
            </div>
          </div>

          <!-- Grupos de Opcionais -->
          <div v-for="group in selectedProduct.optionGroups" :key="group.id" class="space-y-2.5 pt-2" role="group"
            :aria-labelledby="`group-title-${group.id}`">
            <div
              class="bg-slate-950 border-y border-slate-800 px-4 py-2.5 -mx-4 sm:-mx-5 flex items-center justify-between">
              <div>
                <h4 :id="`group-title-${group.id}`" class="font-bold text-xs sm:text-sm text-white">{{ group.title }}
                </h4>
                <p class="text-[11px] text-slate-400 font-medium">
                  {{ group.max === 1 ? 'Escolha 1 opção' : `Escolha até ${group.max} opções` }}
                </p>
              </div>

              <span v-if="group.required"
                class="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                OBRIGATÓRIO
              </span>
              <span v-else
                class="bg-slate-800 text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                OPCIONAL
              </span>
            </div>

            <!-- Lista de Opções -->
            <div class="space-y-2 pt-1">
              <label v-for="option in group.options" :key="option.id"
                class="flex items-center justify-between p-3 rounded-2xl border border-slate-800 hover:bg-slate-800/60 cursor-pointer transition-colors"
                :class="isOptionSelected(group.id, option.id) ? 'border-emerald-500 bg-emerald-950/30' : ''">
                <div class="flex flex-col pr-3">
                  <span class="text-xs sm:text-sm font-medium text-slate-200">{{ option.name }}</span>
                  <span v-if="option.price > 0" class="text-xs font-bold text-emerald-400 mt-0.5">
                    + {{ formatCurrency(option.price) }}
                  </span>
                </div>

                <input :type="group.max === 1 ? 'radio' : 'checkbox'" :name="group.id" :aria-required="group.required"
                  :checked="isOptionSelected(group.id, option.id)" @change="toggleOption(group, option)"
                  class="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-400 bg-slate-950 border-slate-700 shrink-0 cursor-pointer" />
              </label>
            </div>
          </div>

          <!-- Observação -->
          <div class="pt-3 border-t border-slate-800">
            <label for="product-observation-input" class="block text-xs font-bold text-slate-300 mb-1.5">Alguma
              observação?</label>
            <textarea id="product-observation-input" v-model="productObservation" rows="2"
              placeholder="Ex: Ponto da carne bem passado, tirar a cebola, etc."
              class="w-full text-xs p-3 rounded-2xl border border-slate-800 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none placeholder:text-slate-600"></textarea>
          </div>
        </div>

        <!-- Footer do Modal -->
        <div class="p-4 pb-6 sm:pb-4 border-t border-slate-800 bg-slate-900 flex items-center gap-3 shrink-0">
          <div class="flex items-center border border-slate-800 rounded-2xl p-1 shrink-0 bg-slate-950" role="group"
            aria-label="Controle de quantidade">
            <button @click="productQuantity > 1 ? productQuantity-- : null"
              class="p-2 text-slate-400 hover:text-white disabled:opacity-30 active:scale-95 transition-transform cursor-pointer"
              aria-label="Diminuir quantidade" :disabled="productQuantity <= 1">
              <Minus class="w-4 h-4" aria-hidden="true" />
            </button>
            <span class="w-8 text-center font-extrabold text-sm text-white" aria-live="polite">{{ productQuantity
            }}</span>
            <button @click="productQuantity++"
              class="p-2 text-slate-400 hover:text-white active:scale-95 transition-transform cursor-pointer"
              aria-label="Aumentar quantidade">
              <Plus class="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <button @click="addToCart" :disabled="!isProductConfigValid"
            :aria-label="`Adicionar ${productQuantity} item ao carrinho por ${formatCurrency(calculateProductTotal() * productQuantity)}`"
            class="flex-1 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-40 text-slate-950 py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm shadow-lg transition-all flex items-center justify-between cursor-pointer">
            <span>Adicionar</span>
            <span class="font-extrabold">{{ formatCurrency(calculateProductTotal() * productQuantity) }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 8. Barra Fixa Inferior da Sacola -->
    <div v-if="cart.items.length > 0" role="region" aria-label="Resumo da sacola de compras"
      class="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 shadow-2xl z-40">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <div>
          <span class="text-xs text-slate-400 block" aria-live="polite">
            {{ totalItemsCount }} {{ totalItemsCount === 1 ? 'item' : 'itens' }}
          </span>
          <span class="text-lg font-black text-emerald-400">{{ formatCurrency(cartSubtotal) }}</span>
        </div>
        <button @click="isCartDrawerOpen = true" aria-haspopup="dialog" :aria-expanded="isCartDrawerOpen"
          :aria-label="`Ver sacola com ${totalItemsCount} ${totalItemsCount === 1 ? 'item' : 'itens'} no total de ${formatCurrency(cartSubtotal)}`"
          class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 transition-all text-xs cursor-pointer">
          <ShoppingCart class="w-4 h-4" aria-hidden="true" />
          <span>Ver Sacola</span>
        </button>
      </div>
    </div>

    <!-- 9. Drawer de Finalização do Carrinho -->
    <div v-if="isCartDrawerOpen"
      class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col sm:items-center sm:justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      @click="isCartDrawerOpen = false">
      <div role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title"
        class="bg-slate-900 text-slate-100 w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-lg flex flex-col overflow-hidden sm:rounded-3xl sm:border sm:border-slate-800 sm:shadow-2xl"
        @click.stop>
        <div class="p-4 border-b border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <ShoppingCart class="w-5 h-5 text-emerald-400" aria-hidden="true" />
            <h3 id="cart-drawer-title" class="font-bold text-base text-white">Sua Sacola</h3>
          </div>
          <button @click="isCartDrawerOpen = false" class="text-slate-400 hover:text-white cursor-pointer"
            aria-label="Fechar sacola">
            <X class="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div class="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
          <!-- Itens -->
          <div class="space-y-2.5" role="list" aria-label="Itens na sacola">
            <div v-for="(item, index) in cart.items" :key="index" role="listitem"
              class="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-start justify-between gap-2">
              <div class="flex-1">
                <div class="flex items-center gap-1.5">
                  <span class="font-bold text-emerald-400">{{ item.quantity }}x</span>
                  <span class="font-bold text-white">{{ item.product.name }}</span>
                </div>
                <div v-if="item.selectedOptions.length" class="text-[11px] text-slate-400 mt-1 space-y-0.5">
                  <p v-for="opt in item.selectedOptions" :key="opt.id">
                    + {{ opt.name }} {{ opt.price > 0 ? `(${formatCurrency(opt.price)})` : '' }}
                  </p>
                </div>
                <p v-if="item.observation" class="text-[11px] text-slate-500 italic mt-1">
                  Obs: "{{ item.observation }}"
                </p>
                <span class="font-bold text-xs text-emerald-400 mt-2 block">
                  {{ formatCurrency(item.unitPrice * item.quantity) }}
                </span>
              </div>

              <button @click="removeCartItem(index)" class="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                :aria-label="`Remover ${item.product.name} da sacola`" title="Remover item">
                <Trash2 class="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <!-- Tipo de Pedido -->
          <div class="border-t border-slate-800 pt-3" role="group" aria-label="Tipo de entrega do pedido">
            <label class="block font-bold text-slate-300 mb-1.5">Tipo de Pedido:</label>
            <div class="grid grid-cols-2 gap-2">
              <button @click="checkoutData.deliveryType = 'delivery'"
                :aria-pressed="checkoutData.deliveryType === 'delivery'"
                :class="checkoutData.deliveryType === 'delivery' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300 font-medium hover:bg-slate-750'"
                class="py-2.5 rounded-2xl transition-colors cursor-pointer">
                🛵 Entrega (Delivery)
              </button>
              <button @click="checkoutData.deliveryType = 'pickup'"
                :aria-pressed="checkoutData.deliveryType === 'pickup'"
                :class="checkoutData.deliveryType === 'pickup' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300 font-medium hover:bg-slate-750'"
                class="py-2.5 rounded-2xl transition-colors cursor-pointer">
                🛍️ Retirada no Balcão
              </button>
            </div>
          </div>

          <!-- Dados do Cliente -->
          <div class="border-t border-slate-800 pt-3 space-y-2.5">
            <div>
              <label for="checkout-name" class="block font-bold text-slate-300 mb-1">Seu Nome *</label>
              <input id="checkout-name" v-model="checkoutData.customerName" type="text" placeholder="Ex: João da Silva"
                required
                class="w-full p-2.5 rounded-2xl border border-slate-800 bg-slate-950 text-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-600" />
            </div>

            <div v-if="checkoutData.deliveryType === 'delivery'" class="space-y-2">
              <div class="grid grid-cols-3 gap-2">
                <div class="col-span-2">
                  <label for="checkout-street" class="block font-bold text-slate-300 mb-1">Rua / Logradouro *</label>
                  <input id="checkout-street" v-model="checkoutData.address.street" type="text"
                    placeholder="Ex: Av. Brasil" required
                    class="w-full p-2.5 rounded-2xl border border-slate-800 bg-slate-950 text-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-600" />
                </div>
                <div>
                  <label for="checkout-number" class="block font-bold text-slate-300 mb-1">Número *</label>
                  <input id="checkout-number" v-model="checkoutData.address.number" type="text" placeholder="123"
                    required
                    class="w-full p-2.5 rounded-2xl border border-slate-800 bg-slate-950 text-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-600" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label for="checkout-neighborhood" class="block font-bold text-slate-300 mb-1">Bairro *</label>
                  <input id="checkout-neighborhood" v-model="checkoutData.address.neighborhood" type="text"
                    placeholder="Centro" required
                    class="w-full p-2.5 rounded-2xl border border-slate-800 bg-slate-950 text-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-600" />
                </div>
                <div>
                  <label for="checkout-complement" class="block font-bold text-slate-300 mb-1">Complemento</label>
                  <input id="checkout-complement" v-model="checkoutData.address.complement" type="text"
                    placeholder="Apto 42"
                    class="w-full p-2.5 rounded-2xl border border-slate-800 bg-slate-950 text-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-600" />
                </div>
              </div>
            </div>

            <!-- Pagamento -->
            <div class="pt-1">
              <label for="checkout-payment" class="block font-bold text-slate-300 mb-1">Forma de Pagamento *</label>
              <select id="checkout-payment" v-model="checkoutData.paymentMethod"
                class="w-full p-2.5 rounded-2xl border border-slate-800 bg-slate-950 text-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium">
                <option value="Pix">Pix (Chave informada no pedido)</option>
                <option value="Cartão de Crédito">Cartão de Crédito (na entrega)</option>
                <option value="Cartão de Débito">Cartão de Débito (na entrega)</option>
                <option value="Dinheiro">Dinheiro</option>
              </select>

              <div v-if="checkoutData.paymentMethod === 'Dinheiro'" class="mt-2">
                <label for="checkout-change" class="block font-bold text-slate-300 mb-1">Precisa de troco para
                  quanto?</label>
                <input id="checkout-change" v-model.number="checkoutData.changeFor" type="number"
                  placeholder="Ex: 50 ou 100"
                  class="w-full p-2.5 rounded-2xl border border-slate-800 bg-slate-950 text-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-600" />
              </div>
            </div>
          </div>

          <!-- Totalização -->
          <div class="border-t border-slate-800 pt-3 space-y-1 text-xs">
            <div class="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span>{{ formatCurrency(cartSubtotal) }}</span>
            </div>
            <div v-if="checkoutData.deliveryType === 'delivery'" class="flex justify-between text-slate-400">
              <span>Taxa de Entrega:</span>
              <span>{{ formatCurrency(tenant.deliveryFee || 0) }}</span>
            </div>
            <div class="flex justify-between font-black text-sm text-white pt-1.5 border-t border-slate-800">
              <span>Total:</span>
              <span class="text-emerald-400">{{ formatCurrency(cartFinalTotal) }}</span>
            </div>
          </div>
        </div>

        <!-- Botão WhatsApp -->
        <div class="p-4 pb-6 sm:pb-4 border-t border-slate-800 bg-slate-900">
          <button @click="sendWhatsAppOrder" :disabled="!isCheckoutValid"
            aria-label="Enviar pedido formatado para o WhatsApp do estabelecimento"
            class="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-40 text-slate-950 font-black py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-xs transition-all cursor-pointer">
            <span>Enviar Pedido pelo WhatsApp</span>
            <svg class="w-4 h-4 fill-slate-950" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 10. Modais da Loja -->
    <StoreReviewsModal v-if="tenant.reviews" :reviews="tenant.reviews" :is-open="isReviewsOpen"
      @close="isReviewsOpen = false" />

    <StoreInfoModal :tenant="tenant" :is-open="isInfoOpen" @close="isInfoOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRef, onMounted, onUnmounted } from 'vue'
import { useBodyScrollLock } from '~/composables/useBodyScrollLock'
import {
  Phone,
  MapPin,
  Clock,
  X,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Star,
  Info,
  ArrowLeft,
  Flame,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next'
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

// 3. Estados dos Modais
const isReviewsOpen = ref(false)
const isInfoOpen = ref(false)
const selectedProduct = ref<Product | null>(null)
const isCartDrawerOpen = ref(false)

// Trava Global de Scroll
const isAnyOverlayOpen = computed(() => {
  return (
    !!selectedProduct.value ||
    isCartDrawerOpen.value ||
    isReviewsOpen.value ||
    isInfoOpen.value
  )
})

useBodyScrollLock(isAnyOverlayOpen)

// Fechamento com Tecla ESC no Desktop para qualquer modal ativo
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    if (selectedProduct.value) {
      closeProductModal()
    } else if (isCartDrawerOpen.value) {
      isCartDrawerOpen.value = false
    } else if (isReviewsOpen.value) {
      isReviewsOpen.value = false
    } else if (isInfoOpen.value) {
      isInfoOpen.value = false
    }
  }
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('keydown', handleKeyDown)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', handleKeyDown)
  }
})

// 4. Estado de Customização do Produto
const selectedOptions = ref<Map<string, Option[]>>(new Map())
const productObservation = ref('')
const productQuantity = ref(1)

// 5. Estado do Carrinho
interface CartItemState {
  product: Product
  quantity: number
  selectedOptions: Option[]
  observation: string
  unitPrice: number
}

const cart = ref<{ items: CartItemState[] }>({ items: [] })

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

// 6. Destaques Dinâmicos
const featuredProducts = computed(() => {
  if (!tenant.value) return []
  const all: Product[] = []
  tenant.value.categories.forEach(category => {
    all.push(...category.products.filter(p => p.available))
  })
  return all.slice(0, 6)
})

// Controle de Rolagem Imune a Linters
const carouselRef = ref<HTMLElement | null>(null)

function scrollCarousel(direction: 'left' | 'right') {
  if (!carouselRef.value) return
  const scrollAmount = 350
  const delta = direction === 'left' ? -scrollAmount : scrollAmount
  carouselRef.value.scrollLeft += delta
}

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

// 7. Formatação
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// 8. Modal do Produto
function openProductModal(product: Product) {
  if (!product.available) return
  selectedProduct.value = product
  selectedOptions.value = new Map()
  productObservation.value = ''
  productQuantity.value = 1

  product.optionGroups?.forEach(group => {
    const firstOption = group.options.at(0)
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

// 9. Despacho WhatsApp
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