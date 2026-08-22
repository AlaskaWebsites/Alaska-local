<!-- components/CategoryTabs.vue -->
<template>
    <nav
        class="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-2.5 overflow-x-auto no-scrollbar flex items-center gap-2 shadow-xs">
        <button v-for="category in categories" :key="category.id" @click="scrollToCategory(category.id)" :class="activeCategoryId === category.id
            ? 'bg-slate-900 text-white font-bold shadow-xs'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium'"
            class="px-3.5 py-1.5 rounded-full text-xs shrink-0 transition-all active:scale-95 flex items-center gap-1.5">
            <span>{{ category.name }}</span>
        </button>
    </nav>
</template>

<script setup lang="ts">
import type { Category } from '~/types/tenant'

const props = defineProps<{
    categories: Category[]
    activeCategoryId?: string
}>()

function scrollToCategory(id: string) {
    const element = document.getElementById(id)
    if (element) {
        const yOffset = -70 // compensação da altura da barra fixa
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
    }
}
</script>