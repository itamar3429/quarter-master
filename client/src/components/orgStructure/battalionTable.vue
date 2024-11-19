<template>
  <div>
    <GenericTable
      paginate
      :items="
        orgStore.org.data.map((x) => ({
          key: x.battalion_id,
          name: x.battalion_name,
        }))
      "
      :columns="[
        {
          key: 'name',
          title: $t('org.battalion'),
        },
        // {
        //   key: 'btns',
        //   title: '',
        //   btn: [
        //     {
        //       onClick(item) {
        //         console.log(item)
        //       },
        //       color: 'success',
        //       icon: mdiPencil,
        //     },
        //   ],
        // },
        {
          key: 'btns',
          title: $t('org.platoons'),
          btn: [
            {
              onClick(item) {
                state.currBattalion = item.key as number;
              },
              color: 'info',
              icon: mdiEye,
            },
          ],
        },
      ]"
    ></GenericTable>
  </div>
  <PlatoonTable :battalion_id="state.currBattalion" @close="state.currBattalion = 0"></PlatoonTable>
</template>

<script setup lang="ts">
import { mdiEye } from '@mdi/js';
import GenericTable from '../template/Tables/genericTable.vue';
import { useOrgStore } from '@/stores/orgStructure';
import { reactive } from 'vue';
import PlatoonTable from './platoonTable.vue';

const orgStore = useOrgStore();

const state = reactive({
  currBattalion: 0,
});
</script>
