<template>
  <CardBoxModal
    :model-value="!!battalion && !state.showAdd"
    @update:model-value="$emit('close')"
    :title="$t('org.platoons')"
    :button-label="$t('global.close')"
    @confirm="$emit('close')"
  >
    <BaseButton
      :label="$t('org.add_platoon')"
      color="info"
      @click="state.showAdd = true"
      small
    ></BaseButton>
    <GenericTable
      :items="
        battalion?.platoons.map((x) => ({
          key: x.platoon_id,
          name: x.platoon_name,
        })) || []
      "
      :columns="[
        {
          key: 'name',
          title: $t('org.platoon'),
        },
      ]"
    ></GenericTable
  ></CardBoxModal>
  <NewPlatoonModal v-model="state.showAdd" :battalion_id="props.battalion_id"></NewPlatoonModal>
</template>

<script setup lang="ts">
import GenericTable from '../template/Tables/genericTable.vue';
import { useOrgStore } from '@/stores/orgStructure';
import { computed, reactive } from 'vue';
import CardBoxModal from '../template/Cards/CardBoxModal.vue';
import BaseButton from '../template/Elements/BaseButton.vue';
import NewPlatoonModal from './newPlatoonModal.vue';

const props = defineProps<{
  battalion_id: number;
}>();
defineEmits<{
  (event: 'close'): void;
}>();

const state = reactive({
  showAdd: false,
});

const orgStore = useOrgStore();

const battalion = computed(() =>
  orgStore.org.data.find((x) => x.battalion_id == props.battalion_id),
);
</script>
