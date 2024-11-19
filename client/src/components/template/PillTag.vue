<script setup lang="ts">
import { computed } from 'vue'
import { colorsBgLight, colorsOutline } from '@/colors'
import PillTagPlain from '@/components/template/PillTagPlain.vue'

const props = defineProps<{
  label: string
  color: keyof typeof colorsOutline
  icon?: string
  small?: boolean
  outline?: boolean
}>()

const componentClass = computed(() => [
  props.small ? 'py-1 px-3' : 'py-1.5 px-4',
  props.outline ? colorsOutline[props.color] : colorsBgLight[props.color],
])
</script>

<template>
  <PillTagPlain
    class="border rounded-full"
    :class="componentClass"
    :icon="icon"
    :label="label"
    :small="small"
  />
</template>
