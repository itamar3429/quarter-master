<template>
  <BaseButton
    color="info"
    :label="$t('org.add_battalion')"
    @click="state.show = true"
    v-if="isAllowedFor('admin')"
  >
  </BaseButton>
  <CardBoxModal
    v-model="state.show"
    :title="$t('org.add_battalion')"
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
      :label="$t('org.battalion_name')"
      :help="validName.data.value ? $t('org.battalion_name') : $t('global.name_invalid')"
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
import { reactive, watch } from 'vue';
import CardBoxModal from '../template/Cards/CardBoxModal.vue';
import BaseButton from '../template/Elements/BaseButton.vue';
import FormField from '../template/form/FormField.vue';
import FormControl from '../template/form/FormControl.vue';
import { mdiClose, mdiFormTextbox } from '@mdi/js';
import type { AddBattalion, ValidateBattalionName } from '@/services/types/org';
import { asyncComputed } from '@/hooks/asyncComputed';
import fetchService from '@/services/fetch.service';
import { useOrgStore } from '@/stores/orgStructure';
import { useI18n } from 'vue-i18n';
import NotificationBar from '../template/NotificationBar.vue';
import { isAllowedFor } from '@/utils/auth';

const state = reactive({
  show: false,
  name: '',
  loading: false,
  error: '',
});

const orgStore = useOrgStore();

const validName = asyncComputed(
  async () => {
    if (state.name.length < 3 || state.name.length > 200) return false;
    const data = await fetchService<ValidateBattalionName>({
      body: {
        name: state.name.trim(),
      },
      method: 'post',
      url: '/org/battalion/validate',
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
  const res = await fetchService<AddBattalion>({
    body: {
      battalion_name: state.name,
    },
    method: 'post',
    url: '/org/battalion',
  });
  if (res?.success) {
    orgStore.org.data.push(res.data);
    state.show = false;
    state.name = '';
  } else {
    state.error = i18n.t('global.500');
  }
  state.loading = false;
};

watch([() => state.name], () => {
  state.error = '';
});
</script>
