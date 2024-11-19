<script setup lang="ts">
import SectionFullScreen from '@/components/template/Sections/SectionFullScreen.vue'
import CardBox from '@/components/template/Cards/CardBox.vue'
import BaseButton from '@/components/template/Elements/BaseButton.vue'
import BaseButtons from '@/components/template/Elements/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="pinkRed">
      <CardBox :class="cardClass">
        <div class="space-y-3">
          <h1 class="text-2xl">Unhandled exception</h1>

          <p>An Error Occurred</p>
        </div>

        <template #footer>
          <BaseButtons>
            <BaseButton label="Done" to="/dashboard" color="danger" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
