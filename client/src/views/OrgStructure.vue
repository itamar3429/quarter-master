<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiHomeCity" :title="$t('nav.org')">
        <NewBattalionModal></NewBattalionModal>
      </SectionTitleLineWithButton>
      <CardBox class="mb-6" has-table>
        <BattalionTable />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup lang="ts">
import { mdiHomeCity } from '@mdi/js'
import SectionMain from '../components/template/Sections/SectionMain.vue'
import SectionTitleLineWithButton from '../components/template/Sections/SectionTitleLineWithButton.vue'
import LayoutAuthenticated from '../layouts/LayoutAuthenticated.vue'
import CardBox from '../components/template/Cards/CardBox.vue'
import BattalionTable from '../components/orgStructure/battalionTable.vue'
import BaseButton from '@/components/template/Elements/BaseButton.vue'
import NewBattalionModal from '@/components/orgStructure/newBattalionModal.vue'
</script>
