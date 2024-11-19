<template>
  <CardBoxModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="$t('org.add_platoon')"
    has-cancel
    :button-label="$t('global.save')"
    :btn-props="{
      disabled: !validName.data.value || state.loading,
      loading: validName.loading.value || state.loading,
    }"
    @cancel="state.name = ''"
    @confirm="
      {
        if (validName.data.value) save();
      }
    "
  >
    <FormField
      :label="$t('org.platoon_name')"
      :help="validName.data.value ? $t('org.platoon_name') : $t('global.name_invalid')"
    >
      <FormControl v-model="state.name" :icon="mdiFormTextbox" required />
    </FormField>
    <NotificationBar v-if="state.error" color="danger" small>
      {{ state.error }}
      <template #right>
        <BaseButton :icon="mdiClose" small rounded-full color="danger" @click="state.error = ''" />
      </template>
    </NotificationBar>
  </CardBoxModal>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import CardBoxModal from '../template/Cards/CardBoxModal.vue';
import BaseButton from '../template/Elements/BaseButton.vue';
import FormField from '../template/form/FormField.vue';
import FormControl from '../template/form/FormControl.vue';
import { mdiClose, mdiFormTextbox } from '@mdi/js';
import type { AddPlatoon, ValidatePlatoonName } from '@/services/types/org';
import { asyncComputed } from '@/hooks/asyncComputed';
import fetchService from '@/services/fetch.service';
import { useOrgStore } from '@/stores/orgStructure';
import { useI18n } from 'vue-i18n';
import NotificationBar from '../template/NotificationBar.vue';

const props = defineProps<{
  battalion_id: number;
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', val: boolean): void;
}>();

const state = reactive({
  name: '',
  loading: false,
  error: '',
});

const orgStore = useOrgStore();

const battalion = computed(
  () => orgStore.org.data.find((x) => x.battalion_id == props.battalion_id)!,
);

const validName = asyncComputed(
  async () => {
    if (state.name.length < 3 || state.name.length > 200) return false;
    const data = await fetchService<ValidatePlatoonName>({
      body: {
        platoon_name: state.name.trim(),
        battalion_id: props.battalion_id,
      },
      method: 'post',
      url: '/org/platoon/validate',
    });
    if (data?.success) return data.valid;
    return false;
  },
  {
    defVal: false,
    resetOnLoad: true,
    watchers: [() => state.name],
    debounce: 500,
  },
);

const i18n = useI18n();

const save = async () => {
  state.error = '';
  state.loading = true;
  const res = await fetchService<AddPlatoon>({
    body: {
      platoon_name: state.name,
    },
    method: 'post',
    url: `/org/battalion/${props.battalion_id}/platoon`,
  });
  if (res?.success) {
    battalion.value.platoons.push(res.data);
    state.name = '';
    emit('update:modelValue', false);
  } else {
    state.error = i18n.t('global.500');
  }
  state.loading = false;
};

watch([() => state.name], () => {
  state.error = '';
});
</script>
