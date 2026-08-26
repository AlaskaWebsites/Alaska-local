<!-- components/CategoryTabs.vue -->
<template>
    <nav aria-label="Categorias do cardápio"
        class="sticky top-0 z-30 w-full bg-[#f5f5f5]/95 backdrop-blur-md border-b border-slate-200/80 py-3">
        <div class="max-w-4xl mx-auto px-4 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth" role="tablist"
            aria-label="Lista de categorias">
            <a v-for="category in categories" :key="category.id" :href="`#${category.id}`" role="tab"
                :aria-label="`Navegar até a categoria ${category.name}`"
                class="shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer whitespace-nowrap active:scale-95"
                :class="[themeClasses.primaryTextHover, themeClasses.primaryBorderHover]">
                {{ category.name }}
            </a>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTenantTheme } from '~/composables/useTenantTheme'
import type { Category, TenantTheme } from '~/types'

const props = defineProps<{
    categories?: Category[]
    theme?: TenantTheme
}>()

const { themeClasses } = useTenantTheme(computed(() => props.theme))
</script>
