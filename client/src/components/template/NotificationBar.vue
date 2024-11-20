<script setup lang="ts">
import { ref, computed, useSlots } from 'vue';
import { mdiClose } from '@mdi/js';
import { colorsBgLight, colorsOutline } from '@/colors';
import BaseLevel from '@/components/template/Elements/BaseLevel.vue';
import BaseIcon from '@/components/template/Elements/BaseIcon.vue';
import BaseButton from '@/components/template/Elements/BaseButton.vue';

const props = defineProps<{
  icon?: string;
  outline?: boolean;
  small?: boolean;
  color: string;
}>();

const componentClass = computed(() =>
  props.outline ? colorsOutline[props.color] : [colorsBgLight[props.color]],
);

defineEmits<{
  (event: 'dismiss'): void;
}>();

const slots = useSlots();

const hasRightSlot = computed(() => slots.right);
</script>

<template>
  <div
    :class="[
      ...componentClass,
      small ? 'pl-2 px-1 py-1' : 'px-3 py-6 md:py-3',
      'mb-6 last:mb-0 border rounded-lg transition-colors duration-150',
    ]"
  >
    <BaseLevel>
      <div class="flex flex-col md:flex-row items-center">
        <BaseIcon
          v-if="icon"
          :path="icon"
          w="w-10 md:w-5"
          h="h-10 md:h-5"
          size="24"
          class="md:mr-2"
        />
        <span class="text-center md:text-left md:py-2"><slot /></span>
      </div>
      <slot v-if="hasRightSlot" name="right" />
      <BaseButton
        v-else
        :icon="mdiClose"
        small
        rounded-full
        :color="color"
        @click="$emit('dismiss')"
      />
    </BaseLevel>
  </div>
</template>
