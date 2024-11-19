<script setup lang="ts">
defineProps<{
  display?: string
  useMargin?: boolean
}>()
</script>

<template>
  <div
    :class="[display || 'flex', useMargin ? 'my-2 mx-3' : 'py-2 px-3']"
    class="navbar-item-label items-center cursor-pointer dark:text-white dark:hover:text-slate-400"
  >
    <slot />
  </div>
</template>
