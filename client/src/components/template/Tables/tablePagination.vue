<template>
  <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
    <BaseLevel>
      <BaseButtons>
        <BaseButton
          v-for="page in Array(totalPages)
            .fill(0)
            .map((_, i) => i + 1)"
          :key="page"
          :active="page === currPage"
          :label="page"
          :color="page === currPage ? 'lightDark' : 'whiteDark'"
          small
          @click="$emit('update:currPage', page)"
        />
      </BaseButtons>
      <small>Page {{ currPage }} of {{ totalPages }}</small>
    </BaseLevel>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseLevel from '../Elements/BaseLevel.vue'
import BaseButtons from '../Elements/BaseButtons.vue'
import BaseButton from '../Elements/BaseButton.vue'

const props = defineProps<{
  currPage: number
  totalPages: number
  perPage: number
  pageStatusText: string
  perPageArr?: number[]
}>()
const perPageArr = computed(() => props.perPageArr || [10, 20, 50, 100])

const emit = defineEmits(['pageUp', 'pageDown', 'update:perPage', 'update:currPage'])
emit('update:perPage', perPageArr.value[0])
</script>
