<template>
  <div>
    <BaseButton color="info" :label="$t('users.add')" @click="state.show = true" small></BaseButton>
    <CardBoxModal
      v-model="state.show"
      :title="$t('users.add')"
      has-cancel
      @cancel="
        {
          state.username = '';
          state.role = roles[0].id;
        }
      "
      :btn-props="{
        disabled: !validation.valid || state.loading,
        loading: state.loading,
      }"
      @confirm="save"
    >
      <CardBox>
        <FormField :label="$t('users.username')" :help="validation.username">
          <FormControl v-model="state.username" type="text"> </FormControl>
        </FormField>
        <FormField :label="$t('users.password')" :help="validation.password">
          <FormControl v-model="state.password" type="password"> </FormControl>
        </FormField>
        <FormField :label="$t('users.role')" :help="validation.role">
          <FormControl v-model="state.role" name="role" :options="roles" type="select">
          </FormControl>
        </FormField>
        <FormField
          :label="$t('org.battalion')"
          v-show="state.role == 'battalion' || state.role == 'platoon'"
          :help="validation.battalion"
        >
          <FormControl v-model="state.battalion" name="role" :options="battalions" type="select">
          </FormControl>
        </FormField>
        <FormField
          :label="$t('org.platoon')"
          v-show="state.role == 'platoon'"
          :help="validation.platoon"
        >
          <FormControl v-model="state.platoon" name="role" :options="platoons" type="select">
          </FormControl>
        </FormField>
        <NotificationBar v-show="!!state.error" color="danger" small @dismiss="state.error = ''">{{
          state.error
        }}</NotificationBar>
      </CardBox>
    </CardBoxModal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch, type ComputedRef } from 'vue';
import BaseButton from '../template/Elements/BaseButton.vue';
import CardBoxModal from '../template/Cards/CardBoxModal.vue';
import CardBox from '../template/Cards/CardBox.vue';
import FormControl from '../template/form/FormControl.vue';
import FormField from '../template/form/FormField.vue';
import { asyncComputed } from '@/hooks/asyncComputed';
import fetchService from '@/services/fetch.service';
import { type PostUser, type ValidateUsername } from '@/services/types/users';
import { accessEnums } from '@/constants';
import type { TRole } from '@/services/types';
import { isAllowedFor } from '@/utils/auth';
import { useI18n } from 'vue-i18n';
import { useOrgStore } from '@/stores/orgStructure';
import NotificationBar from '../template/NotificationBar.vue';
import { useUsersStore } from '@/stores/userStore';

const { t } = useI18n();

const orgStore = useOrgStore();
const usersStore = useUsersStore();

const roles = computed(() => {
  return (Object.keys(accessEnums) as TRole[])
    .filter((x) => isAllowedFor(x))
    .map((x) => ({
      id: x,
      label: t('org.' + x),
    }));
});

const battalions = computed(() => {
  return orgStore.org.data.map((x) => ({
    id: x.battalion_id,
    label: x.battalion_name,
  }));
});

const state = reactive({
  show: false,
  username: '',
  password: '',
  role: roles.value[0]?.id,
  battalion: (battalions.value[0]?.id as number) || null,
  platoon: null as number | null,
  loading: false,
  error: '',
});

const platoons: typeof battalions = computed(() => {
  return (
    orgStore.org.data
      .find((x) => x.battalion_id == state.battalion)
      ?.platoons.map((x) => ({
        id: x.platoon_id,
        label: x.platoon_name,
      })) || []
  );
});
state.platoon = platoons.value[0]?.id || null;

const isValid = asyncComputed(
  async () => {
    if (state.username.length < 3 || state.username.length > 50) return false;
    const data = await fetchService<ValidateUsername>({
      method: 'post',
      url: '/users/validate-username',
      body: {
        username: state.username,
      },
    });
    return !!data?.success && !!data.valid;
  },
  {
    defVal: false,
    resetOnLoad: true,
    watchers: [() => state.username],
    debounce: 500,
  },
);

const validation = computed(() => {
  const errors = {
    username: '',
    password: '',
    role: '',
    battalion: '',
    platoon: '',
    valid: true,
  };

  if (!isValid.data.value) {
    errors.username = t('global.name_invalid');
    errors.valid = false;
  }
  if (!/[a-zA-z0-9!#]{6,20}/.test(state.password)) {
    errors.password = t('users.password_invalid');
    errors.valid = false;
  }
  if (!roles.value.find((x) => x.id == state.role)) {
    errors.role = t('global.invalid_selection');
    errors.valid = false;
  }
  if (
    (state.role == 'battalion' || state.role == 'platoon') &&
    !battalions.value.find((x) => x.id == state.battalion)
  ) {
    errors.battalion = t('global.invalid_selection');
    errors.valid = false;
  }
  if (state.role == 'platoon' && !platoons.value.find((x) => x.id == state.platoon)) {
    errors.platoon = t('global.invalid_selection');
    errors.valid = false;
  }
  return errors;
});

const save = async () => {
  state.error = '';
  state.loading = true;
  if (!validation.value.valid) return;
  const res = await fetchService<PostUser>({
    body: {
      password: state.password,
      username: state.username,
      role: state.role,
      level_id: state.role == 'admin' ? 0 : state[state.role]!,
    },
    method: 'post',
    url: '/users',
  });
  if (res?.success) {
    usersStore.users.data.push(res.data);
    state.show = false;
    state.password = '';
    state.username = '';
    state.role = 'admin';
  } else {
    state.error = t('global.500');
  }
  state.loading = false;
};

watch(battalions, () => {
  state.battalion = battalions.value[0]?.id ?? null;
});
watch(platoons, () => {
  state.platoon = platoons.value[0]?.id ?? null;
});
</script>
