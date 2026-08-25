<!-- components/CategoryTabs.vue -->
<template>
    <nav aria-label="Categorias do cardápio"
        class="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 py-3 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div class="max-w-4xl mx-auto flex gap-2 overflow-x-auto no-scrollbar" role="tablist"
            aria-label="Lista de categorias">
            <a v-for="category in categories" :key="category.id" :href="`#${category.id}`" role="tab"
                :aria-label="`Navegar até a categoria ${category.name}`"
                class="shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 transition-all cursor-pointer"
                :class="[themeClasses.primaryTextHover, themeClasses.primaryBorderHover]">
                {{ category.name }}
            </a>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { toRef } from 'vue'
import { useTenantTheme } from '~/composables/useTenantTheme'
import type { Category, TenantTheme } from '~/types/tenant'

const props = defineProps<{
    categories: Category[]
    theme?: TenantTheme
}>()

// Tema Dinâmico para o Hover das Abas
const { themeClasses } = useTenantTheme(toRef(props, 'theme'))
</script>