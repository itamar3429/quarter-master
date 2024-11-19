<script setup lang="ts">
import NavBarItem from '@/components/template/Layout/NavBarItem.vue'

defineProps<{
  menu: any[]
}>()

const emit = defineEmits(['menu-click'])

const menuClick = (event: any, item: any) => {
  emit('menu-click', event, item)
}
</script>

<template>
  <NavBarItem v-for="(item, index) in menu" :key="index" :item="item" @menu-click="menuClick" />
</template>
