<script setup lang="ts">
import { containerMaxW } from '@/config'
import BaseLevel from '@/components/template/Elements/BaseLevel.vue'
import QrtMasterLogo from '@/components/template/QrtMasterLogo.vue'
</script>

<template>
  <footer class="py-2 px-6" :class="containerMaxW">
    <BaseLevel>
      <div class="text-center md:text-left">
        <slot />
      </div>
      <div class="md:py-2">
        <QrtMasterLogo class="w-auto h-8 md:h-6" />
      </div>
    </BaseLevel>
  </footer>
</template>
