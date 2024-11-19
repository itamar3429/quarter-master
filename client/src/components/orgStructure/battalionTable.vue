<template>
  <div>
    <GenericTable
      :items="[
        {
          key: 0,
          name: '1st Battalion',
        },
      ]"
      :columns="[
        {
          key: 'name',
          title: $t('org.battalion'),
        },
        {
          key: 'btns',
          title: $t('org.platoons'),
          btn: [
            {
              onClick(item) {
                console.log(item)
              },
              color: 'info',
              icon: mdiEye,
            },
          ],
        },
      ]"
    ></GenericTable>
  </div>
</template>

<script setup lang="ts">
import { mdiEye } from '@mdi/js'
import GenericTable from '../template/Tables/genericTable.vue'

//
</script>
