<template>
  <div class="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100">
    <div class="container mx-auto px-4 py-12">
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-gray-900 mb-4">Alaska Local</h1>
        <p class="text-xl text-gray-600 mb-2">Plataforma multi-tenant para lojistas locais</p>
        <p class="text-sm text-gray-500">Feito com Nuxt 3 + Tailwind CSS</p>
      </div>
      
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Demos Disponíveis</h2>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Cardápio (Menu) -->
          <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div class="bg-orange-500 p-4">
              <h3 class="text-white font-bold text-lg">🍔 Cardápio Digital</h3>
            </div>
            <div class="p-6">
              <p class="text-gray-600 mb-4">Restaurantes e delivery com carrinho e WhatsApp</p>
              <div class="space-y-2">
                <NuxtLink 
                  to="/hamburgueria-x" 
                  class="block w-full bg-brand-500 text-white text-center py-2 rounded-lg hover:bg-brand-600 transition-colors"
                >
                  Hamburgueria X
                </NuxtLink>
                <NuxtLink 
                  to="/restaurante-bella-italia" 
                  class="block w-full bg-brand-500 text-white text-center py-2 rounded-lg hover:bg-brand-600 transition-colors"
                >
                  Bella Italia
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Hub de Links -->
          <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div class="bg-blue-500 p-4">
              <h3 class="text-white font-bold text-lg">🔗 Hub de Links</h3>
            </div>
            <div class="p-6">
              <p class="text-gray-600 mb-4">Links rápidos e vitrine mobile</p>
              <div class="space-y-2">
                <NuxtLink 
                  to="/barbearia-style" 
                  class="block w-full bg-brand-500 text-white text-center py-2 rounded-lg hover:bg-brand-600 transition-colors"
                >
                  Barbearia Style
                </NuxtLink>
                <NuxtLink 
                  to="/cafe-central" 
                  class="block w-full bg-brand-500 text-white text-center py-2 rounded-lg hover:bg-brand-600 transition-colors"
                >
                  Café Central
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Agendamento -->
          <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div class="bg-purple-500 p-4">
              <h3 class="text-white font-bold text-lg">📅 Agendamento</h3>
            </div>
            <div class="p-6">
              <p class="text-gray-600 mb-4">Serviços e agendamento online</p>
              <div class="space-y-2">
                <NuxtLink 
                  to="/clinica-sorriso" 
                  class="block w-full bg-brand-500 text-white text-center py-2 rounded-lg hover:bg-brand-600 transition-colors"
                >
                  Clínica Sorriso
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="mt-12 bg-white rounded-xl shadow-md p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">🚀 Fase 1 - Modo Sem Backend</h3>
          <ul class="space-y-2 text-gray-600">
            <li>✅ Nuxt 3 + TypeScript + Tailwind CSS</li>
            <li>✅ Estrutura multi-tenant com resolução dinâmica</li>
            <li>✅ Validação Zod fail-fast</li>
            <li>✅ Despacho via WhatsApp (URL Scheme)</li>
            <li>✅ Templates modulares (Menu, Hub, Agendamento)</li>
            <li>✅ Carrinho com localStorage</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
